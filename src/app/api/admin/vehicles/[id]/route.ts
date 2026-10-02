import { NextRequest, NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { ADMIN_COOKIE, isAdminSessionValid } from "@/lib/admin-auth";
import { cleanVehicleInput, deleteVehicle, getVehicleById, saveVehicle } from "@/lib/dealership-db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  if (!isAdminSessionValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }
  try {
    const previous = getVehicleById(id);
    if (!previous) return NextResponse.json({ error: "Veículo não encontrado." }, { status: 404 });
    const input = cleanVehicleInput(await request.json());
    const vehicle = saveVehicle(input, id);
    const currentImages = new Set(vehicle.images);
    await Promise.all(previous.images.filter((image) => !currentImages.has(image)).map(removeUploadedFile));
    return NextResponse.json({ vehicle });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível atualizar o veículo." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAdminSessionValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }
  const { id } = await context.params;
  const vehicle = deleteVehicle(id);
  if (!vehicle) return NextResponse.json({ error: "Veículo não encontrado." }, { status: 404 });
  await Promise.all(vehicle.images.map(removeUploadedFile));
  return NextResponse.json({ ok: true });
}

async function removeUploadedFile(image: string): Promise<void> {
  if (!image.startsWith("/uploads/") || image.includes("..")) return;
  await unlink(path.join(process.cwd(), "public", image.slice(1))).catch(() => undefined);
}