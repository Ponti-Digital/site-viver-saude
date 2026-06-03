import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Prefixos permitidos para revalidação — protege contra revalidar caminhos arbitrários */
const ALLOWED_PREFIXES = ["/", "/planos"];

function isAllowedPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  return ALLOWED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + "/")
  );
}

async function checkAdminOrEditor() {
  const supabase = await createClient();
  // getUser() revalida o JWT no Auth server — não confiar em getSession() no servidor.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "editor"].includes(profile.role)) return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = await checkAdminOrEditor();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: { paths?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const { paths } = body;

  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json(
      { error: 'Campo "paths" deve ser um array não vazio de strings' },
      { status: 400 }
    );
  }

  const invalid = paths.filter((p) => typeof p !== "string" || !isAllowedPath(p));
  if (invalid.length > 0) {
    return NextResponse.json(
      {
        error: `Caminhos não permitidos: ${invalid.join(", ")}. Permitidos: ${ALLOWED_PREFIXES.join(", ")} e subpaths.`,
      },
      { status: 400 }
    );
  }

  const revalidated: string[] = [];
  for (const path of paths as string[]) {
    revalidatePath(path);
    revalidated.push(path);
  }

  return NextResponse.json({ revalidated });
}
