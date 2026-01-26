"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { X } from 'lucide-react';
import { IMAGES } from '@/config/images';

// Hardcoded product details for the promotion
const PROMO_PRODUCT = {
  id: "c1",
  name: "Combo Bendito Completo",
  originalPrice: 27.00,
  price: 20.00,
  imageUrl: IMAGES.promos.comboBenditoCompleto,
};

const LOCAL_STORAGE_KEY = 'plantao_promo_seen_v3';

export const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Só executa uma vez
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Verifica se o usuário já viu o modal
    const hasSeenPromo = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-[1.5rem]">
        <DialogHeader className="sr-only">
          <DialogTitle>Promoção Exclusiva</DialogTitle>
          <DialogDescription>Confira nossa promoção especial</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative w-full aspect-[4/3] bg-secondary">
            <Image
              src={PROMO_PRODUCT.imageUrl}
              alt={PROMO_PRODUCT.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 425px) 100vw, 425px"
              unoptimized
            />
          </div>

          <div className="p-6 text-center space-y-4">
            <h3 className="text-2xl font-extrabold text-foreground flex items-center justify-center gap-2">
              🍽️ {PROMO_PRODUCT.name}
            </h3>
            <p className="text-base text-muted-foreground">
              Marmita do dia + Refri + Mousse por um preço imperdível!
            </p>
            
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="text-lg text-gray-500 line-through">
                De {formatCurrency(PROMO_PRODUCT.originalPrice)}
              </span>
              <div className="text-3xl font-black text-green-600">
                Por {formatCurrency(PROMO_PRODUCT.price)}
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 font-bold"
              onClick={handleClose}
            >
              PEDIR AGORA!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
