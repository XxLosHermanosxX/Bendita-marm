"use client";

import Image from "next/image";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useState } from "react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem, isDeliveryAvailable } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isDeliveryAvailable) {
      onClose();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsAdding(true);
    addItem(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 500);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal - Glassmorphism */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white/95 backdrop-blur-xl rounded-3xl z-50 shadow-2xl animate-in zoom-in-95 overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Product Image - Exploded View Style */}
          <div className="relative h-64 bg-gradient-to-br from-[#003366] to-[#003366]/80 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-8 animate-in zoom-in-50 duration-500"
            />
            
            {/* Floating effect background */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] text-xs font-bold uppercase">
                  {product.category}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-[#003366]">
                {product.name}
              </h2>
              
              <p className="text-gray-600">
                {product.description}
              </p>

              {/* Ingredients - Exploded View */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wider mb-3">
                    Ingredientes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Add to Cart */}
          <div className="border-t p-6 bg-white">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  isAdding
                    ? "bg-[#7CFC00] text-[#003366]"
                    : "bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Adicionar</span>
                <span className="ml-2">{formatCurrency(product.price * quantity)}</span>
              </button>
            </div>
            
            {!isDeliveryAvailable && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Informe seu CEP para adicionar ao carrinho
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
