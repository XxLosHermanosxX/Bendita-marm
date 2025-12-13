"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PARTNER_LOGOS = [
    { src: '/images/ifood-logo.png', alt: 'iFood', width: 80, height: 40 },
    { src: '/images/rappi-logo.png', alt: 'Rappi', width: 100, height: 40 },
    { src: '/images/99food-logo.png', alt: '99Food', width: 100, height: 40 },
    { src: '/images/pagseguro-logo.png', alt: 'PagSeguro', width: 120, height: 40 },
];

export const PartnerLogosScroll = () => {
  // Duplicamos os logos para criar o efeito de rolagem infinita
  const logos = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className="w-full overflow-hidden bg-secondary py-3 border-b border-border/50">
      <div className="flex animate-scroll-x">
        {logos.map((logo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 mx-4 flex items-center justify-center h-10" // Reduzindo mx-8 para mx-4
            style={{ width: logo.width }} // Define a largura para manter o espaçamento consistente
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="object-contain max-h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};