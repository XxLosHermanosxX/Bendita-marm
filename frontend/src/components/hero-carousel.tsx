"use client";

import React from 'react';
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
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  link: string;
}

// Banners atualizados com as imagens enviadas
const banners: Banner[] = [
  {
    id: 1,
    // Imagem mais larga (3:1) para Desktop
    desktopUrl: 'https://customer-assets.emergentagent.com/job_github-link-2/artifacts/wj3dr1nd_IMG-20260113-WA0000%281%29.jpg',
    // Imagem mais alta (16:9) para Mobile
    mobileUrl: 'https://customer-assets.emergentagent.com/job_github-link-2/artifacts/t483yxmu_IMG-20260113-WA0002%281%29.jpg',
    alt: 'Bendita Marmita - As melhores marmitas de Curitiba! Bendita seja sua fome!',
    link: '/products',
  },
];

export const HeroCarousel = () => {
  // Configuração do Autoplay
  const autoplayOptions = {
    delay: 10000, // 10 segundos
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  return (
    <Carousel 
      className="w-full"
      opts={{ loop: true }}
      plugins={[Autoplay(autoplayOptions)]} 
    >
      <CarouselContent className="-ml-0">
        {banners.map((banner) => (
          <CarouselItem key={banner.id} className="pl-0">
            <Link href={banner.link} className="block w-full">
              {/* Container responsivo: Aspect ratio muda conforme o breakpoint */}
              <div className="relative w-full aspect-video md:aspect-[3/1]">
                
                {/* Imagem Mobile (Visível apenas em telas pequenas) */}
                <div className="block md:hidden w-full h-full relative">
                  <Image
                    src={banner.mobileUrl}
                    alt={banner.alt}
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100} // High quality
                    sizes="100vw"
                  />
                </div>

                {/* Imagem Desktop (Visível apenas em telas médias ou maiores) */}
                <div className="hidden md:block w-full h-full relative">
                  <Image
                    src={banner.desktopUrl}
                    alt={banner.alt}
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100} // High quality
                    sizes="100vw"
                  />
                </div>

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
