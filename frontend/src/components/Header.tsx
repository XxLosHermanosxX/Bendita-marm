"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "@/store";
import { MapPin, Loader2, CheckCircle, XCircle, ShoppingCart, Navigation } from "lucide-react";
import { ASSETS } from "@/data/assets";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const { 
    location,
    locationStatus, 
    locationError,
    isDeliveryAvailable, 
    deliveryAddress,
    requestLocation,
    getTotalItems 
  } = useStore();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const handleRequestLocation = () => {
    requestLocation();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Main Header - Glassmorphism */}
        <div className="bg-[#003366]/95 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Logo */}
              <div className="relative h-10 w-24 md:h-12 md:w-32 shrink-0">
                <Image
                  src={ASSETS.logo}
                  alt="Plantão do Smash"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Location Button - Mobile First */}
              <button
                onClick={handleRequestLocation}
                disabled={locationStatus === "loading"}
                className={`flex-1 max-w-xs h-10 px-3 rounded-full flex items-center gap-2 text-sm transition-all ${
                  locationStatus === "success" && isDeliveryAvailable
                    ? "bg-[#7CFC00]/20 border border-[#7CFC00]/50 text-[#7CFC00]"
                    : locationStatus === "error" || locationStatus === "denied" || (locationStatus === "success" && !isDeliveryAvailable)
                    ? "bg-red-500/20 border border-red-500/50 text-red-400"
                    : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {locationStatus === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate text-xs">Ubicando...</span>
                  </>
                ) : locationStatus === "success" && isDeliveryAvailable ? (
                  <>
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span className="truncate text-xs font-medium">
                      {deliveryAddress?.neighborhood || "Ciudad del Este"}
                    </span>
                  </>
                ) : locationStatus === "error" || locationStatus === "denied" || (locationStatus === "success" && !isDeliveryAvailable) ? (
                  <>
                    <XCircle className="h-4 w-4 shrink-0" />
                    <span className="truncate text-xs">Fuera de zona</span>
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 shrink-0" />
                    <span className="truncate text-xs">Mi ubicación</span>
                  </>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative h-10 w-10 rounded-full bg-[#FF8C00] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0"
                data-testid="cart-button"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#7CFC00] text-[#003366] text-xs font-bold flex items-center justify-center animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Location Error Banner */}
        {locationError && (
          <div className="bg-red-500/90 text-white text-center text-xs py-2 px-4 animate-in slide-in-from-top">
            {locationError}
          </div>
        )}
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
