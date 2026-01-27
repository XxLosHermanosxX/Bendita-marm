"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { featuredProducts } from "@/data/products";
import { ArrowRight, Zap, Package, Star } from "lucide-react";

const promoColors = [
  "from-[#003366] to-[#004488]",
  "from-[#FF8C00] to-[#FF6B00]",
  "from-[#D90429] to-[#A00020]",
];

const promoIcons = [Package, Zap, Star];

export function PromoSection() {
  const scrollToMenu = () => {
    const menu = document.getElementById("cardapio");
    if (menu) {
      menu.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="px-3 py-1.5 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] text-xs font-bold uppercase tracking-wider">
            Promociones
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#003366] mt-3">
            Destacados
          </h2>
        </div>

        {/* Promo Cards - Horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0">
          {featuredProducts.map((product, index) => {
            const Icon = promoIcons[index];
            
            return (
              <div
                key={product.id}
                onClick={scrollToMenu}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${promoColors[index]} p-5 cursor-pointer active:scale-[0.98] transition-all duration-300 shadow-xl min-w-[280px] md:min-w-0 snap-start`}
              >
                {/* Icon Badge */}
                <div className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-white pt-6">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase mb-3">
                    {product.category}
                  </span>
                  
                  <h3 className="text-xl font-black mb-2 leading-tight">
                    {product.name}
                  </h3>
                  
                  <p className="text-white/80 text-xs mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-white/60 uppercase">Desde</span>
                      <p className="text-2xl font-black">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    
                    <button className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-[#003366] transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Product Image */}
                <div className="absolute -bottom-2 -right-2 h-32 w-32 opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-2xl rounded-2xl"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
