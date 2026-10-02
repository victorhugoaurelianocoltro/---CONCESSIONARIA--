"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CalendarDays, MessageCircle } from "lucide-react";
import type { Vehicle } from "@/lib/dealership-db";
import { dealershipWhatsAppLink, vehicleInterestMessage } from "@/lib/dealership-whatsapp";

export default function VehicleLeadForms({ vehicle }: { vehicle: Vehicle }) {
  const [message, setMessage] = useState("");
  const vehicleName = `${vehicle.make} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ""}`;
  const contactLink = dealershipWhatsAppLink(vehicleInterestMessage(vehicleName));
  const canBookTestDrive = vehicle.status === "disponivel";

  function requestTestDrive(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") || "").replace(/\D/g, "");
    if (phone.length < 10) { setMessage("Informe um WhatsApp com DDD."); return; }
    const values = [
      `Olá! Gostaria de solicitar um test drive do ${vehicleName}.`,
      `Nome: ${formData.get("name")}`,
      `Meu WhatsApp: ${formData.get("phone")}`,
      `Data desejada: ${formData.get("date")}`,
      `Horário desejado: ${formData.get("time")}`,
      `Observação: ${String(formData.get("notes") || "Não informada")}`,
    ];
    const href = dealershipWhatsAppLink(values.join("\n"));
    if (!href) { setMessage("O WhatsApp da concessionária ainda não foi configurado."); return; }
    window.open(href, "_blank", "noopener,noreferrer");
    setMessage("Sua mensagem foi preparada no WhatsApp. Envie para confirmar o agendamento.");
  }

  return (
    <div className="grid gap-8 border-t border-[#dedfd7] pt-8 md:grid-cols-2">
      <section><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7b806f]">Atendimento direto</p><h2 className="mt-2 text-xl font-semibold">Fale com um vendedor</h2><p className="mt-2 text-sm leading-6 text-[#73776d]">Tire dúvidas sobre disponibilidade e condições diretamente com a equipe.</p>
        {contactLink ? <a href={contactLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c9f169] px-5 text-sm font-bold text-[#171914] transition hover:bg-[#d9f994]"><MessageCircle size={17} />Falar com vendedor</a> : <p className="mt-4 text-xs leading-5 text-[#85887d]">Configure NEXT_PUBLIC_DEALERSHIP_WHATSAPP para habilitar o contato.</p>}
      </section>
      <section><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7b806f]">Conheça de perto</p><h2 className="mt-2 text-xl font-semibold">Solicite um test drive</h2>
        {!canBookTestDrive ? <p className="mt-3 text-sm leading-6 text-[#73776d]">{vehicle.status === "reservado" ? "Este veículo está reservado. Fale com a equipe para consultar disponibilidade." : "Este veículo foi vendido e não está disponível para test drive."}</p> : <form onSubmit={requestTestDrive} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-[11px] font-semibold text-[#70746a]">Seu nome<input name="name" required maxLength={120} className="mt-1 h-11 w-full border border-[#d7d9cf] bg-white px-3 text-sm outline-none focus:border-[#748054]" /></label>
          <label className="block text-[11px] font-semibold text-[#70746a]">WhatsApp<input name="phone" required type="tel" autoComplete="tel" maxLength={22} placeholder="(00) 00000-0000" className="mt-1 h-11 w-full border border-[#d7d9cf] bg-white px-3 text-sm outline-none focus:border-[#748054]" /></label>
          <label className="block text-[11px] font-semibold text-[#70746a]">Data desejada<input name="date" required type="date" min={new Date().toISOString().slice(0, 10)} className="mt-1 h-11 w-full border border-[#d7d9cf] bg-white px-3 text-sm outline-none focus:border-[#748054]" /></label>
          <label className="block text-[11px] font-semibold text-[#70746a]">Horário desejado<input name="time" required type="time" className="mt-1 h-11 w-full border border-[#d7d9cf] bg-white px-3 text-sm outline-none focus:border-[#748054]" /></label>
          <label className="block text-[11px] font-semibold text-[#70746a] sm:col-span-2">Observação, se quiser<textarea name="notes" rows={2} maxLength={500} className="mt-1 w-full resize-y border border-[#d7d9cf] bg-white px-3 py-2 text-sm outline-none focus:border-[#748054]" /></label>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#191a16] px-5 text-sm font-semibold text-white transition hover:bg-[#3d4036] sm:col-span-2"><CalendarDays size={17} />Solicitar test drive<ArrowUpRight size={15} /></button>
        </form>}
        {message && <p role="status" className="mt-3 text-xs leading-5 text-[#4f6733]">{message}</p>}
      </section>
    </div>
  );
}