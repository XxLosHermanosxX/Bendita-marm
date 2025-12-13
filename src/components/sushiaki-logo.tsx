"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SushiakiLogoProps {
  className?: string;
}

export const SushiakiLogo = ({ className }: SushiakiLogoProps) => {
  // Definindo um tamanho base que respeita a proporção da logo (mais larga que alta)
  return (
    <div className={cn("relative h-16 w-40", className)}>
      <Image
        src="/images/logo_sushiaki_full.png"
        alt="Sushiaki Logo"
        layout="fill"
        objectFit="contain"
        priority
      />
    </div>
  );
};