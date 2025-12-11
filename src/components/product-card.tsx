"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { ProductModal } from "./product-modal"; // Importando o modal

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne que o clique no botão abra o modal
    // Se o produto tiver variações, abre o modal. Caso contrário, adiciona diretamente.
    if (product.variations && product.variations.length > 0) {
      setIsModalOpen(true);
    } else {
      addItem(product);
    }
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {(product.isNew || product.isExclusive) && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.isNew && (
                <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  NOVO
                </span>
              )}
              {product.isExclusive && (
                <span className="inline-flex items-center rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                  EXCLUSIVO
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {product.description}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {product.rating && (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviews} avaliações)
                </span>
              </>
            )}
          </div>
          <div className="flex items-baseline justify-between mt-auto">
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
            )}
            <Button onClick={handleAddToCart} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Adicionar
            </Button>
          </div>
        </div>
      </div>
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};