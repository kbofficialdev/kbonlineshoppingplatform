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
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentMessage = MESSAGES[currentMsgIndex];
    const typingSpeed = isDeleting ? 25 : 45;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentMessage.length) {
          setDisplayedText(currentMessage.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        } else {
          // Pause when complete sentence is typed
          setTimeout(() => setIsDeleting(true), 2800);
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
    <div className="bg-gradient-to-r from-[#0A0D18] via-[#12192C] to-[#0A0D18] text-white text-[11px] py-1.5 px-4 font-mono border-b border-[#1E2742] overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2">
        <span className="w-2 h-2 rounded-full bg-kb-blue animate-pulse shrink-0"></span>
        <div className="truncate tracking-wide font-medium">
          <span className="text-neutral-200">{displayedText}</span>
          <span className="inline-block w-1.5 h-3 bg-kb-blue ml-0.5 animate-pulse align-middle"></span>
        </div>
      </div>
    </div>
  );
}
