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
import { UpsellModal } from "./upsell-modal";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);

  const handleAddToCart = () => {
    if (product.variations && product.variations.length > 0 || product.id === "p30") {
      // If product has variations or is the custom combo, open modal
      setIsModalOpen(true);
    } else {
      // For simple products, add directly to cart with default quantity 1
      addItem(product, 1);
      setIsUpsellOpen(true); // Open upsell modal immediately after adding
    }
  };
  
  const handleModalClose = (addedToCart: boolean) => {
    setIsModalOpen(false);
    if (addedToCart) {
        setIsUpsellOpen(true);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
        {/* Imagem: Usando aspect-square para consistência visual */}
        <div 
          className="relative w-full aspect-square overflow-hidden bg-secondary cursor-pointer"
          onClick={handleAddToCart} // Torna a imagem clicável
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-foreground line-clamp-2">{product.name}</h3>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground line-clamp-2 h-8 md:h-10">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-lg md:text-xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            
            {/* Botão Responsivo */}
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 h-auto md:px-4 md:py-2"
              onClick={handleAddToCart}
            >
              {/* Ícone e texto: Ícone no mobile, Ícone + Texto no desktop */}
              <Plus className="h-4 w-4 md:mr-2" /> 
              <span className="hidden md:inline">Adicionar</span>
            </Button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ProductModal 
          product={product} 
          isOpen={isModalOpen} 
          onClose={() => handleModalClose(false)} // Pass false if closed without adding
          onSuccess={() => handleModalClose(true)} // New prop for success
        />
      )}
      {isUpsellOpen && (
        <UpsellModal
            isOpen={isUpsellOpen}
            onClose={() => setIsUpsellOpen(false)}
        />
      )}
    </>
  );
};