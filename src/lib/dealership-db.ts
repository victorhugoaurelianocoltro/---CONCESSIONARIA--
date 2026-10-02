import "server-only";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type VehicleStatus = "disponivel" | "reservado" | "vendido";
export type VehicleType = "carro" | "moto";
export type VehicleCondition = "novo" | "seminovo";

export type Vehicle = {
  id: string;
  slug: string;
  type: VehicleType;
  condition: VehicleCondition;
  make: string;
  model: string;
  version: string;
  year: number | null;
  mileage: number | null;
  color: string;
  price: number;
  promotionalPrice: number | null;
  status: VehicleStatus;
  showSoldPublic: boolean;
  featured: boolean;
  engine: string;
  power: string;
  transmission: string;
  fuel: string;
  displacement: string;
  doors: string;
  traction: string;
  specifications: Record<string, string>;
  equipment: string[];
  description: string;
  images: string[];
  financingEnabled: boolean;
  suggestedDownPayment: number | null;
  monthlyRate: number;
  minimumTerm: number;
  maximumTerm: number;
  createdAt: string;
  updatedAt: string;
};

export type VehicleFilters = {
  search?: string;
  type?: string;
  condition?: string;
  make?: string;
  model?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  maxMileage?: string;
  color?: string;
  transmission?: string;
  fuel?: string;
  status?: string;
};

const databasePath = process.env.DEALERSHIP_DB_PATH || path.join(process.cwd(), "data", "dealership.sqlite");
mkdirSync(path.dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('carro', 'moto')),
    condition TEXT NOT NULL CHECK (condition IN ('novo', 'seminovo')),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '',
    year INTEGER,
    mileage INTEGER,
    color TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL,
    promotional_price REAL,
    status TEXT NOT NULL CHECK (status IN ('disponivel', 'reservado', 'vendido')),
    show_sold_public INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    engine TEXT NOT NULL DEFAULT '',
    power TEXT NOT NULL DEFAULT '',
    transmission TEXT NOT NULL DEFAULT '',
    fuel TEXT NOT NULL DEFAULT '',
    displacement TEXT NOT NULL DEFAULT '',
    doors TEXT NOT NULL DEFAULT '',
    traction TEXT NOT NULL DEFAULT '',
    specifications_json TEXT NOT NULL DEFAULT '{}',
    equipment_json TEXT NOT NULL DEFAULT '[]',
    description TEXT NOT NULL DEFAULT '',
    images_json TEXT NOT NULL DEFAULT '[]',
    financing_enabled INTEGER NOT NULL DEFAULT 0,
    suggested_down_payment REAL,
    monthly_rate REAL NOT NULL DEFAULT 0,
    minimum_term INTEGER NOT NULL DEFAULT 12,
    maximum_term INTEGER NOT NULL DEFAULT 60,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS vehicles_status_idx ON vehicles(status);
  CREATE INDEX IF NOT EXISTS vehicles_slug_idx ON vehicles(slug);
`);

type VehicleRow = Record<string, unknown>;

function fromRow(row: VehicleRow): Vehicle {
  return {
    id: String(row.id),
    slug: String(row.slug),
    type: row.type as VehicleType,
    condition: row.condition as VehicleCondition,
    make: String(row.make),
    model: String(row.model),
    version: String(row.version),
    year: row.year === null ? null : Number(row.year),
    mileage: row.mileage === null ? null : Number(row.mileage),
    color: String(row.color),
    price: Number(row.price),
    promotionalPrice: row.promotional_price === null ? null : Number(row.promotional_price),
    status: row.status as VehicleStatus,
    showSoldPublic: Boolean(row.show_sold_public),
    featured: Boolean(row.featured),
    engine: String(row.engine),
    power: String(row.power),
    transmission: String(row.transmission),
    fuel: String(row.fuel),
    displacement: String(row.displacement),
    doors: String(row.doors),
    traction: String(row.traction),
    specifications: JSON.parse(String(row.specifications_json)),
    equipment: JSON.parse(String(row.equipment_json)),
    description: String(row.description),
    images: JSON.parse(String(row.images_json)),
    financingEnabled: Boolean(row.financing_enabled),
    suggestedDownPayment: row.suggested_down_payment === null ? null : Number(row.suggested_down_payment),
    monthlyRate: Number(row.monthly_rate),
    minimumTerm: Number(row.minimum_term),
    maximumTerm: Number(row.maximum_term),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function publicVisibility(): string {
  return "(status != 'vendido' OR show_sold_public = 1)";
}

export function listVehicles(filters: VehicleFilters = {}, includeHidden = false): Vehicle[] {
  const clauses: string[] = [];
  const values: (string | number)[] = [];
  if (!includeHidden) clauses.push(publicVisibility());
  if (filters.search) {
    clauses.push("(make LIKE ? OR model LIKE ? OR version LIKE ?)");
    const query = `%${filters.search.trim()}%`;
    values.push(query, query, query);
  }
  if (filters.type) { clauses.push("type = ?"); values.push(filters.type); }
  if (filters.condition) { clauses.push("condition = ?"); values.push(filters.condition); }
  if (filters.make) { clauses.push("make LIKE ?"); values.push(`%${filters.make}%`); }
  if (filters.model) { clauses.push("model LIKE ?"); values.push(`%${filters.model}%`); }
  if (filters.minPrice && Number.isFinite(Number(filters.minPrice))) { clauses.push("COALESCE(promotional_price, price) >= ?"); values.push(Number(filters.minPrice)); }
  if (filters.maxPrice && Number.isFinite(Number(filters.maxPrice))) { clauses.push("COALESCE(promotional_price, price) <= ?"); values.push(Number(filters.maxPrice)); }
  if (filters.minYear && Number.isFinite(Number(filters.minYear))) { clauses.push("year >= ?"); values.push(Number(filters.minYear)); }
  if (filters.maxYear && Number.isFinite(Number(filters.maxYear))) { clauses.push("year <= ?"); values.push(Number(filters.maxYear)); }
  if (filters.maxMileage && Number.isFinite(Number(filters.maxMileage))) { clauses.push("mileage <= ?"); values.push(Number(filters.maxMileage)); }
  if (filters.color) { clauses.push("color LIKE ?"); values.push(`%${filters.color}%`); }
  if (filters.transmission) { clauses.push("transmission LIKE ?"); values.push(`%${filters.transmission}%`); }
  if (filters.fuel) { clauses.push("fuel LIKE ?"); values.push(`%${filters.fuel}%`); }
  if (filters.status) { clauses.push("status = ?"); values.push(filters.status); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = database.prepare(`SELECT * FROM vehicles ${where} ORDER BY featured DESC, updated_at DESC`).all(...values) as VehicleRow[];
  return rows.map(fromRow);
}

export function getVehicleById(id: string): Vehicle | null {
  const row = database.prepare("SELECT * FROM vehicles WHERE id = ?").get(id) as VehicleRow | undefined;
  return row ? fromRow(row) : null;
}

export function getPublicVehicleBySlug(slug: string): Vehicle | null {
  const row = database.prepare(`SELECT * FROM vehicles WHERE slug = ? AND ${publicVisibility()}`).get(slug) as VehicleRow | undefined;
  return row ? fromRow(row) : null;
}

function text(value: unknown, maxLength = 4000): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function optionalNumber(value: unknown, minimum = 0): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum) throw new Error("Confira os valores numéricos informados.");
  return number;
}

export function cleanVehicleInput(value: unknown): Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt"> {
  if (!value || typeof value !== "object") throw new Error("Dados do veículo inválidos.");
  const input = value as Record<string, unknown>;
  const make = text(input.make, 100);
  const model = text(input.model, 120);
  const type = input.type === "moto" ? "moto" : input.type === "carro" ? "carro" : null;
  const condition = input.condition === "novo" ? "novo" : input.condition === "seminovo" ? "seminovo" : null;
  const status = ["disponivel", "reservado", "vendido"].includes(String(input.status)) ? input.status as VehicleStatus : null;
  const price = optionalNumber(input.price);
  if (!make || !model || !type || !condition || !status || price === null) {
    throw new Error("Tipo, condição, marca, modelo, status e preço são obrigatórios.");
  }
  const specifications = input.specifications && typeof input.specifications === "object" && !Array.isArray(input.specifications)
    ? Object.fromEntries(Object.entries(input.specifications as Record<string, unknown>).map(([key, item]) => [text(key, 80), text(item, 300)]).filter(([key, item]) => key && item))
    : {};
  const images = Array.isArray(input.images) ? input.images.filter((item): item is string => typeof item === "string" && item.startsWith("/uploads/") && !item.includes("..")) : [];
    const equipment = Array.isArray(input.equipment) ? Array.from(new Set(input.equipment.map((item) => text(item, 120)).filter(Boolean))).slice(0, 100) : [];
  const promotionalPrice = optionalNumber(input.promotionalPrice);
  const suggestedDownPayment = optionalNumber(input.suggestedDownPayment);
  const monthlyRate = optionalNumber(input.monthlyRate) ?? 0;
  const minimumTerm = optionalNumber(input.minimumTerm, 1) ?? 12;
  const maximumTerm = optionalNumber(input.maximumTerm, 1) ?? 60;
  const year = optionalNumber(input.year, 1886);
  if (year !== null && year > 2100) throw new Error("Informe um ano válido para o veículo.");
  if (monthlyRate > 0.2) throw new Error("A taxa mensal não pode ultrapassar 20%.");
  if (minimumTerm > 120 || maximumTerm > 120) throw new Error("Os prazos não podem ultrapassar 120 meses.");
  if (maximumTerm < minimumTerm) throw new Error("O prazo máximo precisa ser igual ou maior que o prazo mínimo.");
  if (promotionalPrice !== null && promotionalPrice > price) throw new Error("O preço promocional não pode superar o preço normal.");
  return {
    type,
    condition,
    make,
    model,
    version: text(input.version, 120),
    year,
    mileage: optionalNumber(input.mileage),
    color: text(input.color, 80),
    price,
    promotionalPrice,
    status,
    showSoldPublic: input.showSoldPublic === true,
    featured: input.featured === true,
    engine: text(input.engine, 120),
    power: text(input.power, 80),
    transmission: text(input.transmission, 80),
    fuel: text(input.fuel, 80),
    displacement: text(input.displacement, 80),
    doors: text(input.doors, 40),
    traction: text(input.traction, 80),
    specifications,
    equipment,
    description: text(input.description, 10000),
    images,
    financingEnabled: input.financingEnabled === true,
    suggestedDownPayment,
    monthlyRate,
    minimumTerm: Math.round(minimumTerm),
    maximumTerm: Math.round(maximumTerm),
  };
}

function makeSlug(input: Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt">, id: string): string {
  const base = `${input.make}-${input.model}-${input.version}-${input.year ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "veiculo"}-${id.slice(0, 8)}`;
}

export function saveVehicle(input: Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt">, id?: string): Vehicle {
  const now = new Date().toISOString();
  const vehicleId = id || randomUUID();
  const slug = makeSlug(input, vehicleId);
  const columns = [
    "id", "slug", "type", "condition", "make", "model", "version", "year", "mileage", "color", "price", "promotional_price", "status", "show_sold_public", "featured", "engine", "power", "transmission", "fuel", "displacement", "doors", "traction", "specifications_json", "equipment_json", "description", "images_json", "financing_enabled", "suggested_down_payment", "monthly_rate", "minimum_term", "maximum_term", "created_at", "updated_at",
  ];
  const values = [
    vehicleId, slug, input.type, input.condition, input.make, input.model, input.version, input.year, input.mileage, input.color, input.price, input.promotionalPrice, input.status, Number(input.showSoldPublic), Number(input.featured), input.engine, input.power, input.transmission, input.fuel, input.displacement, input.doors, input.traction, JSON.stringify(input.specifications), JSON.stringify(input.equipment), input.description, JSON.stringify(input.images), Number(input.financingEnabled), input.suggestedDownPayment, input.monthlyRate, input.minimumTerm, input.maximumTerm, now, now,
  ];
  if (id) {
    const existing = getVehicleById(id);
    if (!existing) throw new Error("Veículo não encontrado.");
    const updateColumns = columns.slice(1).filter((column) => column !== "created_at");
    const updateValues = [...values.slice(1, -2), now, id];
    database.prepare(`UPDATE vehicles SET ${updateColumns.map((column) => `${column} = ?`).join(", ")} WHERE id = ?`).run(...updateValues);
  } else {
    database.prepare(`INSERT INTO vehicles (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`).run(...values);
  }
  return getVehicleById(vehicleId)!;
}

export function deleteVehicle(id: string): Vehicle | null {
  const vehicle = getVehicleById(id);
  if (!vehicle) return null;
  database.prepare("DELETE FROM vehicles WHERE id = ?").run(id);
  return vehicle;
}