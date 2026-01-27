"use client";

import { useState, useRef, useEffect } from "react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { useTranslation } from "@/lib/i18n";
import { Product } from "@/types";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const filteredProducts = products.filter(p => p.category === activeCategory);

  // Scroll tab into view when selected (mobile)
  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector(`[data-active="true"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeCategory]);

  return (
    <section id="cardapio" className="py-8 md:py-16 bg-[#F8F8F8] scroll-mt-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="px-3 py-1.5 rounded-full bg-[#003366]/10 text-[#003366] text-xs font-bold uppercase tracking-wider">
            {t("menu")}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#003366] mt-3">
            {t("ourMenu")}
          </h2>
        </div>

        {/* Category Tabs - Horizontal Scroll Mobile */}
        <div className="mb-6 -mx-4 px-4">
          <div 
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                data-active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all snap-start shrink-0 ${
                  activeCategory === category
                    ? "bg-[#003366] text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - 2 columns mobile, 3-4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum produto nesta categoria
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
