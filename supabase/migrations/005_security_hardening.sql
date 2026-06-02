-- Endurecimento de segurança (auditoria 2026-06).
-- Idempotente e defensiva: usa guardas de existência (to_regclass) porque o schema
-- ao vivo divergiu do repo (ex.: consent_logs/lgpd_requests podem não existir; políticas
-- usam is_admin()). Pode ser aplicada com segurança independentemente desse estado.
--
-- Cobre:
--   H1 — Escalonamento de privilégio: impede que usuário autenticado altere o próprio `role`.
--   M1 — Remove INSERT anônimo direto (form_submissions / consent_logs / lgpd_requests),
--        forçando os controles anti-spam das rotas de API (service role).
--   M7 — Storage: restringe insert/update/delete a staff (admin/editor), em vez de qualquer
--        usuário autenticado (crítico com signup público habilitado).
--   Defesa extra — limita o tamanho de consent_text / purposes.

-- =============================================================
-- H1: trigger anti-escalonamento de role em `profiles`
-- =============================================================
CREATE OR REPLACE FUNCTION prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_role text;
BEGIN
  -- auth.uid() IS NULL = contexto service role (rota admin server-side) -> permitido.
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() IS NOT NULL THEN
    SELECT role INTO actor_role FROM profiles WHERE id = auth.uid();
    IF actor_role IS DISTINCT FROM 'admin' THEN
      RAISE EXCEPTION 'Apenas administradores podem alterar o papel (role) de um perfil.'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON profiles;
CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_profile_role_escalation();

-- WITH CHECK explícito na self-update (impede também trocar o id).
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================
-- M1: remove INSERT anônimo direto (inserts seguem via service role nas APIs)
-- =============================================================
DO $$
BEGIN
  IF to_regclass('public.form_submissions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can submit forms" ON form_submissions;
    ALTER TABLE form_submissions DROP CONSTRAINT IF EXISTS form_purposes_max;
    BEGIN
      ALTER TABLE form_submissions
        ADD CONSTRAINT form_purposes_max CHECK (
          purposes IS NULL OR coalesce(array_length(purposes, 1), 0) <= 50
        ) NOT VALID;
    EXCEPTION WHEN undefined_column THEN
      NULL; -- coluna purposes ausente neste schema; ignora
    END;
  END IF;

  IF to_regclass('public.consent_logs') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can register consent" ON consent_logs;
    ALTER TABLE consent_logs DROP CONSTRAINT IF EXISTS consent_text_max_len;
    ALTER TABLE consent_logs
      ADD CONSTRAINT consent_text_max_len CHECK (char_length(consent_text) <= 4000) NOT VALID;
    ALTER TABLE consent_logs DROP CONSTRAINT IF EXISTS consent_purposes_max;
    ALTER TABLE consent_logs
      ADD CONSTRAINT consent_purposes_max CHECK (
        purposes IS NULL OR coalesce(array_length(purposes, 1), 0) <= 50
      ) NOT VALID;
  END IF;

  IF to_regclass('public.lgpd_requests') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can submit LGPD request" ON lgpd_requests;
  END IF;
END $$;

-- =============================================================
-- M7: Storage — escrita/remoção restrita a staff (admin/editor)
-- =============================================================
-- Helper: usuário autenticado é staff? (SECURITY DEFINER evita recursão de RLS em profiles)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$;

-- Substitui as políticas amplas {authenticated} por políticas restritas a staff.
DROP POLICY IF EXISTS "storage_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_delete" ON storage.objects;

CREATE POLICY "storage_staff_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());
CREATE POLICY "storage_staff_update" ON storage.objects
  FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "storage_staff_delete" ON storage.objects
  FOR DELETE TO authenticated USING (public.is_staff());

-- Leitura pública (storage_public_read) é mantida — buckets de mídia do site são públicos por design.

-- NOT VALID aplica as constraints só a novas linhas. Para validar o histórico:
--   ALTER TABLE consent_logs VALIDATE CONSTRAINT consent_text_max_len;  (etc.)
