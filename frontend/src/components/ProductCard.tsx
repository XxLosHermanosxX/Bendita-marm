"use client";

import Image from "next/image";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useState, useCallback } from "react";

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { addItem, isDeliveryAvailable, requestLocation, locationStatus } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se não tem localização ainda, pedir permissão
    if (locationStatus === "idle") {
      requestLocation();
      return;
    }
    
    // Se não está na área de entrega, mostrar aviso
    if (!isDeliveryAvailable) {
      alert("Por favor, habilita tu ubicación para verificar si hacemos entregas en tu zona.");
      return;
    }
    
    // Adicionar ao carrinho com feedback visual
    setIsAdding(true);
    addItem(product, 1);
    
    // Animação de fly para o carrinho
    const cartButton = document.querySelector('[data-testid="cart-button"]');
    if (cartButton) {
      const flyDot = document.createElement("div");
      flyDot.className = "fixed z-[100] w-3 h-3 rounded-full bg-[#FF8C00] pointer-events-none";
      flyDot.style.cssText = `
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;
      document.body.appendChild(flyDot);
      
      const cartRect = cartButton.getBoundingClientRect();
      requestAnimationFrame(() => {
        flyDot.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyDot.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyDot.style.opacity = "0";
        flyDot.style.transform = "scale(2)";
      });
      
      setTimeout(() => flyDot.remove(), 500);
    }
    
    setTimeout(() => setIsAdding(false), 800);
  }, [addItem, isDeliveryAvailable, locationStatus, product, requestLocation]);

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group relative cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Card - Mobile Optimized */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image Container - Rounded */}
        <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
          <div className="relative w-full h-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500 rounded-2xl"
            />
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-full bg-[#003366] text-white text-[10px] font-bold uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          
          {/* Add Button - Floating */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`absolute bottom-2 right-2 h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 ${
              isAdding 
                ? "bg-[#7CFC00] scale-110" 
                : "bg-[#FF8C00] hover:bg-[#FF7000]"
            }`}
            data-testid={`add-to-cart-${product.id}`}
          >
            {isAdding ? (
              <Check className="h-6 w-6 text-white animate-in zoom-in" />
            ) : (
              <Plus className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-[#003366] text-base leading-tight mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 min-h-[32px]">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <p className="text-[#FF8C00] font-black text-lg">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
