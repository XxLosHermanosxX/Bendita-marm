"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/use-cart-store';
import { useIsMobile } from '@/hooks/use-mobile';

// Número de telefone atualizado: (41) 99233-2483
const WHATSAPP_NUMBER = '5541992332483';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WhatsappButton = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const totalCartItems = useCartStore((state) => state.getTotalItems());

  // Ocultar o botão em páginas de checkout/pagamento
  const isCheckoutPage = pathname === '/checkout' || pathname === '/pix-payment';
  
  // No mobile, o botão flutuante do carrinho ocupa a parte inferior.
  // Se o carrinho estiver aberto, o botão do WhatsApp deve ser movido para cima.
  const mobileOffset = isMobile && totalCartItems > 0 && !isCheckoutPage ? 'bottom-[88px]' : 'bottom-4';

  if (isCheckoutPage) {
    return null;
  }

  return (
    <Link 
      href={WHATSAPP_LINK} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "fixed right-4 z-50 transition-all duration-300 ease-in-out",
        mobileOffset
      )}
    >
      {/* Removido shadow-xl para evitar o quadrado transparente em volta */}
      <div className="relative h-14 w-14 md:h-16 md:w-16 hover:scale-105 transition-transform drop-shadow-xl">
        <Image
          src="https://customer-assets.emergentagent.com/job_github-link-2/artifacts/atzszp87_file_00000000b328720ea80bbf3931e4fbd6.png"
          alt="WhatsApp Sushiaki"
          layout="fill"
          objectFit="contain"
          priority
          quality={100}
        />
      </div>
    </Link>
  );
};
