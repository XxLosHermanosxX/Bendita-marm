"use client";

import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "@/components/footer";
import { PromoModal } from "../promo-modal"; // Importando PromoModal

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar para Desktop */}
        {!isMobile && ( // Exibir apenas no desktop
          <aside className="hidden md:block w-72 border-r bg-secondary/50 p-4 pt-20">
            <Sidebar />
          </aside>
        )}
        <main className="flex-1 pt-4 md:pt-0 overflow-y-auto">{children}</main>
      </div>
      <Footer />
      
      {/* Modal de Promoção (Apenas para Mobile) */}
      <PromoModal />
    </div>
  );
};