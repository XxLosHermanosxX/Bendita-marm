"use client";

import Image from "next/image";
import { ASSETS } from "@/data/assets";
import { ChevronDown, MapPin } from "lucide-react";
import { useStore } from "@/store";
import { useTranslation } from "@/lib/i18n";

export function HeroSection() {
  const { requestLocation, locationStatus } = useStore();
  const { t } = useTranslation();
  
  const scrollToMenu = () => {
    const menu = document.getElementById("cardapio");
    if (menu) {
      menu.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLocationRequest = () => {
    if (locationStatus === "idle") {
      requestLocation();
    }
    scrollToMenu();
  };

  return (
    <section className="relative min-h-[100svh] flex items-center bg-gradient-to-br from-[#003366] via-[#003366] to-[#002244] overflow-hidden pt-16 pb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          {/* Content - Mobile First */}
          <div className="text-white text-center lg:text-left order-2 lg:order-1 flex-1">
            <div className="inline-block mb-4">
              <span className="px-3 py-1.5 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] text-xs font-bold uppercase tracking-wider border border-[#FF8C00]/30 flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {t("heroTag")}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
              {t("heroTitle")}{" "}
              <span className="text-[#FF8C00]">{t("heroTitleHighlight")}</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/80 max-w-md mx-auto lg:mx-0 mb-6">
              {t("heroSubtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={handleLocationRequest}
                className="h-14 px-8 rounded-2xl bg-[#FF8C00] text-white font-bold text-lg hover:bg-[#FF7000] active:scale-95 transition-all shadow-lg shadow-[#FF8C00]/30"
              >
                {locationStatus === "idle" ? t("orderNow") : t("viewMenu")}
              </button>
            </div>

            {/* Stats - Mobile Optimized */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-8">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-[#7CFC00]">10k+</p>
                <p className="text-xs text-white/60">{t("orders")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-[#FF8C00]">25min</p>
                <p className="text-xs text-white/60">{t("average")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-white">4.9★</p>
                <p className="text-xs text-white/60">{t("rating")}</p>
              </div>
            </div>
          </div>

          {/* Hero Image - Floating Effect - Mobile First */}
          <div className="relative w-full max-w-[280px] md:max-w-[350px] lg:max-w-[450px] aspect-square order-1 lg:order-2">
            <div className="absolute inset-0 animate-float">
              <Image
                src={ASSETS.products.duploEletroChoque}
                alt="Duplo Eletro-Choque"
                fill
                className="object-contain drop-shadow-[0_20px_40px_rgba(255,140,0,0.4)] rounded-[40px]"
                priority
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-5 right-5 h-16 w-16 rounded-full bg-[#FF8C00]/20 blur-2xl" />
            <div className="absolute bottom-10 left-5 h-24 w-24 rounded-full bg-[#7CFC00]/20 blur-3xl" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToMenu}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <span className="text-[10px] uppercase tracking-wider">{t("viewMenu")}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
