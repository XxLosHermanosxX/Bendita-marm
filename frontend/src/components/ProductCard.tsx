"use client";

import Image from "next/image";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { Plus, Star } from "lucide-react";
import { Product } from "@/types";
import { useState, useRef } from "react";

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { addItem, isDeliveryAvailable } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isDeliveryAvailable) {
      // Scroll to top for CEP input
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    // Add to cart animation
    setIsAdding(true);
    addItem(product);
    
    // Fly animation
    if (cardRef.current) {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const cartButton = document.querySelector('[data-testid="cart-button"]');
      
      if (cartButton) {
        const cartRect = cartButton.getBoundingClientRect();
        const flyElement = document.createElement("div");
        flyElement.className = "fixed z-[100] pointer-events-none";
        flyElement.style.cssText = `
          left: ${rect.left + rect.width / 2 - 20}px;
          top: ${rect.top + 40}px;
          width: 40px;
          height: 40px;
          background: #FF8C00;
          border-radius: 50%;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        document.body.appendChild(flyElement);
        
        requestAnimationFrame(() => {
          flyElement.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
          flyElement.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
          flyElement.style.transform = "scale(0)";
          flyElement.style.opacity = "0";
        });
        
        setTimeout(() => {
          flyElement.remove();
          setIsAdding(false);
        }, 600);
      }
    }
    
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenModal(product)}
      className="group relative cursor-pointer"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-44 bg-gradient-to-br from-[#003366]/5 to-[#FF8C00]/5 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-full bg-[#003366] text-white text-[10px] font-bold uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-[#003366] text-lg leading-tight mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3 min-h-[40px]">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">A partir de</span>
              <p className="text-[#FF8C00] font-bold text-xl">
                {formatCurrency(product.price)}
              </p>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                isAdding 
                  ? "bg-[#7CFC00] scale-110" 
                  : "bg-[#FF8C00] hover:bg-[#FF8C00]/90 hover:scale-110"
              }`}
            >
              <Plus className={`h-6 w-6 text-white transition-transform ${isAdding ? "rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
