"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { CartDrawer } from "@/components/cart-drawer";
import { useCartStore } from "@/store/use-cart-store";
import { useRouter, usePathname } from "next/navigation"; // Importando usePathname
import { BusinessHoursStatus } from "./business-hours-status";
import { cn, formatCurrency } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle"; // Importando o novo hook

// Hardcoded business hours check (duplicated from BusinessHoursStatus for conditional rendering logic)
const checkIsOpen = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentHour = now.getHours();

  const BUSINESS_HOURS = [
    { day: "Segunda-feira", start: 10, end: 24 }, // 24h representa 23:59
    { day: "Terça-feira", start: 10, end: 24 },
    { day: "Quarta-feira", start: 10, end: 24 },
    { day: "Quinta-feira", start: 10, end: 24 },
    { day: "Sexta-feira", start: 10, end: 24 },
    { day: "Sábado", start: 11, end: 24 },
    { day: "Domingo", start: 11, end: 24 },
  ];
  
  const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const todayHours = BUSINESS_HOURS[todayIndex];

  if (!todayHours) return false;

  return currentHour >= todayHours.start && currentHour < todayHours.end;
};


export const Header = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebarToggle(); // Usando o hook global
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const totalCartPrice = useCartStore((state) => state.getTotalPrice()); // Obtendo o preço total
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Mantido para o mobile search
  const router = useRouter();
  const pathname = usePathname(); // Usando usePathname
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(true); 

  useEffect(() => {
    setIsClient(true);
    const updateStatus = () => {
      setIsOpen(checkIsOpen());
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Verifica se estamos na página de checkout ou pagamento PIX
  const isCheckoutPage = pathname === '/checkout' || pathname === '/pix-payment';


  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // If not client, render a basic header structure to avoid hydration mismatch
  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image 
                  src="/sushiaki-logo.png" 
                  alt="Sushiaki Logo" 
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      {/* Mobile: Prominent Closed Status Banner (if closed) */}
      {isMobile && !isOpen && (
        <div className="w-full bg-destructive/10 border-b border-destructive/30 p-2 text-center">
            <BusinessHoursStatus variant="mobile-closed" />
        </div>
      )}

      <div className={cn(
        "flex h-16 items-center px-4 md:px-6 relative",
        isMobile 
            ? "justify-between" 
            : "justify-start gap-8"
      )}>
        
        {/* Left section: Mobile Menu Trigger (Hamburger) */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center/Left section: Logo and Desktop Status */}
        <div className={cn(
            "flex items-center",
            isMobile 
                ? "absolute left-1/2 transform -translate-x-1/2" // Center logo on mobile
                : "gap-3" // Logo e Status lado a lado no desktop
        )}>
            <Link 
                href="/" 
                className={cn(
                    "flex items-center",
                    !isMobile && "h-full" // Garante que o link ocupe a altura para alinhamento
                )}
            >
                <div className={cn(
                  "relative",
                  isMobile ? "h-12 w-12" : "h-14 w-14" // Aumentando a logo no desktop para h-14 w-14
                )}>
                  <Image 
                    src="/sushiaki-logo.png" 
                    alt="Sushiaki Logo" 
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
            </Link>
            {/* Desktop Status ao lado da logo */}
            {!isMobile && (
                <BusinessHoursStatus variant="desktop" />
            )}
        </div>
        
        {/* Right section: Cart, Profile */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Mobile Search Icon */}
          {isMobile && (
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {/* Cart Button */}
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
          
          {/* Profile Button (Desktop only) */}
          {!isMobile && (
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Persistent Cart Button for Mobile (Hidden on Checkout/PIX pages) */}
      {isMobile && totalCartItems > 0 && !isCheckoutPage && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary p-4 z-40">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
            onClick={() => setIsCartOpen(true)}
          >
            Ver Carrinho ({totalCartItems} {totalCartItems === 1 ? 'item' : 'itens'}) - {formatCurrency(totalCartPrice)}
          </Button>
        </div>
      )}
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};