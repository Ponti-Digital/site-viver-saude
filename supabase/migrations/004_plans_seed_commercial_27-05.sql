-- Sincroniza a tabela `plans` com o briefing comercial Viver Saúde — 2026-05-27.
-- Idempotente: pode ser reaplicada sem efeitos colaterais.
-- Fonte: Viver_Saude_Comercial-27-05.docx
--
-- Mudanças em relação à migration 003:
--   - Ametista passa a is_active=false (não comercializado no ciclo atual)
--   - Taglines, descrições, target_audience, highlights e coverage_type atualizados
--     para os 6 planos ativos conforme briefing comercial 27/05
--   - Diamante mantém abrangência ampliada (19 municípios)
--   - sort_order mantido: Diamante=10, Ametista=20, Quartzo=30, Turmalina=40,
--     Rubi=50, Safira=60, Topázio=70

INSERT INTO plans (slug, name, display_name, tagline, description, target_audience, highlights, coverage_type, region, sort_order, is_active)
VALUES
  (
    'diamante', 'Diamante', 'Plano Diamante',
    'Mais cuidado, mais conforto, mais tranquilidade.',
    'O Viver Diamante é o plano de mais alto nível da Viver Saúde. Conta com cobertura ambulatorial, hospitalar e obstétrica, além de opções de acomodação em quarto coletivo ou privativo. É a escolha ideal para quem deseja o melhor cuidado em todas as fases da vida.',
    'Empresarial e Coletivo por Adesão',
    ARRAY['Cobertura ambulatorial e hospitalar com obstetrícia','Opção de quarto privativo e coletivo'],
    'Ambulatorial + Hospitalar com Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu, Macau, Alto do Rodrigues, Açu, Mossoró, Caicó, Currais Novos, Nísia Floresta, Guamaré, Pendências, Pau dos Ferros',
    10, true
  ),
  (
    'ametista', 'Ametista', 'Plano Ametista',
    'Plano completo com obstetrícia para empresas e por adesão',
    'O Viver Ametista oferece cobertura ambulatorial e hospitalar completa, incluindo obstetrícia. Disponível para contratação empresarial e por adesão, combina segurança, acompanhamento próximo e atenção integral à saúde física e emocional dos beneficiários.',
    'Empresarial e Por Adesão',
    ARRAY['Cobertura ambulatorial e hospitalar completa','Cobertura obstétrica (parto e gestação)','Atendimento de urgência e emergência','Disponível para empresas e por adesão','Abrangência em 9 municípios do RN'],
    'Ambulatorial + Hospitalar com Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu',
    20, false
  ),
  (
    'quartzo', 'Quartzo', 'Plano Quartzo',
    'Saúde e acolhimento para todos os momentos.',
    'O Viver Quartzo oferece cobertura ambulatorial e hospitalar com obstetrícia, garantindo cuidado completo em todas as fases da vida. Disponível nas modalidades pessoa física, empresarial e coletivo por adesão, é a escolha ideal para quem busca segurança, acolhimento e assistência integral.',
    'Pessoa Física, Empresarial e Coletivo por Adesão',
    ARRAY['Cobertura ambulatorial e hospitalar com obstetrícia','Opção de quarto privativo e coletivo','Disponível para pessoa física, empresas e coletivo por adesão'],
    'Ambulatorial + Hospitalar com Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    30, true
  ),
  (
    'turmalina', 'Turmalina', 'Plano Turmalina',
    'Plano de atenção primária com obstetrícia para empresas e coletivo por adesão',
    'O Viver Turmalina é um plano de atenção primária à saúde, com cobertura ambulatorial e hospitalar com obstetrícia. Com foco no acompanhamento contínuo, prevenção e gestão da saúde, é ideal para quem valoriza cuidado regular e integral ao longo da vida.',
    'Empresarial e Coletivo por Adesão',
    ARRAY['Cobertura ambulatorial e hospitalar com obstetrícia','Foco em atenção primária e acompanhamento contínuo','Disponível para empresas e coletivo por adesão'],
    'Ambulatorial + Hospitalar com Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    40, true
  ),
  (
    'rubi', 'Rubi', 'Plano Rubi',
    'Plano ambulatorial e hospitalar sem obstetrícia.',
    'O Viver Rubi foi pensado para quem busca praticidade, proteção e acesso facilitado à saúde no dia a dia. O plano oferece atendimento para consultas, exames, procedimentos e internações em uma rede credenciada qualificada.',
    'Pessoa Física, Empresarial e Coletivo por Adesão',
    ARRAY['Cobertura ambulatorial e hospitalar sem obstetrícia','Disponível para pessoa física, empresas e coletivo por adesão'],
    'Ambulatorial + Hospitalar sem Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    50, true
  ),
  (
    'safira', 'Safira', 'Plano Safira',
    'Um plano pensado para o bem-estar e a longevidade.',
    'O Viver Safira é um plano desenvolvido especialmente para o público sênior. Com cobertura ambulatorial e hospitalar sem obstetrícia, oferece atenção contínua às necessidades de saúde do idoso, com foco em prevenção, acompanhamento regular e qualidade de vida em cada fase.',
    'Sênior',
    ARRAY['Cobertura ambulatorial e hospitalar sem obstetrícia','Desenvolvido para o perfil sênior','Opção de quarto privativo e coletivo'],
    'Ambulatorial + Hospitalar sem Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    60, true
  ),
  (
    'topazio', 'Topázio', 'Plano Topázio',
    'Plano ambulatorial empresarial com foco em consultas e prevenção',
    'O Viver Topázio é um plano ambulatorial voltado para quem quer investir na saúde preventiva. Com acesso a consultas regulares, exames e acompanhamento médico contínuo, garante cuidado no dia a dia.',
    'Empresarial e Coletivo por Adesão',
    ARRAY['Consultas com clínico geral e especialistas','Acompanhamento contínuo de saúde','Atendimento humanizado e próximo'],
    'Ambulatorial',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    70, true
  ),
  (
    'turquesa', 'Turquesa', 'Plano Turquesa',
    'Plano corporativo completo com obstetrícia e maior abrangência regional',
    'O Viver Turquesa é um plano desenvolvido para grandes empresas que buscam uma solução completa de saúde para seus colaboradores. Com cobertura ambulatorial e hospitalar, incluindo obstetrícia, e abrangência regional ampliada, oferece saúde ocupacional, gestão de benefícios e programas de qualidade de vida.',
    'Corporativo (grandes empresas)',
    ARRAY['Cobertura ambulatorial e hospitalar completa','Cobertura obstétrica (parto e gestação)','Solução corporativa para grandes empresas','Atendimento de urgência e emergência','Abrangência em Natal, Parnamirim, Mossoró e São Gonçalo do Amarante'],
    'Ambulatorial + Hospitalar com Obstetrícia',
    'Natal, Parnamirim, Mossoró, São Gonçalo do Amarante',
    80, false
  ),
  (
    'esmeralda', 'Esmeralda', 'Plano Esmeralda',
    'Plano hospitalar essencial para empresas e por adesão',
    'O Viver Esmeralda é um plano hospitalar pensado para quem busca cobertura essencial e eficiente em internações e atendimentos hospitalares. Sem cobertura ambulatorial, é uma opção estratégica para empresas e entidades de adesão que querem garantir proteção nos momentos mais críticos de saúde.',
    'Empresarial e Por Adesão',
    ARRAY['Cobertura hospitalar para internações clínicas e cirúrgicas','Atendimento de urgência e emergência','Acesso à rede hospitalar credenciada','Disponível para empresas e por adesão','Opção estratégica de menor custo com proteção hospitalar'],
    'Hospitalar',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    90, false
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  target_audience = EXCLUDED.target_audience,
  highlights = EXCLUDED.highlights,
  coverage_type = EXCLUDED.coverage_type,
  region = EXCLUDED.region,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = now();
