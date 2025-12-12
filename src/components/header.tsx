"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Clock } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(true); // Placeholder for business hours status

  useEffect(() => {
    setIsClient(true);
    
    // Placeholder logic for business hours
    const checkBusinessHours = () => {
      const now = new Date();
      const hours = now.getHours();
      // Example: Open from 10:00 to 22:00
      setIsOpen(hours >= 10 && hours < 22);
    };
    
    checkBusinessHours();
    // Check every minute
    const interval = setInterval(checkBusinessHours, 60000);
    return () => clearInterval(interval);
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
              <div className="relative h-10 w-10">
                <Image 
                  src="/sushiaki-logo.png" 
                  alt="Sushiaki Logo" 
                  layout="fill"
                  objectFit="contain"
                  className="h-10 w-10"
                />
              </div>
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
            <div className="relative h-10 w-10">
              <Image 
                src="/sushiaki-logo.png" 
                alt="Sushiaki Logo" 
                layout="fill"
                objectFit="contain"
                className="h-10 w-10"
              />
            </div>
          </Link>
        </div>

        {/* Business hours status */}
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium ${isOpen ? 'text-success' : 'text-destructive'}`}>
            {isOpen ? 'Aberto agora' : 'Fechado'}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </Button>
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