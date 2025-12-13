"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/lib/utils';
import { Package, X } from 'lucide-react';

// Hardcoded product details for the promotion (p30)
const PROMO_PRODUCT = {
  id: "p30",
  name: "Combinado Exclusivo 80 Peças",
  price: 49.90,
  imageUrl: "/images/combinado-80-pecas.png",
  link: "/?category=Exclusivos%20do%20App", // Corrigido para a rota raiz
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
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
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
              objectFit="cover"
              className="object-center"
            />
          </div>

          {/* Content */}
          <div className="p-6 text-center space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                <Package className="h-6 w-6" /> {PROMO_PRODUCT.name}
            </h3>
            <p className="text-lg text-foreground">
              Aproveite o maior combinado da casa por um preço imperdível!
            </p>
            
            <div className="text-3xl font-extrabold text-destructive">
                {formatCurrency(PROMO_PRODUCT.price)}
            </div>

            <Link href={PROMO_PRODUCT.link} passHref>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                onClick={handleClose}
              >
                Pedir Agora
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};