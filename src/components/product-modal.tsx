"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Utensils } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/use-cart-store";
import { Separator } from "@/components/ui/separator";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  // Placeholder for selected variation logic (since current products don't have variations)
  const selectedPrice = product.price; 

  const handleAddToCart = () => {
    // Placeholder para lógica de variação, se houver
    const selectedVariation = product.variations && product.variations.length > 0 
      ? { name: product.variations[0].name, option: product.variations[0].options[0] } // Usando a primeira variação/opção como placeholder
      : undefined;

    addItem(product, quantity, selectedVariation, notes);
    setQuantity(1);
    setNotes("");
    onClose();
  };

  const totalItemPrice = selectedPrice * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="object-center"
          />
        </div>
        
        <div className="p-6 pt-0 space-y-4">
          <DialogHeader className="text-left">
            {/* DialogTitle é obrigatório para acessibilidade */}
            <DialogTitle className="text-2xl font-bold text-foreground">
              {product.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </DialogHeader>

          {/* Ingredientes (Placeholder) */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-semibold flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" /> Ingredientes
              </h4>
              <p className="text-sm text-muted-foreground">
                {product.ingredients.join(", ")}
              </p>
            </div>
          )}

          {/* Variações (Placeholder) */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-semibold">Opções</h4>
              {/* Implementação de RadioGroup ou Select para variações aqui */}
              <p className="text-sm text-muted-foreground">
                Selecione uma variação.
              </p>
            </div>
          )}

          <Separator />

          {/* Notas e Quantidade */}
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
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-6 py-6"
              >
                Adicionar {formatCurrency(totalItemPrice)}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};