"use client";

import React, { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuLayout } from "@/components/menu-layout";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/data/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

// Helper function to group products (copied from page.tsx)
const getGroupedProducts = () => {
  return categories.reduce((acc, category) => {
    acc[category] = products.filter(p => p.category === category);
    return acc;
  }, {} as Record<string, Product[]>);
};

const getVisibleCategories = (groupedProducts: Record<string, Product[]>) => {
  return categories.filter(c => groupedProducts[c] && groupedProducts[c].length > 0);
};


export const HomeContentWrapper = () => {
  const isMobile = useIsMobile();
  
  const groupedProducts = useMemo(getGroupedProducts, []);
  const visibleCategories = useMemo(() => getVisibleCategories(groupedProducts), [groupedProducts]);

  // Data for desktop layout
  // Destaque do Dia (m1)
  const exclusiveProducts = products.filter(p => p.category === "Marmita Destaque do Dia").slice(0, 3); 
  // Combos (c1)
  const comboProducts = products.filter(p => p.category === "Combos").slice(0, 3);

  // Render nothing until isMobile is defined (i.e., client-side)
  if (isMobile === undefined) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {/* Banner de Boas-vindas (Carrossel) */}
        <section className="mb-4">
          <HeroCarousel />
        </section>
        
        {/* Full Menu for Mobile */}
        <MenuLayout 
          activeCategory="Marmita Destaque do Dia" // Updated default category
          visibleCategories={visibleCategories}
          groupedProducts={groupedProducts}
        />
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      {/* Banner de Boas-vindas (Agora Carrossel) */}
      <section className="mb-8">
        <HeroCarousel />
      </section>

      <div className="container mx-auto p-4 md:p-6 pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Bem-vindo à Bendita Marmita!
        </h1>
        
        {/* Seção de Produtos Exclusivos do App (Destaque) */}
        {exclusiveProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-primary">
                🔥 Destaque do Dia & Combos
              </h2>
            </div>
            
            {/* Exibindo Destaques + Combos na mesma linha (grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Destaque do Dia */}
              {exclusiveProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}

              {/* Combos (agora junto com o destaque) */}
              {comboProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Seção de Combos (Se houver mais, pode manter separado, mas o usuário pediu junto) */}
        {/* O código acima já exibe o combo junto. Se quiser remover a seção separada de combos: */}
        {/* 
        {comboProducts.length > 0 && (
          <section className="mb-8">
            ...
          </section>
        )}
        */}

        <div className="text-center mt-8">
          <Link href="/products" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
              Explorar Cardápio Completo
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
