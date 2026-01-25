"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// @ts-expect-error - use-sound does not export types correctly in some Next.js environments
import useSound from 'use-sound';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [play] = useSound('/sounds/sword-slice-2.mp3', { volume: 0.5 });

  useEffect(() => {
    play();
    const animationTimeout = setTimeout(() => setIsVisible(false), 1500);
    const hideTimeout = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(hideTimeout);
    };
  }, [onFinish, play]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] flex items-center justify-center bg-[#005A8D] transition-all duration-1500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: isVisible ? 1 : 1.5, rotate: 0 }}
        transition={{ duration: 1 }}
        className="relative h-48 w-48"
      >
        <Image
          src="/images/logo_plantao_smash.png"
          alt="Plantão do Smash"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
};