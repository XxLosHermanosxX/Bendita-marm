"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/lib/utils';
import { X } from 'lucide-react';
import { openProductConfigurationModalById } from '@/lib/product-actions'; // Importando a nova função

// Hardcoded product details for the promotion (c1)
const PROMO_PRODUCT = {
  id: "c1",
  name: "Combo Bendito Completo",
  originalPrice: 27.00, // Assuming R$ 17 + R$ 5 + R$ 5 = R$ 27.00
  price: 20.00,
  imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/cqsth8y8_Combo_Bendito.png",
};

const LOCAL_STORAGE_KEY = 'bendita_promo_seen_v2'; // Updated key to force new view

export const PromoModal = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Verificação de ambiente móvel ou desktop agora, para mostrar em ambos se necessário,
    // mas o pedido foi "ao entrar no site", então vou deixar geral, não apenas mobile.
    
    // Verifica se o usuário já viu o modal nesta sessão
    const hasSeenPromo = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hasSeenPromo) {
      // Atraso para garantir que a tela de splash termine
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isMobile]); // Trigger on mount

  const handleClose = () => {
    setIsOpen(false);
    // Marca como visto no localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };
  
  // Novo handler para o clique do botão: abre a configuração do produto e fecha o modal.
  const handleOrderClick = () => {
    // Usamos a função que busca o produto pelo ID e abre o ProductModal
    openProductConfigurationModalById(PROMO_PRODUCT.id);
    handleClose();
  };

  if (!isClient) {
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
              // Ajustando objectFit para 'cover' com foco no centro.
              objectFit="cover" 
              className="object-center"
              quality={100}
            />
          </div>

          {/* Content */}
          {/* Aumentando o espaçamento para space-y-8 */}
          <div className="p-6 text-center space-y-6">
            {/* Usando emoji de sushi e fonte padrão bold */}
            <h3 className="text-2xl font-extrabold text-foreground flex items-center justify-center gap-2">
                🍽️ {PROMO_PRODUCT.name}
            </h3>
            <p className="text-base text-foreground">
              Marmita do dia + Refri + Mousse por um preço imperdível!
            </p>
            
            {/* Preços Duplos: Cortado e Novo Preço em Destaque */}
            {/* Aumentando mb-4 para mb-8 para subir o preço e separar do botão */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-6">
                <span className="text-xl text-gray-500 line-through font-medium">
                    De {formatCurrency(PROMO_PRODUCT.originalPrice)}
                </span>
                {/* Novo Preço: Verde Claro, Sombreado Leve e Efeito de Brilho/Pulsação */}
                <div className="text-4xl font-black text-green-600 animate-pulse drop-shadow-md">
                    Por {formatCurrency(PROMO_PRODUCT.price)}
                </div>
            </div>

            {/* Removed Link wrapper and added direct action */}
            <Button 
              // Botão vermelho fogo e texto piscando
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xl py-6 font-extrabold shadow-lg transition-all duration-300"
              onClick={handleOrderClick}
            >
              <span className="">PEDIR AGORA!</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
