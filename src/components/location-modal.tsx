"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useLocationStore, simulateIpDetection } from '@/store/use-location-store';
import { useRouter } from 'next/navigation';
import { SushiakiLogo } from './sushiaki-logo';

// Definindo o tipo para a localização detectada
type DetectedLocation = { 
  city: string, 
  state: string, 
  deliveryTime: string, 
  distance: string 
};

export const LocationModal = () => {
  const router = useRouter();
  const { isLocationConfirmed, setConfirmedLocation, clearLocation } = useLocationStore();
  const [isClient, setIsClient] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Only run detection and show modal if location is not confirmed yet
    if (!isLocationConfirmed) {
      const { detectedCity, detectedState, detectedDeliveryTime, detectedDistance } = simulateIpDetection();
      setDetectedLocation({ 
        city: detectedCity, 
        state: detectedState, 
        deliveryTime: detectedDeliveryTime,
        distance: detectedDistance
      });
      setIsOpen(true);
    }
  }, [isLocationConfirmed]);

  const handleConfirm = () => {
    if (detectedLocation) {
      setConfirmedLocation(
        detectedLocation.city,
        detectedLocation.state,
        detectedLocation.deliveryTime,
        detectedLocation.distance // Passando a distância
      );
      setIsOpen(false);
    }
  };

  const handleManualInput = () => {
    // Clear location state and redirect to a manual input page (or just close for now and show a toast)
    clearLocation();
    setIsOpen(false);
    // Redirecting to products page as a fallback for manual input
    router.push('/products');
  };

  // We only render if we are on the client, location is not confirmed, and we have detected data.
  if (!isClient || isLocationConfirmed || !detectedLocation) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] p-8 text-center">
        <DialogHeader className="sr-only">
          <DialogTitle>Confirmação de Localização</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Usando a logo real, ajustando o tamanho do container para a proporção da imagem */}
          <div className="mx-auto h-16 w-40">
            <SushiakiLogo className="h-full w-full" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Bateu a fome de Japa?
          </h2>
          <p className="text-sm text-muted-foreground">
            Confirmar sua localização garante o tempo de entrega exato.
          </p>

          <div className="p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Sua localização detectada:</p>
            <p className="text-xl font-bold text-foreground mt-1">
              {detectedLocation.city} - {detectedLocation.state}
            </p>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
            onClick={handleConfirm}
          >
            <Check className="h-5 w-5 mr-2" /> É isso mesmo!
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-foreground hover:bg-accent"
            onClick={handleManualInput}
          >
            Digitar outro local
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};