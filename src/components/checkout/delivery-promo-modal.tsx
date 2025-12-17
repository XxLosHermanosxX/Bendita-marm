"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveryPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryPromoModal = ({ isOpen, onClose }: DeliveryPromoModalProps) => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state and start animation sequence
      setShowImage(false);
      
      // Delay to show the image pop-in effect
      const timer = setTimeout(() => {
        setShowImage(true);
      }, 100); 
      
      // Automatically close after 3 seconds
      const autoCloseTimer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-8 text-center">
        <DialogHeader className="sr-only">
          <DialogTitle>Entrega Grátis!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Animated Image */}
          <div className="relative h-24 w-24 mx-auto">
            <Image
              src="/images/delivery-free-check.png"
              alt="Entrega Grátis Confirmada"
              layout="fill"
              objectFit="contain"
              className={cn(
                "transition-all duration-500 ease-out",
                showImage ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-[-30deg] opacity-0"
              )}
            />
          </div>

          <h2 className="text-3xl font-bold text-success">
            Entrega Grátis!
          </h2>
          <p className="text-lg text-foreground">
            Você ganhou frete grátis no seu primeiro pedido!
          </p>

          <Button 
            className="w-full bg-success hover:bg-success/90 text-success-foreground text-lg py-6"
            onClick={onClose}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" /> Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};