"use client";

import Link from "next/link";
import { CheckCircle, Home, Package } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#003366] flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        {/* Success Icon */}
        <div className="h-24 w-24 rounded-full bg-[#7CFC00] mx-auto mb-8 flex items-center justify-center animate-in zoom-in">
          <CheckCircle className="h-12 w-12 text-[#003366]" />
        </div>
        
        <h1 className="text-3xl font-black mb-4">
          Pedido Confirmado!
        </h1>
        
        <p className="text-white/80 mb-8">
          Seu pedido foi recebido com sucesso. Em breve você receberá uma confirmação no WhatsApp.
        </p>

        {/* Order Status Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#FF8C00] flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold">Preparando seu pedido</p>
              <p className="text-sm text-white/60">Tempo estimado: 25-40 min</p>
            </div>
          </div>
          
          {/* Progress Line - ECG Style */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/4 bg-[#7CFC00] rounded-full animate-pulse" />
          </div>
        </div>

        <Link href="/">
          <button className="w-full h-14 rounded-xl bg-[#FF8C00] text-white font-bold text-lg hover:bg-[#FF8C00]/90 transition-all flex items-center justify-center gap-2">
            <Home className="h-5 w-5" />
            Voltar ao Início
          </button>
        </Link>
      </div>
    </div>
  );
}
