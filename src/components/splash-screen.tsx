"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { IMAGES } from '@/config/images';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const hasPlayed = useRef(false);

  useEffect(() => {
    // Só executa uma vez
    if (hasPlayed.current) return;
    hasPlayed.current = true;

    const animationTimeout = setTimeout(() => setIsVisible(false), 1500);
    const hideTimeout = setTimeout(() => onFinish(), 2500);
    
    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(hideTimeout);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] flex items-center justify-center bg-[#005A8D] transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-48 w-48"
      >
        <Image
          src={IMAGES.logo}
          alt="Plantão do Smash"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </motion.div>
    </div>
  );
};