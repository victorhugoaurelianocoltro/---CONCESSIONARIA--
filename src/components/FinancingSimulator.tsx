"use client";

import { useMemo, useState } from "react";
import { Calculator, MessageCircle } from "lucide-react";
import type { Vehicle } from "@/lib/dealership-db";
import { dealershipWhatsAppLink } from "@/lib/dealership-whatsapp";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

function monthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (principal <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}

export default function FinancingSimulator({ vehicle }: { vehicle: Vehicle }) {
  const vehiclePrice = vehicle.promotionalPrice ?? vehicle.price;
  const [downPayment, setDownPayment] = useState(Math.min(vehicle.suggestedDownPayment ?? 0, vehiclePrice));
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const terms = useMemo(() => Array.from(new Set([
    vehicle.minimumTerm,
    Math.round((vehicle.minimumTerm + vehicle.maximumTerm) / 2),
    vehicle.maximumTerm,
  ])).sort((first, second) => first - second), [vehicle.minimumTerm, vehicle.maximumTerm]);
  const financedAmount = Math.max(0, vehiclePrice - Math.min(downPayment, vehiclePrice));
  const possibilities = terms.map((months) => {
    const installment = monthlyPayment(financedAmount, vehicle.monthlyRate, months);
    const total = installment * months;
    return { months, installment, total, interest: Math.max(0, total - financedAmount) };
  });
  const message = `Olá! Tenho interesse no ${vehicle.make} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ""}. Fiz uma simulação com entrada de ${money.format(downPayment)} e parcela aproximada de ${money.format(possibilities[0]?.installment ?? 0)} em ${possibilities[0]?.months ?? vehicle.minimumTerm} meses. Gostaria de falar com um vendedor.`;
  const whatsappLink = dealershipWhatsAppLink(message);

  return (
    <section aria-labelledby="financing-title" className="border-t border-[#dedfd7] pt-8">
      <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8eddc] text-[#57683a]"><Calculator size={19} /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7b806f]">Estimativa de financiamento</p><h2 id="financing-title" className="mt-1 text-2xl font-semibold">Veja possibilidades para este veículo</h2></div></div>
      <label className="mt-7 block text-xs font-semibold text-[#64685e]">Valor de entrada
        <span className="mt-2 flex h-12 items-center border border-[#d7d9cf] bg-white px-3 focus-within:border-[#748054]"><span className="mr-2 text-sm text-[#85887d]">R$</span><input type="number" min="0" max={vehiclePrice} step="500" value={downPayment} onChange={(event) => setDownPayment(Math.min(vehiclePrice, Math.max(0, Number(event.target.value))))} className="w-full bg-transparent text-sm text-[#191a16] outline-none" /></span>
      </label>
      <label className="mt-4 block text-xs font-semibold text-[#64685e]">Limite de parcela mensal (opcional)
        <span className="mt-2 flex h-12 items-center border border-[#d7d9cf] bg-white px-3 focus-within:border-[#748054]"><span className="mr-2 text-sm text-[#85887d]">R$</span><input type="number" min="0" step="100" value={monthlyBudget || ""} onChange={(event) => setMonthlyBudget(Math.max(0, Number(event.target.value)))} placeholder="Quanto você consegue pagar" className="w-full bg-transparent text-sm text-[#191a16] outline-none" /></span>
      </label>
      <p className="mt-4 text-sm text-[#74786e]">Valor financiado: <strong className="font-semibold text-[#252720]">{money.format(financedAmount)}</strong></p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{possibilities.map(({ months, installment, total, interest }) => <article key={months} className="border border-[#dedfd7] bg-white p-4"><p className="text-xs font-semibold text-[#777a70]">{months} parcelas</p><p className="mt-2 text-lg font-bold">{money.format(installment)}<span className="text-xs font-medium text-[#777a70]">/mês</span></p><p className="mt-3 border-t border-[#ecece7] pt-3 text-[11px] leading-5 text-[#777a70]">Total estimado: {money.format(total)}<br />Juros estimados: {money.format(interest)}</p>{monthlyBudget > 0 && <p className={`mt-2 text-[11px] font-semibold ${installment <= monthlyBudget ? "text-[#4f6733]" : "text-[#9a4e3e]"}`}>{installment <= monthlyBudget ? "Dentro do limite informado" : "Acima do limite informado"}</p>}</article>)}</div>
      <p className="mt-4 text-[11px] leading-5 text-[#85887d]">Valores estimados com a taxa mensal de {(vehicle.monthlyRate * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}% informada pela concessionária. Não é proposta de crédito nem garantia de aprovação. Consulte condições e análise com um vendedor.</p>
      {whatsappLink ? <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c9f169] px-5 text-sm font-bold text-[#171914] transition hover:bg-[#d9f994]"><MessageCircle size={17} />Enviar simulação ao vendedor</a> : <p className="mt-5 border border-[#dedfd7] bg-white px-4 py-3 text-xs leading-5 text-[#777a70]">WhatsApp da concessionária não configurado. Configure NEXT_PUBLIC_DEALERSHIP_WHATSAPP para habilitar o contato.</p>}
    </section>
  );
}