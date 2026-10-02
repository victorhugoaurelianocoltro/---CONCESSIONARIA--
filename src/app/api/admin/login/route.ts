import { NextRequest, NextResponse } from "next/server";
import { adminCredentialsConfigured, authenticateAdmin, ADMIN_COOKIE, createAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!adminCredentialsConfigured()) {
    return NextResponse.json({ error: "O administrador ainda não foi configurado no servidor." }, { status: 503 });
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.slice(0, 150) : "";
  const password = typeof body.password === "string" ? body.password.slice(0, 300) : "";
  if (!authenticateAdmin(username, password)) {
    return NextResponse.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
  }

  const session = createAdminSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}