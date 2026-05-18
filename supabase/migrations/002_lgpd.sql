-- LGPD: registros de consentimento e solicitações de direitos do titular

-- Consent logs: registra cada consentimento dado por titular (formulários e cookies)
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Identificação do titular (não-autenticado): hash determinístico do e-mail/telefone
  subject_hash TEXT,
  -- Origem do consentimento: 'form-contato' | 'form-quero-ser-cliente' | 'form-programa' | 'cookie-banner'
  source TEXT NOT NULL,
  -- Lista de finalidades aceitas pelo titular (ex: ['contato_comercial', 'analytics', 'marketing'])
  purposes TEXT[] NOT NULL DEFAULT '{}',
  -- Conteúdo exato do texto de consentimento aceito (snapshot legal)
  consent_text TEXT NOT NULL,
  -- Versão da Política de Privacidade vigente no momento
  policy_version TEXT NOT NULL,
  -- Ação: 'granted' | 'rejected' | 'withdrawn'
  action TEXT NOT NULL DEFAULT 'granted' CHECK (action IN ('granted', 'rejected', 'withdrawn')),
  ip_hash TEXT,
  user_agent TEXT,
  page_url TEXT,
  related_submission_id UUID REFERENCES form_submissions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX consent_logs_subject_hash_idx ON consent_logs(subject_hash);
CREATE INDEX consent_logs_source_idx ON consent_logs(source);
CREATE INDEX consent_logs_created_at_idx ON consent_logs(created_at DESC);

ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
-- Inserção pública via API server-side (anon key inserts permitido para registro de consentimento)
CREATE POLICY "Anyone can register consent" ON consent_logs
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read consents" ON consent_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- LGPD requests: solicitações de direitos do titular (art. 18 LGPD)
CREATE TABLE lgpd_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Tipo de solicitação
  request_type TEXT NOT NULL CHECK (request_type IN (
    'access',           -- Confirmação/acesso aos dados (art. 18, I e II)
    'correction',       -- Correção de dados (art. 18, III)
    'anonymization',    -- Anonimização/bloqueio/eliminação (art. 18, IV)
    'portability',      -- Portabilidade (art. 18, V)
    'deletion',         -- Eliminação dos dados (art. 18, VI)
    'consent_info',     -- Informação sobre compartilhamento (art. 18, VII)
    'consent_withdraw', -- Revogação de consentimento (art. 18, IX)
    'other'
  )),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cpf_hash TEXT,
  -- Vínculo com a empresa: 'beneficiario' | 'prestador' | 'lead' | 'colaborador' | 'outro'
  relationship TEXT,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN (
    'received', 'in_review', 'awaiting_subject', 'completed', 'rejected'
  )),
  -- Resposta enviada ao titular
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  ip_hash TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX lgpd_requests_status_idx ON lgpd_requests(status);
CREATE INDEX lgpd_requests_created_at_idx ON lgpd_requests(created_at DESC);

ALTER TABLE lgpd_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit LGPD request" ON lgpd_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage LGPD requests" ON lgpd_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE TRIGGER lgpd_requests_updated_at
  BEFORE UPDATE ON lgpd_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Adiciona campos LGPD à tabela form_submissions (consentimento por submissão)
ALTER TABLE form_submissions
  ADD COLUMN IF NOT EXISTS consent_granted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_text TEXT,
  ADD COLUMN IF NOT EXISTS policy_version TEXT,
  ADD COLUMN IF NOT EXISTS purposes TEXT[] DEFAULT '{}';

-- Data retention: política de retenção de dados pessoais
-- Recomendação: form_submissions e consent_logs > 5 anos podem ser anonimizados
-- (manter consent_logs para prova de consentimento conforme LGPD art. 37)
COMMENT ON TABLE consent_logs IS 'LGPD: prova de consentimento. Retenção: 5 anos após término da relação.';
COMMENT ON TABLE lgpd_requests IS 'LGPD: solicitações de direitos do titular. Resposta em até 15 dias (art. 19, §1º).';
COMMENT ON COLUMN form_submissions.consent_granted IS 'LGPD: consentimento explícito do titular ao enviar o formulário.';
