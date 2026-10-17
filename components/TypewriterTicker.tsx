"use client";

import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "✨ Welcome to KB FASHIONS • 20 Years of Generational Textile Heritage in Kalwaral, Telangana",
  "🥻 Authentic Handloom Gadwal Sarees with Pure Kuttu Zari Borders & Temple Pallu",
  "✂ Men's Unstitched Raymond & Arvind Fine Shirtings & Suitings — Cut by Meter",
  "🛍️ Small Village Enterprise • Direct Artisan Prices Without Middleman Markups",
  "✦ Try KB Shopmate AI • Voice Shopping in Telugu & English with Instant Garment Matches",
];

export default function TypewriterTicker() {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(MESSAGES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(MESSAGES[0].length);

  useEffect(() => {
    const currentMessage = MESSAGES[currentMsgIndex];
    const typingSpeed = isDeleting ? 20 : 35;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentMessage.length) {
          setDisplayedText(currentMessage.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        } else {
          // Pause when complete sentence is typed
          setTimeout(() => setIsDeleting(true), 3500);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedText(currentMessage.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setCurrentMsgIndex(prev => (prev + 1) % MESSAGES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentMsgIndex]);

  return (
    <div className="bg-gradient-to-r from-[#07090F] via-[#0E1528] to-[#07090F] text-white text-[11px] sm:text-xs h-8 sm:h-9 px-4 font-mono border-b border-[#1A233A] overflow-hidden flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2 w-full">
        <span className="w-2 h-2 rounded-full bg-kb-blue animate-pulse shrink-0"></span>
        <div className="truncate tracking-wide font-medium">
          <span className="text-neutral-100">{displayedText}</span>
          <span className="inline-block w-1.5 h-3.5 bg-kb-blue ml-1 animate-pulse align-middle"></span>
        </div>
      </div>
    </div>
  );
}

