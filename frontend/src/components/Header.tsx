"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useStore } from "@/store";
import { formatCep, validateCep } from "@/lib/utils";
import { MapPin, Loader2, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { ASSETS } from "@/data/assets";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const { cep, setCep, isDeliveryAvailable, setDeliveryAvailable, setDeliveryAddress, getTotalItems } = useStore();
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    
    // Reset validation when typing
    if (validationStatus !== "idle") {
      setValidationStatus("idle");
      setDeliveryAvailable(false);
    }
  };

  const handleCepSubmit = async () => {
    if (cep.replace(/\D/g, "").length !== 8) return;
    
    setIsValidating(true);
    setValidationStatus("idle");
    
    const result = await validateCep(cep);
    
    setIsValidating(false);
    
    if (result.valid && result.address) {
      setValidationStatus("success");
      setDeliveryAvailable(true);
      setDeliveryAddress({
        cep,
        street: result.address.street,
        number: "",
        neighborhood: result.address.neighborhood,
        city: result.address.city,
        state: result.address.state,
      });
    } else {
      setValidationStatus("error");
      setErrorMessage(result.error || "CEP inválido");
      setDeliveryAvailable(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCepSubmit();
    }
  };

  const totalItems = getTotalItems();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Glassmorphism Header */}
        <div className="bg-[#003366]/90 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="relative h-12 w-32 shrink-0">
                <Image
                  src={ASSETS.logo}
                  alt="Plantão do Smash"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* CEP Verification - Priority */}
              <div className="flex-1 max-w-md">
                <div className="relative flex items-center">
                  <div className="absolute left-3 z-10">
                    <MapPin className="h-4 w-4 text-[#FF8C00]" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite seu CEP"
                    maxLength={9}
                    className="w-full h-10 pl-9 pr-24 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all"
                  />
                  <button
                    onClick={handleCepSubmit}
                    disabled={isValidating || cep.replace(/\D/g, "").length !== 8}
                    className="absolute right-1 h-8 px-4 rounded-full bg-[#FF8C00] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#FF8C00]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isValidating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Verificar"
                    )}
                  </button>
                </div>
                
                {/* Validation Status */}
                {validationStatus === "success" && (
                  <div className="flex items-center gap-1 mt-1 text-[#7CFC00] text-xs animate-in fade-in slide-in-from-top-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Entregamos na sua região!</span>
                  </div>
                )}
                {validationStatus === "error" && (
                  <div className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-in fade-in slide-in-from-top-1">
                    <XCircle className="h-3 w-3" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative h-10 w-10 rounded-full bg-[#FF8C00] flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="cart-button"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#7CFC00] text-[#003366] text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
