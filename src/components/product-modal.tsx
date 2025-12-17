"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Utensils } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
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

  // Check if the product is the 80-piece combo
  const isCombo80 = product.id === "p30";

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setQuantity(1);
      setNotes("");
    }
  }, [isOpen]);

  const handleContinue = () => {
    // For the 80-piece combo, we'll pass the standard components in the description
    const details = isCombo80 ? {
      customItems: [
        { name: "20 Uramaki Filadélfia", count: 20 },
        { name: "20 Hot Filadélfia", count: 20 },
        { name: "20 Uramaki Salmão Grelhado", count: 20 },
        { name: "20 Hot Roll Tradicional", count: 20 }
      ]
    } : undefined;

    // Pass the configured item to the Addons Modal
    openAddonsModal({
      product: product,
      quantity: quantity,
      details: details,
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
        
        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
          {/* Special description for 80-piece combo */}
          {isCombo80 && (
            <div className="space-y-3 border p-4 rounded-lg bg-secondary/50">
              <h4 className="text-md font-semibold text-primary">
                Combo Padrão (80 Peças)
              </h4>
              <ul className="text-sm space-y-1">
                <li>• 20 Uramaki Filadélfia</li>
                <li>• 20 Hot Filadélfia</li>
                <li>• 20 Uramaki Salmão Grelhado</li>
                <li>• 20 Hot Roll Tradicional</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                Este é nosso combo padrão especial. Aproveite!
              </p>
            </div>
          )}

          {/* Ingredients (if not the 80-piece combo) */}
          {!isCombo80 && product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-semibold flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                Ingredientes
              </h4>
              <p className="text-sm text-muted-foreground">
                {product.ingredients.join(", ")}
              </p>
            </div>
          )}

          {/* Simple Variations (if not the 80-piece combo) */}
          {!isCombo80 && product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-semibold">Opções</h4>
              <p className="text-sm text-muted-foreground">
                Selecione uma variação.
              </p>
            </div>
          )}

          <Separator />

          {/* Notes and General Quantity */}
          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="text-sm font-medium text-foreground block mb-2">
                Observações (Ex: Sem cebolinha, sem tarê)
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