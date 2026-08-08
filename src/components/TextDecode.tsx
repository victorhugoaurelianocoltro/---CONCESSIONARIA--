"use client";

import React, { useEffect, useState } from "react";

export default function TextDecode({ text, className = "" }: { text: string, className?: string }) {
  // Start with full text so HTML renders text instantly for SEO & immediate paint
  const [displayText, setDisplayText] = useState(text);
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"; // Using uniform width characters to prevent layout jitter

  useEffect(() => {
    let iteration = 0;
    
    const interval = setInterval(() => {
      setDisplayText(
        text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          if (letter === " " || letter === "\n") return letter;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 2; // Controls the speed of the decode
    }, 20); // 20ms is buttery smooth (50fps)
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
