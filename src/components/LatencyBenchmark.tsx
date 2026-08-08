"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

const rows = [
  {
    feature: "Response Latency",
    human: "3,000 - 5,000ms (Human Delay)",
    wrapper: "2,000 - 4,000ms (Awkward Pause)",
    parv: "< 800ms (Instant & Conversational)",
    parvHighlight: true,
  },
  {
    feature: "Interruption & Barging-In",
    human: "Manual Handoff",
    wrapper: "Fails / Overlaps Audio",
    parv: "Sub-500ms Natural Interruption",
    parvHighlight: true,
  },
  {
    feature: "Availability & SLA",
    human: "8 Hours / Day (Mon-Fri)",
    wrapper: "99.0% Uptime (Unmonitored)",
    parv: "24/7/365 (99.9% SLA Guarantee)",
    parvHighlight: true,
  },
  {
    feature: "CRM & Calendar Sync",
    human: "Manual End-of-Day Entry",
    wrapper: "Basic Zapier Webhook",
    parv: "Headless n8n Direct Database Write",
    parvHighlight: true,
  },
  {
    feature: "Data Privacy & Masking",
    human: "Zero Masking Guardrails",
    wrapper: "Public Model Exposure",
    parv: "HIPAA / SOC-2 Compliant Privacy",
    parvHighlight: true,
  },
];

export default function LatencyBenchmark() {
  return (
    <section className="py-28 bg-transparent relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-electric/10 border border-accent-electric/20 px-4 py-1.5 mb-6">
            <Zap size={14} className="text-accent-electric" />
            <span className="text-xs font-semibold text-accent-electric uppercase tracking-widest">
              Performance Benchmark
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
            Why Latency is the #1 Conversion Killer
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Slow voice bots feel fake and frustrate callers. Our sub-800ms Retell + Twilio engine responds faster than human reaction time.
          </p>
        </motion.div>

        {/* Benchmark Table */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-sm uppercase tracking-wider text-white/50">
                <th className="p-6">Architecture Spec</th>
                <th className="p-6 text-white/40">Human Receptionist</th>
                <th className="p-6 text-white/40">Standard GPT Wrapper</th>
                <th className="p-6 bg-accent-electric/10 text-accent-electric font-semibold border-l border-r border-accent-electric/20">
                  ParvInfoSoft Engine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm md:text-base">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 font-medium text-white/90">{row.feature}</td>
                  <td className="p-6 text-white/50">{row.human}</td>
                  <td className="p-6 text-white/50">{row.wrapper}</td>
                  <td className="p-6 bg-accent-electric/5 border-l border-r border-accent-electric/20 font-semibold text-white">
                    <span className="inline-flex items-center gap-2 text-accent-electric">
                      <Check size={16} />
                      {row.parv}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
