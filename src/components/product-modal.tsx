"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Utensils } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAddonsStore } from "@/store/use-addons-store";
import { toast } from "sonner";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const openAddonsModal = useAddonsStore((state) => state.openModal);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if the product has variations (like the Combo Bendito or Refrigerante)
  const hasVariations = product.variations && product.variations.length > 0;

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setQuantity(1);
      setNotes("");
      
      // No auto-scroll needed for the new menu structure
    }
  }, [isOpen]);

  const handleContinue = () => {
    // Pass the configured item to the Addons Modal
    openAddonsModal({
      product: product,
      quantity: quantity,
      details: undefined, // No complex details needed for marmitas
      notes: notes,
    });

    // Close the current modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative h-64 w-full">
          <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" className="object-center" />
        </div>
        
        <DialogHeader className="text-left p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {product.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {product.description}
          </p>
        </DialogHeader>
        
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6 pt-4 space-y-4"
        >
          {/* Ingredients/Details (using description for marmitas) */}
          <div className="space-y-2">
            <h4 className="text-md font-semibold flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Detalhes da Marmita
            </h4>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Simple Variations (if they exist, e.g., Refrigerante flavor) */}
          {hasVariations && product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-semibold">Opções</h4>
              <p className="text-sm text-muted-foreground">
                Selecione uma variação. (Implementação futura)
              </p>
            </div>
          )}

          <Separator />

          {/* Notes and General Quantity */}
          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="text-sm font-medium text-foreground block mb-2">
                Observações (Ex: Sem feijão, mais arroz)
              </label>
              <Textarea 
                id="notes" 
                placeholder="Adicione notas especiais para o preparo..." 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="resize-none focus-visible:ring-primary" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                ref={buttonRef}
                onClick={handleContinue}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-6 py-6"
              >
                Continuar ({formatCurrency(product.price * quantity)})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};