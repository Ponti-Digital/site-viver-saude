-- Sincroniza a tabela `plans` com o briefing comercial Viver Saúde — 2026-05-21.
-- Idempotente: pode ser reaplicada sem efeitos colaterais.
-- Fonte: Viver_Saude_Comercial-21-05.docx
--
-- Regras:
--   - 7 planos ativos na ordem do mais completo para o menos completo
--     (Diamante=10, Ametista=20, Quartzo=30, Turmalina=40, Rubi=50, Safira=60, Topázio=70)
--   - Turquesa e Esmeralda permanecem no banco como is_active=false (não comercializados)

INSERT INTO plans (slug, name, display_name, tagline, description, target_audience, highlights, coverage_type, region, sort_order, is_active)
VALUES
  (
    'diamante', 'Diamante', 'Plano Diamante',
    'Plano empresarial completo, com obstetrícia e opção de quarto privativo',
    'O Viver Diamante é o plano empresarial de mais alto nível da Viver Saúde. Com cobertura ambulatorial e hospitalar completa, incluindo obstetrícia, e opção de quarto privativo, é a escolha para empresas que querem oferecer o melhor aos seus colaboradores em qualquer fase da vida.',
    'Empresarial',
    ARRAY['Cobertura ambulatorial e hospitalar completa','Cobertura obstétrica (parto e gestação)','Opção de quarto privativo','Atendimento de urgência e emergência','Abrangência em todo o Rio Grande do Norte'],
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
    20, true
  ),
  (
    'quartzo', 'Quartzo', 'Plano Quartzo',
    'Plano completo com obstetrícia para empresas e pessoa física',
    'O Viver Quartzo oferece cobertura ambulatorial e hospitalar completa, com obstetrícia. Disponível tanto para contratação empresarial quanto para pessoa física, é um plano robusto para quem quer proteção integral em todas as fases da vida, incluindo a chegada de um filho.',
    'Empresarial e Pessoa Física',
    ARRAY['Cobertura ambulatorial e hospitalar completa','Cobertura obstétrica (parto e gestação)','Opção de quarto privativo (modalidade QP)','Atendimento de urgência e emergência','Disponível para empresas e pessoa física'],
    'Ambulatorial + Hospitalar com Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    30, true
  ),
  (
    'turmalina', 'Turmalina', 'Plano Turmalina',
    'Plano de atenção primária com obstetrícia para empresas e pessoa física',
    'O Viver Turmalina é um plano de atenção primária à saúde, com cobertura ambulatorial e hospitalar completa, incluindo obstetrícia. Com foco no acompanhamento contínuo, prevenção e gestão da saúde, é ideal para quem valoriza cuidado regular e integral ao longo da vida.',
    'Empresarial e Pessoa Física',
    ARRAY['Cobertura ambulatorial e hospitalar completa','Cobertura obstétrica (parto e gestação)','Foco em atenção primária e acompanhamento contínuo','Atendimento de urgência e emergência','Disponível para empresas e pessoa física'],
    'Ambulatorial + Hospitalar com Obstetrícia',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    40, true
  ),
  (
    'rubi', 'Rubi', 'Plano Rubi',
    'Plano ambulatorial e hospitalar para empresas e pessoa física',
    'O Viver Rubi oferece cobertura ambulatorial e hospitalar completa para quem busca segurança no dia a dia e nas situações que exigem internação. Disponível para contratação empresarial e pessoa física, combina acesso a consultas, exames e procedimentos com uma rede credenciada qualificada.',
    'Empresarial e Pessoa Física',
    ARRAY['Cobertura ambulatorial e hospitalar completa','Consultas com clínico geral e especialistas','Exames e procedimentos cirúrgicos','Atendimento de urgência e emergência','Disponível para empresas e pessoa física'],
    'Ambulatorial + Hospitalar',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    50, true
  ),
  (
    'safira', 'Safira', 'Plano Safira',
    'Plano sênior ambulatorial e hospitalar para pessoa física e por adesão',
    'O Viver Safira é um plano desenvolvido especialmente para o público sênior. Com cobertura ambulatorial e hospitalar, oferece atenção contínua às necessidades de saúde do idoso, com foco em prevenção, acompanhamento regular e qualidade de vida em cada fase.',
    'Sênior',
    ARRAY['Cobertura ambulatorial e hospitalar completa','Desenvolvido para o perfil sênior','Opção de quarto privativo (modalidade QP)','Atendimento de urgência e emergência','Disponível para pessoa física e por adesão'],
    'Ambulatorial + Hospitalar',
    'Natal, Parnamirim, São Gonçalo do Amarante',
    60, true
  ),
  (
    'topazio', 'Topázio', 'Plano Topázio',
    'Plano ambulatorial empresarial com foco em consultas e prevenção',
    'O Viver Topázio é um plano ambulatorial voltado para empresas que querem investir na saúde preventiva dos seus colaboradores. Com acesso a consultas regulares, exames e acompanhamento médico contínuo, garante cuidado no dia a dia sem necessidade de cobertura hospitalar.',
    'Empresarial',
    ARRAY['Consultas com clínico geral e especialistas','Exames preventivos e de rotina','Acompanhamento contínuo de saúde','Atendimento humanizado e próximo','Plano exclusivo para contratação empresarial'],
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
