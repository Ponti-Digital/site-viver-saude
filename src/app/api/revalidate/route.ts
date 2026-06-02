import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import crypto from "crypto";

/**
 * Compara dois segredos em tempo constante. Retorna false se algum estiver vazio
 * (fail-closed) ou se os tamanhos diferirem.
 */
function safeEqual(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    const expected = process.env.REVALIDATION_SECRET;

    // Fail-closed: sem segredo configurado, ninguém revalida.
    if (!expected) {
      console.error("REVALIDATION_SECRET não configurado — revalidação bloqueada.");
      return Response.json({ error: "Indisponível" }, { status: 503 });
    }

    const body = await request.json();
    const { secret, path } = body as { secret?: string; path?: string };

    if (!safeEqual(secret, expected)) {
      return Response.json({ error: "Token inválido" }, { status: 401 });
    }

    if (!path) {
      return Response.json(
        { error: "Path é obrigatório" },
        { status: 400 }
      );
    }

    revalidatePath(path);

    return Response.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidate error:", err);
    return Response.json({ error: "Erro interno." }, { status: 500 });
  }
}
