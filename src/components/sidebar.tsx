"use client";
import React from "react";
import Link from "next/link";
import { 
  Star, Utensils, Package, 
  Soup, Coffee, Cake
} from "lucide-react";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

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
  // Lê a categoria da URL. Se não houver, assume 'Marmita Destaque do Dia' como padrão.
  const activeCategory = searchParams.get('category') || "Marmita Destaque do Dia"; 
  
  // Filtra a lista de categorias para remover 'Combinados' (não existe mais)
  const filteredCategories = categories;

  return (
    <div className="h-full flex flex-col p-4 bg-secondary/50">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Categorias</h2>
      <nav className="flex-1 space-y-1">
        {filteredCategories.map((category) => {
          const Icon = categoryIcons[category] || Utensils;
          return (
            <Link 
              key={category} 
              href={`/products?category=${encodeURIComponent(category)}`}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                activeCategory === category 
                  ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" 
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {category}
            </Link>
          );
        })}
      </nav>
      {/* Removed Filters Section */}
    </div>
  );
};