"use client";

import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PromoModal } from "../promo-modal";
import { SidebarProvider } from "@/hooks/use-sidebar-toggle";
import { SidebarSheet } from "./sidebar-sheet";
import { useIsMobile } from "@/hooks/use-mobile"; // Importando useIsMobile
import { LocationModal } from "../location-modal"; // Importando LocationModal
import { AddonsModal } from "../addons-modal"; // Importando AddonsModal
import { WhatsappButton } from "../whatsapp-button"; // Importando WhatsappButton

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          {/* Sidebar Sheet (Hamburger Menu) only visible on mobile */}
          {isMobile && <SidebarSheet />}
          
          {/* Main content is now full width */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <Footer />
        
        {/* Modals */}
        <PromoModal />
        <LocationModal />
        <AddonsModal />
        
        {/* Floating Buttons */}
        <WhatsappButton />
      </div>
    </SidebarProvider>
  );
};