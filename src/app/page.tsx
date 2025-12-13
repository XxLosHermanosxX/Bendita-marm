"use client";

import React, { useMemo, useState, useEffect } from "react";
import { products, categories } from "@/data/products";
import { Product } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuLayout } from "@/components/menu-layout";
import { DesktopMenuLayout } from "@/components/desktop-menu-layout";
import { useSearchParams } from "next/navigation";

// Função para agrupar produtos por categoria
const groupProductsByCategory = (products: Product[]) => {
  return products.reduce((acc, product) => {
    const category = product.category || "Outros";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
};

export default function MenuPage() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  
  // Estado local para o termo de busca, inicializado pelo URL
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Atualiza o estado local se o URL mudar (ex: navegação de volta)
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const groupedProducts = useMemo(() => groupProductsByCategory(products), []);
  const allCategories = useMemo(() => categories, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);

  const visibleCategories = useMemo(() => {
    if (!searchTerm) {
      return allCategories;
    }
    // Filtra categorias que contêm pelo menos um produto filtrado
    return allCategories.filter(category => 
      groupedProducts[category]?.some(p => filteredProducts.includes(p))
    );
  }, [searchTerm, allCategories, groupedProducts, filteredProducts]);

  const activeCategory = visibleCategories[0] || "";

  if (isMobile) {
    return (
      <div className="pb-20"> {/* Adiciona padding para a barra de carrinho fixa */}
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
    />
  );
}