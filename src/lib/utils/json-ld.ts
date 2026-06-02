/**
 * Serializa um objeto JSON-LD para uso seguro em
 * `<script type="application/ld+json" dangerouslySetInnerHTML>`.
 *
 * `JSON.stringify` sozinho NÃO escapa `<`, `>` e `&`, então um conteúdo vindo do
 * CMS (ex.: nome/descrição de plano) contendo `</script>` quebraria a tag e
 * permitiria injeção de script (XSS). Aqui escapamos esses caracteres como
 * sequências unicode, que continuam sendo JSON válido.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
