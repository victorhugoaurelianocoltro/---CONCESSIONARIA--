"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const AIChatbot = dynamic(() => import("@/components/AIChatbot"), { ssr: false });
const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const InteractiveBackground = dynamic(() => import("@/components/InteractiveBackground"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });

export default function ClientExperience() {
  return (
    <>
      <InteractiveBackground />
      <Preloader />
      <CustomCursor />
      <SmoothScroll />
      <AIChatbot />
    </>
  );
}