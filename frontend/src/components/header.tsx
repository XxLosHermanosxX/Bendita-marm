"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, Menu, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IMAGES } from "@/config/images";

export const Header = () => {
  const { openSidebar } = useSidebarToggle();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={openSidebar}>
            <Menu className="h-6 w-6 text-[#005A8D]" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-14 w-32 md:h-16 md:w-40 transition-transform hover:scale-105">
              <Image
                src={IMAGES.logo}
                alt="Plantão do Smash Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest text-[#005A8D]">
          <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
          <Link href="/products" className="hover:text-[#FF6B00] transition-colors">Cardápio</Link>
          <Link href="/checkout" className="hover:text-[#FF6B00] transition-colors">Status</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-[#005A8D]">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link href="/checkout">
            <Button variant="outline" size="icon" className="relative border-[#005A8D] text-[#005A8D] hover:bg-[#005A8D] hover:text-white transition-all">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#FF6B00] text-white hover:bg-[#FF6B00] px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};