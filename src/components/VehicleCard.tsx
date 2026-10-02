import { ArrowUpRight, Bike, CarFront, Gauge } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Vehicle } from "@/lib/dealership-db";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const sold = vehicle.status === "vendido";
  const name = `${vehicle.make} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ""}`;
  const specifications = [vehicle.year, vehicle.mileage !== null ? `${vehicle.mileage.toLocaleString("pt-BR")} km` : null, vehicle.transmission || null].filter(Boolean);

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[#1b1c18] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,.28)]">
      <Link href={`/veiculos/${vehicle.slug}`} aria-label={`Ver ${name}`} className="relative block aspect-[1.45] overflow-hidden bg-[#24251f]">
        {vehicle.images[0] ? <Image src={vehicle.images[0]} alt={`${name}${vehicle.year ? `, ${vehicle.year}` : ""}`} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" /> : <span className="grid h-full w-full place-items-center text-white/25">{vehicle.type === "moto" ? <Bike size={38} /> : <CarFront size={38} />}</span>}
        <span className="absolute left-3 top-3 bg-[#141510]/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-white/85">{vehicle.condition === "novo" ? "Novo" : "Seminovo"}</span>
        {vehicle.status !== "disponivel" && <span className={`absolute right-3 top-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] ${sold ? "bg-[#9d493b] text-white" : "bg-[#d9bc7a] text-[#262216]"}`}>{sold ? "Vendido" : "Reservado"}</span>}
        {vehicle.featured && <span className="absolute bottom-3 left-3 bg-[#c9f169] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#171914]">Destaque</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#afb09f]">{vehicle.make}{vehicle.type === "moto" ? " · Moto" : " · Carro"}</p>
        <h2 className="mt-2 text-lg font-semibold leading-tight"><Link href={`/veiculos/${vehicle.slug}`} className="transition hover:text-[#d5f78b]">{name}</Link></h2>
        {specifications.length > 0 && <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/50"><Gauge size={13} className="shrink-0" />{specifications.join(" · ")}</p>}
        {vehicle.color && <p className="mt-1 text-[11px] text-white/45">{vehicle.color}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-white/10 pt-4">
          <div>{vehicle.promotionalPrice !== null && <p className="text-[10px] text-white/40 line-through">{money.format(vehicle.price)}</p>}<p className="text-xl font-semibold tabular-nums">{money.format(vehicle.promotionalPrice ?? vehicle.price)}</p></div>
          <Link href={`/veiculos/${vehicle.slug}`} aria-label={`Ver detalhes de ${name}`} className="grid h-10 w-10 shrink-0 place-items-center border border-white/15 text-white transition group-hover:border-[#c9f169] group-hover:text-[#c9f169]"><ArrowUpRight size={17} /></Link>
        </div>
        {vehicle.financingEnabled && !sold && <p className="mt-3 text-[10px] font-semibold text-[#c9f169]">Simulação disponível</p>}
      </div>
    </article>
  );
}