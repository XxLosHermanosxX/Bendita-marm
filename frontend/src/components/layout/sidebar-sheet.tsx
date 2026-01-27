"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

export const SidebarSheet = () => {
  const { isSidebarOpen, closeSidebar } = useSidebarToggle();
  const isMobile = useIsMobile();

  // Placeholder for dynamic unit information
  const currentUnit = "Curitiba"; 

  if (!isMobile) return null; // Do not render on desktop

  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        
        {/* Custom Header for Sidebar */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image 
                src="/bendita-logo.png" 
                alt="Bendita Marmita Logo" 
                layout="fill"
                objectFit="contain"
              />
            </div>
            <h3 className="text-xl font-bold text-foreground">Bendita Marmita</h3>
          </div>
          
          {/* Unit Information */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Unidade: <span className="font-semibold text-foreground">{currentUnit}</span></span>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
            <Sidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
};