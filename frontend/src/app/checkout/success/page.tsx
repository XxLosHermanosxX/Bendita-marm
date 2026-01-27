"use client";

import Link from "next/link";
import { CheckCircle, Home, Package, MessageCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[100svh] bg-[#003366] flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <div className="text-center text-white max-w-sm w-full">
        {/* Success Icon */}
        <div className="h-20 w-20 rounded-full bg-[#7CFC00] mx-auto mb-6 flex items-center justify-center animate-in zoom-in">
          <CheckCircle className="h-10 w-10 text-[#003366]" />
        </div>
        
        <h1 className="text-2xl font-black mb-3">
          ¡Pedido Confirmado!
        </h1>
        
        <p className="text-white/80 text-sm mb-6">
          Tu pedido fue recibido con éxito. Pronto recibirás una confirmación por WhatsApp.
        </p>

        {/* Order Status Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#FF8C00] flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold">Preparando tu pedido</p>
              <p className="text-xs text-white/60">Tiempo estimado: 25-40 min</p>
            </div>
          </div>
          
          {/* Progress Line */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/4 bg-[#7CFC00] rounded-full animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <a
            href="https://wa.me/595981000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <MessageCircle className="h-5 w-5" />
            Contactar por WhatsApp
          </a>
          
          <Link href="/">
            <button className="w-full h-12 rounded-xl bg-white/10 text-white font-bold active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Home className="h-5 w-5" />
              Volver al Inicio
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
