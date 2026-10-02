"use client";

import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Bike, CarFront, ChevronLeft, ChevronRight, Gauge, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Vehicle } from "@/lib/dealership-db";
import { vehicleInterestMessage, dealershipWhatsAppLink } from "@/lib/dealership-whatsapp";
import FinancingSimulator from "@/components/FinancingSimulator";
import VehicleLeadForms from "@/components/VehicleLeadForms";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function VehicleDetailClient({ vehicle }: { vehicle: Vehicle }) {
  const [activeImage, setActiveImage] = useState(0);
  const vehicleName = `${vehicle.make} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ""}`;
  const photos = vehicle.images;
  const sold = vehicle.status === "vendido";
  const contactMessage = vehicle.status === "reservado"
    ? `Olá! Gostaria de consultar a disponibilidade do ${vehicleName}, que consta como reservado no site.`
    : vehicleInterestMessage(vehicleName);
  const contactLink = sold ? null : dealershipWhatsAppLink(contactMessage);
  const specifications = [
    ["Marca", vehicle.make], ["Modelo", vehicle.model], ["Versão", vehicle.version],
    ["Tipo", vehicle.type === "carro" ? "Carro" : "Moto"], ["Condição", vehicle.condition === "novo" ? "Novo" : "Seminovo"],
    ["Ano", vehicle.year], ["Quilometragem", vehicle.mileage !== null ? `${vehicle.mileage.toLocaleString("pt-BR")} km` : ""],
    ["Cor", vehicle.color], ["Motor", vehicle.engine], ["Potência", vehicle.power], ["Câmbio", vehicle.transmission],
    ["Combustível", vehicle.fuel], ["Cilindrada", vehicle.displacement], ["Portas", vehicle.doors], ["Tração", vehicle.traction],
    ...Object.entries(vehicle.specifications),
  ].filter((entry): entry is [string, string | number] => Boolean(entry[1]));

  function changeImage(direction: -1 | 1) {
    setActiveImage((current) => (current + direction + photos.length) % photos.length);
  }

  return (
    <main className="min-h-screen bg-[#f3f2ed] text-[#191a16]">
      <header className="border-b border-[#dedfd7] bg-white"><div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-5 md:px-10"><Link href="/" className="text-sm font-black tracking-[0.12em]">MOTORA<span className="text-[#84995b]">.</span></Link><Link href="/veiculos" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6d7066] hover:text-[#191a16]"><ArrowLeft size={15} />Voltar ao estoque</Link></div></header>
      <div className="mx-auto max-w-[1320px] px-5 py-7 md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
          <section aria-label="Galeria de fotos do veículo">
            <div className="relative aspect-[1.45] overflow-hidden bg-[#22241e]">
              {photos.length ? <Image src={photos[activeImage]} alt={`${vehicleName}${vehicle.year ? `, ${vehicle.year}` : ""}, foto ${activeImage + 1}`} fill priority sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" /> : <span className="grid h-full w-full place-items-center text-white/30">{vehicle.type === "moto" ? <Bike size={52} /> : <CarFront size={52} />}</span>}
              {photos.length > 1 && <><button type="button" onClick={() => changeImage(-1)} aria-label="Foto anterior" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-[#12130f]/70 text-white backdrop-blur transition hover:bg-[#12130f]"><ChevronLeft size={20} /></button><button type="button" onClick={() => changeImage(1)} aria-label="Próxima foto" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-[#12130f]/70 text-white backdrop-blur transition hover:bg-[#12130f]"><ChevronRight size={20} /></button><span className="absolute bottom-3 right-3 bg-[#12130f]/75 px-3 py-1.5 text-[10px] font-semibold text-white">{activeImage + 1} / {photos.length}</span></>}
            </div>
            {photos.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{photos.map((photo, index) => <button type="button" key={photo} onClick={() => setActiveImage(index)} aria-label={`Exibir foto ${index + 1}`} aria-pressed={activeImage === index} className={`relative h-[72px] w-[104px] shrink-0 overflow-hidden border-2 ${activeImage === index ? "border-[#84995b]" : "border-transparent"}`}><Image src={photo} alt="" fill sizes="104px" className="object-cover" /></button>)}</div>}
          </section>

          <section className="lg:pt-2">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em]"><span className="bg-[#e7e9df] px-2.5 py-1.5 text-[#53574c]">{vehicle.condition === "novo" ? "Novo" : "Seminovo"}</span><span className="bg-[#e7e9df] px-2.5 py-1.5 text-[#53574c]">{vehicle.type === "carro" ? "Carro" : "Moto"}</span>{vehicle.status !== "disponivel" && <span className={`px-2.5 py-1.5 ${sold ? "bg-[#f0dfda] text-[#863f31]" : "bg-[#f3ead6] text-[#765e24]"}`}>{sold ? "Vendido" : "Reservado"}</span>}</div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.13em] text-[#777a70]">{vehicle.make}</p><h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">{vehicle.model}</h1>{vehicle.version && <p className="mt-2 text-lg text-[#73776d]">{vehicle.version}</p>}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6c7065]">{vehicle.year !== null && <span>{vehicle.year}</span>}{vehicle.mileage !== null && <span className="inline-flex items-center gap-1.5"><Gauge size={14} />{vehicle.mileage.toLocaleString("pt-BR")} km</span>}{vehicle.color && <span>{vehicle.color}</span>}{vehicle.transmission && <span>{vehicle.transmission}</span>}</div>
            <div className="mt-7 border-y border-[#d8dad0] py-6">{vehicle.promotionalPrice !== null && <p className="text-sm text-[#7b7e74] line-through">{money.format(vehicle.price)}</p>}<p className="mt-1 text-4xl font-semibold tracking-tight">{money.format(vehicle.promotionalPrice ?? vehicle.price)}</p>{vehicle.status === "reservado" && <p className="mt-2 text-xs font-semibold text-[#806b35]">Disponibilidade sujeita à confirmação com o vendedor.</p>}{sold && <p className="mt-2 text-xs font-semibold text-[#8d4032]">Este veículo foi marcado como vendido.</p>}</div>
            {contactLink && <a href={contactLink} target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#c9f169] px-6 text-sm font-bold text-[#171914] transition hover:bg-[#d9f994]"><MessageCircle size={18} />Falar com vendedor<ArrowUpRight size={16} /></a>}
            {vehicle.status === "disponivel" && <a href="#contato-veiculo" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#bfc2b5] px-6 text-sm font-semibold text-[#383b33] transition hover:border-[#191a16]"><ArrowDown size={16} />Agendar test drive</a>}
            {vehicle.financingEnabled && !sold && <p className="mt-3 text-center text-[11px] text-[#78805f]">Financiamento sujeito às condições cadastradas e análise da instituição.</p>}
          </section>
        </div>

        {(vehicle.description || specifications.length > 0 || vehicle.equipment.length > 0) && <section className="mt-12 grid gap-10 border-t border-[#d8dad0] pt-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>{vehicle.description && <><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#818477]">Descrição do veículo</p><h2 className="mt-2 text-2xl font-semibold">Sobre este veículo</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#62665c]">{vehicle.description}</p></>}</div>
          {specifications.length > 0 && <div><h2 className="text-xl font-semibold">Especificações</h2><dl className="mt-4 grid grid-cols-2 gap-x-5">{specifications.map(([label, value]) => <div key={label} className="border-t border-[#dedfd7] py-3"><dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#85887d]">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl></div>}
          {vehicle.equipment.length > 0 && <div className="lg:col-span-2"><h2 className="text-xl font-semibold">Equipamentos e opcionais</h2><ul className="mt-4 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-3">{vehicle.equipment.map((item) => <li key={item} className="border-t border-[#dedfd7] py-3 text-sm text-[#53574e]">{item}</li>)}</ul></div>}
        </section>}

        {vehicle.financingEnabled && !sold && <div className="mt-12 border-t border-[#dedfd7] pt-8"><FinancingSimulator key={vehicle.id} vehicle={vehicle} /></div>}
        {!sold && <div id="contato-veiculo" className="scroll-mt-8 mt-12"><VehicleLeadForms vehicle={vehicle} /></div>}
        <footer className="mt-14 border-t border-[#dedfd7] pt-6 text-[10px] leading-5 text-[#85887d]">Valores e disponibilidade sujeitos à confirmação pela concessionária. Simulações de financiamento são estimativas, não ofertas de crédito nem garantia de aprovação.</footer>
      </div>
    </main>
  );
}