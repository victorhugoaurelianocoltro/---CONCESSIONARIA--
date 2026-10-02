import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminCredentialsConfigured, isAdminSessionValid } from "@/lib/admin-auth";
import AdminLogin from "@/components/AdminLogin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Acesso administrativo | Motora", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (isAdminSessionValid((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin");
  return <AdminLogin configured={adminCredentialsConfigured()} />;
}