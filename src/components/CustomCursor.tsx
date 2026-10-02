"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const touchDevice = typeof window === "undefined"
  || window.matchMedia("(max-width: 1023px)").matches
  || "ontouchstart" in window
  || (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState("");
  const markerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const markerX = useRef<((value: number) => void) | null>(null);
  const markerY = useRef<((value: number) => void) | null>(null);
  const labelX = useRef<((value: number) => void) | null>(null);
  const labelY = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    if (touchDevice || !markerRef.current || !labelRef.current) return;

    const marker = markerRef.current;
    const label = labelRef.current;
    gsap.set(marker, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(label, { xPercent: -50, yPercent: -50, width: 0, height: 30, autoAlpha: 0, scale: 0.9 });

    markerX.current = gsap.quickTo(marker, "x", { duration: 0.08, ease: "power3.out" });
    markerY.current = gsap.quickTo(marker, "y", { duration: 0.08, ease: "power3.out" });
    labelX.current = gsap.quickTo(label, "x", { duration: 0.25, ease: "power4.out" });
    labelY.current = gsap.quickTo(label, "y", { duration: 0.25, ease: "power4.out" });

    let hasStarted = false;
    const onMouseMove = (event: MouseEvent) => {
      markerX.current?.(event.clientX);
      markerY.current?.(event.clientY);
      labelX.current?.(event.clientX);
      labelY.current?.(event.clientY);
      if (!hasStarted) {
        hasStarted = true;
        gsap.to(marker, { autoAlpha: 1, duration: 0.15 });
      }
    };

    const onMouseEnterInteractive = () => {
      gsap.to(marker, { scale: 1.2, duration: 0.2, ease: "power2.out" });
      gsap.to(marker.querySelector("[data-cursor-core]"), { backgroundColor: "#f4f1e9", duration: 0.2 });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(marker, { scale: 1, duration: 0.22, ease: "power2.out" });
      gsap.to(marker.querySelector("[data-cursor-core]"), { backgroundColor: "transparent", duration: 0.2 });
    };

    const onMouseEnterBadge = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const text = target.getAttribute("data-cursor") || "VER DETALHES";
      setCursorText(text);
      gsap.to(marker, { scale: 0.65, autoAlpha: 0.35, duration: 0.18, ease: "power2.out" });
      gsap.to(label, { width: Math.min(190, Math.max(94, text.length * 7 + 28)), autoAlpha: 1, scale: 1, duration: 0.22, ease: "power2.out" });
      gsap.to(label.querySelector("[data-cursor-label]"), { autoAlpha: 1, duration: 0.16, delay: 0.04 });
    };

    const onMouseLeaveBadge = () => {
      setCursorText("");
      gsap.to(marker, { scale: 1, autoAlpha: 1, duration: 0.2, ease: "power2.out" });
      gsap.to(label, { width: 0, autoAlpha: 0, scale: 0.9, duration: 0.18, ease: "power2.in" });
      gsap.to(label.querySelector("[data-cursor-label]"), { autoAlpha: 0, duration: 0.1 });
    };

    const attachHoverEvents = () => {
      const interactives = document.querySelectorAll("a, button, input, textarea, select, [role='button'], .interactive-hover");
      interactives.forEach((element) => {
        element.removeEventListener("mouseenter", onMouseEnterInteractive);
        element.removeEventListener("mouseleave", onMouseLeaveInteractive);
        element.addEventListener("mouseenter", onMouseEnterInteractive);
        element.addEventListener("mouseleave", onMouseLeaveInteractive);
      });

      document.querySelectorAll("[data-cursor]").forEach((element) => {
        element.removeEventListener("mouseenter", onMouseEnterBadge);
        element.removeEventListener("mouseleave", onMouseLeaveBadge);
        element.addEventListener("mouseenter", onMouseEnterBadge);
        element.addEventListener("mouseleave", onMouseLeaveBadge);
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    attachHoverEvents();
    const observer = new MutationObserver(attachHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      document.querySelectorAll("a, button, input, textarea, select, [role='button'], .interactive-hover").forEach((element) => {
        element.removeEventListener("mouseenter", onMouseEnterInteractive);
        element.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
      document.querySelectorAll("[data-cursor]").forEach((element) => {
        element.removeEventListener("mouseenter", onMouseEnterBadge);
        element.removeEventListener("mouseleave", onMouseLeaveBadge);
      });
      gsap.killTweensOf([marker, label]);
    };
  }, []);

  if (touchDevice) return null;

  return (
    <>
      <div ref={markerRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[99999] h-8 w-8 mix-blend-difference">
        <span className="absolute left-0 top-0 h-[7px] w-[1px] bg-[#c9f169]" />
        <span className="absolute left-0 top-0 h-[1px] w-[7px] bg-[#c9f169]" />
        <span className="absolute right-0 top-0 h-[7px] w-[1px] bg-[#c9f169]" />
        <span className="absolute right-0 top-0 h-[1px] w-[7px] bg-[#c9f169]" />
        <span className="absolute bottom-0 left-0 h-[7px] w-[1px] bg-[#c9f169]" />
        <span className="absolute bottom-0 left-0 h-[1px] w-[7px] bg-[#c9f169]" />
        <span className="absolute bottom-0 right-0 h-[7px] w-[1px] bg-[#c9f169]" />
        <span className="absolute bottom-0 right-0 h-[1px] w-[7px] bg-[#c9f169]" />
        <span data-cursor-core className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#c9f169] bg-transparent" />
      </div>
      <div ref={labelRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[99998] flex items-center justify-center overflow-hidden border border-[#c9f169]/80 bg-[#151610]/95 px-3 mix-blend-difference [clip-path:polygon(0_0,calc(100%_-_7px)_0,100%_7px,100%_100%,0_100%)]">
        <span ref={cursorTextRef} data-cursor-label className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.12em] text-white opacity-0">{cursorText}</span>
      </div>
    </>
  );
}