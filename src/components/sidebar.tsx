"use client";
import React from "react";
import Link from "next/link";
import { 
  Star, Utensils, Package, 
  Soup, Coffee, Cake, MapPin, ShieldCheck, Clock, Phone
} from "lucide-react";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Map categories to Lucide icons (using available icons)
const categoryIcons: { [key: string]: React.ElementType } = {
  "Marmita Destaque do Dia": Star,
  "Cardápio Principal": Utensils,
  "Combos": Package,
  "Sobremesas": Cake,
  "Bebidas": Coffee,
};

export const Sidebar = () => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || "Combos de Plantão"; 
  
  const filteredCategories = categories;

  return (
    <div className="h-full flex flex-col p-6 bg-[#005A8D] text-white overflow-y-auto">
      <div className="mb-10 text-center">
        <div className="relative h-16 w-32 mx-auto mb-4">
          <Image src="/images/logo_plantao_smash.png" alt="Logo" fill className="object-contain brightness-0 invert" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
          <MapPin className="h-3 w-3 text-[#FF6B00]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Ciudad del Este, PY</span>
        </div>
      </div>

      <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-white/40">Setores / Cardápio</h2>
      <nav className="flex-1 space-y-2">
        {filteredCategories.map((category) => {
          return (
            <Link 
              key={category} 
              href={`/products?category=${encodeURIComponent(category)}`}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all border border-transparent",
                activeCategory === category 
                  ? "bg-white text-[#005A8D] shadow-lg shadow-black/20" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Utensils className="h-4 w-4" />
              {category}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-8">
        <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-[#FF6B00]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase">Plantão Aberto</span>
              <span className="text-xs opacity-70">Até às 02:00</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase">Pagamento Seguro</span>
              <span className="text-xs opacity-70">Online ou Entrega</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-black h-12 rounded-xl"
          onClick={() => window.open('https://wa.me/5500000000000', '_blank')}
        >
          SUPORTE DE EMERGÊNCIA
        </Button>
      </div>
    </div>
  );
};