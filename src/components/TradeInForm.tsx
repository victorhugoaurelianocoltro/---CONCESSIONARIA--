"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Repeat2 } from "lucide-react";
import { dealershipWhatsAppLink } from "@/lib/dealership-whatsapp";

export default function TradeInForm() {
  const [feedback, setFeedback] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").replace(/\D/g, "");
    if (phone.length < 10) { setFeedback("Informe um WhatsApp com DDD."); return; }
    const fields = [
      "Olá! Gostaria de avaliar meu veículo para uma possível troca.",
      `Marca: ${data.get("make")}`,
      `Modelo: ${data.get("model")}`,
      `Ano: ${data.get("year")}`,
      `Quilometragem: ${Number(data.get("mileage")).toLocaleString("pt-BR")} km`,
      `Estado de conservação: ${data.get("condition")}`,
      `Valor desejado: R$ ${Number(data.get("desiredPrice")).toLocaleString("pt-BR")}`,
      `Nome: ${data.get("name")}`,
      `WhatsApp: ${data.get("phone")}`,
    ];
    const link = dealershipWhatsAppLink(fields.join("\n"));
    if (!link) { setFeedback("O WhatsApp da concessionária ainda não foi configurado."); return; }
    window.open(link, "_blank", "noopener,noreferrer");
    setFeedback("Sua solicitação foi preparada no WhatsApp. Envie para conversar com a equipe.");
  }

  const inputClass = "mt-1 h-11 w-full border border-[#dedfd7] bg-white px-3 text-sm outline-none focus:border-[#748054]";
  const labelClass = "block text-[11px] font-semibold text-[#65695f]";

  return (
    <section id="troca" className="scroll-mt-8 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[0.75fr_1.25fr]">
      <div><span className="grid h-10 w-10 place-items-center border border-[#c9f169]/35 text-[#c9f169]"><Repeat2 size={19} /></span><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#c9f169]">Seu veículo pode fazer parte do próximo</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Considere uma troca.</h2><p className="mt-3 max-w-[350px] text-sm leading-6 text-white/55">Conte sobre seu veículo para iniciar uma conversa de avaliação com a equipe.</p></div>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>Marca<input required name="make" maxLength={100} className={inputClass} /></label>
        <label className={labelClass}>Modelo<input required name="model" maxLength={120} className={inputClass} /></label>
        <label className={labelClass}>Ano<input required name="year" type="number" min="1886" max={new Date().getFullYear() + 1} className={inputClass} /></label>
        <label className={labelClass}>Quilometragem<input required name="mileage" type="number" min="0" className={inputClass} /></label>
        <label className={labelClass}>Estado de conservação<select required name="condition" className={inputClass}><option value="">Selecione</option><option>Ótimo</option><option>Bom</option><option>Regular</option><option>Precisa de reparos</option></select></label>
        <label className={labelClass}>Valor desejado (R$)<input required name="desiredPrice" type="number" min="0" step="100" className={inputClass} /></label>
        <label className={labelClass}>Seu nome<input required name="name" maxLength={120} autoComplete="name" className={inputClass} /></label>
        <label className={labelClass}>Seu WhatsApp<input required name="phone" type="tel" autoComplete="tel" maxLength={22} placeholder="(00) 00000-0000" className={inputClass} /></label>
        <button className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 bg-[#c9f169] px-5 text-sm font-bold text-[#171914] transition hover:bg-[#d9f994] sm:col-span-2">Enviar dados pelo WhatsApp<ArrowUpRight size={16} /></button>
        {feedback && <p role="status" className="text-xs leading-5 text-[#c9d4ae] sm:col-span-2">{feedback}</p>}
      </form>
    </section>
  );
}