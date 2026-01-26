"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/config/images';

const PARTNER_LOGOS = [
    { src: IMAGES.parceiros.ifood, alt: 'iFood', width: 80, height: 40 },
    { src: IMAGES.parceiros.rappi, alt: 'Rappi', width: 100, height: 40 },
    { src: IMAGES.parceiros.food99, alt: '99Food', width: 100, height: 40 },
    { src: IMAGES.pagamentos.pagseguro, alt: 'PagSeguro', width: 120, height: 40 },
];

export const PartnerLogosScroll = () => {
  // Duplicamos os logos para criar o efeito de rolagem infinita
  const logos = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className="w-full overflow-hidden bg-secondary py-3 border-b border-border/50">
      {/* Adicionando min-w-max para garantir que o container flex seja largo o suficiente para todo o conteúdo duplicado */}
      <div className="flex animate-scroll-x min-w-max">
        {logos.map((logo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 mx-4 flex items-center justify-center h-10"
            style={{ width: logo.width }} 
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="object-contain max-h-full"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
};