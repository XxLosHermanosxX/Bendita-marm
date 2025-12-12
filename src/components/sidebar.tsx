"use client";
import React from "react";
import Link from "next/link";
import { 
  Star, Sparkles, Flame, ScrollText, 
  Leaf, Gift, Utensils, Fish, Coffee, 
  Package, Drumstick, GlassWater
} from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

// Map categories to Lucide icons (using available icons)
const categoryIcons: { [key: string]: React.ElementType } = {
  "Exclusivos do App": Star,
  "Prato do Dia": Sparkles,
  "Pokes": Utensils,
  "Pratos Quentes": Utensils,
  "Teppan": Utensils,
  "Niguiri": Fish,
  "Temaki": ScrollText,
  "Yakisoba": Utensils,
  "Vegetarianos": Leaf,
  "Especiais": Sparkles,
  "Novidades": Gift,
  "Soda": Coffee,
  "Combinados": Package,
  "Hossomaki": Fish,
  "Uramaki": Fish,
  "Sashimi": Fish,
  "Hot Sushis": Flame,
  "Tilápia Sushiaki": Fish,
  "Street Food": Drumstick,
  "Bebidas": GlassWater,
};

export const Sidebar = () => {
  const searchParams = useSearchParams();
  // Lê a categoria da URL. Se não houver, assume 'Exclusivos do App' como padrão.
  const activeCategory = searchParams.get('category') || "Exclusivos do App"; 
  
  // Filtra a lista de categorias para remover 'Combinados' se não for mais usada
  const filteredCategories = categories.filter(c => c !== "Combinados");

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
      <div className="mt-8 pt-4 border-t border-border">
        <h3 className="text-md font-semibold mb-3 text-foreground">Filtros</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Preço</p>
            <div className="h-8 w-full bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
              Slider de Preço
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Avaliação</p>
            <div className="h-8 w-full bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
              Filtro de Estrelas
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};