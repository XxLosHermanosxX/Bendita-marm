"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/lib/utils';
import { X } from 'lucide-react';

// Hardcoded product details for the promotion (p30)
const PROMO_PRODUCT = {
  id: "p30",
  name: "Combinado Exclusivo 80 Peças",
  originalPrice: 79.90, // Novo preço original
  price: 49.90,
  imageUrl: "/images/combinado-80-pecas.png",
  link: "/products?category=Exclusivos%20do%20App",
};

const LOCAL_STORAGE_KEY = 'sushiaki_promo_seen';

export const PromoModal = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isMobile) {
      // Verifica se o usuário já viu o modal nesta sessão
      const hasSeenPromo = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!hasSeenPromo) {
        // Atraso para garantir que a tela de splash termine
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3000); 
        return () => clearTimeout(timer);
      }
    }
  }, [isMobile]);

  const handleClose = () => {
    setIsOpen(false);
    // Marca como visto no localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* Aumentando o arredondamento do DialogContent (rounded-[1.5rem]) */}
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-[1.5rem]">
        <DialogHeader className="sr-only">
          <DialogTitle>Promoção Exclusiva</DialogTitle>
        </DialogHeader>
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Image Banner */}
          <div className="relative w-full aspect-[4/3] bg-secondary">
            <Image
              src={PROMO_PRODUCT.imageUrl}
              alt={PROMO_PRODUCT.name}
              layout="fill"
              // Ajustando objectFit para 'contain' ou 'cover' com foco no centro. 
              // Usaremos 'cover' e garantiremos que a imagem esteja bem enquadrada.
              objectFit="cover" 
              className="object-center"
            />
          </div>

          {/* Content */}
          <div className="p-6 text-center space-y-4">
            {/* Usando emoji de sushi e melhorando a fonte */}
            <h3 className="text-2xl font-extrabold text-foreground flex items-center justify-center gap-2 font-serif">
                🍣 {PROMO_PRODUCT.name}
            </h3>
            <p className="text-lg text-foreground">
              Aproveite o maior combinado da casa por um preço imperdível!
            </p>
            
            {/* Preços Duplos: Cortado e Novo Preço em Destaque */}
            <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-lg text-gray-500 line-through">
                    De {formatCurrency(PROMO_PRODUCT.originalPrice)}
                </span>
                <div className="text-4xl font-extrabold text-green-600">
                    Por {formatCurrency(PROMO_PRODUCT.price)}
                </div>
            </div>

            <Link href={PROMO_PRODUCT.link} passHref>
              <Button 
                // Botão vermelho fogo e texto piscando
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-6 font-extrabold shadow-lg transition-all duration-300"
                onClick={handleClose}
              >
                <span className="animate-pulse">PEDIR AGORA</span>
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};