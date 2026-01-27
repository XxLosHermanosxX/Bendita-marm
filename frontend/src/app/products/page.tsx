"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { products, categories } from "@/data/products";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuLayout } from "@/components/menu-layout";
import { DesktopMenuLayout } from "@/components/desktop-menu-layout";
import { Product } from "@/types";

export default function ProductsPage() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  
  // Derivar a categoria ativa diretamente dos searchParams para garantir reatividade
  const activeCategory = searchParams.get('category') || "Exclusivos do App";
  
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Agrupar produtos por categoria e filtrar categorias vazias
  const groupedProducts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = products.filter(p => p.category === category);
      return acc;
    }, {} as Record<string, Product[]>);
  }, []);

  const visibleCategories = useMemo(() => {
    return categories.filter(c => groupedProducts[c] && groupedProducts[c].length > 0);
  }, [groupedProducts]);


  // 2. Lógica de Filtragem e Busca
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por Categoria (usando o parâmetro de URL)
    // Se não houver categoria ou for "Todos", mostra todos os produtos
    if (activeCategory && activeCategory !== "Todos" && categories.includes(activeCategory as any)) {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Filtrar por Busca
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(lowerCaseSearch) || 
             p.description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Nota: Filtros de Preço e Avaliação seriam aplicados aqui se existissem.

    return filtered;
  }, [activeCategory, searchTerm]);

  // 3. Reagrupar produtos filtrados para o layout de desktop (que precisa renderizar seções)
  const filteredGroupedProducts = useMemo(() => {
    return visibleCategories.reduce((acc, category) => {
      acc[category] = filteredProducts.filter(p => p.category === category);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [filteredProducts, visibleCategories]);


  if (isMobile) {
    // No mobile, usamos o MenuLayout que inclui a barra de busca no Header
    return (
      <MainLayout>
        <MenuLayout 
          activeCategory={activeCategory}
          visibleCategories={visibleCategories}
          groupedProducts={groupedProducts}
        />
      </MainLayout>
    );
  }

  // Desktop Layout
  return (
    <MainLayout>
      <DesktopMenuLayout
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredProducts={filteredProducts}
        activeCategory={activeCategory}
        visibleCategories={visibleCategories}
        groupedProducts={filteredGroupedProducts} // Passamos os produtos filtrados por categoria
      />
    </MainLayout>
  );
}