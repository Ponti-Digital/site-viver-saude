import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkAdmin() {
  const supabase = await createClient();
  // getUser() revalida o JWT no Auth server do Supabase — não confiar em getSession() no servidor.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await checkAdmin();
  if (!user) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: profiles } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Get emails from auth.users
  const { data: { users } } = await admin.auth.admin.listUsers();

  const emailMap = new Map<string, string>();
  for (const u of users ?? []) {
    emailMap.set(u.id, u.email ?? "");
  }

  const result = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap.get(p.id) ?? "",
  }));

  return NextResponse.json({ data: result });
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin();
  if (!user) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { email, password, full_name, role } = body as {
    email: string;
    password: string;
    full_name: string;
    role: "admin" | "editor";
  };

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: "Campos obrigatorios faltando." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: newUser.user.id,
    full_name,
    role: role || "editor",
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ data: { id: newUser.user.id, email, full_name, role } });
}

export async function PATCH(request: NextRequest) {
  const user = await checkAdmin();
  if (!user) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { id, role, full_name } = body as {
    id: string;
    role?: "admin" | "editor";
    full_name?: string;
  };

  if (!id) {
    return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });
  }

  const admin = createAdminClient();
  const updates: Record<string, string> = {};
  if (role) updates.role = role;
  if (full_name) updates.full_name = full_name;

  const { error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await checkAdmin();
  if (!user) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });
  }

  if (userId === user.id) {
    return NextResponse.json({ error: "Voce nao pode excluir a si mesmo." }, { status: 400 });
  }

  const admin = createAdminClient();

  await admin.from("profiles").delete().eq("id", userId);
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
