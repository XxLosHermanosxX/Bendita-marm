"use client";

import Image from "next/image";
import { ASSETS } from "@/data/assets";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToMenu = () => {
    const menu = document.getElementById("cardapio");
    if (menu) {
      menu.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-[#003366] via-[#003366] to-[#002244] overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-6 text-center lg:text-left">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] text-sm font-bold uppercase tracking-wider border border-[#FF8C00]/30">
                🔥 Entrega Rápida em Hospitais
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              O Combustível para o seu{" "}
              <span className="text-[#FF8C00]">Plantão.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
              Smash Burgers, Combos e Boxes. Entrega Rápida em Hospitais e Universidades.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToMenu}
                className="h-14 px-8 rounded-xl bg-[#FF8C00] text-white font-bold text-lg hover:bg-[#FF8C00]/90 transition-all hover:scale-105 shadow-lg shadow-[#FF8C00]/30"
              >
                Pedir Agora
              </button>
              <button
                onClick={scrollToMenu}
                className="h-14 px-8 rounded-xl bg-white/10 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Ver Cardápio
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-6">
              <div className="text-center">
                <p className="text-3xl font-black text-[#7CFC00]">10.000+</p>
                <p className="text-sm text-white/60">Pedidos Entregues</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-[#FF8C00]">25min</p>
                <p className="text-sm text-white/60">Tempo Médio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">4.9★</p>
                <p className="text-sm text-white/60">Avaliação</p>
              </div>
            </div>
          </div>

          {/* Hero Image - Floating Effect */}
          <div className="relative h-[400px] lg:h-[500px]">
            <div className="absolute inset-0 animate-float">
              <Image
                src={ASSETS.products.duploEletroChoque}
                alt="Duplo Eletro-Choque"
                fill
                className="object-contain drop-shadow-[0_35px_60px_rgba(255,140,0,0.4)]"
                priority
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 h-20 w-20 rounded-full bg-[#FF8C00]/20 blur-2xl" />
            <div className="absolute bottom-20 left-10 h-32 w-32 rounded-full bg-[#7CFC00]/20 blur-3xl" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <span className="text-xs uppercase tracking-wider">Ver Cardápio</span>
        <ChevronDown className="h-5 w-5" />
      </button>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
