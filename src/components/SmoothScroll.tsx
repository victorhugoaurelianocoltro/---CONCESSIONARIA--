"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ultra-smooth exponential easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    // Connect Lenis to ScrollTrigger and update Scroll Progress Bar
    const progressBar = document.querySelector(".scroll-progress-bar");
    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      if (progressBar) {
        const scrollPercent = e.scroll / (e.limit || 1);
        gsap.set(progressBar, { scaleX: scrollPercent });
      }
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Dynamic Scroll Skew effect for elements with class 'scroll-skew'
    const skewElements = document.querySelectorAll(".scroll-skew");
    let skewTrigger: ScrollTrigger | null = null;
    
    if (skewElements.length > 0) {
      const proxy = { skew: 0 };
      const skewSetters = Array.from(skewElements).map(el => gsap.quickSetter(el, "skewY", "deg"));
      const clamp = gsap.utils.clamp(-6, 6); // clamp between -6 and +6 degrees

      skewTrigger = ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -400);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
              onUpdate: () => {
                skewSetters.forEach(setter => setter(proxy.skew));
              }
            });
          }
        }
      });
    }

    // Scroll reveal text masking
    const revealTexts = document.querySelectorAll(".scroll-reveal-text");
    const revealTriggers: ScrollTrigger[] = [];

    revealTexts.forEach(el => {
      const text = el.textContent || "";
      const words = text.split(" ");
      
      el.innerHTML = "";
      words.forEach((word) => {
        const wrapper = document.createElement("span");
        wrapper.className = "inline-block overflow-hidden mr-[0.22em] pb-[0.05em] align-bottom";
        
        const inner = document.createElement("span");
        inner.className = "inline-block translate-y-[110%] will-change-transform";
        inner.textContent = word;
        
        wrapper.appendChild(inner);
        el.appendChild(wrapper);
      });

      const innerSpans = el.querySelectorAll("span > span");
      
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(innerSpans, {
            y: "0%",
            duration: 0.8,
            stagger: 0.02,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
      revealTriggers.push(trigger);
    });

    // Image reveal animation using clip-path and scale
    const revealImages = document.querySelectorAll(".img-reveal");
    revealImages.forEach(el => {
      // Set initial styles
      gsap.set(el, { 
        clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        scale: 1.15
      });
      
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(el, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            scale: 1,
            duration: 1.2,
            ease: "power4.inOut",
            overwrite: "auto"
          });
        }
      });
      revealTriggers.push(trigger);
    });

    // Parallax scrolling elements
    const parallaxElements = document.querySelectorAll(".scroll-parallax");
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-parallax-speed") || "10"); // percent offset
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress; // 0 to 1
          const yOffset = (progress - 0.5) * 2 * speed;
          gsap.set(el, { yPercent: yOffset, overwrite: "auto" });
        }
      });
      revealTriggers.push(trigger);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
      if (skewTrigger) {
        skewTrigger.kill();
      }
      revealTriggers.forEach(t => t.kill());
    };
  }, []);

  return null;
}
