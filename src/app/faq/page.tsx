"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { SITE, WHATSAPP_URL } from "@/lib/constants/site";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  /** Plain-text version for search and JSON-LD */
  answerText: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const planosTabela: Array<{
  registro: string;
  nome: string;
  segmentacao: string;
  contratacao: string;
  fator: string;
  acomodacao: string;
  area: string;
}> = [
  {
    registro: "506.795/25-2",
    nome: "AMETISTA CA QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "Canguaretama, São Gonçalo do Amarante, São José de Mipibu, Parnamirim, Macaíba, Goianinha, Natal, Ceará-Mirim, Extremoz",
  },
  {
    registro: "506.794/25-4",
    nome: "AMETISTA CE QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "Canguaretama, São Gonçalo do Amarante, São José de Mipibu, Parnamirim, Macaíba, Goianinha, Natal, Ceará-Mirim, Extremoz",
  },
  {
    registro: "506.797/25-9",
    nome: "DIAMANTE CA QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "Canguaretama, Nísia Floresta, São Gonçalo do Amarante, Açu, Caicó, Guamaré, Pendências, São José de Mipibu, Parnamirim, Extremoz, Goianinha, Mossoró, Alto do Rodrigues, Natal, Ceará-Mirim, Currais Novos, Macaíba, Macau, Pau dos Ferros",
  },
  {
    registro: "506.798/25-7",
    nome: "DIAMANTE CA QP",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Individual",
    area: "Canguaretama, Nísia Floresta, São Gonçalo do Amarante, Açu, Caicó, Guamaré, Pendências, São José de Mipibu, Parnamirim, Extremoz, Goianinha, Mossoró, Alto do Rodrigues, Natal, Ceará-Mirim, Currais Novos, Macaíba, Macau, Pau dos Ferros",
  },
  {
    registro: "506.804/25-5",
    nome: "DIAMANTE CE QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "Canguaretama, Nísia Floresta, São Gonçalo do Amarante, Açu, Caicó, Guamaré, Pendências, São José de Mipibu, Parnamirim, Extremoz, Goianinha, Mossoró, Alto do Rodrigues, Natal, Ceará-Mirim, Currais Novos, Macaíba, Macau, Pau dos Ferros",
  },
  {
    registro: "506.799/25-5",
    nome: "DIAMANTE CE QP",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Individual",
    area: "Canguaretama, Nísia Floresta, São Gonçalo do Amarante, Açu, Caicó, Guamaré, Pendências, São José de Mipibu, Parnamirim, Extremoz, Goianinha, Mossoró, Alto do Rodrigues, Natal, Ceará-Mirim, Currais Novos, Macaíba, Macau, Pau dos Ferros",
  },
  {
    registro: "506.800/25-2",
    nome: "ESMERALDA CA QC",
    segmentacao: "Hospitalar sem obstetrícia",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "506.801/25-1",
    nome: "ESMERALDA CE QC",
    segmentacao: "Hospitalar sem obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "504.286/25-1",
    nome: "QUARTZO CA QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "504.246/25-1",
    nome: "QUARTZO CE QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "504.283/25-6",
    nome: "QUARTZO PF QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Individual ou familiar",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "504.244/25-5",
    nome: "REFERÊNCIA VIVER CA",
    segmentacao: "Referência",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Macaíba, Natal, Parnamirim",
  },
  {
    registro: "504.245/25-3",
    nome: "REFERÊNCIA VIVER PF",
    segmentacao: "Referência",
    contratacao: "Individual ou familiar",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Macaíba, Natal, Parnamirim",
  },
  {
    registro: "503.781/25-6",
    nome: "REFERÊNCIA VIVER SAÚDE",
    segmentacao: "Referência",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Macaíba, Natal, Parnamirim",
  },
  {
    registro: "504.284/25-4",
    nome: "RUBI CA QC",
    segmentacao: "Ambulatorial + Hospitalar sem obstetrícia",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "504.247/25-0",
    nome: "RUBI CE QC",
    segmentacao: "Ambulatorial + Hospitalar sem obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "504.285/25-2",
    nome: "RUBI PF QC",
    segmentacao: "Ambulatorial + Hospitalar sem obstetrícia",
    contratacao: "Individual ou familiar",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "506.806/25-1",
    nome: "SAFIRA CA QC",
    segmentacao: "Ambulatorial + Hospitalar sem obstetrícia",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "506.803/25-7",
    nome: "SAFIRA PF QC",
    segmentacao: "Ambulatorial + Hospitalar sem obstetrícia",
    contratacao: "Individual ou familiar",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "506.802/25-9",
    nome: "TOPAZIO CA QC",
    segmentacao: "Ambulatorial",
    contratacao: "Coletivo por adesão",
    fator: "Co-participação",
    acomodacao: "Não possui",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "506.796/25-1",
    nome: "TOPAZIO CE QC",
    segmentacao: "Ambulatorial",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Não possui",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "506.805/25-3",
    nome: "TURMALINA CE QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Co-participação",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Parnamirim",
  },
  {
    registro: "505.560/25-1",
    nome: "TURQUESA CE QC",
    segmentacao: "Ambulatorial + Hospitalar com obstetrícia",
    contratacao: "Coletivo empresarial",
    fator: "Não possui",
    acomodacao: "Coletivo",
    area: "São Gonçalo do Amarante, Natal, Mossoró, Parnamirim",
  },
];

const categorias: FaqCategory[] = [
  {
    title: "Contratação e Planos",
    items: [
      {
        question: "Quais planos a Viver Saúde oferece?",
        answerText:
          "A Viver Saúde oferece várias opções de planos: Topázio, Rubi, Safira, Turmalina, Quartzo, Diamante, Ametista, Esmeralda e Turquesa — para pessoa física, empresas e adesão, com coberturas e diferenciais próprios para cada perfil. Acesse a página de Planos para conhecer cada opção.",
        answer: (
          <div className="space-y-4">
            <p>
              A Viver Saúde oferece diversas opções de planos: Topázio, Rubi,
              Safira, Turmalina, Quartzo, Diamante, Ametista, Esmeralda e
              Turquesa — para pessoa física, empresas e adesão, com coberturas
              e diferenciais próprios para cada perfil.{" "}
              <Link
                href="/planos"
                className="text-primary font-semibold hover:underline"
              >
                Acesse a página de Planos
              </Link>{" "}
              para conhecer cada opção e simular o seu.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-foreground">Nº Registro ANS</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Nome Comercial</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Segmentação</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Contratação</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Fator Moderador</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Acomodação</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Área de Atuação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {planosTabela.map((p) => (
                    <tr key={p.registro} className="align-top">
                      <td className="px-3 py-2 text-muted whitespace-nowrap">{p.registro}</td>
                      <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{p.nome}</td>
                      <td className="px-3 py-2 text-muted">{p.segmentacao}</td>
                      <td className="px-3 py-2 text-muted">{p.contratacao}</td>
                      <td className="px-3 py-2 text-muted">{p.fator}</td>
                      <td className="px-3 py-2 text-muted">{p.acomodacao}</td>
                      <td className="px-3 py-2 text-muted">{p.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        question: "Como faço para contratar um plano?",
        answerText: `Você pode contratar pelo site (página Quero Contratar), pelo WhatsApp ${SITE.phone} ou ligando para a nossa Central de Atendimento. Um consultor vai orientar você sobre o melhor plano para o seu perfil e auxiliar em todo o processo de contratação.`,
        answer: (
          <p>
            Você pode contratar pelo site (
            <Link href="/quero-ser-cliente" className="text-primary font-semibold hover:underline">
              Quero Contratar
            </Link>
            ), pelo WhatsApp <strong>{SITE.phone}</strong> ou ligando para a
            nossa Central de Atendimento. Um consultor vai orientar você sobre
            o melhor plano para o seu perfil e auxiliar em todo o processo de
            contratação.
          </p>
        ),
      },
      {
        question: "Existe período de carência?",
        answerText:
          "Carência é o tempo que você terá que esperar para ser atendido pelo plano de saúde em um determinado procedimento. As regras seguem a Lei nº 9.656/98. Urgência/emergência: 24 horas. Partos a termo: 300 dias. Demais situações: 180 dias. Esses são os prazos máximos previstos em lei.",
        answer: (
          <div className="space-y-3">
            <p>
              Carência é o tempo que você terá que esperar para ser atendido
              pelo plano de saúde em um determinado procedimento. As regras
              aplicadas pela Viver Saúde são as estabelecidas na Lei nº
              9.656/98.
            </p>
            <p>
              <strong>Planos individuais ou familiares:</strong> há aplicação
              de carência nos prazos máximos permitidos por lei, podendo ser
              reduzidos conforme adesão ao Programa de Redução de Carências
              (PRC) vigente.
            </p>
            <p>
              <strong>Planos coletivos empresariais (até 29 beneficiários):</strong>{" "}
              aplicação de carência nos prazos máximos legais, podendo ser
              reduzida pelo PRC.
            </p>
            <p>
              <strong>Coletivos empresariais com 30 ou mais beneficiários:</strong>{" "}
              isenção de carência se o ingresso ocorrer em até 30 dias da
              celebração do contrato ou vinculação à empresa.
            </p>
            <p>
              <strong>Planos coletivos por adesão:</strong> isenção se o
              ingresso ocorrer em até 30 dias após a celebração do contrato ou
              no aniversário do contrato.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-foreground">Situação</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Tempo máximo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 text-muted">Urgência e emergência</td>
                    <td className="px-3 py-2 text-muted">24 horas</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-muted">Partos a termo</td>
                    <td className="px-3 py-2 text-muted">300 dias</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-muted">Demais situações</td>
                    <td className="px-3 py-2 text-muted">180 dias</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted">
              Esses são os limites máximos previstos em lei — a operadora pode
              exigir prazos menores.
            </p>
          </div>
        ),
      },
      {
        question: "Posso incluir dependentes no meu plano?",
        answerText:
          "A possibilidade de inclusão de dependentes varia conforme o tipo de contrato e as regras do plano contratado. A inclusão está sujeita à análise da documentação comprobatória e às condições previstas no contrato. Em alguns casos, os dependentes podem cumprir carências.",
        answer: (
          <div className="space-y-3">
            <p>
              A possibilidade de inclusão de dependentes varia conforme o tipo
              de contrato e as regras do plano contratado.
            </p>
            <p>
              A inclusão está sujeita à análise da documentação comprobatória e
              às condições previstas no contrato. Em alguns casos, os
              dependentes incluídos poderão cumprir carências, conforme a
              legislação e as regras do produto contratado.
            </p>
          </div>
        ),
      },
      {
        question: "A Viver Saúde aceita portabilidade de carência?",
        answerText:
          "Sim. A Viver Saúde aceita pedidos de portabilidade de carências desde que atendidos os requisitos da ANS, regulamentados na Resolução Normativa nº 438/2018.",
        answer: (
          <div className="space-y-3">
            <p>
              Sim. A Viver Saúde aceita pedidos de portabilidade de carências,
              desde que sejam atendidos os requisitos definidos pela Agência
              Nacional de Saúde Suplementar (ANS).
            </p>
            <p>
              As regras estão regulamentadas na Resolução Normativa nº 438/2018
              e também podem ser consultadas na{" "}
              <a
                href="http://www.ans.gov.br/images/stories/noticias/pdf/Cartilha_Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Cartilha da ANS sobre portabilidade
              </a>
              .
            </p>
          </div>
        ),
      },
      {
        question: "Posso contratar um plano para a minha empresa?",
        answerText: `Sim. A Viver Saúde oferece planos empresariais para MEIs, pequenas, médias e grandes empresas, com soluções de gestão de benefícios e programas de qualidade de vida. Entre em contato pelo ${SITE.phone} ou pelo WhatsApp.`,
        answer: (
          <p>
            Sim. A Viver Saúde oferece planos empresariais para MEIs, pequenas,
            médias e grandes empresas, com soluções de gestão de benefícios e
            programas de qualidade de vida para colaboradores. Entre em contato
            pelo <strong>{SITE.phone}</strong> ou pelo WhatsApp para falar com
            um consultor.
          </p>
        ),
      },
      {
        question: "Quais documentos preciso para contratar?",
        answerText:
          "Os documentos podem variar conforme o tipo de plano. Em geral: documento oficial com foto, CPF, comprovante de residência, cartão do SUS (quando aplicável), documentos dos dependentes e documentos que comprovem vínculo com empresa, entidade ou associação nos contratos coletivos.",
        answer: (
          <div className="space-y-3">
            <p>
              Os documentos podem variar conforme o tipo de plano contratado
              (individual, familiar, coletivo empresarial ou coletivo por
              adesão). De forma geral, poderão ser solicitados:
            </p>
            <ul className="list-disc list-inside text-muted space-y-1">
              <li>documento oficial com foto;</li>
              <li>CPF;</li>
              <li>comprovante de residência;</li>
              <li>cartão do SUS (quando aplicável);</li>
              <li>documentos dos dependentes;</li>
              <li>
                documentos que comprovem vínculo com empresa, entidade de
                classe ou associação, nos contratos coletivos.
              </li>
            </ul>
            <p>
              Durante o processo de contratação, a Viver Saúde informará a
              documentação necessária para cada modalidade.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    title: "Uso do Plano",
    items: [
      {
        question: "Como agendar uma consulta?",
        answerText: `O agendamento pode ser feito diretamente com o prestador da rede credenciada. Para consultas na Viver Clínica Lagoa Nova, Zona Norte ou Clínica Ampla Zona Sul, ligue para ${SITE.phone}.`,
        answer: (
          <div className="space-y-3">
            <p>
              O agendamento pode ser feito diretamente com o prestador da rede
              credenciada. Consulte o telefone ou WhatsApp de cada unidade na{" "}
              <Link
                href="/rede-credenciada"
                className="text-primary font-semibold hover:underline"
              >
                página Rede Credenciada
              </Link>{" "}
              ou no app Viver Saúde.
            </p>
            <p>
              Para consultas na Viver Clínica Lagoa Nova, Zona Norte ou Clínica
              Ampla Zona Sul, ligue para <strong>{SITE.phone}</strong>.
            </p>
          </div>
        ),
      },
      {
        question: "Como acesso o Portal do Cliente?",
        answerText:
          "Acesse o Portal do Cliente em planoviversaude.com.br, clicando em 'Portal do Cliente' no menu. Você será redirecionado para a plataforma Solus, onde pode consultar boletos, autorizações, histórico de atendimentos e informações do seu plano.",
        answer: (
          <p>
            Acesse o{" "}
            <Link
              href="/portal-cliente"
              className="text-primary font-semibold hover:underline"
            >
              Portal do Cliente
            </Link>{" "}
            no menu do site. Você será redirecionado para a plataforma Solus,
            onde pode consultar boletos, autorizações, histórico de
            atendimentos e informações do seu plano. Use o login e senha
            cadastrados para entrar.
          </p>
        ),
      },
      {
        question: "Preciso de autorização prévia para consultas e exames?",
        answerText:
          "Em geral, consultas eletivas na rede credenciada não precisam de autorização prévia. Alguns exames, procedimentos, terapias e cirurgias podem depender de autorização, conforme regras do plano, diretrizes da ANS e critérios técnicos.",
        answer: (
          <div className="space-y-3">
            <p>
              Em geral, consultas eletivas realizadas na rede credenciada não
              necessitam de autorização prévia.
            </p>
            <p>
              Já alguns exames, procedimentos, terapias, cirurgias e
              atendimentos específicos podem depender de autorização prévia,
              conforme as regras do plano, diretrizes da ANS e critérios
              técnicos assistenciais aplicáveis.
            </p>
            <p>
              Nos produtos com mecanismo de porta de entrada, determinados
              exames e encaminhamentos podem exigir solicitação do médico
              responsável pelo primeiro atendimento da rede direcionada.
            </p>
            <p>
              Em caso de dúvida, consulte previamente os canais de atendimento
              da Viver Saúde.
            </p>
          </div>
        ),
      },
      {
        question: "O que fazer em caso de urgência ou emergência?",
        answerText:
          "Dirija-se ao Hospital Rio Grande, atendimento 24h. Para urgências psiquiátricas, o Mental Help atende de 07h às 21h pelo (84) 99610-4222. Em situações de emergência, o atendimento é garantido.",
        answer: (
          <p>
            Dirija-se ao <strong>Hospital Rio Grande</strong>, atendimento 24h.
            Para urgências psiquiátricas, o <strong>Mental Help</strong> atende
            de 07h às 21h pelo <strong>(84) 99610-4222</strong>. Em situações
            de emergência, o atendimento é garantido.
          </p>
        ),
      },
      {
        question: "Como funciona o pronto-atendimento?",
        answerText:
          "O pronto-atendimento está disponível no Hospital Rio Grande 24h, com clínica médica adulta e infantil, ortopedia e pediatria. Para urgências psiquiátricas, o Mental Help atende de 07h às 21h pelo (84) 99610-4222.",
        answer: (
          <p>
            O pronto-atendimento está disponível no{" "}
            <strong>Hospital Rio Grande 24h</strong>, com clínica médica adulta
            e infantil, ortopedia e pediatria. Para urgências psiquiátricas, o
            Mental Help atende de 07h às 21h pelo{" "}
            <strong>(84) 99610-4222</strong>.
          </p>
        ),
      },
      {
        question: "Posso me consultar fora da rede credenciada e pedir reembolso?",
        answerText:
          "Os planos da Viver Saúde não possuem sistema de livre escolha de prestadores. Em situações específicas previstas pela legislação e pelas normas da ANS, poderá haver direito a reembolso, como casos de urgência/emergência ou indisponibilidade de prestador na rede credenciada.",
        answer: (
          <div className="space-y-3">
            <p>
              Os planos da Viver Saúde não possuem sistema de livre escolha de
              prestadores. Por isso, em regra, os atendimentos devem ser
              realizados na rede credenciada do plano.
            </p>
            <p>
              No entanto, em situações específicas previstas pela legislação e
              pelas normas da ANS, poderá haver direito a reembolso — por
              exemplo, em casos de urgência/emergência ou indisponibilidade de
              prestador apto na rede credenciada. O contato prévio com a
              operadora é sempre necessário antes de buscar um prestador por
              livre escolha.
            </p>
            <p>
              As regras de reembolso variam conforme a situação e as condições
              contratuais aplicáveis.
            </p>
          </div>
        ),
      },
      {
        question: "Como solicito minha carteirinha?",
        answerText:
          "Sua carteirinha digital está disponível no app Viver Saúde (iOS e Android). Basta baixar o aplicativo e acessar com seus dados cadastrais.",
        answer: (
          <p>
            Sua carteirinha digital está disponível no app{" "}
            <strong>Viver Saúde</strong> (iOS e Android). Basta baixar o
            aplicativo e acessar com seus dados cadastrais.
          </p>
        ),
      },
      {
        question: "Meu plano cobre cirurgias?",
        answerText:
          "Sim, desde que o procedimento possua cobertura contratual e esteja de acordo com a segmentação do plano. Os planos com cobertura hospitalar contemplam cirurgias previstas no Rol de Procedimentos e Eventos em Saúde da ANS. Os planos exclusivamente ambulatoriais não possuem cobertura para internações e cirurgias hospitalares.",
        answer: (
          <div className="space-y-3">
            <p>
              Sim, desde que o procedimento possua cobertura contratual e
              esteja de acordo com a segmentação do plano contratado.
            </p>
            <p>
              Os planos com cobertura hospitalar da Viver Saúde contemplam
              cirurgias previstas no Rol de Procedimentos e Eventos em Saúde da
              ANS, observadas as diretrizes de utilização, carências, cobertura
              contratada e demais regras previstas em contrato.
            </p>
            <p>
              Alguns procedimentos podem depender de autorização prévia,
              documentação médica específica ou cumprimento de requisitos
              definidos pela ANS e pelo contrato.
            </p>
            <p>
              Já os planos exclusivamente ambulatoriais não possuem cobertura
              para internações e cirurgias hospitalares.
            </p>
          </div>
        ),
      },
      {
        question: "O plano cobre tratamento odontológico?",
        answerText:
          "Depende do plano contratado. Quando houver cobertura odontológica, o beneficiário terá acesso aos procedimentos previstos no Rol Odontológico da ANS, observadas as regras do plano, rede credenciada, carências e demais condições contratuais.",
        answer: (
          <div className="space-y-3">
            <p>
              Depende do plano contratado. Por isso, é importante verificar as
              coberturas previstas no seu contrato.
            </p>
            <p>
              Quando houver contratação de cobertura odontológica, o
              beneficiário terá acesso aos procedimentos previstos no Rol
              Odontológico da ANS, observadas as regras do plano, rede
              credenciada, carências e demais condições contratuais.
            </p>
          </div>
        ),
      },
      {
        question: "Existe coparticipação?",
        answerText:
          "Depende do plano contratado. A Viver Saúde possui produtos com e sem coparticipação. Nos planos com coparticipação, o beneficiário contribui com parte do valor de determinados atendimentos, exames ou procedimentos, conforme regras e percentuais previstos em contrato.",
        answer: (
          <div className="space-y-3">
            <p>Depende do plano contratado.</p>
            <p>
              A Viver Saúde possui produtos com e sem coparticipação. Nos
              planos com coparticipação, o beneficiário contribui com parte do
              valor de determinados atendimentos, exames ou procedimentos
              realizados, conforme as regras e percentuais previstos em
              contrato.
            </p>
            <p>
              As cobranças seguem os limites e critérios estabelecidos pela ANS
              e pelas condições do produto contratado.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    title: "Rede Credenciada",
    items: [
      {
        question: "Como consulto a rede credenciada atualizada?",
        answerText: `A forma mais prática é pelo app Viver Saúde (iOS e Android), onde a rede é atualizada regularmente. Você também pode consultar a página Rede Credenciada no site ou ligar para ${SITE.phone}.`,
        answer: (
          <p>
            A forma mais prática é pelo app <strong>Viver Saúde</strong> (iOS e
            Android), onde a rede é atualizada regularmente. Você também pode
            consultar a{" "}
            <Link
              href="/rede-credenciada"
              className="text-primary font-semibold hover:underline"
            >
              página Rede Credenciada
            </Link>{" "}
            no site ou ligar para <strong>{SITE.phone}</strong>.
          </p>
        ),
      },
      {
        question: "Quais hospitais estão na rede?",
        answerText:
          "Hospital Rio Grande (hospital geral, urgência, emergência e internações), Maternidade Delfin Gonzalez (maternidade e pediatria) e Hospital Villa Vic (psiquiatria).",
        answer: (
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>
              <strong>Hospital Rio Grande</strong> — hospital geral, urgência,
              emergência e internações
            </li>
            <li>
              <strong>Maternidade Delfin Gonzalez</strong> — maternidade e
              pediatria
            </li>
            <li>
              <strong>Hospital Villa Vic</strong> — psiquiatria
            </li>
          </ul>
        ),
      },
      {
        question: "Onde posso fazer exames laboratoriais?",
        answerText: "Laboratório Paulo Gurgel e Laboratório HEMME.",
        answer: (
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Laboratório Paulo Gurgel</li>
            <li>Laboratório HEMME</li>
          </ul>
        ),
      },
      {
        question: "Onde posso fazer exames de imagem?",
        answerText:
          "Hospital Rio Grande, Viver Clínica Lagoa e Clínica Ampla Zona Sul.",
        answer: (
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Hospital Rio Grande</li>
            <li>Viver Clínica Lagoa</li>
            <li>Clínica Ampla Zona Sul</li>
          </ul>
        ),
      },
      {
        question: "Quais especialidades médicas estão disponíveis na rede própria?",
        answerText:
          "A Viver Clínica Lagoa Nova oferece mais de 25 especialidades, incluindo cardiologia, dermatologia, endocrinologia, gastroenterologia, ginecologia, neurologia, ortopedia, pediatria, psiquiatria, reumatologia, urologia, nutrição e muito mais.",
        answer: (
          <p>
            A <strong>Viver Clínica Lagoa Nova</strong> oferece mais de 25
            especialidades, incluindo cardiologia, dermatologia, endocrinologia,
            gastroenterologia, ginecologia, neurologia, ortopedia, pediatria,
            psiquiatria, reumatologia, urologia, nutrição e muito mais.
            Consulte a lista completa na{" "}
            <Link
              href="/rede-credenciada"
              className="text-primary font-semibold hover:underline"
            >
              página Rede Credenciada
            </Link>
            .
          </p>
        ),
      },
      {
        question: "A rede atende em toda Natal?",
        answerText:
          "Sim. Nossa rede própria está distribuída estrategicamente por Natal e região.",
        answer: (
          <p>
            Sim. Nossa rede própria está distribuída estrategicamente por Natal
            e região.
          </p>
        ),
      },
    ],
  },
  {
    title: "Financeiro e Boletos",
    items: [
      {
        question: "Como emito a segunda via do boleto?",
        answerText: `Acesse o Portal do Cliente, entre na área financeira e emita seu boleto. Você também pode solicitar pelo WhatsApp ${SITE.phone} ou pelo app Viver Saúde.`,
        answer: (
          <p>
            Acesse o{" "}
            <Link
              href="/portal-cliente"
              className="text-primary font-semibold hover:underline"
            >
              Portal do Cliente
            </Link>
            , entre na área financeira e emita seu boleto. Você também pode
            solicitar pelo WhatsApp <strong>{SITE.phone}</strong> ou pelo app
            Viver Saúde.
          </p>
        ),
      },
      {
        question: "Quando vence minha mensalidade?",
        answerText:
          "A data de vencimento da mensalidade está informada no seu contrato, proposta de adesão e boletos do plano. Em caso de dúvida, consulte os canais de atendimento da Viver Saúde.",
        answer: (
          <div className="space-y-3">
            <p>
              A data de vencimento da mensalidade está informada no seu
              contrato, proposta de adesão e boletos do plano.
            </p>
            <p>
              Caso tenha dúvidas, você pode consultar essas informações nos
              canais de atendimento da Viver Saúde.
            </p>
          </div>
        ),
      },
      {
        question: "O que acontece se eu não pagar a mensalidade no prazo?",
        answerText:
          "O não pagamento pode gerar cobrança de juros, multa e outras medidas previstas em contrato. Após determinados prazos e observadas as regras da ANS, o plano poderá sofrer suspensão de atendimentos e rescisão por inadimplência.",
        answer: (
          <div className="space-y-3">
            <p>
              O não pagamento da mensalidade pode gerar cobrança de juros,
              multa e outras medidas previstas em contrato.
            </p>
            <p>
              Após determinados prazos e observadas as regras da ANS e do tipo
              de contrato contratado, o plano poderá sofrer suspensão de
              atendimentos e até rescisão por inadimplência.
            </p>
            <p>
              Nos contratos em situação de inadimplência, a operadora também
              poderá realizar notificações de cobrança e adotar medidas de
              proteção ao crédito, quando cabíveis.
            </p>
            <p>
              Para evitar impactos na utilização do plano, é importante manter
              as mensalidades em dia e entrar em contato com a Viver Saúde em
              caso de dúvidas.
            </p>
          </div>
        ),
      },
      {
        question: "Posso alterar a data de vencimento?",
        answerText:
          "A possibilidade de alteração da data de vencimento depende do tipo de contrato e das regras do plano contratado. Entre em contato com os canais de atendimento da Viver Saúde para verificar disponibilidade e condições.",
        answer: (
          <div className="space-y-3">
            <p>
              A possibilidade de alteração da data de vencimento depende do
              tipo de contrato e das regras do plano contratado.
            </p>
            <p>
              Caso deseje solicitar a mudança, entre em contato com os canais
              de atendimento da Viver Saúde para verificar a disponibilidade,
              condições aplicáveis e eventual necessidade de análise cadastral
              ou contratual.
            </p>
          </div>
        ),
      },
      {
        question: "Como funciona o reajuste anual do plano?",
        answerText:
          "O reajuste anual ocorre conforme regras da legislação e da ANS. Nos planos individuais/familiares, o percentual é autorizado pela ANS. Nos coletivos, é calculado conforme critérios previstos em contrato. Aplica-se uma vez por ano, geralmente no aniversário do contrato.",
        answer: (
          <div className="space-y-3">
            <p>
              O reajuste anual do plano de saúde ocorre conforme as regras
              definidas pela legislação e pela Agência Nacional de Saúde
              Suplementar (ANS), podendo variar de acordo com o tipo de
              contrato contratado.
            </p>
            <p>
              <strong>Planos individuais/familiares:</strong> o percentual de
              reajuste anual é definido e autorizado pela ANS.
            </p>
            <p>
              <strong>Planos coletivos empresariais e por adesão:</strong> o
              reajuste é calculado conforme critérios previstos em contrato,
              podendo considerar variação de custos médico-hospitalares,
              utilização do plano e equilíbrio financeiro.
            </p>
            <p>
              Os reajustes anuais — que não se confundem com mudanças de faixa
              etária — são aplicados uma única vez por ano, geralmente no mês
              de aniversário do contrato.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    title: "Programas Viver Melhor 2.6",
    items: [
      {
        question: "O que são os programas Viver Melhor 2.6?",
        answerText:
          "O Viver Melhor 2.6 é o programa de qualidade de vida da Viver Saúde, organizado em linhas de cuidado temáticas, com acompanhamento multiprofissional, atividades na CASA e benefícios exclusivos, sem custo adicional ao plano.",
        answer: (
          <p>
            O <strong>Viver Melhor 2.6</strong> é o programa de qualidade de
            vida da Viver Saúde, organizado em linhas de cuidado temáticas —
            cada uma com foco em uma condição ou público específico. Os
            programas oferecem acompanhamento multiprofissional, atividades na
            CASA e benefícios exclusivos, sem custo adicional ao plano.
          </p>
        ),
      },
      {
        question: "Quais programas estão disponíveis agora?",
        answerText:
          "Tempo de Viver 2.6 (cuidado integral com a saúde do idoso, 60+), Viver na Medida Certa 2.6 (tratamento da obesidade) e Viver Sem Limites 2.6 (acompanhamento de fibromialgia).",
        answer: (
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>
              <strong>Tempo de Viver 2.6</strong> — cuidado integral com a
              saúde do idoso (60 anos ou mais)
            </li>
            <li>
              <strong>Viver na Medida Certa 2.6</strong> — tratamento da
              obesidade
            </li>
            <li>
              <strong>Viver Sem Limites 2.6</strong> — acompanhamento de
              fibromialgia
            </li>
          </ul>
        ),
      },
      {
        question: "Os programas têm custo adicional?",
        answerText:
          "Não. Os programas Viver Melhor 2.6 são oferecidos sem custo adicional ao plano. Participantes têm isenção de coparticipação nos atendimentos com a equipe de referência e nos exames laboratoriais definidos no plano de cuidado.",
        answer: (
          <p>
            Não. Os programas <strong>Viver Melhor 2.6</strong> são oferecidos
            sem custo adicional ao plano. Participantes têm ainda isenção de
            coparticipação nos atendimentos com a equipe de referência do
            programa e nos exames laboratoriais definidos no plano de cuidado.
          </p>
        ),
      },
      {
        question: "Como me inscrevo em um programa?",
        answerText: `Pelo WhatsApp ${SITE.phone}, presencialmente na CASA (Rua Maxaranguape, 920, Tirol, Natal/RN) ou pelo formulário disponível no site, na página Programas.`,
        answer: (
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>
              Pelo WhatsApp: <strong>{SITE.phone}</strong>
            </li>
            <li>
              Presencialmente na CASA — Rua Maxaranguape, 920, Tirol, Natal/RN
            </li>
            <li>
              Pelo formulário de inscrição disponível na{" "}
              <Link
                href="/programas"
                className="text-primary font-semibold hover:underline"
              >
                página Programas
              </Link>
            </li>
          </ul>
        ),
      },
      {
        question: "O que é a CASA?",
        answerText:
          "A CASA (Centro de Atenção à Saúde) é o espaço exclusivo da Viver Saúde para participantes dos programas, na Rua Maxaranguape, 920, Tirol. Conta com consultórios multidisciplinares, sala de movimento, piscina para hidroginástica, cozinha para treinamentos, área verde, rooftop e espaço gourmet.",
        answer: (
          <p>
            A <strong>CASA</strong> (Centro de Atenção à Saúde) é o espaço
            exclusivo da Viver Saúde para os participantes dos programas,
            localizada na <strong>Rua Maxaranguape, 920, Tirol</strong>. Conta
            com consultórios multidisciplinares, sala de movimento, piscina
            para hidroginástica, cozinha para treinamentos em alimentação
            saudável, área verde, rooftop e espaço gourmet para eventos e
            convivência.
          </p>
        ),
      },
      {
        question: "Qualquer beneficiário pode participar dos programas?",
        answerText:
          "Os programas são abertos a beneficiários ativos da Viver Saúde que se encaixem no perfil de cada linha de cuidado. Tempo de Viver: 60+. Medida Certa: beneficiários com obesidade. Viver Sem Limites: com diagnóstico de fibromialgia.",
        answer: (
          <p>
            Os programas são abertos a todos os beneficiários ativos da Viver
            Saúde que se encaixem no perfil de cada linha de cuidado. Por
            exemplo, o <strong>Tempo de Viver</strong> é voltado a
            beneficiários com 60 anos ou mais; o <strong>Medida Certa</strong>{" "}
            para beneficiários com obesidade; e o{" "}
            <strong>Viver Sem Limites</strong> para beneficiários com
            diagnóstico de fibromialgia.
          </p>
        ),
      },
    ],
  },
  {
    title: "Cancelamento, Ouvidoria e ANS",
    items: [
      {
        question: "Como cancelo meu plano?",
        answerText:
          "O cancelamento pode ser solicitado pelos canais de atendimento da Viver Saúde, observadas as regras do contrato. Nos planos individuais ou familiares, o titular pode solicitar a qualquer momento. Nos coletivos, pode depender da empresa contratante, administradora ou entidade estipulante.",
        answer: (
          <div className="space-y-3">
            <p>
              O cancelamento do plano pode ser solicitado pelos canais de
              atendimento da Viver Saúde, observadas as regras do tipo de
              contrato contratado.
            </p>
            <p>
              Nos <strong>planos individuais ou familiares</strong>, o titular
              pode solicitar o cancelamento diretamente à operadora a qualquer
              momento.
            </p>
            <p>
              Já nos <strong>planos coletivos empresariais ou por adesão</strong>,
              o cancelamento pode depender da participação da empresa
              contratante, administradora de benefícios ou entidade
              estipulante, conforme as regras do contrato.
            </p>
            <p>
              Antes de solicitar o cancelamento, verifique possíveis impactos
              como perda de carências já cumpridas, encerramento imediato da
              cobertura e regras de permanência previstas contratualmente.
            </p>
          </div>
        ),
      },
      {
        question: "Em caso de demissão, posso manter o plano?",
        answerText:
          "Depende da forma de contratação e do atendimento aos requisitos legais. Conforme os arts. 30 e 31 da Lei nº 9.656/98, demitidos sem justa causa e aposentados podem manter o plano empresarial, desde que tenham contribuído durante o vínculo e assumam integralmente o pagamento.",
        answer: (
          <div className="space-y-3">
            <p>
              Depende da forma de contratação do plano e do atendimento aos
              requisitos previstos na legislação.
            </p>
            <p>
              Nos termos dos <strong>arts. 30 e 31 da Lei nº 9.656/98</strong>,
              empregados demitidos sem justa causa e aposentados podem ter
              direito à manutenção do plano de saúde empresarial após o
              desligamento, desde que:
            </p>
            <ul className="list-disc list-inside text-muted space-y-1 ml-4">
              <li>
                tenham contribuído para o pagamento do plano durante o vínculo
                empregatício; e
              </li>
              <li>
                assumam integralmente o pagamento das mensalidades após o
                desligamento.
              </li>
            </ul>
            <p>
              A manutenção ocorre nas mesmas condições de cobertura assistencial
              vigentes durante o contrato de trabalho, observadas as regras
              legais aplicáveis, os prazos previstos em lei e as condições do
              contrato coletivo empresarial.
            </p>
          </div>
        ),
      },
      {
        question: "Posso transferir meu plano para outra operadora sem perder a carência?",
        answerText:
          "Sim, em muitos casos isso é possível por meio da portabilidade de carências, conforme as regras da ANS. A portabilidade está regulamentada na Resolução Normativa nº 438/2018.",
        answer: (
          <div className="space-y-3">
            <p>
              Sim, em muitos casos isso é possível por meio da{" "}
              <strong>portabilidade de carências</strong>, conforme as regras
              da Agência Nacional de Saúde Suplementar (ANS).
            </p>
            <p>
              A portabilidade permite mudar de plano ou de operadora sem
              necessidade de cumprir novas carências, desde que sejam atendidos
              os requisitos definidos pela ANS.
            </p>
            <p>
              As regras estão regulamentadas na Resolução Normativa nº 438/2018
              e podem ser consultadas na{" "}
              <a
                href="http://www.ans.gov.br/images/stories/noticias/pdf/Cartilha_Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Cartilha da ANS
              </a>
              .
            </p>
          </div>
        ),
      },
      {
        question: "Como registro uma reclamação ou sugestão?",
        answerText: `Pelo WhatsApp ${SITE.phone}, pelo e-mail ${SITE.email} ou pelo formulário de contato no site (assunto 'Ouvidoria'). A Ouvidoria responde conclusivamente em até 7 dias úteis, podendo se estender a 30 dias úteis em casos excepcionais.`,
        answer: (
          <div className="space-y-3">
            <p>Você pode registrar reclamações, sugestões ou elogios pelos seguintes canais:</p>
            <ul className="list-disc list-inside text-muted space-y-1">
              <li>
                WhatsApp: <strong>{SITE.phone}</strong>
              </li>
              <li>
                E-mail:{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-primary font-semibold hover:underline"
                >
                  Formulário de contato
                </Link>{" "}
                no site, selecionando o assunto &quot;Ouvidoria&quot;
              </li>
            </ul>
            <p>
              A Ouvidoria deverá responder conclusivamente às manifestações no
              prazo máximo de <strong>7 (sete) dias úteis</strong>, podendo ser
              pactuado prazo maior, não superior a 30 (trinta) dias úteis, em
              casos excepcionais devidamente justificados.
            </p>
          </div>
        ),
      },
      {
        question: "Posso acionar a ANS se minha reclamação não for resolvida?",
        answerText:
          "Sim. Se sua demanda não for resolvida pela Viver Saúde, você pode acionar a ANS pelo 0800 701 9656 ou pelo site www.ans.gov.br. Também pode usar nossa Ouvidoria pelo e-mail ouvidoria@planoviversaude.com.br.",
        answer: (
          <div className="space-y-3">
            <p>
              Sim. Se sua demanda não for resolvida pela Viver Saúde, você pode
              acionar a <strong>ANS</strong> (Agência Nacional de Saúde
              Suplementar) pelo telefone{" "}
              <strong>0800 701 9656</strong> ou pelo site{" "}
              <a
                href="https://www.ans.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                www.ans.gov.br
              </a>
              . A ANS é o órgão regulador dos planos de saúde no Brasil.
            </p>
            <p>
              A Viver Saúde também conta com um canal próprio para solucionar
              problemas não resolvidos nos canais de atendimento, a Ouvidoria.
              Fale conosco em{" "}
              <a
                href="mailto:ouvidoria@planoviversaude.com.br"
                className="text-primary font-semibold hover:underline"
              >
                ouvidoria@planoviversaude.com.br
              </a>
              .
            </p>
          </div>
        ),
      },
      {
        question: "Quais são os prazos máximos de atendimento?",
        answerText:
          "A ANS estabelece prazos máximos para atendimento que todas as operadoras devem cumprir. Consulte a tabela completa no site da ANS.",
        answer: (
          <p>
            A ANS estabelece prazos máximos para atendimento que todas as
            operadoras devem cumprir. Consulte a tabela completa:{" "}
            <a
              href="https://www.gov.br/ans/pt-br/assuntos/consumidor/prazos-maximos-de-atendimento"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              Prazos máximos de atendimento — ANS
            </a>
            .
          </p>
        ),
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categorias.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerText,
      },
    }))
  ),
};

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return categorias;
    return categorias
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answerText.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [normalizedQuery]);

  const toggle = (key: string) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <span className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-sm font-semibold mb-4">
              Dúvidas Frequentes
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Encontre respostas rápidas para as dúvidas mais comuns sobre o seu plano Viver Saúde.
            </p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 110-16 8 8 0 010 16z"
                  />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="O que você quer saber?"
                  aria-label="Buscar nas perguntas frequentes"
                  className="w-full pl-12 pr-4 py-4 rounded-full text-foreground bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* FAQ Categorias */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {filtered.length === 0 && (
              <ScrollAnimationWrapper>
                <div className="text-center py-12">
                  <p className="text-muted text-lg">
                    Nenhuma pergunta encontrada para &quot;{query}&quot;.
                  </p>
                  <p className="text-muted mt-2">
                    Tente buscar com outras palavras ou fale conosco diretamente.
                  </p>
                </div>
              </ScrollAnimationWrapper>
            )}

            {filtered.map((categoria) => (
              <ScrollAnimationWrapper key={categoria.title}>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {categoria.title}
                  </h2>
                  <div className="space-y-3">
                    {categoria.items.map((item, idx) => {
                      const key = `${categoria.title}-${idx}`;
                      const isOpen = openKey === key;
                      return (
                        <div
                          key={key}
                          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
                        >
                          <button
                            onClick={() => toggle(key)}
                            className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer"
                            aria-expanded={isOpen}
                          >
                            <span className="font-semibold text-foreground text-base md:text-lg">
                              {item.question}
                            </span>
                            <svg
                              className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="px-5 md:px-6 pb-6 text-muted leading-relaxed border-t border-border pt-4">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Não encontrou o que procurava?
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Nossa equipe está pronta para responder qualquer dúvida sobre o seu plano ou sobre como contratar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 px-6 py-3 bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar pelo WhatsApp
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar e-mail
              </a>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
