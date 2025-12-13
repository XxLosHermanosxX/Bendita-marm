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
    <div className="w-full bg-background border-b border-border/50 shadow-sm h-12 flex items-center px-4">
      <div className="flex items-center justify-start gap-4 w-full overflow-x-auto whitespace-nowrap">
        
        {/* 1. Location (City Name) - Always visible and clickable */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLocationChange || handleLocationChange}
          className="flex items-center gap-1 text-sm font-semibold text-foreground p-0 h-auto hover:bg-transparent flex-shrink-0"
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-primary font-bold">{currentCity}</span>
        </Button>

        {/* Separator */}
        <div className="h-6 w-px bg-border flex-shrink-0"></div>

        {/* 2. Distance Info (1.6km de você) */}
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground flex-shrink-0">
          <span className="text-base">📍</span> {/* Emoji de mapa */}
          <span className="font-bold text-foreground">{currentDistance.replace(' km', 'km')}</span>
          <span className="text-muted-foreground font-normal">de você</span>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border flex-shrink-0"></div>

        {/* 3. Delivery Time */}
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground flex-shrink-0">
          <Bike className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold text-foreground">{currentDeliveryTime.replace(' min', ' min')}</span>
        </div>
      </div>
    </div>
  );
};