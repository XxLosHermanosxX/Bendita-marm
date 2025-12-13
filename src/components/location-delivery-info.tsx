"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocationStore, simulateIpDetection } from '@/store/use-location-store';

// Placeholder function to determine emoji based on city
const getCityEmoji = (city: string) => {
  const lowerCity = city.toLowerCase();
  if (lowerCity.includes('curitiba')) return '🌳';
  if (lowerCity.includes('florianopolis') || lowerCity.includes('florianópolis')) return '🌊';
  return '📍';
};

interface LocationDeliveryInfoProps {
  onLocationChange?: () => void;
}

export const LocationDeliveryInfo = ({ onLocationChange }: LocationDeliveryInfoProps) => {
  const { city, state, deliveryTime, distance, clearLocation } = useLocationStore();
  
  // Fallback to simulated data if store hasn't loaded yet or is empty
  const fallback = simulateIpDetection();
  const currentCity = city || fallback.detectedCity;
  const currentState = state || fallback.detectedState;
  const currentDeliveryTime = deliveryTime || fallback.detectedDeliveryTime;
  const currentDistance = distance || fallback.detectedDistance; 

  const handleLocationChange = () => {
    // Clear location to trigger the modal again on next page load/refresh
    clearLocation();
    // Optionally, force a refresh or redirect to home to show the modal immediately
    window.location.href = '/'; 
  };

  return (
    // Outer wrapper to handle sticky positioning and ensure the pill is centered
    // Removendo a altura fixa e a borda inferior do container externo
    <div className="w-full bg-background py-2 flex justify-center border-b border-border/50 shadow-sm">
      
      {/* The Pill Container: Compact, rounded, bordered, and white background */}
      {/* Usando text-sm para compactação geral */}
      <div className="flex items-center h-8 px-3 bg-white border border-border rounded-full shadow-md text-sm">
        
        {/* 1. Location (City Name) - Clickable */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLocationChange || handleLocationChange}
          // Ajustando classes para o visual compacto dentro da 'pill'
          className="flex items-center gap-1 text-sm font-semibold text-primary p-0 h-auto hover:bg-transparent flex-shrink-0"
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-bold">{currentCity}</span>
        </Button>

        {/* Separator */}
        <div className="h-4 w-px bg-border mx-2 flex-shrink-0"></div>

        {/* 2. Distance Info (1.6km de você) */}
        <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
          {/* Usando MapPin para consistência visual e cor, como na imagem */}
          <MapPin className="h-4 w-4 text-primary" /> 
          <span className="font-bold text-foreground">{currentDistance.replace(' km', 'km')}</span>
          {/* Ocultando 'de você' em telas muito pequenas para evitar quebra de linha */}
          <span className="text-muted-foreground font-normal text-xs hidden sm:inline">de você</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-border mx-2 flex-shrink-0"></div>

        {/* 3. Delivery Time */}
        <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
          <Bike className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold text-foreground">{currentDeliveryTime.replace(' min', ' min')}</span>
        </div>
      </div>
    </div>
  );
};