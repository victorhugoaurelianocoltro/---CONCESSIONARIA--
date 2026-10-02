import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "dealership_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function sessionSecret(): string {
  const secret = process.env.DEALERSHIP_ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Configure DEALERSHIP_ADMIN_SESSION_SECRET com pelo menos 32 caracteres.");
  return secret;
}

function safeEqual(first: string, second: string): boolean {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

export function adminCredentialsConfigured(): boolean {
  return Boolean(process.env.DEALERSHIP_ADMIN_USERNAME && process.env.DEALERSHIP_ADMIN_PASSWORD && process.env.DEALERSHIP_ADMIN_SESSION_SECRET?.length && process.env.DEALERSHIP_ADMIN_SESSION_SECRET.length >= 32);
}

export function authenticateAdmin(username: string, password: string): boolean {
  const expectedUsername = process.env.DEALERSHIP_ADMIN_USERNAME || "";
  const expectedPassword = process.env.DEALERSHIP_ADMIN_PASSWORD || "";
  if (!expectedUsername || !expectedPassword || !adminCredentialsConfigured()) return false;
  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

export function createAdminSession(): { token: string; maxAge: number } {
  const maxAge = SESSION_DURATION_SECONDS;
  const payload = Buffer.from(JSON.stringify({ expiresAt: Date.now() + maxAge * 1000 })).toString("base64url");
  return { token: `${payload}.${sign(payload)}`, maxAge };
}

export function isAdminSessionValid(token?: string): boolean {
  if (!token || !adminCredentialsConfigured()) return false;
  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!safeEqual(signature, sign(payload))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { expiresAt?: number };
    return typeof session.expiresAt === "number" && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}