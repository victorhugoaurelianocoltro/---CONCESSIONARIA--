"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MagneticButton from "@/components/MagneticButton";
import Link from "next/link";

export default function GetStartedPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    data.formType = "b2b_services";

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error('Submission failed');
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-general relative selection:bg-accent-electric selection:text-white">
      <Navbar />
      
      {/* Ambient background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-electric/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <main className="relative z-10 pt-36 pb-32 container mx-auto px-6 max-w-4xl min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {!isSuccess ? (
            <motion.div
              key="services-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-2 rounded-full bg-accent-electric/10 border border-accent-electric/20 px-4 py-1.5 mb-6 w-fit">
                <Zap size={14} className="text-accent-electric" />
                <span className="text-xs font-semibold text-accent-electric uppercase tracking-wider">
                  B2B AI Automation Audit
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-medium mb-4 leading-tight">
                Calculate Your Automation ROI &amp; Book Consultation
              </h1>
              <p className="text-white/60 mb-10 text-base md:text-lg max-w-2xl leading-relaxed">
                Tell us about your business operations, existing CRM, and lead flow bottlenecks. Our AI strategy team will prepare a custom deployment blueprint within 2 business hours.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 pb-8 border-b border-white/10">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <Clock size={18} className="text-accent-electric shrink-0" />
                  <span>14-Day System Deployment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <Zap size={18} className="text-accent-electric shrink-0" />
                  <span>Sub-800ms Voice AI Latency</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <ShieldCheck size={18} className="text-accent-electric shrink-0" />
                  <span>HIPAA &amp; SOC-2 Compliant</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Full Name *</label>
                    <input required name="name" type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent-electric transition-colors" placeholder="Kaushal Tiwari" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Company Name *</label>
                    <input required name="company" type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent-electric transition-colors" placeholder="Acme Real Estate Developers" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Work Email Address *</label>
                    <input required name="email" type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent-electric transition-colors" placeholder="kaushal@acmerealty.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Phone Number *</label>
                    <input required name="phone" type="tel" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent-electric transition-colors" placeholder="+91 90815 53331" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Primary Service / System Needed *</label>
                    <select 
                      required 
                      name="service" 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent-electric transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select a system</option>
                      <option value="AI Voice Receptionist (Retell/Twilio)">AI Voice Receptionist (Sub-800ms)</option>
                      <option value="Real Estate Lead Qualification Engine">Real Estate Lead Qualification Engine</option>
                      <option value="Custom CRM & ERP Automation">Custom CRM &amp; ERP Automation</option>
                      <option value="Custom Web & Mobile App Platform">Custom Web &amp; Mobile App Platform</option>
                      <option value="Enterprise AI Consulting & Blueprint">Enterprise AI Consulting &amp; Blueprint</option>
                      <option value="Custom System / Other">Custom System / Other (Specify below)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Estimated Monthly Project Budget *</label>
                    <select 
                      required 
                      name="budget" 
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent-electric transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select budget range</option>
                      <option value="₹50k - ₹1.5L">₹50k - ₹1.5L (Starter Systems)</option>
                      <option value="₹1.5L - ₹5L">₹1.5L - ₹5L (Growth Infrastructure)</option>
                      <option value="₹5L+">₹5L+ (Enterprise Custom Scale)</option>
                      <option value="Custom Budget / Flexible">Custom Budget / Flexible (To be discussed)</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Custom Field Inputs */}
                {(selectedService === "Custom System / Other" || selectedBudget === "Custom Budget / Flexible") && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-accent-electric/5 p-4 rounded-2xl border border-accent-electric/20"
                  >
                    {selectedService === "Custom System / Other" && (
                      <div className="space-y-2 col-span-1">
                        <label className="text-sm font-medium text-accent-electric">Custom System Details *</label>
                        <input 
                          required 
                          name="customServiceDetails" 
                          type="text" 
                          className="w-full bg-black border border-accent-electric/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-electric" 
                          placeholder="e.g. AI WhatsApp bot + POS integration" 
                        />
                      </div>
                    )}
                    {selectedBudget === "Custom Budget / Flexible" && (
                      <div className="space-y-2 col-span-1">
                        <label className="text-sm font-medium text-accent-electric">Custom Budget Details *</label>
                        <input 
                          required 
                          name="customBudgetDetails" 
                          type="text" 
                          className="w-full bg-black border border-accent-electric/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-electric" 
                          placeholder="e.g. Milestone based / Equity / Retainer" 
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Operational Pain Points &amp; Goals</label>
                  <textarea name="requirements" rows={4} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent-electric transition-colors resize-none" placeholder="Describe your current lead volume, existing CRM (Salesforce/HubSpot/Zoho), and key automation goals..."></textarea>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-accent-electric text-black font-semibold text-base hover:bg-white transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(78,163,224,0.4)]"
                >
                  {isSubmitting ? "Generating AI Blueprint..." : "Request ROI Audit & Consultation"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="w-24 h-24 bg-accent-electric/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-electric/30">
                <CheckCircle2 size={44} className="text-accent-electric" />
              </div>
              <h2 className="text-4xl font-medium mb-4">Request Received</h2>
              <p className="text-white/60 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                Thank you! Our AI Systems Architecture team will review your business requirements and connect with you within 2 business hours.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <MagneticButton>
                  <Link 
                    href="/"
                    className="relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden group bg-white/20 transition-all hover:bg-white/40 w-full sm:w-auto"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-white opacity-60 blur-[3px] group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white rounded-full px-[40px] py-[16px] h-full w-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                      <span className="text-black text-[16px] font-medium tracking-wide">Return Home</span>
                    </div>
                  </Link>
                </MagneticButton>
                
                <MagneticButton>
                  <a 
                    href="https://wa.me/919081553331"
                    target="_blank"
                    rel="noreferrer"
                    className="px-[40px] py-[16px] rounded-full border border-white/20 text-white font-medium text-[16px] hover:bg-white/10 transition-colors w-full sm:w-auto active:scale-95 bg-black/50 backdrop-blur-md"
                  >
                    Direct WhatsApp Support
                  </a>
                </MagneticButton>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
