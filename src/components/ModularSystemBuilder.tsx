"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Cpu, ShieldCheck, Clock, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import MagneticButton from "./MagneticButton";

const modulesList = [
  {
    id: "voice",
    title: "Autonomous AI Voice Receptionist",
    desc: "Sub-800ms latency, natural interruption handling, and live phone call intake.",
    days: 4,
    hoursSavedPerWeek: 15,
    defaultChecked: true,
  },
  {
    id: "n8n",
    title: "Headless n8n Workflow Engine",
    desc: "Custom backend orchestration connecting all API endpoints without monthly Zapier limits.",
    days: 3,
    hoursSavedPerWeek: 10,
    defaultChecked: true,
  },
  {
    id: "crm",
    title: "Real-Time CRM & Calendar Auto-Sync",
    desc: "Direct database read/write to Salesforce, HubSpot, Zoho, and Cal.com.",
    days: 3,
    hoursSavedPerWeek: 8,
    defaultChecked: true,
  },
  {
    id: "whatsapp",
    title: "WhatsApp API Automated Nurture",
    desc: "Instant text follow-ups, audio note dispatches, and PDF brochure distribution.",
    days: 2,
    hoursSavedPerWeek: 7,
    defaultChecked: false,
  },
  {
    id: "guardrails",
    title: "HIPAA & SOC-2 Data Privacy Masking",
    desc: "Enterprise logic layers and sensitive data anonymization before LLM processing.",
    days: 2,
    hoursSavedPerWeek: 5,
    defaultChecked: false,
  },
];

export default function ModularSystemBuilder() {
  const [selectedModules, setSelectedModules] = useState<string[]>(
    modulesList.filter((m) => m.defaultChecked).map((m) => m.id)
  );

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalDays = selectedModules.reduce((acc, id) => {
    const item = modulesList.find((m) => m.id === id);
    return acc + (item ? item.days : 0);
  }, 0);

  const totalHoursSaved = selectedModules.reduce((acc, id) => {
    const item = modulesList.find((m) => m.id === id);
    return acc + (item ? item.hoursSavedPerWeek : 0);
  }, 0);

  return (
    <section id="system-builder" className="py-28 bg-transparent relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-electric/10 border border-accent-electric/20 px-4 py-1.5 mb-6">
            <Cpu size={14} className="text-accent-electric" />
            <span className="text-xs font-semibold text-accent-electric uppercase tracking-widest">
              Interactive System Configurator
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
            Build Your Custom AI Architecture
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Select the exact operational modules your business requires. See live estimated deployment timelines and weekly time savings in real-time.
          </p>
        </motion.div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Module Toggles */}
          <div className="lg:col-span-7 space-y-4">
            {modulesList.map((m) => {
              const isChecked = selectedModules.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => toggleModule(m.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? "bg-accent-electric/10 border-accent-electric shadow-[0_0_20px_rgba(78,163,224,0.15)]"
                      : "bg-[#050505] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg shrink-0 mt-0.5 border flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-accent-electric border-accent-electric text-black"
                        : "border-white/30 bg-black/40"
                    }`}
                  >
                    {isChecked && <Check size={14} className="stroke-[3]" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-white font-medium text-lg">{m.title}</h4>
                      <span className="text-xs font-semibold text-accent-electric px-2.5 py-1 rounded-full bg-accent-electric/10 border border-accent-electric/20 whitespace-nowrap">
                        +{m.hoursSavedPerWeek}h / week saved
                      </span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Summary & ROI Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#050505] border border-white/15 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between h-fit">
              <div>
                <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-semibold mb-6">
                  <ShieldCheck size={16} className="text-accent-electric" />
                  Custom Architecture Summary
                </div>

                <div className="space-y-6 mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <Clock size={16} className="text-accent-electric" />
                      Estimated Deployment Time:
                    </span>
                    <span className="text-white font-semibold text-lg">{totalDays} Business Days</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <Zap size={16} className="text-accent-electric" />
                      Projected Time Saved:
                    </span>
                    <span className="text-accent-electric font-semibold text-xl">{totalHoursSaved} Hours / Week</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Selected Modules:</span>
                    <span className="text-white font-semibold text-sm">{selectedModules.length} of {modulesList.length} Active</span>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <span className="text-xs uppercase tracking-wider text-white/40 block">Included Architecture:</span>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li className="flex items-center gap-2">✓ Sub-800ms Retell Voice Infrastructure</li>
                    <li className="flex items-center gap-2">✓ Custom Prompting & Logic Guardrails</li>
                    <li className="flex items-center gap-2">✓ 100% IP Ownership & Team Handover</li>
                  </ul>
                </div>
              </div>

              <MagneticButton className="w-full">
                <Link
                  href="/get-started"
                  className="w-full py-4 rounded-2xl bg-accent-electric text-black font-semibold text-center text-sm hover:bg-white transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(78,163,224,0.3)]"
                >
                  Request Blueprint for This Build <ArrowRight size={16} />
                </Link>
              </MagneticButton>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
