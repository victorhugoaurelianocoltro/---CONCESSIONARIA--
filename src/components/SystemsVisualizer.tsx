"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ArrowRight, PhoneOff, PhoneCall, Database, Clock, Zap } from "lucide-react";

export default function SystemsVisualizer() {
  return (
    <section className="py-28 bg-[#020202] border-t border-b border-white/5 relative overflow-hidden">
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
              Systems Architecture Visualizer
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
            Legacy Manual Operations vs. ParvInfoSoft AI Engine
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            See how autonomous sub-800ms voice agents and n8n headless orchestration eliminate lead decay and scale sales velocity.
          </p>
        </motion.div>

        {/* Before vs After Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: The Legacy Chaos (BEFORE) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            className="bg-[#050505] border border-red-500/20 p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">The Legacy Process</h3>
                  <span className="text-red-400 text-xs font-medium">Slow, Manual &amp; Leaky</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 uppercase tracking-widest">
                High Lead Decay
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <PhoneOff size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white/90 font-medium text-sm mb-1">1. Missed Inbound Calls</h4>
                  <p className="text-white/50 text-xs">Callers go to voicemail after hours. 60% buy from the next competitor who answers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Clock size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white/90 font-medium text-sm mb-1">2. 4-to-12 Hour Response Lag</h4>
                  <p className="text-white/50 text-xs">Human reps manually review web forms hours later when the prospect is cold.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Database size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white/90 font-medium text-sm mb-1">3. Messy &amp; Incomplete CRM Records</h4>
                  <p className="text-white/50 text-xs">Reps forget to log buyer preferences, site-visit notes, or budget details into Salesforce.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-red-400 font-semibold">
              <span>Result: Loss of ₹4.5L+ every month</span>
              <span>Conversion: 3% - 5%</span>
            </div>
          </motion.div>

          {/* Right: The ParvInfoSoft Engine (AFTER) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            className="bg-accent-electric/5 border border-accent-electric/30 p-8 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(78,163,224,0.1)]"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-accent-electric/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-electric/10 border border-accent-electric/30 flex items-center justify-center text-accent-electric">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">ParvInfoSoft AI Engine</h3>
                  <span className="text-emerald-400 text-xs font-medium">Sub-800ms Autonomous Execution</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full border border-emerald-400/20 uppercase tracking-widest">
                Zero Lead Decay
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-accent-electric/20">
                <PhoneCall size={20} className="text-accent-electric shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">1. Instant Sub-800ms Voice Pickup</h4>
                  <p className="text-white/70 text-xs">AI Voice agent picks up 24/7/365 within 1 ring and answers complex buyer inquiries.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-accent-electric/20">
                <Zap size={20} className="text-accent-electric shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">2. Instant Cal.com Site-Visit Booking</h4>
                  <p className="text-white/70 text-xs">Agent verifies buyer budget, parses intent, and books site visits into rep calendar automatically.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-accent-electric/20">
                <Database size={20} className="text-accent-electric shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">3. Headless n8n CRM Direct Write</h4>
                  <p className="text-white/70 text-xs">Logs call transcripts, intent scores, and follow-up tasks into Salesforce / HubSpot instantly.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-accent-electric/20 flex items-center justify-between text-xs text-accent-electric font-semibold">
              <span>Result: Maximize Deal Revenue</span>
              <span>Conversion Lift: +40%</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
