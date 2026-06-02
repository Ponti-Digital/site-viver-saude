import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/ponti-admin");
  const isLoginRoute =
    request.nextUrl.pathname === "/ponti-admin/login" ||
    request.nextUrl.pathname === "/ponti-admin/reset-password";

  if (isAdminRoute && !isLoginRoute) {
    // Sem usuário autenticado -> login.
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/ponti-admin/login";
      return NextResponse.redirect(url);
    }

    // Autenticado mas sem perfil/role válido (ex.: auto-registro) -> negar acesso ao painel.
    // RLS "Users can view own profile" permite ler o próprio perfil com a anon key + JWT.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "editor") {
      const url = request.nextUrl.clone();
      url.pathname = "/ponti-admin/login";
      url.searchParams.set("erro", "sem-permissao");
      return NextResponse.redirect(url);
    }
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/ponti-admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
