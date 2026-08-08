"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";
import Link from "next/link";
import TextDecode from "./TextDecode";

export default function Hero() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const springX = useSpring(mousePosition.x, { stiffness: 50, damping: 20 });
  const springY = useSpring(mousePosition.y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col items-center overflow-hidden font-general">
      <motion.div 
        style={{ y: yParallax, opacity: opacityFade }}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden"
      >
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4" type="video/mp4" />
        </motion.video>
      </motion.div>

      {/* 50% Black Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>

      {/* Ambient moving orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0, -50, 0],
          y: [0, 30, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-electric/10 rounded-full blur-[100px] z-0 pointer-events-none"
      ></motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="relative z-20 flex flex-col items-center w-full max-w-7xl px-6 pt-[200px] md:pt-[280px] pb-[102px] my-auto"
      >
        
        {/* Trusted Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-2 rounded-[20px] bg-white/10 border border-white/20 px-4 py-2 mb-[32px]"
        >
          <div className="w-[6px] h-[6px] bg-accent-electric rounded-full animate-pulse"></div>
          <span className="text-[13px] font-medium tracking-wide">
            <span className="text-white/60">Enterprise B2B AI Agency | Established </span>
            <span className="text-white font-semibold">2024</span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-[36px] sm:text-[54px] md:text-[68px] font-semibold leading-[1.12] text-center max-w-[950px] tracking-tight"
          style={{
            backgroundImage: "linear-gradient(144.5deg, #FFFFFF 28%, rgba(255,255,255,0.7) 115%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent"
          }}
        >
          <TextDecode text="Convert Leads While Your Competitors Are Still Dialing." />
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-[24px] mb-[36px] text-[16px] md:text-[19px] font-normal text-white/80 max-w-[780px] text-center leading-relaxed"
        >
          Sub-800ms Voice AI &amp; Autonomous Sales Infrastructure for High-Volume Real Estate &amp; Healthcare Enterprises. We eliminate the 4-hour "Lead Decay" costing your firm lakhs every month.
        </motion.p>

        {/* Instant AI Voice Latency Test Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl bg-black/60 border border-white/15 backdrop-blur-xl rounded-2xl p-4 sm:p-5 mb-8 shadow-[0_0_40px_rgba(78,163,224,0.15)]"
        >
          <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider font-semibold text-accent-electric">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Agent Sandbox (&lt; 800ms Latency)
            </span>
            <span className="text-white/40">Zero Waiting</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              window.open("https://wa.me/919081553331?text=Hi%20ParvInfoSoft!%20Send%20me%20a%20live%20AI%20voice%20agent%20audio%20demo%20on%20WhatsApp", "_blank");
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input 
              type="tel"
              required
              placeholder="Enter phone number (+91 / +1...)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent-electric transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-accent-electric text-black font-semibold text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(78,163,224,0.4)] whitespace-nowrap active:scale-95"
            >
              ⚡ Hear Instant Demo
            </button>
          </form>

          <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
            <span>📞 Receives instant call / audio sample</span>
            <a 
              href="https://wa.me/919081553331?text=Hi%20ParvInfoSoft!%20Send%20me%20a%20live%20AI%20voice%20agent%20audio%20demo%20on%20WhatsApp"
              target="_blank"
              rel="noreferrer"
              className="text-accent-electric hover:underline font-medium"
            >
              Prefer WhatsApp Audio? Click Here →
            </a>
          </div>
        </motion.div>

        {/* Secondary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <Link 
              href="/get-started"
              className="relative inline-flex items-center justify-center p-[0.6px] rounded-full overflow-hidden group bg-white/20 hover:bg-white/40 transition-all active:scale-95"
            >
              <div className="relative bg-white rounded-full px-[32px] py-[13px] h-full w-full flex items-center justify-center">
                <span className="text-black text-[15px] font-semibold tracking-wide">Calculate Unchecked Lead Cost</span>
              </div>
            </Link>
          </MagneticButton>

          <MagneticButton>
            <Link 
              href="/#system-builder"
              className="px-[30px] py-[13px] rounded-full border border-white/20 text-white font-medium text-[15px] hover:bg-white/10 transition-colors active:scale-95 bg-black/40 backdrop-blur-md flex items-center justify-center"
            >
              Build Custom AI System
            </Link>
          </MagneticButton>
        </motion.div>

      </motion.div>
    </section>
  );
}
