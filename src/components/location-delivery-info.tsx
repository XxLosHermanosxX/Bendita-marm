"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocationStore, simulateIpDetection, getDynamicDeliveryTime } from '@/store/use-location-store';

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
  const { city, state, deliveryTime, distance, clearLocation, updateDeliveryTime } = useLocationStore();
  
  // Use state to force re-render based on time (in addition to store updates)
  const [dynamicTime, setDynamicTime] = useState(getDynamicDeliveryTime());

  // Atualiza o tempo de entrega a cada minuto
  useEffect(() => {
    // Atualiza o store (se confirmado) e o estado local
    const updateTime = () => {
        updateDeliveryTime();
        setDynamicTime(getDynamicDeliveryTime());
    };
    
    updateTime(); // Initial run
    
    const intervalId = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [updateDeliveryTime]);

  // Fallback to simulated data if store hasn't loaded yet or is empty
  const fallback = simulateIpDetection();
  const currentCity = city || fallback.detectedCity;
  const currentDeliveryTime = deliveryTime || dynamicTime.time; // Prioriza o store, mas usa o tempo dinâmico se o store estiver vazio
  const currentDistance = distance || fallback.detectedDistance; 

  const handleLocationChange = () => {
    // Clear location to trigger the modal again on next page load/refresh
    clearLocation();
    // Optionally, force a refresh or redirect to home to show the modal immediately
    window.location.href = '/'; 
  };

  // Define classes de cor e animação
  const timeColorClasses = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };
  
  const timeIconClasses = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  const deliveryTimeClasses = cn(
    'font-bold',
    timeColorClasses[dynamicTime.color],
    dynamicTime.animation && 'animate-pulse' // Aplica animação de piscar se for horário normal (verde)
  );

  return (
    // Outer wrapper to handle sticky positioning and ensure the pill is centered
    <div className="w-full bg-background py-2 flex justify-center border-b border-border/50 shadow-sm">
      
      {/* The Pill Container: Increased size (h-10, px-4, text-base) */}
      <div className="flex items-center h-10 px-4 bg-white border border-border rounded-full shadow-md text-base">
        
        {/* 1. Location (City Name) - Clickable */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLocationChange || handleLocationChange}
          className="flex items-center gap-1 text-base font-semibold text-primary p-0 h-auto hover:bg-transparent flex-shrink-0"
        >
          <MapPin className="h-5 w-5 text-primary" /> {/* Ícone maior */}
          <span className="font-bold">{currentCity}</span>
        </Button>

        {/* Separator */}
        <div className="h-5 w-px bg-border mx-3 flex-shrink-0"></div> {/* Separador maior */}

        {/* 2. Distance Info (1.6km de você) */}
        <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
          <MapPin className="h-5 w-5 text-primary" /> {/* Ícone maior */}
          <span className="font-bold text-foreground">{currentDistance.replace(' km', 'km')}</span>
          <span className="text-muted-foreground font-normal text-sm hidden sm:inline">de você</span> {/* Fonte menor para 'de você' */}
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-border mx-3 flex-shrink-0"></div> {/* Separador maior */}

        {/* 3. Delivery Time (Dinâmico) */}
        <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
          <Bike className={cn("h-5 w-5", timeIconClasses[dynamicTime.color])} /> {/* Ícone maior */}
          <span className={deliveryTimeClasses}>
            {currentDeliveryTime.replace(' min', ' min')}
          </span>
        </div>
      </div>
    </div>
  );
};