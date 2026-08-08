"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Can your AI agents integrate with our existing CRM (Salesforce, HubSpot, Zoho, LeadSquared)?",
    a: "Yes. We build custom headless integrations using n8n and REST/GraphQL APIs. Your AI agents will read, qualify, and update leads in real-time directly inside your existing CRM with zero data latency."
  },
  {
    q: "What is the response latency of your AI Voice Receptionists?",
    a: "Our AI Voice Receptionists achieve sub-800ms latency—indistinguishable from a human operator. They handle natural interruptions, complex real estate inquiries, and calendar booking seamlessly."
  },
  {
    q: "How secure is our company and customer data?",
    a: "We implement HIPAA, SOC-2, and GDPR-compliant data masking and encryption. Your sensitive customer records and proprietary business data remain fully protected and are never trained on public models."
  },
  {
    q: "How long does a custom AI automation project take to deploy?",
    a: "Standard AI Voice & CRM Automation systems are deployed within 7 to 14 business days. Enterprise-wide custom integrations take 3 to 4 weeks, including stress testing and team onboarding."
  },
  {
    q: "Do we need an in-house technical team to manage the system once built?",
    a: "No. We build fully autonomous, self-healing systems and provide ongoing SLA monitoring, maintenance, and 24/7 technical support so your team can focus on closing deals."
  },
  {
    q: "Can we test the AI voice agent before deploying to production?",
    a: "Absolutely. We set up a sandbox environment where you can place live phone calls to test intent parsing, interruption handling, and CRM logging before going live."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-transparent relative border-t border-white/5">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="mb-20 text-center"
        >
          <h2 className="text-[40px] md:text-[56px] font-medium text-white leading-[1.1] mb-6">
            Questions? We’ve Got Answers
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1 }}
              className="border border-white/10 bg-[#050505] rounded-xl overflow-hidden transition-colors hover:border-white/20"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === i ? 'text-accent-electric' : 'text-white'}`}>
                  {faq.q}
                </span>
                <span className="text-white/50">
                  {openIndex === i ? <Minus size={20} className="text-accent-electric" /> : <Plus size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-white/60 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
