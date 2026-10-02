import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminSessionValid } from "@/lib/admin-auth";
import { cleanVehicleInput, listVehicles, saveVehicle } from "@/lib/dealership-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminSessionValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }
  return NextResponse.json({ vehicles: listVehicles(Object.fromEntries(request.nextUrl.searchParams), true) });
}

export async function POST(request: NextRequest) {
  if (!isAdminSessionValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }
  try {
    const input = cleanVehicleInput(await request.json());
    return NextResponse.json({ vehicle: saveVehicle(input) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível salvar o veículo." }, { status: 400 });
  }
}