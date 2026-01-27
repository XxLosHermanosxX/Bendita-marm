"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { featuredProducts } from "@/data/products";
import { ASSETS } from "@/data/assets";
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
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="px-4 py-2 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] text-sm font-bold uppercase tracking-wider">
            Promoções
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#003366] mt-4">
            Destaques do Plantão
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            As melhores opções para matar sua fome de plantão
          </p>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => {
            const Icon = promoIcons[index];
            
            return (
              <div
                key={product.id}
                onClick={scrollToMenu}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${promoColors[index]} p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-xl`}
              >
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase mb-4">
                    {product.category}
                  </span>
                  
                  <h3 className="text-2xl font-black mb-2 leading-tight">
                    {product.name}
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-white/60 uppercase">A partir de</span>
                      <p className="text-3xl font-black">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    
                    <button className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-[#003366] transition-all">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Product Image */}
                <div className="absolute -bottom-4 -right-4 h-40 w-40 opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-2xl"
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
