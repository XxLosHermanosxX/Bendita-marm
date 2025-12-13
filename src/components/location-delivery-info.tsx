"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Bike } from 'lucide-react'; // Corrigido: usando Bike
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
    <div className="w-full bg-background border-b border-border/50 shadow-sm h-12 flex items-center justify-start gap-4 px-4">
      
      {/* Location/Distance Info (1.6km de você) */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLocationChange || handleLocationChange}
        className="flex items-center gap-1 text-sm font-semibold text-muted-foreground p-0 h-auto hover:bg-transparent"
      >
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="font-bold text-foreground">{currentDistance.replace(' km', 'km')}</span>
        <span className="text-muted-foreground font-normal">de você</span>
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-border"></div>

      {/* Delivery Time */}
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <Bike className="h-4 w-4 text-muted-foreground" />
        <span className="font-bold text-foreground">{currentDeliveryTime.replace(' min', ' min')}</span>
      </div>
    </div>
  );
};