"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Banner {
  id: number;
  imageUrl: string;
  alt: string;
  link: string;
}

// Hardcoded banner data
const banners: Banner[] = [
  {
    id: 1,
    imageUrl: '/images/banner-1.png',
    alt: 'Bem-vindo ao melhor sushi de Curitiba! 20% OFF na primeira compra. Cupom: BEMVINDO20',
    link: '/products?coupon=BEMVINDO20',
  },
  {
    id: 2,
    imageUrl: '/images/banner-2.png',
    alt: 'Combo Família 80 Peças por R$49,90. Cupom: BEMVINDO49',
    link: '/products?coupon=BEMVINDO49',
  },
];

export const HeroCarousel = () => {
  // Configuração do Autoplay
  const autoplayOptions = {
    delay: 10000, // 10 segundos
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay(autoplayOptions),
  ]);

  // O componente Carousel do Shadcn já usa o useEmblaCarousel internamente,
  // mas precisamos garantir que o Autoplay seja aplicado.
  // Vamos usar a estrutura padrão do Shadcn e injetar o plugin Autoplay.

  return (
    <Carousel 
      className="w-full"
      opts={{ loop: true }}
      plugins={[Autoplay(autoplayOptions)]} // Injetando o plugin Autoplay
    >
      {/* Overriding default Shadcn carousel padding/margins for full width */}
      <CarouselContent className="-ml-0">
        {banners.map((banner) => (
          <CarouselItem key={banner.id} className="pl-0">
            <Link href={banner.link} className="block">
              {/* Ajustando a proporção: 16:9 no mobile, 3:1 no desktop */}
              <div className="relative w-full aspect-video md:aspect-[3/1]">
                <Image
                  src={banner.imageUrl}
                  alt={banner.alt}
                  layout="fill"
                  objectFit="cover" // Usando cover para preencher o novo aspect-ratio
                  className="object-center"
                  priority
                />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Show navigation only if there is more than one banner */}
      {banners.length > 1 && (
        <>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </>
      )}
    </Carousel>
  );
};