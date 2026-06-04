-- 006_plans_content.sql
-- Adiciona colunas de conteúdo rich à tabela plans e sincroniza todo o conteúdo
-- hardcoded atual do site público como fonte de verdade no banco.
--
-- COMO APLICAR: Cole este arquivo inteiro no SQL Editor do Supabase Dashboard
-- e clique em "Run". É idempotente: pode ser executado mais de uma vez com segurança.
--
-- Após aplicar, o site lerá os dados do banco com fallback field-by-field
-- para o conteúdo hardcoded — zero regressão antes da migration.

-- 1. Adicionar colunas novas (IF NOT EXISTS = idempotente)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS audience_label    text;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS starting_price    text;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS price_raw         text;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS benefits          jsonb DEFAULT '[]';
ALTER TABLE plans ADD COLUMN IF NOT EXISTS modalities_text   text;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS price_footnote    text;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS condicoes_gerais  jsonb DEFAULT '[]';

-- 2. Sincronizar conteúdo por slug
-- Usamos dollar-quoting para evitar problemas com aspas e acentos.

-- DIAMANTE
UPDATE plans SET
  tagline          = $$Mais cuidado, mais conforto, mais tranquilidade.$$,
  description      = $$O Viver Diamante é o plano de mais alto nível da Viver Saúde. Conta com cobertura ambulatorial, hospitalar e obstétrica, além de opções de acomodação em quarto coletivo ou privativo. É a escolha ideal para quem deseja o melhor cuidado em todas as fases da vida.$$,
  target_audience  = $$Ideal para quem busca o mais alto padrão de cobertura, com assistência obstétrica e opções de acomodação em quarto privativo ou coletivo.$$,
  highlights       = ARRAY[
    'Cobertura ambulatorial e hospitalar com obstetrícia',
    'Opção de quarto privativo e coletivo'
  ],
  coverage_type    = $$Ambulatorial + Hospitalar com Obstetrícia$$,
  region           = $$Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu, Macau, Alto do Rodrigues, Açu, Mossoró, Caicó, Currais Novos, Nísia Floresta, Guamaré, Pendências, Pau dos Ferros$$,
  image_url        = $$/images/plans/diamante.png$$,
  audience_label   = $$Empresarial e Coletivo por Adesão$$,
  starting_price   = $$A partir de R$ 154,27$$,
  price_raw        = $$R$ 154,27$$,
  modalities_text  = $$Disponível nas modalidades empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo ou privativo.$$,
  price_footnote   = $$*Valor referente à faixa etária de 0 a 18 anos. Consulte condições para demais faixas etárias e regras de contratação.$$,
  benefits         = '[{"name":"Telemedicina","description":"Consultas médicas online disponíveis 24h","value":"Incluso"},{"name":"Seguro Viagem","description":"Cobertura de R$ 50.000 em viagens","value":"Incluso"}]'::jsonb,
  condicoes_gerais = '[{"label":"Diamante CE QC","file":"/docs/condicoes-gerais/diamante-ce-qc.pdf"},{"label":"Diamante CE QP (Quarto Privativo)","file":"/docs/condicoes-gerais/diamante-ce-qp.pdf"}]'::jsonb,
  updated_at       = now()
WHERE slug = 'diamante';

-- AMETISTA
UPDATE plans SET
  tagline          = $$Plano completo com obstetrícia para empresas e por adesão$$,
  description      = $$O Viver Ametista oferece cobertura ambulatorial e hospitalar completa, incluindo obstetrícia. Disponível para contratação empresarial e por adesão, combina segurança, acompanhamento próximo e atenção integral à saúde física e emocional dos beneficiários.$$,
  target_audience  = $$Para empresas e entidades de adesão que buscam cobertura completa com obstetrícia e uma abrangência regional ampliada no Rio Grande do Norte.$$,
  highlights       = ARRAY[
    'Cobertura ambulatorial e hospitalar completa',
    'Cobertura obstétrica (parto e gestação)',
    'Atendimento de urgência e emergência',
    'Disponível para empresas e por adesão',
    'Abrangência em 9 municípios do RN'
  ],
  coverage_type    = $$Ambulatorial + Hospitalar com Obstetrícia$$,
  region           = $$Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu$$,
  image_url        = $$/images/plans/ametista.png$$,
  audience_label   = $$Empresarial e Por Adesão$$,
  starting_price   = $$A partir de R$ 121,80$$,
  price_raw        = $$R$ 121,80$$,
  modalities_text  = $$Disponível para contratação empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo.$$,
  price_footnote   = $$*Valor referente à faixa etária de 0 a 18 anos. Consulte condições para demais faixas etárias e regras de contratação.$$,
  benefits         = '[{"name":"Telemedicina","description":"Consultas médicas online disponíveis 24h","value":"Incluso"},{"name":"Seguro Viagem","description":"Cobertura de R$ 50.000 em viagens","value":"Incluso"}]'::jsonb,
  condicoes_gerais = '[{"label":"Ametista CE QC","file":"/docs/condicoes-gerais/ametista-ce-qc.pdf"}]'::jsonb,
  updated_at       = now()
WHERE slug = 'ametista';

-- QUARTZO
UPDATE plans SET
  tagline          = $$Saúde e acolhimento para todos os momentos.$$,
  description      = $$O Viver Quartzo oferece cobertura ambulatorial e hospitalar com obstetrícia, garantindo cuidado completo em todas as fases da vida. Disponível nas modalidades pessoa física, empresarial e coletivo por adesão, é a escolha ideal para quem busca segurança, acolhimento e assistência integral.$$,
  target_audience  = $$Ideal para quem busca cuidado completo, segurança e assistência em todas as fases da vida.$$,
  highlights       = ARRAY[
    'Cobertura ambulatorial e hospitalar com obstetrícia',
    'Opção de quarto privativo e coletivo',
    'Disponível para pessoa física, empresas e coletivo por adesão'
  ],
  coverage_type    = $$Ambulatorial + Hospitalar com Obstetrícia$$,
  region           = $$Natal, Parnamirim, São Gonçalo do Amarante$$,
  image_url        = $$/images/plans/quartzo.png$$,
  audience_label   = $$Pessoa Física, Empresarial e Coletivo por Adesão$$,
  starting_price   = $$A partir de R$ 110,80$$,
  price_raw        = $$R$ 110,80$$,
  modalities_text  = $$Disponível nas modalidades empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo ou privativo.$$,
  price_footnote   = $$*Valor referente à faixa etária de 0 a 18 anos. Consulte condições para demais faixas etárias e regras de contratação.$$,
  benefits         = '[{"name":"Telemedicina","description":"Consultas médicas online disponíveis 24h","value":"Incluso"},{"name":"Seguro Viagem","description":"Cobertura de R$ 30.000 em viagens","value":"Incluso"}]'::jsonb,
  condicoes_gerais = '[{"label":"Quartzo CA QC","file":"/docs/condicoes-gerais/quartzo-ca-qc.pdf"},{"label":"Quartzo CE QC","file":"/docs/condicoes-gerais/quartzo-ce-qc.pdf"}]'::jsonb,
  updated_at       = now()
WHERE slug = 'quartzo';

-- TURMALINA
UPDATE plans SET
  tagline          = $$Plano de atenção primária com obstetrícia para empresas e coletivo por adesão$$,
  description      = $$O Viver Turmalina é um plano de atenção primária à saúde, com cobertura ambulatorial e hospitalar com obstetrícia. Com foco no acompanhamento contínuo, prevenção e gestão da saúde, é ideal para quem valoriza cuidado regular e integral ao longo da vida.$$,
  target_audience  = $$Ideal para quem valoriza prevenção, acompanhamento contínuo e mais qualidade de vida no dia a dia.$$,
  highlights       = ARRAY[
    'Cobertura ambulatorial e hospitalar com obstetrícia',
    'Foco em atenção primária e acompanhamento contínuo',
    'Disponível para empresas e coletivo por adesão'
  ],
  coverage_type    = $$Ambulatorial + Hospitalar com Obstetrícia$$,
  region           = $$Natal, Parnamirim, São Gonçalo do Amarante$$,
  image_url        = $$/images/plans/turmalina.png$$,
  audience_label   = $$Empresarial e Coletivo por Adesão$$,
  starting_price   = $$A partir de R$ 98,37$$,
  price_raw        = $$R$ 98,37$$,
  modalities_text  = $$Disponível para contratação empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo.$$,
  price_footnote   = $$*Valor referente à faixa etária de 0 a 18 anos. Consulte condições para demais faixas etárias e regras de contratação.$$,
  benefits         = '[{"name":"Telemedicina","description":"Consultas médicas online disponíveis 24h","value":"Incluso"},{"name":"Seguro Viagem","description":"Cobertura de R$ 30.000 em viagens","value":"Incluso"}]'::jsonb,
  condicoes_gerais = '[{"label":"Turmalina CA QC","file":"/docs/condicoes-gerais/turmalina-ca-qc.pdf"},{"label":"Turmalina CE QC","file":"/docs/condicoes-gerais/turmalina-ce-qc.pdf"}]'::jsonb,
  updated_at       = now()
WHERE slug = 'turmalina';

-- RUBI
UPDATE plans SET
  tagline          = $$Plano ambulatorial e hospitalar sem obstetrícia.$$,
  description      = $$O Viver Rubi foi pensado para quem busca praticidade, proteção e acesso facilitado à saúde no dia a dia. O plano oferece atendimento para consultas, exames, procedimentos e internações em uma rede credenciada qualificada.$$,
  target_audience  = $$Para quem deseja um plano para acompanhar a rotina de saúde com mais tranquilidade e conveniência.$$,
  highlights       = ARRAY[
    'Cobertura ambulatorial e hospitalar sem obstetrícia',
    'Disponível para pessoa física, empresas e coletivo por adesão'
  ],
  coverage_type    = $$Ambulatorial + Hospitalar sem Obstetrícia$$,
  region           = $$Natal, Parnamirim, São Gonçalo do Amarante$$,
  image_url        = $$/images/plans/rubi.png$$,
  audience_label   = $$Pessoa Física, Empresarial e Coletivo por Adesão$$,
  starting_price   = $$A partir de R$ 104,53$$,
  price_raw        = $$R$ 104,53$$,
  modalities_text  = $$Disponível para contratação pessoa física, empresarial e coletivo por adesão com opções de coparticipação básica ou completa e acomodação em quarto coletivo.$$,
  price_footnote   = $$*Valor referente à faixa etária de 0 a 18 anos. Consulte condições para demais faixas etárias e regras de contratação.$$,
  benefits         = '[{"name":"Telemedicina","description":"Consultas médicas online disponíveis 24h","value":"Incluso"},{"name":"Seguro Viagem","description":"Cobertura de R$ 30.000 em viagens","value":"Incluso"}]'::jsonb,
  condicoes_gerais = '[{"label":"Rubi CA QC","file":"/docs/condicoes-gerais/rubi-ca-qc.pdf"},{"label":"Rubi CE QC","file":"/docs/condicoes-gerais/rubi-ce-qc.pdf"}]'::jsonb,
  updated_at       = now()
WHERE slug = 'rubi';

-- SAFIRA
UPDATE plans SET
  tagline          = $$Um plano pensado para o bem-estar e a longevidade.$$,
  description      = $$O Viver Safira é um plano desenvolvido especialmente para o público sênior. Com cobertura ambulatorial e hospitalar sem obstetrícia, oferece atenção contínua às necessidades de saúde do idoso, com foco em prevenção, acompanhamento regular e qualidade de vida em cada fase.$$,
  target_audience  = $$Para quem busca mais qualidade de vida, acompanhamento contínuo e um cuidado pensado especialmente para o público sênior.$$,
  highlights       = ARRAY[
    'Cobertura ambulatorial e hospitalar sem obstetrícia',
    'Desenvolvido para o perfil sênior',
    'Opção de quarto privativo e coletivo'
  ],
  coverage_type    = $$Ambulatorial + Hospitalar sem Obstetrícia$$,
  region           = $$Natal, Parnamirim, São Gonçalo do Amarante$$,
  image_url        = $$/images/plans/safira.png$$,
  audience_label   = $$Sênior$$,
  starting_price   = $$A partir de R$ 964,11 (faixa 59+ anos)$$,
  price_raw        = $$R$ 964,11$$,
  modalities_text  = $$Disponível para contratação empresarial, pessoa física e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo ou privativo.$$,
  price_footnote   = $$*Valor referente à faixa etária 59+. Consulte condições para demais faixas etárias e regras de contratação.$$,
  benefits         = '[{"name":"Telemedicina","description":"Consultas médicas online disponíveis 24h","value":"Incluso"},{"name":"Seguro Viagem","description":"Cobertura de R$ 30.000 em viagens","value":"Incluso"}]'::jsonb,
  condicoes_gerais = '[{"label":"Safira CA QC","file":"/docs/condicoes-gerais/safira-ca-qc.pdf"},{"label":"Safira PF QC","file":"/docs/condicoes-gerais/safira-pf-qc.pdf"}]'::jsonb,
  updated_at       = now()
WHERE slug = 'safira';

-- TOPÁZIO
UPDATE plans SET
  tagline          = $$Plano ambulatorial empresarial com foco em consultas e prevenção$$,
  description      = $$O Viver Topázio é um plano ambulatorial voltado para quem quer investir na saúde preventiva. Com acesso a consultas regulares, exames e acompanhamento médico contínuo, garante cuidado no dia a dia.$$,
  target_audience  = $$Para quem busca um plano ambulatorial acessível, com foco em prevenção e acompanhamento regular da saúde.$$,
  highlights       = ARRAY[
    'Consultas com clínico geral e especialistas',
    'Acompanhamento contínuo de saúde',
    'Atendimento humanizado e próximo'
  ],
  coverage_type    = $$Ambulatorial$$,
  region           = $$Natal, Parnamirim, São Gonçalo do Amarante$$,
  image_url        = $$/images/plans/topázio.png$$,
  audience_label   = $$Empresarial e Coletivo por Adesão$$,
  starting_price   = $$A partir de R$ 69,90$$,
  price_raw        = $$R$ 69,90$$,
  modalities_text  = $$Disponível para contratação empresarial e coletivo por adesão, com opções de coparticipação básica ou completa.$$,
  price_footnote   = $$*Valor referente à faixa etária de 0 a 18 anos. Consulte condições para demais faixas etárias e regras de contratação.$$,
  benefits         = '[{"name":"Telemedicina","description":"Consultas médicas online disponíveis 24h","value":"Incluso"},{"name":"Seguro Viagem","description":"Cobertura de R$ 15.000 em viagens","value":"Incluso"}]'::jsonb,
  condicoes_gerais = '[{"label":"Topázio CE (Ambulatorial)","file":"/docs/condicoes-gerais/topazio-ce-ambulatorial.pdf"}]'::jsonb,
  updated_at       = now()
WHERE slug = 'topazio';
