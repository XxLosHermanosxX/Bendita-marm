"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BenditaLogoProps {
  className?: string;
}

export const BenditaLogo = ({ className }: BenditaLogoProps) => {
  // Definindo um tamanho base que respeita a proporção da logo (mais larga que alta)
  return (
    <div className={cn("relative h-16 w-40", className)}>
      <Image
        src="/bendita-logo.png"
        alt="Bendita Marmita Logo"
        layout="fill"
        objectFit="contain"
        priority
      />
    </div>
  );
};