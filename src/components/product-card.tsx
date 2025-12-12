"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { ProductModal } from "./product-modal";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    if (product.variations && product.variations.length > 0 || product.id === "p30") {
      // If product has variations or is the custom combo, open modal
      setIsModalOpen(true);
    } else {
      // For simple products, add directly to cart with default quantity 1
      addItem(product, 1); // Corrected: added quantity argument
    }
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden bg-secondary">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddToCart}
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ProductModal 
          product={product} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};