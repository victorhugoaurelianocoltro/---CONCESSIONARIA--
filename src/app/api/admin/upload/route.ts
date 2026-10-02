import { NextRequest, NextResponse } from "next/server";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { ADMIN_COOKIE, isAdminSessionValid } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const allowedTypes: Record<string, { extension: string; matches: (bytes: Buffer) => boolean }> = {
  "image/jpeg": { extension: "jpg", matches: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  "image/png": { extension: "png", matches: (bytes) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  "image/webp": { extension: "webp", matches: (bytes) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" },
};

export async function POST(request: NextRequest) {
  if (!isAdminSessionValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const files = formData.getAll("images").filter((entry): entry is File => entry instanceof File);
    if (files.length === 0 || files.length > 12) {
      return NextResponse.json({ error: "Selecione de 1 a 12 imagens." }, { status: 400 });
    }
    const validated: { bytes: Buffer; extension: string }[] = [];
    for (const file of files) {
      if (file.size > MAX_IMAGE_BYTES || file.size === 0 || !allowedTypes[file.type]) {
        return NextResponse.json({ error: "Cada imagem precisa ter até 8 MB." }, { status: 400 });
      }
      const imageType = allowedTypes[file.type];
      const bytes = Buffer.from(await file.arrayBuffer());
      if (!imageType?.matches(bytes)) {
        return NextResponse.json({ error: "Use imagens JPG, PNG ou WebP válidas." }, { status: 400 });
      }
      validated.push({ bytes, extension: imageType.extension });
    }
    const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDirectory, { recursive: true });
    const saved: string[] = [];
    try {
      for (const image of validated) {
        const filename = `${randomUUID()}.${image.extension}`;
        await writeFile(path.join(uploadsDirectory, filename), image.bytes, { flag: "wx" });
        saved.push(`/uploads/${filename}`);
      }
    } catch (error) {
      await Promise.all(saved.map((image) => unlink(path.join(process.cwd(), "public", image.slice(1))).catch(() => undefined)));
      throw error;
    }
    return NextResponse.json({ images: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar as imagens." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminSessionValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }
  const image = request.nextUrl.searchParams.get("path") || "";
  if (!/^\/uploads\/[a-z0-9-]+\.(jpg|png|webp)$/.test(image)) {
    return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
  }
  try {
    await unlink(path.join(process.cwd(), "public", image.slice(1)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  }
}