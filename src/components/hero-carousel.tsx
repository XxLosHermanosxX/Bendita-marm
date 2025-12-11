"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

// Hardcoded banner data (using the uploaded image)
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
  return (
    <Carousel className="w-full">
      {/* Overriding default Shadcn carousel padding/margins for full width */}
      <CarouselContent className="-ml-0">
        {banners.map((banner) => (
          <CarouselItem key={banner.id} className="pl-0">
            <Link href={banner.link} className="block">
              {/* Usando aspect-video (16:9) para manter a proporção e garantir que a imagem não seja cortada */}
              <div className="relative w-full aspect-video">
                <Image
                  src={banner.imageUrl}
                  alt={banner.alt}
                  layout="fill"
                  objectFit="contain" 
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