"use client";

import React, { useState, useEffect } from "react";
import { Clock, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Hardcoded business hours (24h format)
const BUSINESS_HOURS = [
  { day: "Segunda-feira", start: 10, end: 22 },
  { day: "Terça-feira", start: 10, end: 22 },
  { day: "Quarta-feira", start: 10, end: 22 },
  { day: "Quinta-feira", start: 10, end: 22 },
  { day: "Sexta-feira", start: 10, end: 22 },
  { day: "Sábado", start: 11, end: 23 },
  { day: "Domingo", start: 11, end: 23 },
];

// Helper function to check if the store is open now
const checkIsOpen = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentHour = now.getHours();

  // Adjust dayOfWeek: BUSINESS_HOURS array is 0=Monday, 1=Tuesday... 6=Sunday.
  const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const todayHours = BUSINESS_HOURS[todayIndex];

  if (!todayHours) return false;

  return currentHour >= todayHours.start && currentHour < todayHours.end;
};

interface BusinessHoursStatusProps {
    variant: 'desktop' | 'mobile-closed' | 'mobile-sidebar';
}

export const BusinessHoursStatus = ({ variant }: BusinessHoursStatusProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateStatus = () => {
      setIsOpen(checkIsOpen());
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return null;
  }

  const statusText = isOpen ? "Aberto agora" : "Fechado";
  const statusColor = isOpen ? "text-success" : "text-destructive";
  const Icon = isOpen ? CheckCircle : XCircle;

  // Desktop variant: Status below logo, uses Popover for details
  if (variant === 'desktop') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-auto p-0 text-left flex items-center justify-start gap-1 group"
          >
            <Icon className={cn("h-3 w-3", statusColor)} />
            <span className={cn("text-xs font-medium", statusColor)}>
              {statusText}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 text-sm">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Horário de Funcionamento
          </h4>
          <ul className="space-y-1">
            {BUSINESS_HOURS.map((h, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-muted-foreground">{h.day}:</span>
                <span className="font-medium">{h.start}:00 - {h.end}:00</span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    );
  }

  // Mobile Closed variant: Prominent status banner in the header (only if closed)
  if (variant === 'mobile-closed' && !isOpen) {
    return (
        <div className="flex items-center justify-center gap-2 w-full">
            <Icon className={cn("h-4 w-4", statusColor)} />
            <span className={cn("text-sm font-medium", statusColor)}>
              {statusText} - Veja os horários
            </span>
        </div>
    );
  }
  
  // Mobile Sidebar variant: Simple status text (used inside the sidebar/menu)
  if (variant === 'mobile-sidebar') {
    return (
        <div className="flex items-center gap-1">
            <Icon className={cn("h-4 w-4", statusColor)} />
            <span className={cn("text-sm font-medium", statusColor)}>
              {statusText}
            </span>
        </div>
    );
  }

  return null;
};