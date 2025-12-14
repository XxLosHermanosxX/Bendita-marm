"use client";

import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useProductModalStore } from "@/store/use-product-modal-store";
import { ProductModal } from "@/components/product-modal";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isOpen, product, closeModal } = useProductModalStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
      <Toaster richColors position="top-center" />
      
      {/* Global Product Modal */}
      {product && (
        <ProductModal 
          product={product} 
          isOpen={isOpen} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};