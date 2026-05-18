import type { Metadata } from "next";
import Link from "next/link";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { LGPD, SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site da Viver Saúde.",
  alternates: { canonical: "/termos-de-uso" },
};

const sections = [
  {
    title: "1. Aceitação dos Termos",
    content:
      "Ao acessar e usar o site planoviversaude.com.br, você concorda com estes Termos de Uso. Se não concordar com algum dos termos, não utilize este site.",
  },
  {
    title: "2. Identificação",
    content: `Este site é operado por ${LGPD.controllerName}, registro ANS nº ${SITE.ansNumber}, com contato em ${SITE.email} e telefone ${SITE.phone}.`,
  },
  {
    title: "3. Objeto do Site",
    content:
      "O site tem caráter informativo, divulga os planos de saúde da Viver Saúde, sua rede credenciada, programas de cuidado, notícias e canais de relacionamento. Os conteúdos comerciais não substituem condições contratuais formalmente firmadas com a operadora.",
  },
  {
    title: "4. Cadastro e Veracidade das Informações",
    content:
      "Ao preencher formulários do site, você declara que as informações fornecidas são verdadeiras, completas e atualizadas. Você é responsável pela exatidão dos dados informados.",
  },
  {
    title: "5. Propriedade Intelectual",
    content:
      "Todo o conteúdo do site (textos, imagens, marcas, logotipos, layout, software) é propriedade da Viver Saúde ou de terceiros licenciantes e está protegido pelas leis de direitos autorais e propriedade industrial. É vedada a reprodução, distribuição ou uso comercial sem autorização prévia e por escrito.",
  },
  {
    title: "6. Uso Permitido",
    list: [
      "Navegar pelo site para fins informativos pessoais.",
      "Solicitar contato comercial.",
      "Acessar áreas restritas (Portal do Cliente, Prestador, Empresa) com credenciais legítimas.",
    ],
  },
  {
    title: "7. Uso Proibido",
    list: [
      "Acessar áreas restritas sem autorização.",
      "Tentar burlar mecanismos de segurança ou autenticação.",
      "Inserir códigos maliciosos, vírus ou realizar ataques.",
      "Coletar dados de outros usuários (scraping massivo, raspagem).",
      "Utilizar o site para finalidades ilícitas, fraudulentas ou que violem direitos de terceiros.",
    ],
  },
  {
    title: "8. Disponibilidade",
    content:
      "Empenhamo-nos em manter o site disponível, mas não garantimos disponibilidade ininterrupta. O site pode ficar indisponível por manutenção, atualizações ou eventos de força maior.",
  },
  {
    title: "9. Links para Sites de Terceiros",
    content:
      "O site pode conter links para sites de terceiros (CRM, portais Solus, redes sociais, lojas de aplicativos). Não nos responsabilizamos pelo conteúdo, políticas ou práticas desses sites.",
  },
  {
    title: "10. Limitação de Responsabilidade",
    content:
      "Na máxima extensão permitida pela lei, a Viver Saúde não se responsabiliza por danos indiretos, lucros cessantes ou prejuízos decorrentes do uso ou da impossibilidade de uso do site, salvo nos casos previstos no Código de Defesa do Consumidor.",
  },
  {
    title: "11. Privacidade e Proteção de Dados",
    content: (
      <>
        O tratamento de dados pessoais é regido por nossa{" "}
        <Link href="/politica-de-privacidade" className="text-primary hover:underline font-medium">
          Política de Privacidade
        </Link>{" "}
        e pela{" "}
        <Link href="/politica-de-cookies" className="text-primary hover:underline font-medium">
          Política de Cookies
        </Link>
        , parte integrante destes Termos.
      </>
    ),
  },
  {
    title: "12. Alterações dos Termos",
    content:
      "Estes Termos podem ser alterados a qualquer momento. A versão vigente sempre estará disponível nesta página. Recomendamos revisão periódica.",
  },
  {
    title: "13. Lei Aplicável e Foro",
    content:
      "Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de Natal/RN para dirimir qualquer controvérsia, ressalvado o foro do consumidor previsto em lei.",
  },
  {
    title: "14. Contato",
    content: `Dúvidas sobre estes Termos: ${SITE.email}. Assuntos de privacidade: ${LGPD.dpoEmail}.`,
  },
];

export default function TermosUsoPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Condições gerais para utilização do site da Viver Saúde.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {sections.map((section, idx) => (
              <ScrollAnimationWrapper key={idx} delay={Math.min(idx * 0.03, 0.3)}>
                <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  {section.content && (
                    <p className="text-muted leading-relaxed">{section.content}</p>
                  )}
                  {section.list && (
                    <ul className="list-disc pl-6 space-y-2 text-muted leading-relaxed">
                      {section.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
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
