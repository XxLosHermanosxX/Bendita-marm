"use client";

import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PromoModal } from "../promo-modal";
import { SidebarProvider } from "@/hooks/use-sidebar-toggle";
import { SidebarSheet } from "./sidebar-sheet";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  // useIsMobile is no longer strictly needed here as SidebarSheet handles responsiveness via Sheet component,
  // but we keep it if other parts of the layout rely on it. However, since the fixed sidebar is gone,
  // we can remove the useIsMobile import and usage related to the sidebar.

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          {/* Sidebar now handled by SidebarSheet (Drawer/Hamburger Menu) */}
          <SidebarSheet />
          
          {/* Main content is now full width */}
          <main className="flex-1 pt-4 md:pt-0 overflow-y-auto">{children}</main>
        </div>
        <Footer />
        
        {/* Modal de Promoção */}
        <PromoModal />
      </div>
    </SidebarProvider>
  );
};