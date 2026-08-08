"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, UserCheck, EyeOff, AlertTriangle } from "lucide-react";

const guardrails = [
  {
    icon: Lock,
    title: "Deterministic Logic Boundaries",
    desc: "Strict state machines prevent the AI from inventing unverified pricing, false property availability, or unauthorized promises.",
  },
  {
    icon: UserCheck,
    title: "Sub-500ms Human Transfer",
    desc: "If a caller expresses frustration or requests a live manager, the call transfers instantly to your human sales rep with zero drop.",
  },
  {
    icon: EyeOff,
    title: "HIPAA & SOC-2 Data Masking",
    desc: "Personal identification (PII), patient data, and credit details are masked locally before hitting public LLM endpoints.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Model Training Exposure",
    desc: "Your proprietary business database, client contracts, and conversation logs are never used to train public AI models.",
  },
];

export default function AIGuardrails() {
  return (
    <section className="py-28 bg-transparent relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 mb-6">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  Enterprise Security &amp; Safety
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-tight tracking-tight">
                The Guardrails: Why Our AI Will Never Go Rogue
              </h2>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
                The #1 fear for CMOs &amp; Real Estate founders is AI hallucination. We engineer rigid multi-layer logic barriers so your voice agent acts strictly within your approved brand protocols.
              </p>

              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4">
                <AlertTriangle size={24} className="text-red-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">Generic Bot Wrappers vs. ParvInfoSoft</h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Cheap wrappers rely on raw prompts that break under pressure. We build custom deterministic middleware (n8n + LangChain guardrails) to guarantee 100% compliance.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Cards */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {guardrails.map((g, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#050505] border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-electric/10 border border-accent-electric/20 flex items-center justify-center mb-4 text-accent-electric">
                  <g.icon size={20} />
                </div>
                <h4 className="text-white font-semibold text-base mb-2">{g.title}</h4>
                <p className="text-white/60 text-xs leading-relaxed">{g.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
