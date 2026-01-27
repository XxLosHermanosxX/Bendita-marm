"use client";

import Image from "next/image";
import { useStore } from "@/store";
import { formatBRL, formatPYG } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useState } from "react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem, requestLocation, locationStatus } = useStore();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (locationStatus === "idle") {
      requestLocation();
    }

    setIsAdding(true);
    addItem(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 500);
  };

  const totalPrice = product.price * quantity;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal - Full screen mobile, centered desktop */}
      <div 
        className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:w-[calc(100%-2rem)] md:max-h-[90vh] bg-white z-[60] md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 z-[70] h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform safe-area-top"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-56 md:h-64 bg-gradient-to-br from-[#003366] to-[#002244] shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-8 animate-in zoom-in-50 duration-500"
          />
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] text-xs font-bold uppercase">
                {product.category}
              </span>
            </div>
            
            <h2 className="text-2xl font-black text-[#003366]">
              {product.name}
            </h2>
            
            <p className="text-gray-600 text-sm">
              {product.description}
            </p>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-3">
                  {t("ingredients")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
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
        <div className="border-t p-5 bg-white shrink-0 safe-area-bottom">
          <div className="flex items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 relative z-[70]">
              <button
                onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 h-14 rounded-xl font-bold flex flex-col items-center justify-center active:scale-[0.98] transition-all ${
                isAdding
                  ? "bg-[#7CFC00] text-[#003366]"
                  : "bg-[#FF8C00] text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-base">{formatBRL(totalPrice)}</span>
              </div>
              <span className="text-[10px] opacity-80 font-normal">{formatPYG(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
