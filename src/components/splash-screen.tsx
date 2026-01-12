"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import useSound from 'use-sound';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  // Atualizando o caminho do som para o novo arquivo
  const [play] = useSound('/sounds/sword-slice-2.mp3', { volume: 0.5 });

  useEffect(() => {
    // 1. Toca o som imediatamente
    play();

    // 2. Inicia a animação de fade-out e movimento após um pequeno atraso
    const animationTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 1000); // 1 segundo para a logo aparecer

    // 3. Esconde o componente completamente após a duração da animação (ex: 1.5s)
    const hideTimeout = setTimeout(() => {
      onFinish();
    }, 2500); // 2.5 segundos total (1s visível + 1.5s de transição)

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(hideTimeout);
    };
  }, [onFinish, play]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] flex items-center justify-center bg-background transition-all duration-1500 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      )}
    >
      <div
        className={cn(
          "relative h-24 w-24 transition-all duration-1500 ease-in-out",
          isVisible ? "scale-100" : "scale-150" // Aumenta a escala enquanto some
        )}
      >
        <Image
          src="/bendita-logo.png"
          alt="Bendita Marmita Logo"
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
    </div>
  );
};