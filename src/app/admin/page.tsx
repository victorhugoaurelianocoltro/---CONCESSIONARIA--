import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdminSessionValid } from "@/lib/admin-auth";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Estoque | Motora Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!isAdminSessionValid((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/login");
  return <AdminDashboard />;
}