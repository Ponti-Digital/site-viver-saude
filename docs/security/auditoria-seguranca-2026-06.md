# Auditoria de Segurança — site-viver-saude

- **Data:** 2026-06-02
- **Alvo:** Aplicação Next.js 16 + React 19 (App Router) com Supabase (Auth/Postgres/RLS),
  Anthropic SDK, painel admin `/ponti-admin`, formulários LGPD. Deploy na Netlify.
- **Tipo:** Revisão de segurança de aplicação **autorizada** (defensiva / hardening) sobre o
  próprio código do cliente. Não houve teste ativo contra ambiente de produção.
- **Metodologia:** OWASP Top 10 (2021) + OWASP ASVS + Proactive Controls — lente AppSec da squad
  *cybersecurity* (perfil `jim-manico`), coordenada pelo fluxo `web_application_test` do `cyber-chief`.
- **Base da análise:** leitura estática do código, migrations SQL e configuração, **+ validação ao
  vivo** do projeto Supabase `Viver Saude - Site` (ref `hxavbmcwtgzrcpmznfwv`) via Management API
  (RLS, políticas, Storage, config de Auth e security advisors — ver Apêndice B).

---

## 1. Sumário executivo

A aplicação parte de uma base sólida: RLS habilitado em todas as tabelas, `service_role` restrito
ao servidor, validação com Zod nos formulários, honeypot + timing anti-spam, hashing de CPF e
headers de segurança já presentes.

A auditoria encontrou **2 riscos ALTOS**, **5 MÉDIOS** e **7 BAIXOS**. A validação ao vivo
**confirmou** que o escalonamento de privilégio (H1) está ativo em produção e revelou um agravante
crítico: o **cadastro público está habilitado** (`disable_signup: false`) e o **Storage** permite
escrita/remoção a qualquer usuário autenticado (M7) — ou seja, qualquer pessoa pode se registrar e
**deletar/sobrescrever toda a mídia do site**. As correções de código e a migration foram preparadas;
itens marcados como "aplicar" exigem rodar a migration 005 e ajustar a config de Auth no Supabase.

| ID | Severidade | OWASP | Título | Status |
|----|-----------|-------|--------|--------|
| H1 | **ALTO** | A01 Broken Access Control | Escalonamento de privilégio via RLS de `profiles` (confirmado ao vivo) | ✅ **Aplicado em produção** (migration 005) |
| H2 | **ALTO** | A05 Security Misconfiguration | `/api/revalidate` fail-open sem segredo | ✅ Corrigido (código) |
| **M7** | **ALTO** | A01 Broken Access Control | Storage: escrita/remoção liberada a qualquer autenticado + signup aberto | ✅ **Aplicado** (storage staff-only) → ⚠️ desabilitar signup |
| M1 | MÉDIO | A04 Insecure Design | Anti-spam contornável via INSERT anônimo direto | ✅ **Aplicado em produção** (migration 005) |
| M2 | MÉDIO | A07 Auth Failures | Autorização server-side com `getSession()` | ✅ Corrigido (código) |
| M3 | MÉDIO | A05 Security Misconfiguration | CSP com `unsafe-inline` + `unsafe-eval` | ✅ Mitigado (ver nota) |
| M4 | MÉDIO | A04 Insecure Design | Rate-limit por `X-Forwarded-For` spoofável | ✅ Corrigido (código) |
| M5 | MÉDIO | A01 Broken Access Control | Middleware não checa `role`; **signup público habilitado** | ✅ Middleware corrigido → ⚠️ **desabilitar signup** |
| M6 | MÉDIO | A02 Cryptographic Failures | `IP_HASH_SALT` fraco; pseudonimização de CPF | ✅ Corrigido (HMAC + salt obrigatório) |
| L1 | BAIXO | A03 Injection | JSON-LD sem escape de `<`/`>`/`&` | ✅ Corrigido (código) |
| L2 | BAIXO | A04 Insecure Design | `/api/ai/chat` sem rate-limit por usuário | ✅ Mitigado (best-effort) |
| L3 | BAIXO | A04 Insecure Design | `/api/lgpd/consent` sem honeypot/rate-limit | ✅ Corrigido (código) |
| L4 | BAIXO | A03 Injection | HTML do TipTap não sanitizado (latente) | 📝 Documentado (sem superfície hoje) |
| L5 | BAIXO | A05 Security Misconfiguration | `NEXT_PUBLIC_RD_STATION_TOKEN` exporia token | ✅ Corrigido (`.env.example`) |
| L6 | BAIXO | A07 Auth Failures | Proteção contra senhas vazadas desabilitada | ✅ **Ativado** (`password_hibp_enabled`) |
| L7 | BAIXO | A05 Security Misconfiguration | Advisors: `function_search_path_mutable` | 📝 Documentado |

---

## 2. Achados detalhados

### H1 — Escalonamento de privilégio via RLS de `profiles` [ALTO]
**OWASP A01.** `supabase/migrations/001_initial_schema.sql:13` — a policy
`"Users can update own profile" FOR UPDATE USING (auth.uid() = id)` não restringia colunas nem tinha
`WITH CHECK`. Como o browser usa a `anon key` com a sessão do usuário (`src/lib/supabase/client.ts`),
um `editor` autenticado podia executar
`supabase.from('profiles').update({ role: 'admin' }).eq('id', <self>)` e virar `admin` — ganhando
poder de criar/excluir usuários e ler todas as submissões e dados LGPD/PII.

**Confirmado ao vivo:** a policy `Users can update own profile` em produção tem `cmd=UPDATE`,
`qual=(auth.uid() = id)`, **`with_check = null`**, e o trigger de proteção **não existe**
(`role_escalation_trigger_count = 0`). A falha é explorável agora.

**Correção:** `supabase/migrations/005_security_hardening.sql` adiciona o trigger
`prevent_profile_role_escalation()` (`BEFORE UPDATE`), que bloqueia mudança de `role` quando o ator
não é admin. Mudanças legítimas continuam via `PATCH /api/admin/users` (service role, `auth.uid()`
nulo → permitido). A policy de UPDATE foi recriada com `WITH CHECK (auth.uid() = id)` explícito.
**Requer aplicar a migration 005.**

### H2 — `/api/revalidate` abre se o segredo não estiver setado [ALTO]
**OWASP A05.** `src/app/api/revalidate/route.ts` comparava `secret !== process.env.REVALIDATION_SECRET`.
Com a env ausente (`undefined`) e body sem `secret`, `undefined !== undefined` é falso → **bypass**,
permitindo revalidação arbitrária de qualquer path (abuso de cache/DoS). Comparação não constant-time.

**Correção:** *fail-closed* — retorna `503` se `REVALIDATION_SECRET` não estiver configurado;
comparação com `crypto.timingSafeEqual` e rejeição de segredos vazios.

### M7 — Storage: escrita/remoção liberada a qualquer autenticado [ALTO]
**OWASP A01.** Verificação ao vivo do Storage:
- 4 buckets, **todos `public: true`** (`images`, `pdfs`, `blog`, `media`).
- Políticas em `storage.objects`: `storage_public_read` (SELECT, public) e
  `storage_auth_insert` / `storage_auth_update` / `storage_auth_delete` — todas para `{authenticated}`,
  **sem escopo de bucket, owner ou role**.

Combinado com o **signup público habilitado** (ver M5), isto significa que **qualquer pessoa na
internet pode se cadastrar e então inserir, sobrescrever ou DELETAR qualquer objeto em todos os
buckets** — defacement/destruição de toda a mídia do site e hospedagem de arquivos arbitrários no
domínio da empresa. Por isso é classificado como **ALTO**.

**Correção:** migration 005 cria `public.is_staff()` (SECURITY DEFINER) e substitui as três políticas
amplas por `storage_staff_insert/update/delete` restritas a `admin`/`editor`. A leitura pública é
mantida (mídia do site é pública por design). **Requer aplicar a migration 005.**

### M1 — Anti-spam contornável: INSERT anônimo direto nas tabelas [MÉDIO]
**OWASP A04.** Policies `"Anyone can ..." FOR INSERT TO anon WITH CHECK (true)` em `form_submissions`,
`consent_logs` e `lgpd_requests`. Como `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` são públicos, um
atacante postava direto no REST do Supabase, **ignorando honeypot, timing e rate-limit** das APIs.

**Correção:** migration 005 remove as três policies de INSERT anônimo. Os inserts continuam pelas
rotas de API, que usam `service_role` (ignora RLS) e onde ficam os controles anti-spam. Adicionadas
constraints de tamanho em `consent_text` e `purposes`.

### M2 — Autorização server-side com `getSession()` [MÉDIO]
**OWASP A07.** `src/app/api/ai/chat/route.ts` e `src/app/api/admin/users/route.ts` usavam
`auth.getSession()`, que confia no cookie e não revalida o token no Auth server (recomendação oficial
do Supabase é `getUser()` no servidor). Em `ai/chat` não havia query que revalidasse o JWT.

**Correção:** ambas as checagens migradas para `auth.getUser()`.

### M3 — CSP fraca para scripts [MÉDIO]
**OWASP A05.** `next.config.ts` usava `script-src 'self' 'unsafe-inline' 'unsafe-eval'`.

**Mitigação aplicada:** `'unsafe-eval'` removido em produção (mantido só em dev, onde o React precisa);
adicionadas as diretivas `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` e
`upgrade-insecure-requests`, que reduzem o raio de impacto de uma eventual injeção.
**Nota técnica:** `'unsafe-inline'` foi **mantido** intencionalmente. Migrar para CSP por *nonce*
exigiria renderização **dinâmica** em todas as páginas (a doc do Next 16 confirma: nonce desativa
static/ISR/CDN e é incompatível com PPR), o que regrediria o trabalho de LCP/performance recente.
Além disso, `experimental.inlineCss: true` exige `style-src 'unsafe-inline'`. Próximo passo opcional:
avaliar **SRI** (`experimental.sri`) para hash-based CSP mantendo geração estática.

### M4 — Rate-limit por `X-Forwarded-For` spoofável [MÉDIO]
**OWASP A04.** `contact` e `lgpd/request` usavam `xff.split(",")[0]` — o primeiro hop é enviado pelo
cliente e pode ser forjado para burlar o limite por IP.

**Correção:** novo util `src/lib/utils/pii-hash.ts#clientIp()` prioriza o header confiável da
plataforma (`x-nf-client-connection-ip` na Netlify) e, como fallback, usa o **último** hop do XFF.

### M5 — Middleware não checa `role` do perfil [MÉDIO]
**OWASP A01.** `src/lib/supabase/middleware.ts` só verificava a existência de `user`, não o `role`.
Qualquer autenticado carregava a UI de `/ponti-admin/*` (os dados seguem protegidos por RLS/API).

**Confirmado ao vivo:** `disable_signup: false` e `external_email_enabled: true` →
**o cadastro público está ATIVO**. Hoje, qualquer pessoa cria uma conta autenticada (com confirmação
de e-mail, pois `mailer_autoconfirm: false`). Sem perfil ela não vira admin, mas vira `authenticated`
— o que é suficiente para explorar o Storage (M7).

**Correção:** o middleware agora consulta o `role` do perfil e redireciona quem não for
`admin`/`editor`. **⚠️ Ação de ops (recomendada):** **desabilitar o signup** (`disable_signup: true`)
— é um painel interno, não precisa de auto-registro. Isso remove o vetor externo de M7 e do acesso
ao painel.

### M6 — `IP_HASH_SALT` fraco; pseudonimização de CPF [MÉDIO]
**OWASP A02 / LGPD.** O hashing de IP/CPF/e-mail usava `sha256(valor + (env ?? "viver-saude-salt"))`,
com fallback hardcoded e duplicado em 3 rotas. Com salt conhecido/ausente, o hash de CPF (≈10^11
combinações) é reidentificável por força bruta.

**Correção:** centralizado em `src/lib/utils/pii-hash.ts` usando **HMAC-SHA256** com
`IP_HASH_SALT` **obrigatório** (falha se ausente ou < 16 chars — sem fallback). `.env.local.example`
atualizado. **Observação LGPD:** hash de CPF é *pseudonimização*, não anonimização (art. 12); o dado
segue sob proteção da LGPD.

### L1 — JSON-LD sem escape [BAIXO]
**OWASP A03.** `JSON.stringify` em `dangerouslySetInnerHTML` não escapa `<`/`>`/`&`; conteúdo do CMS
(ex.: nome de plano) com `</script>` quebraria a tag. **Correção:** novo util
`src/lib/utils/json-ld.ts#jsonLdString()` aplicado em `planos/[slug]` e `planos/page` (os demais
JSON-LD são literais estáticos, sem risco).

### L2 — `/api/ai/chat` sem rate-limit por usuário [BAIXO]
**OWASP A04.** Endpoint autenticado sem limite por usuário → abuso de custo da API Anthropic.
**Mitigação:** limitador *best-effort* por usuário (20 req/min). Em serverless o estado é por
instância; o **fix durável** é um store compartilhado (tabela no Supabase ou Upstash/Redis) — fica
como recomendação. Risco residual baixo: endpoint restrito a `admin`/`editor`.

### L3 — `/api/lgpd/consent` sem honeypot/rate-limit [BAIXO]
**OWASP A04.** **Correção:** adicionados honeypot, timing-check, rate-limit (20/h por IP) e
`.max(50)` em `purposes`.

### L4 — HTML do TipTap não sanitizado (latente) [BAIXO]
**OWASP A03.** O CMS armazena conteúdo rico (TipTap). Hoje o blog público (`noticias/page.tsx`) usa
um **array estático** — **não há render de HTML do CMS**, então não há sink explorável agora.
**Ação futura:** ao criar uma página pública que renderize `posts.content`, sanitizar server-side
com lib vetada (ex.: `isomorphic-dompurify`) antes de qualquer `dangerouslySetInnerHTML`. Não foi
adicionado sanitizador caseiro de propósito (anti-padrão). Snippet recomendado:

```ts
import DOMPurify from "isomorphic-dompurify";
const safe = DOMPurify.sanitize(htmlDoCms, { USE_PROFILES: { html: true } });
// <div dangerouslySetInnerHTML={{ __html: safe }} />
```

### L5 — `NEXT_PUBLIC_RD_STATION_TOKEN` [BAIXO]
**OWASP A05.** O exemplo de env prefixava o token de CRM com `NEXT_PUBLIC_`, o que o exporia ao
browser (atualmente não usado no código). **Correção:** renomeado para `RD_STATION_TOKEN`
(server-only) em `.env.local.example`.

### L6 — Proteção contra senhas vazadas desabilitada [BAIXO]
**OWASP A07.** Advisor `auth_leaked_password_protection`: o Supabase pode checar senhas contra a base
HaveIBeenPwned, mas está **desligado**. Como as senhas de admin são definidas via API
(`POST /api/admin/users`), vale ativar. **Ação:** Auth → Settings → "Leaked password protection".

### L7 — Funções com `search_path` mutável [BAIXO]
**OWASP A05.** Advisor `function_search_path_mutable` em funções existentes (ex.: `update_updated_at`,
`is_admin`) — sem `SET search_path`, há risco teórico de hijack via objetos em schema controlável.
As funções novas desta entrega (`prevent_profile_role_escalation`, `is_staff`) já fixam
`search_path = public`. **Recomendação:** adicionar `SET search_path = ''` (ou `public`) às funções
legadas. Os advisors `*_security_definer_function_executable` (sobre `is_admin`) são esperados e de
baixo risco.

---

## 3. Pontos positivos (defesa já presente)
- Sem segredos reais versionados; `.gitignore` cobre `.env*`, `*.pem`, `imagens/`, `.claude/`.
- Headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, `frame-ancestors 'none'`.
- `service_role` apenas server-side; browser usa só `anon` (`src/lib/supabase/admin.ts`).
- `next/image remotePatterns` restrito a `*.supabase.co/storage/.../public` e Unsplash.
- Validação com Zod; honeypot + timing nos forms; CPF hasheado (não armazenado em claro).
- RLS habilitado em todas as tabelas; políticas de leitura pública restritas a `published`/`active`.

---

## Apêndice A — Arquivos alterados nesta entrega
- `supabase/migrations/005_security_hardening.sql` (novo) — H1, M1, M7 (+ `is_staff()`).
- `src/lib/utils/pii-hash.ts` (novo) — M4, M6.
- `src/lib/utils/json-ld.ts` (novo) — L1.
- `src/app/api/revalidate/route.ts` — H2.
- `src/app/api/ai/chat/route.ts` — M2, L2.
- `src/app/api/admin/users/route.ts` — M2.
- `src/lib/supabase/middleware.ts` — M5.
- `next.config.ts` — M3.
- `src/app/api/contact/route.ts`, `src/app/api/lgpd/request/route.ts`,
  `src/app/api/lgpd/consent/route.ts` — M4, M6, L3.
- `src/app/planos/[slug]/page.tsx`, `src/app/planos/page.tsx` — L1.
- `src/lib/utils/antispam.ts` — M6 (delega `hashIP`).
- `.env.local.example` — M6, L5, H2.

> A migration 005 **não** foi aplicada ao banco. Aplicar com `supabase db push` (ou `apply_migration`)
> após revisão. Operações git remotas (push/PR) são exclusivas do `@aiox-devops`.

## Apêndice B — Verificação ao vivo (executada via Management API)
Projeto `Viver Saude - Site` (ref `hxavbmcwtgzrcpmznfwv`, sa-east-1), em 2026-06-02:

- **RLS:** habilitado em todas as 20 tabelas de `public` ✅.
- **profiles:** policy de UPDATE com `with_check = null` → **H1 confirmado**. Trigger de proteção
  ausente → migration 005 ainda não aplicada.
- **form_submissions:** policy `Anyone can submit forms` INSERT `{anon,authenticated}` `WITH CHECK true`
  presente → **M1 confirmado**.
- **consent_logs / lgpd_requests:** **não existem** neste projeto (a migration `002_lgpd` do repo não
  foi aplicada aqui). ⚠️ Drift de schema — ver nota abaixo.
- **site_settings:** leitura pública (`true`) para `anon` — aceitável (apenas contato/redes sociais).
- **Storage:** 4 buckets públicos + insert/update/delete para `{authenticated}` → **M7 (ALTO)**.
- **Auth:** `disable_signup: false` (**signup aberto**), `mailer_autoconfirm: false`,
  `external_anonymous_users_enabled: false`, `security_captcha_enabled: false` → **M5/M7 amplificados**.
- **Security advisors:** 13× `rls_policy_always_true` (políticas `USING/CHECK true`),
  `auth_leaked_password_protection` desabilitado (**L6**), `function_search_path_mutable` (**L7**),
  `*_security_definer_function_executable` (esperado para `is_admin`).

> **Drift de schema (repo × produção):** as policies ao vivo usam `is_admin()` (refatoração não
> presente nas migrations do repo) e as tabelas LGPD (`consent_logs`/`lgpd_requests`) não existem em
> produção. As migrations versionadas **não** são a fonte de verdade do banco atual. Recomenda-se
> reconciliar (exportar o schema real para migrations versionadas). A migration 005 foi escrita de
> forma defensiva (guardas `to_regclass`) para aplicar com segurança nesse cenário.

## Apêndice C-ops — Ações de configuração
**Executadas nesta sessão (via Management API, 2026-06-02):**
- ✅ **Migration 005 aplicada** em produção — verificado: trigger `profiles_prevent_role_escalation`
  ativo, `WITH CHECK` na policy de UPDATE, policy de insert anônimo removida, Storage com políticas
  `storage_staff_*` (escrita só admin/editor).
- ✅ **Leaked password protection ativada** (`password_hibp_enabled = true`).
- ✅ Advisors revalidados: `auth_leaked_password_protection` resolvido; `rls_policy_always_true`
  caiu de 13→12 (restantes são leitura pública intencional).

**Ainda pendentes (decisão/ops):**
1. ⚠️ **Desabilitar o signup** (`disable_signup: true`) — **não** alterado (sem confirmação). Enquanto
   aberto, qualquer um cria conta; M7 segue mitigado pela migration (escrita só staff), mas desabilitar
   é a defesa recomendada para um painel interno.
2. Definir em produção (Netlify) as envs **obrigatórias**: `IP_HASH_SALT` (>=16 chars) e
   `REVALIDATION_SECRET` — senão os endpoints falham *fail-closed* (intencional).
3. (Higiene) `SET search_path` nas funções legadas (L7); reconciliar o drift de schema repo×produção;
   opcional: `REVOKE EXECUTE ... FROM anon` em `is_staff()`/`is_admin()`.
4. **Revogar o token de acesso pessoal** usado nesta auditoria (foi exposto no chat).

## Apêndice C — Verificação executada
- `npm run build` ✅ (postbuild `next-sitemap` ok; páginas seguem `Static`/`SSG` — CSP não regrediu performance).
- `npm run lint` — 7 erros **pré-existentes** (`react-hooks/set-state-in-effect` em
  `ponti-admin/users/page.tsx` e `BannerCarousel.tsx`), **não relacionados** a esta auditoria.
  Nenhum arquivo alterado aqui introduziu erro novo.
