"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder function to determine emoji based on city
const getCityEmoji = (city: string) => {
  const lowerCity = city.toLowerCase();
  if (lowerCity.includes('curitiba')) return '🌳';
  if (lowerCity.includes('florianopolis') || lowerCity.includes('florianópolis')) return '🌊';
  return '📍';
};

interface LocationDeliveryInfoProps {
  currentCity: string;
  deliveryTime: string;
  onLocationChange?: () => void;
}

export const LocationDeliveryInfo = ({ currentCity, deliveryTime, onLocationChange }: LocationDeliveryInfoProps) => {
  const cityEmoji = getCityEmoji(currentCity);

  return (
    <div className="w-full bg-background border-b border-border/50 shadow-sm h-12 flex items-center justify-between px-4">
      
      {/* Location Selector Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLocationChange}
        className="flex items-center gap-1 text-sm font-semibold text-foreground p-0 h-auto hover:bg-transparent"
      >
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground mr-1">Você está em:</span>
        <span className="text-primary">
          {currentCity} {cityEmoji}
        </span>
      </Button>

      {/* Delivery Time */}
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <Clock className="h-4 w-4 text-primary" />
        <span>{deliveryTime}</span>
      </div>
    </div>
  );
};