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
    imageUrl: '/images/banner-principal.png',
    alt: 'Bem-vindo ao melhor sushi de Curitiba! 20% OFF na primeira compra. Cupom: BEMVINDO20',
    link: '/products?coupon=BEMVINDO20',
  },
];

export const HeroCarousel = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <Link href={banner.link} className="block">
              <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={banner.imageUrl}
                  alt={banner.alt}
                  layout="fill"
                  objectFit="cover"
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