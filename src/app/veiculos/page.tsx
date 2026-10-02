import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import VehicleCard from "@/components/VehicleCard";
import { listVehicles, type VehicleFilters } from "@/lib/dealership-db";

export const dynamic = "force-dynamic";

type PageSearchParams = Record<string, string | string[] | undefined>;

function getValue(params: PageSearchParams, name: keyof VehicleFilters): string | undefined {
  const value = params[name];
  return typeof value === "string" ? value.slice(0, 100) : undefined;
}

export default function VehiclesPage({ searchParams }: { searchParams: PageSearchParams }) {
  const filters: VehicleFilters = {
    search: getValue(searchParams, "search"),
    type: getValue(searchParams, "type"),
    condition: getValue(searchParams, "condition"),
    make: getValue(searchParams, "make"),
    model: getValue(searchParams, "model"),
    minPrice: getValue(searchParams, "minPrice"),
    maxPrice: getValue(searchParams, "maxPrice"),
    minYear: getValue(searchParams, "minYear"),
    maxYear: getValue(searchParams, "maxYear"),
    maxMileage: getValue(searchParams, "maxMileage"),
    color: getValue(searchParams, "color"),
    transmission: getValue(searchParams, "transmission"),
    fuel: getValue(searchParams, "fuel"),
  };
  const allVehicles = listVehicles();
  const filteredVehicles = listVehicles(filters);
  const makes = Array.from(new Set(allVehicles.map((vehicle) => vehicle.make))).sort((first, second) => first.localeCompare(second, "pt-BR"));
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <main className="min-h-screen bg-[#12130f] text-[#f8f8f4]">
      <header className="border-b border-white/10"><div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10"><Link href="/" className="text-sm font-black tracking-[0.12em]">MOTORA<span className="text-[#c9f169]">.</span></Link><Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/65 hover:text-white"><ArrowLeft size={15} />Início</Link></div></header>
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9f169]">Estoque cadastrado pela concessionária</p>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Encontre seu próximo veículo.</h1><p className="text-sm text-white/55">{filteredVehicles.length} {filteredVehicles.length === 1 ? "veículo encontrado" : "veículos encontrados"}</p></div>
        <form action="/veiculos" method="get" className="mt-9 border border-white/10 bg-[#1a1b16] p-4 md:p-6">
          <label className="relative block"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" /><input name="search" defaultValue={filters.search} placeholder="Buscar marca, modelo ou versão" className="h-12 w-full border border-white/10 bg-[#12130f] pl-11 pr-4 text-sm outline-none focus:border-[#c9f169]" /></label>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <select name="type" defaultValue={filters.type ?? ""} className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]"><option value="">Carros e motos</option><option value="carro">Carros</option><option value="moto">Motos</option></select>
            <select name="condition" defaultValue={filters.condition ?? ""} className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]"><option value="">Novos e seminovos</option><option value="novo">Novos</option><option value="seminovo">Seminovos</option></select>
            <select name="make" defaultValue={filters.make ?? ""} className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]"><option value="">Todas as marcas</option>{makes.map((make) => <option key={make} value={make}>{make}</option>)}</select>
            <input name="model" defaultValue={filters.model} placeholder="Modelo" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="minPrice" type="number" min="0" defaultValue={filters.minPrice} placeholder="Preço mínimo" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="maxPrice" type="number" min="0" defaultValue={filters.maxPrice} placeholder="Preço máximo" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="minYear" type="number" min="1886" defaultValue={filters.minYear} placeholder="Ano a partir de" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="maxYear" type="number" min="1886" defaultValue={filters.maxYear} placeholder="Ano até" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="maxMileage" type="number" min="0" defaultValue={filters.maxMileage} placeholder="Km até" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="color" defaultValue={filters.color} placeholder="Cor" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="transmission" defaultValue={filters.transmission} placeholder="Câmbio" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
            <input name="fuel" defaultValue={filters.fuel} placeholder="Combustível" className="h-11 min-w-0 border border-white/10 bg-[#12130f] px-3 text-xs outline-none focus:border-[#c9f169]" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3"><button className="h-11 bg-[#c9f169] px-6 text-xs font-bold text-[#171914] transition hover:bg-[#d9f994]">Aplicar filtros</button>{hasFilters && <Link href="/veiculos" className="px-3 py-3 text-xs font-semibold text-white/60 hover:text-white">Limpar filtros</Link>}</div>
        </form>
        {filteredVehicles.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <section className="mt-8 border border-white/10 bg-[#1a1b16] px-5 py-16 text-center"><h2 className="text-xl font-semibold">{allVehicles.length === 0 ? "O estoque está sendo preparado." : "Nenhum veículo corresponde a esses filtros."}</h2><p className="mx-auto mt-3 max-w-[440px] text-sm leading-6 text-white/50">{allVehicles.length === 0 ? "Ainda não há veículos cadastrados pela concessionária. Volte em breve para conferir as novidades." : "Tente ajustar ou remover algum filtro para encontrar mais opções."}</p>{allVehicles.length > 0 && <Link href="/veiculos" className="mt-5 inline-flex min-h-11 items-center border border-white/25 px-5 text-sm font-semibold hover:border-white">Limpar filtros</Link>}</section>}
      </div>
      <footer className="border-t border-white/10 px-5 py-7 text-center text-[10px] text-white/35">MOTORA · Consulte condições e disponibilidade com a concessionária.</footer>
    </main>
  );
}