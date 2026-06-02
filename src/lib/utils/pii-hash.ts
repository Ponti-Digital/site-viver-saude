import { createHmac } from "crypto";

/**
 * Hashing pseudonimizado de dados pessoais (IP, e-mail, CPF) para fins de
 * rate-limiting e prova de consentimento (LGPD).
 *
 * Usa HMAC-SHA256 com um segredo OBRIGATÓRIO (`IP_HASH_SALT`). Sem o segredo,
 * a função falha (fail-closed) — não há fallback hardcoded, pois um salt
 * conhecido/ausente permitiria reidentificar os titulares (CPF tem só ~10^11
 * combinações, trivialmente enumeráveis com um hash sem segredo).
 *
 * IMPORTANTE: hash de CPF NÃO é anonimização irreversível (art. 12 LGPD); é
 * pseudonimização. O dado segue protegido pela LGPD.
 */
function getSalt(): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt || salt.length < 16) {
    throw new Error(
      "IP_HASH_SALT ausente ou curto. Defina um segredo forte (>= 16 chars) no " +
        "ambiente (ex.: Netlify) — obrigatório para o hashing de IP/CPF/e-mail (LGPD)."
    );
  }
  return salt;
}

function hmac(value: string, hexLen: number): string {
  return createHmac("sha256", getSalt()).update(value).digest("hex").slice(0, hexLen);
}

export function hashIP(ip: string): string {
  return hmac(ip, 16);
}

export function hashSubject(value: string): string {
  return hmac(value.toLowerCase().trim(), 32);
}

export function hashCpf(cpf: string): string {
  const onlyDigits = cpf.replace(/\D/g, "");
  if (!onlyDigits) return "";
  return hmac(onlyDigits, 32);
}

/**
 * IP confiável do cliente.
 *
 * Não usamos `x-forwarded-for.split(",")[0]`: o primeiro valor é o que o cliente
 * envia e pode ser forjado para burlar o rate-limit. Preferimos o header que a
 * plataforma define (Netlify: `x-nf-client-connection-ip`); como fallback usamos
 * o ÚLTIMO hop do XFF (adicionado pelo proxy confiável).
 */
export function clientIp(headers: Headers): string {
  const platformIp = headers.get("x-nf-client-connection-ip");
  if (platformIp?.trim()) return platformIp.trim();

  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return "unknown";
}
