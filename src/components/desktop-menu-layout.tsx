"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { LocationDeliveryInfo } from "@/components/location-delivery-info";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

// Helper component for category section
const ProductCategorySection = React.forwardRef<HTMLDivElement, { category: string, products: Product[] }>(({ category, products }, ref) => {
  return (
    <section ref={ref} id={`category-${category.replace(/\s/g, '-')}`} className="mb-8 pt-4">
      {/* Título da categoria que se sobrepõe ao rolar. Offset ajustado para desktop (Header 64px + Location Bar 48px = 112px) */}
      <h2 className="text-2xl font-bold text-foreground mb-4 sticky top-[112px] bg-background z-10 py-2 border-b border-border/50">
        {category}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
});
ProductCategorySection.displayName = 'ProductCategorySection';


interface DesktopMenuLayoutProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  activeCategory: string;
  visibleCategories: string[];
  groupedProducts: Record<string, Product[]>;
}

export const DesktopMenuLayout = ({ 
  searchTerm, 
  setSearchTerm, 
  filteredProducts, 
  activeCategory, 
  visibleCategories, 
  groupedProducts 
}: DesktopMenuLayoutProps) => {
  
  const [currentActiveCategory, setCurrentActiveCategory] = useState(activeCategory);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Combined height of fixed header (64px) + location bar (48px) = 112px
  const STICKY_OFFSET = 112; 

  // Handle scrolling to category section
  const scrollToCategory = (category: string) => {
    const ref = sectionRefs.current[`category-${category.replace(/\s/g, '-')}`];
    if (ref) {
      const offset = ref.offsetTop - STICKY_OFFSET;
      
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
      setCurrentActiveCategory(category);
    }
  };

  // Handle scroll observation to update active category
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = STICKY_OFFSET;
      let newActiveCategory = visibleCategories[0];

      for (const category of visibleCategories) {
        const id = `category-${category.replace(/\s/g, '-')}`;
        const ref = sectionRefs.current[id];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // Check if the section top is near the combined sticky bars
          if (rect.top <= headerHeight + 100 && rect.bottom > headerHeight) {
            newActiveCategory = category;
            break;
          }
        }
      }
      setCurrentActiveCategory(newActiveCategory);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCategories]);


  // Ensure the active tab is visible in the horizontal scroll area
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-category="${currentActiveCategory}"]`) as HTMLElement;
      if (activeElement) {
        // Scroll the horizontal bar to center the active element
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const elementOffset = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;
        
        scrollContainerRef.current.scrollTo({
          left: elementOffset - containerWidth / 2 + elementWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentActiveCategory]);


  return (
    <div className="w-full">
      
      {/* Sticky Location and Delivery Info Bar (top-16 = 64px) */}
      <div className="sticky top-16 z-30">
        <LocationDeliveryInfo 
          currentCity="Curitiba" 
          deliveryTime="35-45 min" 
          onLocationChange={() => toast.info("Funcionalidade de seleção de unidade será implementada aqui.")}
        />
      </div>

      {/* Sticky Category Navigation Bar (top-[112px] = 64px + 48px) */}
      <div className="sticky top-[112px] z-20 bg-background border-b border-border shadow-sm">
        <ScrollArea className="w-full whitespace-nowrap">
          <div ref={scrollContainerRef} className="flex space-x-2 p-2 container mx-auto px-4 md:px-6">
            {visibleCategories.map((category) => (
              <Button
                key={category}
                data-category={category}
                variant={currentActiveCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-shrink-0 rounded-full transition-colors",
                  currentActiveCategory === category ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
                )}
                onClick={() => scrollToCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Cardápio Completo
        </h1>
        
        {/* Search Bar (Desktop) */}
        <div className="relative mb-6 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar no cardápio"
            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid de Produtos */}
        {filteredProducts.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filteredProducts.length} produtos encontrados
            </p>
            {visibleCategories.map((category) => {
              const categoryProducts = groupedProducts[category].filter(p => filteredProducts.includes(p));
              
              // Only render category section if it contains filtered products
              if (categoryProducts.length === 0) return null;

              return (
                <ProductCategorySection 
                  key={category}
                  ref={el => { sectionRefs.current[`category-${category.replace(/\s/g, '-')}`] = el; }}
                  category={category} 
                  products={categoryProducts} 
                />
              );
            })}
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">Nenhum produto encontrado.</p>
            <p className="text-sm">Tente ajustar sua busca ou filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};