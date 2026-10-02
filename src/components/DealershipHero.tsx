"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, MessageCircle, Rotate3D, ShieldCheck } from "lucide-react";
import type { HeroFinish, HeroView } from "@/components/HeroVehicleCanvas";

const VehicleCanvas = dynamic(() => import("@/components/HeroVehicleCanvas"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-xs uppercase tracking-[0.16em] text-white/45">Preparando visualização 3D</div>,
});

const views: { id: HeroView; label: string }[] = [
  { id: "3-4", label: "360°" }, { id: "front", label: "Frente" },
  { id: "side", label: "Lateral" }, { id: "rear", label: "Traseira" },
  { id: "details", label: "Detalhes" },
];
const finishes: { id: HeroFinish; label: string; color: string }[] = [
  { id: "carmine", label: "Carmim metálico", color: "#772531" },
  { id: "graphite", label: "Grafite", color: "#424948" },
  { id: "pearl", label: "Pérola", color: "#c9c8bd" },
];

export default function DealershipHero({ vehicleCount, whatsappHref }: { vehicleCount: number; whatsappHref: string | null }) {
  const [view, setView] = useState<HeroView>("3-4");
  const [finish, setFinish] = useState<HeroFinish>("carmine");

  return (
    <section id="inicio" className="relative isolate min-h-[830px] overflow-hidden bg-[#11130f] pb-10 pt-[88px] text-[#f5f4ef] md:min-h-[820px] lg:min-h-[900px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_46%,rgba(145,154,129,.18),transparent_38%),linear-gradient(112deg,#11130f_0%,#1c1e18_58%,#11130f_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "linear-gradient(rgba(235,230,213,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(235,230,213,.1) 1px,transparent 1px)", backgroundSize: "88px 88px", maskImage: "linear-gradient(to right,transparent,black 55%,transparent)" }} />
      <div className="relative mx-auto grid min-h-[730px] max-w-[1500px] content-center gap-2 px-5 sm:px-8 lg:grid-cols-[minmax(360px,.78fr)_minmax(0,1.22fr)] lg:gap-5 lg:px-12">
        <div className="order-2 z-10 pb-8 pt-3 lg:order-1 lg:py-16">
          <p className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#c9f169] sm:text-[10px]"><span className="h-px w-8 bg-[#c9f169]" />MOTORA · MOBILIDADE PREMIUM</p>
          <h1 className="mt-5 max-w-[690px] text-[42px] font-semibold leading-[1.01] tracking-[-0.04em] sm:text-6xl lg:text-[68px]">A próxima conquista começa com <span className="text-[#c9f169]">confiança.</span></h1>
          <p className="mt-5 max-w-[510px] text-sm leading-7 text-white/65 sm:text-base">Uma curadoria de carros e motos para quem valoriza procedência, atendimento próximo e decisões bem informadas.</p>
          <div className="mt-7 flex items-center gap-3 border-y border-white/10 py-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60"><ShieldCheck size={17} className="shrink-0 text-[#c9f169]" /><span>Transparência em cada detalhe</span><span className="ml-auto tabular-nums text-white/35">{vehicleCount} no estoque</span></div>
          <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Link href="/veiculos" className="inline-flex min-h-12 items-center justify-between gap-3 bg-[#c9f169] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#171914] transition hover:bg-[#e3f4bb] sm:col-span-2 sm:px-5 sm:text-[11px]">Conheça nosso estoque <ArrowRight size={16} /></Link>
            <Link href="/veiculos" className="inline-flex min-h-11 items-center justify-between gap-2 border border-white/20 px-3 text-[9px] font-semibold uppercase tracking-[0.035em] text-white/80 transition hover:border-[#c9f169] hover:text-white sm:px-4 sm:text-[10px]">Encontre seu próximo veículo <ArrowUpRight size={14} /></Link>
            <a href="#financiamento" className="inline-flex min-h-11 items-center justify-between gap-2 border border-white/20 px-3 text-[9px] font-semibold uppercase tracking-[0.035em] text-white/80 transition hover:border-[#c9f169] hover:text-white sm:px-4 sm:text-[10px]">Simule seu financiamento <ArrowDown size={14} /></a>
            {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-between gap-2 border border-white/20 px-3 text-[9px] font-semibold uppercase tracking-[0.04em] text-white/80 transition hover:border-[#c9f169] hover:text-white sm:col-span-2 sm:px-4 sm:text-[10px]"><span className="inline-flex items-center gap-2"><MessageCircle size={15} />Fale com um vendedor</span><ArrowUpRight size={14} /></a> : <span aria-disabled="true" title="Configure o WhatsApp oficial da concessionária" className="inline-flex min-h-11 cursor-not-allowed items-center justify-between gap-2 border border-white/10 px-3 text-[9px] font-semibold uppercase tracking-[0.04em] text-white/35 sm:col-span-2 sm:px-4 sm:text-[10px]"><span className="inline-flex items-center gap-2"><MessageCircle size={15} />WhatsApp não configurado</span><ArrowUpRight size={14} /></span>}
          </div>
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <div className="relative h-[310px] overflow-hidden border-y border-white/[0.08] bg-[#181a15] sm:h-[420px] md:h-[510px] lg:h-[625px] lg:border">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_44%,rgba(206,193,165,.1),transparent_52%),linear-gradient(165deg,rgba(255,255,255,.035),transparent_44%)]" />
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/55 sm:left-6 sm:top-6 sm:text-[9px]"><span className="h-1.5 w-1.5 bg-[#c9f169]" />Modelo institucional · fora do estoque</div>
            <VehicleCanvas view={view} finish={finish} className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-between gap-2 border-t border-white/10 bg-[#11130f]/90 px-3 py-2.5 backdrop-blur-md sm:flex-row sm:items-center sm:px-5 sm:py-3">
              <div className="flex items-center gap-1" role="group" aria-label="Ângulos do modelo institucional">{views.map((option) => <button key={option.id} type="button" onClick={() => setView(option.id)} aria-pressed={view === option.id} className={`min-h-8 px-2.5 text-[9px] font-semibold uppercase tracking-[0.05em] transition sm:px-3 ${view === option.id ? "bg-[#c9f169] text-[#171914]" : "text-white/55 hover:text-white"}`}>{option.label}</button>)}</div>
              <div className="flex items-center gap-2.5"><span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40">Acabamento</span>{finishes.map((option) => <button key={option.id} type="button" onClick={() => setFinish(option.id)} aria-label={option.label} aria-pressed={finish === option.id} title={option.label} className={`grid h-6 w-6 place-items-center border transition ${finish === option.id ? "border-white" : "border-white/20 hover:border-white/65"}`}><span className="h-3.5 w-3.5" style={{ backgroundColor: option.color }} /></button>)}</div>
            </div>
          </div>
          <p className="mt-2 flex items-center justify-between text-[8px] font-medium uppercase tracking-[0.1em] text-white/35 sm:mt-3 sm:text-[9px]"><span className="inline-flex items-center gap-1.5"><Rotate3D size={13} />Arraste para inspecionar</span><span>Modelo Khronos · CC BY 4.0</span></p>
        </div>
      </div>
    </section>
  );
}