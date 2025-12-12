"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory || "Todos");

  // Lógica de Filtragem e Busca
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // 1. Filtrar por Categoria (usando o parâmetro de URL ou estado local)
    if (activeCategory && activeCategory !== "Todos") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // 2. Filtrar por Busca
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(lowerCaseSearch) || 
             p.description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Futuramente: 3. Filtrar por Preço e Avaliação

    return filtered;
  }, [activeCategory, searchTerm]);

  // Nota: A Sidebar já está no MainLayout e gerencia a navegação por categoria.
  // Aqui, vamos garantir que a busca funcione.

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Cardápio Completo
        </h1>

        {/* Barra de Busca (Mobile) */}
        <div className="relative md:hidden mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar no cardápio"
            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros e Ordenação (Desktop/Tablet) - Placeholder */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} produtos encontrados
          </p>
          {/* Placeholder para Ordenação */}
          <div className="hidden md:block text-sm text-muted-foreground">
            Ordenar por: <span className="font-medium text-foreground">Mais vendidos</span>
          </div>
        </div>

        {/* Grid de Produtos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">Nenhum produto encontrado.</p>
            <p className="text-sm">Tente ajustar sua busca ou filtros.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}