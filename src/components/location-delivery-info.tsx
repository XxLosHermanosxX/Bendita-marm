"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Car } from 'lucide-react'; // Importando Car para representar a distância
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
  const currentDistance = distance || fallback.detectedDistance; // Usando a distância

  const cityEmoji = getCityEmoji(currentCity);

  const handleLocationChange = () => {
    // Clear location to trigger the modal again on next page load/refresh
    clearLocation();
    // Optionally, force a refresh or redirect to home to show the modal immediately
    window.location.href = '/'; 
  };

  return (
    <div className="w-full bg-background border-b border-border/50 shadow-sm h-12 flex items-center justify-between px-4">
      
      {/* Location Selector Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLocationChange || handleLocationChange}
        className="flex items-center gap-1 text-sm font-semibold text-foreground p-0 h-auto hover:bg-transparent"
      >
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground mr-1">Você está em:</span>
        <span className="text-primary">
          {currentCity} - {currentState} {cityEmoji}
        </span>
      </Button>

      {/* Delivery Time and Distance */}
      <div className="flex items-center gap-4">
        {/* Delivery Time */}
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>{currentDeliveryTime}</span>
        </div>
        
        {/* Distance */}
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Car className="h-4 w-4 text-primary" />
          <span>{currentDistance}</span>
        </div>
      </div>
    </div>
  );
};