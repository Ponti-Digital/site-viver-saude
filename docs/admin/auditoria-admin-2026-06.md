# Auditoria do Painel Admin (/ponti-admin) — Junho/2026

**Escopo:** auditoria completa de UX/UI e funcionalidade do painel administrativo, tendo como benchmark o **painel admin do WordPress** e como requisito o **Prompt Mestre Ponti** (seções 12 — Painel Admin e 13 — IA e agentes no admin).

**Data:** 2026-06-03
**Branch auditada:** `feat/ux-ui-audit-busca` (commit `c1794f2`)
**Tipo:** documento de auditoria — nenhum código foi alterado.

---

## 1. Sumário executivo

O painel cobre o básico com competência: auth via Supabase com middleware server-side e checagem de role, CRUD funcional de banners/planos/guia médico, upload de mídia com drag-and-drop, visualização de submissions com UTMs, analytics caseiro e chat de IA com 3 modos. O design é limpo e consistente (Tailwind, cards brancos, sidebar fixa).

O problema central **não é estético — é de arquitetura**: três das quatro entidades editáveis no admin (**posts, páginas e configurações**) não alimentam o site público. O conteúdo publicado vai para o banco e morre lá. Em paralelo, a experiência de edição está muito abaixo do padrão WordPress que o usuário final conhece: sem editor visual (TipTap está instalado e não é usado), sem feedback de sucesso, sem paginação, sem lixeira, sem autosave, e com um bug que **reescreve o slug de posts já publicados**.

### Nota por categoria

| Categoria | Nota | Comentário |
|---|---|---|
| Autenticação e segurança | 8/10 | Middleware + role check sólidos; reset de senha existe |
| Conexão admin → site público | **2/10** | Posts, páginas e settings não têm efeito no site |
| Edição de conteúdo | 3/10 | Textarea crua; TipTap instalado sem uso; slug instável |
| Listagens (tabelas) | 4/10 | Sem paginação, bulk actions, contadores ou lixeira |
| Mídia | 4/10 | Upload bom; sem alt text, busca ou integração com editores |
| Feedback ao usuário | 3/10 | `alert()`/`confirm()` nativos; sucesso silencioso |
| Navegação/layout | 6/10 | Sidebar limpa e responsiva; sem submenus, breadcrumbs ou "Ver site" |
| Roles e permissões | 5/10 | API protege; UI não diferencia admin de editor |
| IA no admin | 6/10 | Chat com modos funciona; não integrado aos editores |

### Top 5 riscos

1. **Conteúdo fantasma** — o editor publica um post e ele nunca aparece no site (`/noticias` é hardcoded). Quebra a confiança no painel inteiro.
2. **Slug de post publicado muda ao editar o título** — quebra URLs já indexadas (perda de SEO + 404).
3. **Exclusões permanentes com `confirm()` nativo e sem lixeira** — um clique apressado destrói conteúdo sem recuperação.
4. **`published_at` sobrescrito a cada save** — datas de publicação originais se perdem silenciosamente.
5. **Salvar sem revalidar ISR** — mesmo banners/planos (que o site lê) podem não refletir após edição; o endpoint `/api/revalidate` existe e nunca é chamado pelo admin.

---

## 2. Metodologia e referências

### Código auditado (leitura integral)

| Área | Arquivos |
|---|---|
| Layout/navegação | `src/app/ponti-admin/layout.tsx`, `template.tsx` |
| Dashboard | `src/app/ponti-admin/page.tsx` |
| Posts | `posts/page.tsx`, `posts/new/page.tsx`, `posts/[id]/page.tsx` |
| Páginas | `pages/page.tsx`, `pages/[id]/page.tsx` |
| Planos | `plans/page.tsx`, `plans/[id]/page.tsx` |
| Banners | `banners/page.tsx` |
| Guia Médico | `rede-credenciada/page.tsx` + editores `[id]` |
| Mídia | `media/page.tsx` |
| Submissions | `submissions/page.tsx` |
| Analytics | `analytics/page.tsx` |
| Usuários | `users/page.tsx`, `src/app/api/admin/users/route.ts` |
| Settings | `settings/page.tsx` |
| IA | `ai-chat/page.tsx`, `src/app/api/ai/chat/route.ts` |
| Auth | `login/page.tsx`, `reset-password/page.tsx`, `src/lib/supabase/middleware.ts` |
| Revalidação | `src/app/api/revalidate/route.ts` |

### Referências

- **Prompt Mestre Ponti** (Drive, `CLAUDE.md`), seção 12: login + reset + confirmação de e-mail + RLS; gestão de imagens, **gestão de páginas (edição inline)**, gestão de blog com SEO por post, gestão de usuários com papéis. Seção 13: assistente conversacional + agentes de Copywriting e UX/UI operando sobre conteúdo real.
- **Padrão WordPress admin**: list tables (busca, filtros, contadores por status, bulk actions, quick edit, paginação, lixeira), editor visual com autosave/revisões/preview/agendamento, media library com alt text e seleção integrada, admin notices, admin bar com "Visitar site", menus por capability.

---

## 3. Matriz de paridade WordPress

| Recurso WP | Estado no /ponti-admin | Gap | Prioridade |
|---|---|---|---|
| Conteúdo publicado aparece no site | **Não** (posts/páginas/settings órfãos) | Total | **P0** |
| Editor visual (Gutenberg/TinyMCE) | `<textarea font-mono>` | Total (TipTap já instalado) | **P0** |
| Slug travado após publicar | Slug regenera ao digitar título | Bug | **P0** |
| Cache atualizado ao salvar | Sem chamada a `/api/revalidate` | Total | **P0** |
| Admin notices (sucesso/erro) | `alert()`/`confirm()`; sucesso silencioso | Alto | **P1** |
| Paginação de listagens | Inexistente (submissions: `limit(100)` fixo) | Alto | **P1** |
| Contadores por status ("Todos (12) \| Publicados (8)…") | Inexistente | Alto | **P1** |
| Lixeira (trash/restore) | Delete permanente | Alto | **P1** |
| Media library: alt text, busca, seleção nos editores | Só grid + copiar URL + excluir | Alto | **P1** |
| Menus por capability (role) | Editor vê tudo, inclusive "Usuários" | Alto | **P1** |
| Bulk actions + quick edit | Inexistente | Médio | P2 |
| Autosave + aviso de alterações não salvas | Inexistente | Médio | P2 |
| Preview antes de publicar | Inexistente | Médio | P2 |
| Agendamento de publicação | Só banners têm (`starts_at`/`ends_at`) | Médio | P2 |
| Taxonomias gerenciáveis (categorias) | Array hardcoded no código | Médio | P2 |
| Admin bar / "Visitar site" / "Ver post" | Inexistente | Médio | P2 |
| Revisões de conteúdo | Inexistente | Baixo | P3 |
| Screen options / colunas configuráveis | Inexistente | Baixo | P3 |
| Dashboard widgets ("At a Glance", atividade) | Cards estáticos não clicáveis | Baixo | P3 |

---

## 4. Achados detalhados

### A. Arquitetura — o admin não liga no site (P0)

**A1. Posts não têm rota pública.**
`src/app/noticias/page.tsx:28` renderiza um array hardcoded de notícias; não existe `src/app/noticias/[slug]/page.tsx`. `grep from("posts")` confirma que a tabela `posts` só é lida pelo próprio admin (dashboard, analytics, listagem, editores). Todo o fluxo de blog do admin (criar → editar → publicar, com SEO, tags, capa) é inócuo.
**Recomendação:** criar rota pública `noticias/[slug]` (SSG/ISR lendo `posts` com `status = published`) e migrar os itens hardcoded para o banco — ou, se o blog não for prioridade, remover Posts do menu até existir a rota (pior cenário é manter UI que mente).

**A2. Tabela `pages` não alimenta o site.**
Todas as páginas públicas são `.tsx` hardcoded. O editor `pages/[id]/page.tsx:117` expõe **JSON cru numa textarea** — hostil para usuário não técnico e sem qualquer consumo público. O prompt mestre exige "gestão de páginas (edição inline)".
**Recomendação:** decidir o modelo: (a) blocos editáveis por página (hero título/subtítulo/CTA etc.) lidos pelos `.tsx` públicos via Supabase com ISR; ou (b) remover a seção Páginas do menu. JSON cru não deve ser exposto em nenhum cenário.

**A3. `site_settings` não tem efeito público.**
`settings/page.tsx` salva telefone/e-mail/endereço/redes sociais, mas `grep from("site_settings")` mostra que só o próprio settings lê a tabela. O Footer/Header usam `src/lib/constants/site.ts`.
**Recomendação:** Footer/Header/FloatingWhatsApp passarem a ler `site_settings` (fetch server-side + ISR + revalidação ao salvar), com `constants/site.ts` como fallback.

**A4. Nenhuma revalidação após salvar.**
`/api/revalidate` (`src/app/api/revalidate/route.ts`) está pronto e seguro (timing-safe, fail-closed), mas `grep revalidate` no diretório do admin retorna 0 usos. Banners e planos — que o site público **lê** (`src/lib/supabase/banners.ts`, `plans.ts`) — podem ficar defasados até expirar o cache.
**Recomendação:** após cada save/delete de banner/plano (e futuramente post/página/settings), disparar revalidação dos paths afetados via server action ou route handler autenticado (não expor o secret no client).

**A5. TipTap instalado e não utilizado.**
`@tiptap/react`, `starter-kit`, `extension-image`, `extension-link` estão no `package.json`; `grep tiptap|useEditor` = 0 ocorrências em `src/`. O conteúdo de posts é editado em `<textarea>` mono (`posts/[id]/page.tsx:294`).
**Recomendação:** componente `RichTextEditor` compartilhado (TipTap + toolbar: headings, bold/italic, listas, link, imagem via media library, undo). Se não for implementado agora, remover as dependências (peso morto no bundle/lockfile).

### B. Bugs e comportamentos perigosos

**B1 (P0). Slug regenera ao editar título de post publicado.**
`posts/[id]/page.tsx:80-83`: `handleTitleChange` chama `setSlug(slugify(value))` incondicionalmente — corrigir um typo no título de um post publicado muda a URL e quebra links indexados. No `posts/new` o comportamento é aceitável; no edit, não.
**Padrão WP:** slug fica travado após publicar; edição só por ação explícita ("Editar" ao lado do permalink).
**Recomendação:** no editor de post existente, não derivar slug do título; exibir o slug com botão "editar" + aviso de que mudar a URL exige redirect.

**B2 (P0/P1). `published_at` sobrescrito a cada save.**
`posts/[id]/page.tsx:162-164`: todo submit com `status === "published"` faz `published_at = now()`. A data original de publicação se perde a cada correção.
**Recomendação:** só definir `published_at` na transição draft → published (e preservar em saves subsequentes). WP preserva e ainda permite editar a data manualmente (back-date/agendamento).

**B3 (P1). Erros engolidos em operações destrutivas e de escrita.**
- `posts/page.tsx:49-51`: delete sem checar `error` — a linha some da UI mesmo se o banco recusar (ex.: RLS), e volta no refresh.
- `banners/page.tsx:119-123`: insert/update sem checar `error`.
- Listagens (`posts/page.tsx:39`, `media/page.tsx:29`, `submissions/page.tsx:28-33`, `plans/page.tsx:25-29`) descartam `error` — falha de rede vira "Nenhum item encontrado" (estado vazio mentiroso).
**Recomendação:** tratar `error` em toda operação Supabase; distinguir estado vazio de estado de erro (com botão "tentar novamente").

**B4 (P2). Arquivos órfãos no Storage.**
Excluir post não remove `cover_image_url` do bucket; excluir banner não remove `banners/...` (a media library remove corretamente em `media/page.tsx:91-95`). Custo de storage cresce sem visibilidade.

**B5 (P3). React key warning latente.**
`submissions/page.tsx:93`: o fragment `<>` dentro do `.map` não recebe `key` (a key está no `<tr>` interno) — precisa ser `<Fragment key={sub.id}>`.

### C. Feedback ao usuário (P1)

**C1.** Nenhuma notificação de sucesso: salvar post/página redireciona mudo (`posts/[id]/page.tsx:177`); só Settings mostra mensagem de sucesso (`settings/page.tsx:130-133`).
**C2.** `confirm()`/`alert()` nativos em 10 pontos (posts, media, banners, users, rede-credenciada) — visual de 1998, sem contexto, sem botão de undo.
**C3.** Sem aviso ao sair com alterações não salvas (fechar a aba ou clicar no menu descarta tudo silenciosamente).
**Recomendação:** sistema único de **admin notices estilo WP**: componente `Toast`/`Notice` (sucesso/erro/aviso) + `ConfirmDialog` modal reutilizável. Combinar com lixeira (D4) para o fluxo "Excluído. **Desfazer**" do WordPress.

### D. Listagens — padrão WP list table (P1)

**D1. Sem paginação em lugar nenhum.** Posts/media/users carregam tudo; submissions tem `limit(100)` fixo sem navegação (`submissions/page.tsx:32`) — o 101º lead é invisível no admin.
**D2. Sem contadores por status.** WP mostra "Todos (15) | Publicados (9) | Rascunhos (6)" como links-filtro. O dado já está disponível (analytics já calcula em `analytics/page.tsx:31-39`).
**D3. Sem bulk actions** (seleção múltipla + ação em massa) e **sem quick edit** (editar status/categoria sem abrir o editor).
**D4. Sem lixeira.** Tudo é hard delete. WP: trash → 30 dias → purge, com restore.
**D5. Busca sem debounce na listagem de posts** (`posts/page.tsx:45`: o `useEffect` dispara query Supabase a cada tecla). O padrão correto **já existe no próprio projeto**: `rede-credenciada/page.tsx:80-83` usa `setTimeout` de 300ms — replicar.
**D6. Ordenação fixa.** Nenhuma coluna ordenável (WP permite ordenar por título/data).
**D7. Planos: CRUD incompleto.** `plans/page.tsx` não tem "Novo plano" nem excluir/inativar pela listagem — só editar os existentes.

### E. Editores de conteúdo (P0/P2)

**E1.** Editor visual: ver A5 (TipTap).
**E2. Sem preview** — não há como ver o post renderizado antes de publicar (depende de A1).
**E3. Sem agendamento** de posts. Curiosamente banners já têm `starts_at`/`ends_at` (`banners/page.tsx:17-18`) — o conceito existe no projeto.
**E4. Categorias hardcoded** (`posts/[id]/page.tsx:16-23` e duplicado em `posts/new/page.tsx`): array fixo com valores sem acento ("Saude", "Nutricao") que viram labels visíveis. WP tem CRUD de taxonomia.
**E5. SEO sem preview de snippet.** Há contadores de caracteres (bom), mas sem simulação visual do resultado Google nem validação de duplicidade. OG Image é input de URL crua — deveria abrir a media library.
**E6. Sem autosave/revisões.** WP salva rascunho a cada ~60s e mantém histórico. Mínimo viável: autosave de rascunho + aviso `beforeunload`.
**E7. Imagem de capa não integra com a media library** (`posts/[id]/page.tsx:308-316`): upload avulso direto para o bucket, sem registro na tabela `media`, sem alt text, sem reaproveitar imagens existentes.

### F. Mídia (P1)

**F1. Alt text não editável.** O campo `alt_text` existe na interface `MediaItem` (`media/page.tsx:13`) e na tabela, mas a UI não oferece como preenchê-lo — e o prompt mestre exige alt em toda imagem. O upload (`media/page.tsx:60-66`) nem insere o campo.
**F2. Sem busca, filtro ou paginação** no grid.
**F3. Sem painel de detalhes** (dimensões, data, em uso onde?) nem edição de nome.
**F4. Sem `MediaPicker` reutilizável** — todo lugar que precisa de imagem (capa de post, OG image, banners) resolve por conta própria. Este é o componente de maior alavancagem do roadmap: destrava E5, E7 e F1 de uma vez.

### G. Usuários e roles (P1)

**G1. UI idêntica para admin e editor.** O menu mostra "Usuários" e "Config" para todos (`layout.tsx:8-93` não consulta role); um editor clica, a página renderiza e a API retorna 401 (`api/admin/users/route.ts:17`) — frustração evitável. WP esconde menus por capability.
**Recomendação:** carregar o profile (role) no layout e filtrar `navItems`; opcionalmente diferenciar permissões de publicação (editor só rascunha?) conforme a política do cliente.
**G2. Mudança de role sem confirmação** (`users/page.tsx:55-62`): um select inline que dispara PATCH no change — fácil promover/demitir alguém por engano; sem toast de resultado.
**G3. Sem estados intermediários:** nenhuma indicação de "último acesso", usuário desabilitado vs. excluído (WP/Supabase permitem ban).

### H. Submissions e Analytics (P2)

**H1. Submissions sem ações:** não dá para marcar spam/não-spam, excluir (LGPD!), exportar CSV ou filtrar por tipo/data/spam. Para o usuário final (time comercial), exportação e filtro por período são o uso nº 1.
**H2. Analytics agrega no cliente:** `analytics/page.tsx:75-97` baixa **todas** as submissions para contar UTM sources no navegador — funciona com centenas, degrada com milhares.
**Recomendação:** mover agregações para views/RPC no Postgres (`group by utm_source`, `date_trunc('day')`).

### I. Navegação e layout (P2)

**I1. Sidebar plana com 12 itens** sem agrupamento. Padrão WP: grupos com submenu (Conteúdo: Posts/Páginas/Mídia · Site: Banners/Planos/Guia Médico · Leads: Submissions/Analytics · Sistema: Usuários/Config) — reduz carga cognitiva.
**I2. Sem link "Ver site"** (admin bar do WP) nem "ver página/post publicado" a partir do item — o editor não tem caminho de volta para o que está editando no site real.
**I3. Sem breadcrumbs** nos editores (Posts → Editar "Título").
**I4. Sem indicador de página ativa para subrotas com destaque parcial** — funciona, mas sem `aria-current`.
**I5. Header subaproveitado:** só e-mail + Sair. WP usa para busca global, notificações e atalhos "+ Novo".
**I6. Duplicação de auth no client** (`layout.tsx:110-125`): o middleware (`src/lib/supabase/middleware.ts:37-58`) já garante sessão + role no server; o `useEffect` do layout repete o check e adiciona um spinner em toda navegação. Pode reduzir para apenas exibir o e-mail (ou mover o user para um server component).

### J. Acessibilidade e consistência (P3)

**J1. Labels não associados:** nos formulários do admin os `<label>` não têm `htmlFor` (ex.: `posts/[id]/page.tsx:202`, `settings/page.tsx:143`) — exceto o login, que faz certo (`login/page.tsx:58`). Screen readers não vinculam label ↔ input.
**J2. Sem `aria-current="page"`** no item ativo do menu; modais/overlays (mobile sidebar) sem focus trap.
**J3. Idioma misto na UI:** "Submissions" vs. "Submissões", "Config", "Dashboard" — padronizar PT-BR ("Formulários", "Configurações", "Painel").
**J4. Componentes UI existentes não são usados:** `src/components/ui/` (Button, Input, Select, Card, Badge) está pronto, mas o admin repete classes Tailwind inline e SVGs duplicados (o mesmo ícone de upload aparece 3×). Extrair também `StatusBadge`, `DataTable`, `EmptyState`, `Spinner`.
**J5. Datas sem hora em listagens de conteúdo** (posts mostram só a data; WP mostra "Publicado 2026/06/03 às 14:22").

### K. IA no admin (P2)

**K1.** O chat (`ai-chat/page.tsx`) com modos Geral/Copywriting/UX atende parcialmente a seção 13 do prompt mestre, mas **não opera sobre conteúdo real**: não há botão "melhorar este texto" dentro do editor de post, nem contexto da página sendo editada.
**K2.** Histórico de conversa se perde ao navegar (estado local apenas).
**Recomendação:** ações de IA inline no editor (melhorar título, gerar meta description a partir do conteúdo, sugerir excerpt) usando o endpoint existente `/api/ai/chat` com modo copywriting — alto valor, esforço moderado, infra já pronta.

---

## 5. Roadmap sugerido

> Esforço: S (< meio dia) · M (1–2 dias) · L (3+ dias)

### Fase 1 — Ligar o admin no site + fundação de edição (P0)

| # | Item | Esforço |
|---|---|---|
| 1.1 | Rota pública `noticias/[slug]` + listagem lendo `posts` (ISR) e migração das notícias hardcoded | L |
| 1.2 | Revalidação ISR ao salvar/excluir banners e planos (depois posts/páginas) | S |
| 1.3 | Footer/Header lendo `site_settings` com fallback em constants | M |
| 1.4 | Travar slug no edit de post publicado (+ botão de edição explícita) | S |
| 1.5 | Preservar `published_at` (definir só na transição draft→published) | S |
| 1.6 | `RichTextEditor` TipTap substituindo as textareas de posts | M/L |
| 1.7 | Decisão sobre "Páginas": blocos editáveis ou remover do menu (nunca JSON cru) | M/L |

### Fase 2 — Paridade WP nas interações (P1)

| # | Item | Esforço |
|---|---|---|
| 2.1 | Sistema de notices/toasts + `ConfirmDialog` (substituir todos os `alert`/`confirm`) | M |
| 2.2 | Tratamento de `error` em todas as operações Supabase + estado de erro nas listas | M |
| 2.3 | Paginação (posts, media, submissions, users) | M |
| 2.4 | Contadores por status como filtros clicáveis (posts) | S |
| 2.5 | Lixeira para posts (status `trash` + restore + purge) | M |
| 2.6 | `MediaPicker` modal reutilizável + alt text editável na biblioteca | M/L |
| 2.7 | Capa de post e OG image via `MediaPicker` | S (após 2.6) |
| 2.8 | Menu filtrado por role (esconder Usuários/Config de editores) | S |
| 2.9 | Debounce na busca de posts (copiar padrão de `rede-credenciada/page.tsx:80-83`) | S |

### Fase 3 — Produtividade (P2)

| # | Item | Esforço |
|---|---|---|
| 3.1 | Autosave de rascunho + aviso `beforeunload` | M |
| 3.2 | Preview de post (rota draft preview autenticada) | M |
| 3.3 | Agendamento de posts (reaproveitar conceito dos banners) | M |
| 3.4 | CRUD de categorias (tabela `categories`) | M |
| 3.5 | Bulk actions + quick edit na listagem de posts | M/L |
| 3.6 | Submissions: filtros (tipo/data/spam), marcar spam, excluir (LGPD), exportar CSV | M |
| 3.7 | Analytics via views/RPC no Postgres | M |
| 3.8 | Sidebar agrupada em seções + link "Ver site" no header + breadcrumbs | M |
| 3.9 | IA inline nos editores (melhorar texto, gerar meta description) | M |
| 3.10 | "Novo plano" + inativar na listagem de planos | S |

### Fase 4 — Polish (P3)

| # | Item | Esforço |
|---|---|---|
| 4.1 | `htmlFor`/`id` em todos os formulários + `aria-current` + focus trap no sidebar mobile | S/M |
| 4.2 | Padronizar idioma PT-BR na UI | S |
| 4.3 | Adotar `components/ui/` no admin + extrair `DataTable`/`StatusBadge`/`EmptyState` + lib de ícones | M |
| 4.4 | Limpeza de storage órfão ao excluir post/banner | S |
| 4.5 | Dashboard "At a Glance" com cards clicáveis por status + datas com hora | S |
| 4.6 | Corrigir key do Fragment em submissions | S |

---

## 6. Quick wins (itens de < 1h, alto retorno)

1. **Debounce na busca de posts** — padrão já existe no projeto (`rede-credenciada/page.tsx:80-83`).
2. **Preservar `published_at`** — condicional de 2 linhas no submit (`posts/[id]/page.tsx:162`).
3. **Travar slug no edit** — remover `setSlug(slugify())` do `handleTitleChange` no editor de post existente.
4. **Esconder "Usuários"/"Config" de editores** — filtro em `navItems` com o role do profile.
5. **Link "Ver site" no header do admin** — `<Link href="/" target="_blank">`.
6. **`htmlFor` nos labels** — replicar o que o login já faz.
7. **Checar `error` no delete de posts** — evitar remoção otimista mentirosa.
8. **`aria-current="page"`** no item ativo da sidebar.
9. **Fragment key em submissions** (`submissions/page.tsx:93`).
10. **Contadores por status na listagem de posts** — queries `head: true` já usadas no analytics.

---

## Apêndice — pontos positivos a preservar

- **Middleware de auth exemplar** (`src/lib/supabase/middleware.ts`): `getUser()` revalidado no servidor, checagem de role fail-closed, comentários explicando as decisões.
- **API de usuários** com `checkAdmin()` em todos os verbos e proteção contra auto-exclusão (`api/admin/users/route.ts:141`).
- **Endpoint de revalidação seguro** (timing-safe compare, fail-closed) — só falta usá-lo.
- **Banners**: agendamento (`starts_at`/`ends_at`), toggle ativo, imagem desktop/mobile separadas — o CRUD mais completo do painel.
- **Guia Médico**: busca com debounce, tabs, tratamento de erro com `console.error` — o melhor padrão de listagem do painel.
- **Submissions**: linha expansível com dados do formulário + UTMs é uma boa solução de detalhe.
- Design visual consistente e responsivo (sidebar mobile com overlay).
