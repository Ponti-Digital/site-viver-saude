import type { Metadata } from "next";
import Link from "next/link";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { LGPD, SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como a Viver Saúde coleta, utiliza, armazena e protege seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).",
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "1. Quem somos (Controlador dos Dados)",
    content: `${LGPD.controllerName}, com sede em ${LGPD.controllerAddress}, registro ANS nº ${SITE.ansNumber}, é a Controladora dos dados pessoais tratados por este site (planoviversaude.com.br) e seus canais relacionados.`,
  },
  {
    title: "2. Encarregado de Proteção de Dados (DPO)",
    content: `Em cumprimento ao art. 41 da LGPD, indicamos um Encarregado de Proteção de Dados, responsável por receber comunicações da ANPD e dos titulares. Contato: ${LGPD.dpoEmail}.`,
  },
  {
    title: "3. Quais dados coletamos",
    list: [
      "Dados de identificação: nome completo, CPF (quando aplicável), data de nascimento.",
      "Dados de contato: e-mail, telefone, WhatsApp, endereço.",
      "Dados de navegação: IP (armazenado de forma anonimizada via hash), tipo de dispositivo, páginas visitadas, parâmetros UTM.",
      "Dados de saúde (sensíveis): apenas quando estritamente necessário para execução do contrato de plano de saúde, mediante consentimento específico (art. 11 LGPD).",
      "Conteúdo de mensagens enviadas pelos formulários do site.",
    ],
  },
  {
    title: "4. Finalidades do tratamento",
    list: [
      "Atendimento de solicitações comerciais (formulário Quero Ser Cliente).",
      "Atendimento ao cliente, ouvidoria e suporte (formulário de contato).",
      "Inscrição em programas de saúde (Viver Melhor e similares).",
      "Cumprimento de obrigações legais e regulatórias da ANS.",
      "Prevenção a fraudes e garantia da segurança das operações.",
      "Análise estatística agregada e melhoria contínua do site.",
    ],
  },
  {
    title: "5. Bases legais (art. 7º e art. 11 LGPD)",
    list: [
      "Consentimento explícito do titular (formulários e cookies não essenciais).",
      "Execução de contrato (relação de plano de saúde).",
      "Cumprimento de obrigação legal e regulatória (ANS, CDC, Código Civil).",
      'Tutela da saúde, em procedimento realizado por profissionais de saúde (art. 11, II, "f").',
      "Legítimo interesse, com avaliação de impacto, para segurança e prevenção a fraude.",
    ],
  },
  {
    title: "6. Compartilhamento de dados com terceiros",
    content:
      "Compartilhamos dados pessoais apenas quando estritamente necessário e com operadores que adotam padrões equivalentes de segurança e privacidade. Mantemos contratos de tratamento de dados (DPA) com nossos parceiros.",
    list: [
      "Plataforma de hospedagem e CDN (Netlify) — hospedagem do site.",
      "Plataforma de banco de dados (Supabase) — armazenamento de submissões e conteúdo.",
      "CRM HStation — gestão de leads e relacionamento comercial.",
      "Solus — plataforma do portal do beneficiário, prestador e empresa.",
      "Provedores de e-mail transacional (quando aplicável).",
      "Autoridades públicas, mediante requisição legal.",
    ],
  },
  {
    title: "7. Transferência internacional",
    content:
      "Alguns provedores podem armazenar dados em servidores fora do Brasil. Quando isso ocorrer, garantimos que o país de destino oferece grau de proteção adequado ou utilizamos cláusulas contratuais específicas, conforme art. 33 da LGPD.",
  },
  {
    title: "8. Por quanto tempo guardamos seus dados",
    list: [
      "Dados de leads e formulários: até 5 anos após a última interação, para fins de prestação de contas (CDC, art. 27).",
      "Dados de beneficiários: durante toda a vigência do contrato e pelos prazos legais aplicáveis após o término.",
      "Registros de consentimento: 5 anos após a revogação, para prova de cumprimento da LGPD.",
      "Logs de navegação: 6 meses (Marco Civil da Internet, art. 15).",
    ],
  },
  {
    title: "9. Seus direitos como titular (art. 18 LGPD)",
    list: [
      "Confirmação da existência de tratamento.",
      "Acesso aos dados.",
      "Correção de dados incompletos, inexatos ou desatualizados.",
      "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade.",
      "Portabilidade dos dados a outro fornecedor.",
      "Eliminação dos dados tratados com base em consentimento.",
      "Informação sobre entidades públicas e privadas com as quais compartilhamos seus dados.",
      "Informação sobre a possibilidade de não fornecer consentimento e suas consequências.",
      "Revogação do consentimento.",
    ],
    extra:
      'Para exercer qualquer um desses direitos, acesse a página "Direitos do Titular" ou envie e-mail para ' + LGPD.dpoEmail + ". Responderemos em até 15 dias.",
  },
  {
    title: "10. Segurança dos dados",
    list: [
      "Conexão criptografada (HTTPS/TLS) em todas as páginas.",
      "Autenticação multifator no acesso administrativo.",
      "Row Level Security (RLS) no banco de dados.",
      "Hash do endereço IP nas submissões de formulário.",
      "Controle de acesso interno baseado em função (admin/editor).",
      "Monitoramento contínuo e plano de resposta a incidentes.",
    ],
  },
  {
    title: "11. Tratamento de dados sensíveis de saúde",
    content:
      "Por sermos uma operadora de planos de saúde, tratamos dados sensíveis de saúde apenas quando essenciais para a execução do contrato e mediante consentimento específico e destacado, ou nas demais hipóteses do art. 11 da LGPD. Estes dados recebem proteção reforçada e são acessados apenas pelo número mínimo de profissionais necessários.",
  },
  {
    title: "12. Cookies e tecnologias similares",
    content: (
      <>
        Para entender como utilizamos cookies, consulte nossa{" "}
        <Link href="/politica-de-cookies" className="text-primary hover:underline font-medium">
          Política de Cookies
        </Link>
        . Você pode gerenciar suas preferências a qualquer momento pelo banner de cookies ou nas configurações do seu navegador.
      </>
    ),
  },
  {
    title: "13. Incidentes de segurança",
    content:
      "Em caso de incidente que possa acarretar risco ou dano relevante aos titulares, comunicaremos a ANPD e os titulares afetados em prazo razoável, conforme art. 48 da LGPD.",
  },
  {
    title: "14. Reclamações à ANPD",
    content:
      "Você pode peticionar à Autoridade Nacional de Proteção de Dados (ANPD) caso entenda que seus direitos não foram atendidos. Acesse: gov.br/anpd.",
  },
  {
    title: "15. Atualizações desta Política",
    content: `Esta Política pode ser atualizada periodicamente. Versão atual: ${LGPD.privacyPolicyVersion}, vigente desde ${LGPD.privacyPolicyDate}. Recomendamos que você revisite esta página regularmente.`,
  },
  {
    title: "16. Contato",
    content: `Dúvidas sobre privacidade e proteção de dados: ${LGPD.dpoEmail}. Para assuntos gerais: ${SITE.email}.`,
  },
];

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Política de Privacidade
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Transparência sobre como tratamos seus dados pessoais conforme a LGPD (Lei nº 13.709/2018).
            </p>
            <p className="text-sm text-white/70 mt-6">
              Versão {LGPD.privacyPolicyVersion} · Vigente desde {LGPD.privacyPolicyDate}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((section, idx) => (
              <ScrollAnimationWrapper key={idx} delay={Math.min(idx * 0.03, 0.3)}>
                <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  {section.content && (
                    <p className="text-muted leading-relaxed mb-3">{section.content}</p>
                  )}
                  {section.list && (
                    <ul className="list-disc pl-6 space-y-2 text-muted leading-relaxed">
                      {section.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.extra && (
                    <p className="text-muted leading-relaxed mt-4">{section.extra}</p>
                  )}
                </article>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
