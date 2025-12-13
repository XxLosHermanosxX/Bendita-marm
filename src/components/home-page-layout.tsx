"use client";

import React from "react";
import { HeroCarousel } from "./hero-carousel";
import { MenuLayout } from "./menu-layout";
import { DesktopMenuLayout } from "./desktop-menu-layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Product } from "@/types";

interface HomePageLayoutProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  activeCategory: string;
  visibleCategories: string[];
  groupedProducts: Record<string, Product[]>;
}

export const HomePageLayout = ({
  searchTerm,
  setSearchTerm,
  filteredProducts,
  activeCategory,
  visibleCategories,
  groupedProducts,
}: HomePageLayoutProps) => {
  const isMobile = useIsMobile();

  // Se houver termo de busca, o carrossel não deve aparecer, e o layout deve focar nos resultados.
  const showCarousel = !searchTerm;

  if (isMobile) {
    return (
      <div className="pb-20">
        {showCarousel && <HeroCarousel />}
        <MenuLayout
          activeCategory={activeCategory}
          visibleCategories={visibleCategories}
          groupedProducts={groupedProducts}
        />
      </div>
    );
  }

  return (
    <DesktopMenuLayout
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filteredProducts={filteredProducts}
      activeCategory={activeCategory}
      visibleCategories={visibleCategories}
      groupedProducts={groupedProducts}
      showCarousel={showCarousel} // Passando a flag para o desktop layout
    />
  );
};