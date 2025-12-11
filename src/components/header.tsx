"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { CartDrawer } from "@/components/cart-drawer";
import { useCartStore } from "@/store/use-cart-store";
import { useRouter } from "next/navigation";

export const Header = () => {
  const isMobile = useIsMobile();
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Don't render cart button until client-side hydration is complete
  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 pt-16">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            )}
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/sushiaki-logo.png" 
                alt="Sushiaki Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8" 
              />
              <span className="text-lg font-bold text-primary">SUSHIAKI</span>
            </Link>
          </div>

          {!isMobile && (
            <div className="relative flex-1 max-w-md mx-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar no cardápio"
                className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            {isMobile && (
              <Button variant="ghost" size="icon" className="relative">
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {!isMobile && (
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section: Mobile Menu Trigger (Hamburger) and Logo */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 pt-16">
                {/* pt-16 to clear header */}
                <Sidebar />
              </SheetContent>
            </Sheet>
          )}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/sushiaki-logo.png" 
              alt="Sushiaki Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8" 
            />
            <span className="text-lg font-bold text-primary">SUSHIAKI</span>
          </Link>
        </div>

        {/* Search Input (Desktop only) */}
        {!isMobile && (
          <div className="relative flex-1 max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar no cardápio"
              className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        )}

        {/* Right section: Cart, Profile (Desktop only) */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-5 w-5" />
              {/* Mobile search icon (no input) */}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {totalCartItems}
              </span>
            )}
          </Button>
          {!isMobile && (
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Persistent Cart Button for Mobile */}
      {isMobile && totalCartItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary p-4 z-40">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
            onClick={() => setIsCartOpen(true)}
          >
            Ver Carrinho ({totalCartItems} {totalCartItems === 1 ? 'item' : 'itens'})
          </Button>
        </div>
      )}
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};