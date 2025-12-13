"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { LocationDeliveryInfo } from "@/components/location-delivery-info";
import { toast } from "sonner";
import { PartnerLogosScroll } from "./partner-logos-scroll"; // Importando o novo componente

// Helper component for category section
const ProductCategorySection = React.forwardRef<HTMLDivElement, { category: string, products: Product[] }>(({ category, products }, ref) => {
  return (
    <section ref={ref} id={`category-${category.replace(/\s/g, '-')}`} className="mb-8 pt-4">
      {/* Título da categoria que se sobrepõe ao rolar. Ajustado para 112px (64px Header + 48px Location Bar) */}
      <h2 className="text-2xl font-bold text-foreground mb-4 sticky top-[112px] bg-background z-10 py-2 border-b border-border/50">
        {category}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
});
ProductCategorySection.displayName = 'ProductCategorySection';


interface MenuLayoutProps {
  activeCategory: string;
  visibleCategories: string[];
  groupedProducts: Record<string, Product[]>;
}

export const MenuLayout = ({ activeCategory: initialActiveCategory, visibleCategories, groupedProducts }: MenuLayoutProps) => {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory);
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
      setActiveCategory(category);
    }
  };

  // Handle scroll observation to update active category
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = STICKY_OFFSET;
      let currentActiveCategory = visibleCategories[0];

      for (const category of visibleCategories) {
        const id = `category-${category.replace(/\s/g, '-')}`;
        const ref = sectionRefs.current[id];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // Check if the section top is near the combined sticky bars
          if (rect.top <= headerHeight + 100 && rect.bottom > headerHeight) {
            currentActiveCategory = category;
            break;
          }
        }
      }
      setActiveCategory(currentActiveCategory);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCategories]);


  // Ensure the active tab is visible in the horizontal scroll area
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-category="${activeCategory}"]`) as HTMLElement;
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
  }, [activeCategory]);


  return (
    <div className="w-full">
      
      {/* Sticky Location and Delivery Info Bar (top-16 = 64px) */}
      <div className="sticky top-16 z-30">
        <LocationDeliveryInfo 
          onLocationChange={() => toast.info("Funcionalidade de seleção de unidade será implementada aqui.")}
        />
      </div>

      {/* Sticky Category Navigation Bar (top-[112px] = 64px + 48px) */}
      <div className="sticky top-[112px] z-20 bg-background border-b border-border shadow-sm">
        <ScrollArea className="w-full whitespace-nowrap">
          <div ref={scrollContainerRef} className="flex space-x-2 p-2">
            {visibleCategories.map((category) => (
              <Button
                key={category}
                data-category={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-shrink-0 rounded-full transition-colors",
                  activeCategory === category ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
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
      
      {/* Partner Logos Scroll (New Section) */}
      <PartnerLogosScroll />

      {/* Product Sections */}
      <div className="p-4">
        {visibleCategories.map((category) => (
          <ProductCategorySection 
            key={category}
            ref={el => { sectionRefs.current[`category-${category.replace(/\s/g, '-')}`] = el; }}
            category={category} 
            products={groupedProducts[category]} 
          />
        ))}
      </div>
    </div>
  );
};