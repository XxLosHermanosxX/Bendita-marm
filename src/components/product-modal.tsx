"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Utensils, Package } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils"; // Importando cn
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/use-cart-store";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // <-- Added import

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

// Define a estrutura inicial para o combinado de 80 peças
const INITIAL_COMBINED_ITEMS = {
  "Sashimi Salmão": 0,
  "Niguiri Salmão": 0,
  "Uramaki Filadélfia": 0,
  "Hot Filadélfia": 0,
  "Hossomaki Salmão": 0,
};

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState(INITIAL_COMBINED_ITEMS);
  
  // Verifica se o produto é o combinado de 80 peças
  const isCustomCombined = product.id === "p30";

  useEffect(() => {
    if (isOpen) {
      // Resetar o estado ao abrir o modal
      setQuantity(1);
      setNotes("");
      if (isCustomCombined) {
        setSelectedItems(INITIAL_COMBINED_ITEMS);
      }
    }
  }, [isOpen, isCustomCombined]);

  const totalPieces = useMemo(() => {
    if (!isCustomCombined) return 0;
    return Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  }, [selectedItems, isCustomCombined]);

  const remainingPieces = isCustomCombined ? 80 - totalPieces : 0;
  const selectedPrice = product.price; 
  const totalItemPrice = selectedPrice * quantity;

  const handleSetItemQuantity = (item: keyof typeof INITIAL_COMBINED_ITEMS, newCount: number) => {
    setSelectedItems(prev => {
      const currentCount = prev[item];
      
      // Ensure non-negative
      let limitedCount = Math.max(0, newCount); 

      // 1. Check total limit (80)
      const currentTotalExcludingItem = totalPieces - currentCount;
      let newTotal = currentTotalExcludingItem + limitedCount;

      if (newTotal > 80) {
        // If the new total exceeds 80, adjust the limitedCount down
        limitedCount = 80 - currentTotalExcludingItem;
        limitedCount = Math.max(0, limitedCount); // Ensure non-negative
        newTotal = 80; // Set new total to 80

        // If the user tried to set a quantity higher than the limit allows, show a warning
        if (limitedCount < newCount) {
             toast.warning(`Limite total de 80 peças atingido.`);
        }
      }
      
      // If the resulting count is different, update the state
      if (limitedCount !== currentCount) {
        return { ...prev, [item]: limitedCount };
      }
      
      return prev;
    });
  };

  const handleAddToCart = () => {
    if (isCustomCombined && totalPieces !== 80) {
      toast.error(`Selecione exatamente 80 peças. Faltam ${80 - totalPieces} peças.`);
      return;
    }

    let details: { selectedVariation?: any, customItems?: any } | undefined = undefined;
    
    if (isCustomCombined) {
      details = {
        customItems: Object.entries(selectedItems)
          .filter(([, count]) => count > 0)
          .map(([name, count]) => ({ name, count: count as number })),
      };
    } else if (product.variations && product.variations.length > 0) {
        // Lógica para variações simples (placeholder)
        details = {
            selectedVariation: { name: product.variations[0].name, option: product.variations[0].options[0] }
        };
    }

    addItem(product, quantity, details, notes);
    setQuantity(1);
    setNotes("");
    setSelectedItems(INITIAL_COMBINED_ITEMS);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-y-auto max-h-[90vh]">
        <div className="relative h-64 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="object-center"
          />
        </div>
        
        {/* DialogHeader moved here, right after the image, to be a direct child of DialogContent */}
        <DialogHeader className="text-left p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {product.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {product.description}
          </p>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          {/* Seção de Seleção de Itens para Combinado Personalizado */}
          {isCustomCombined && (
            <div className="space-y-4 border p-4 rounded-lg bg-secondary/50">
              <h4 className="text-md font-semibold flex items-center gap-2 text-primary">
                <Package className="h-4 w-4" /> Monte seu Combinado (80 Peças)
              </h4>
              <div className="text-sm font-medium">
                Peças Selecionadas: {totalPieces} / 80 
                <span className={remainingPieces < 0 ? "text-destructive ml-2" : "text-muted-foreground ml-2"}>
                  ({remainingPieces} restantes)
                </span>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {Object.entries(INITIAL_COMBINED_ITEMS).map(([item, initialCount]) => {
                  const key = item as keyof typeof INITIAL_COMBINED_ITEMS;
                  const currentCount = selectedItems[key];
                  
                  // O limite efetivo agora é apenas o que falta para 80, mais o que já foi selecionado neste item.
                  const effectiveLimit = 80 - (totalPieces - currentCount);

                  return (
                    <div key={item} className="space-y-2 border-b pb-3 last:border-b-0">
                      <Label className="text-sm font-semibold block">
                        {item} 
                        <span className="text-xs text-muted-foreground ml-2 font-normal">
                          (Atual: {currentCount})
                        </span>
                      </Label>
                      
                      {/* Quick Selection Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {[1, 5, 10, 15, 20].map(amount => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 px-3",
                              currentCount === amount ? "bg-accent" : ""
                            )}
                            onClick={() => handleSetItemQuantity(key, amount)}
                            // Disable if setting this amount exceeds the effective limit
                            disabled={amount > effectiveLimit && amount > currentCount}
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>

                      {/* Manual Input */}
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="number"
                          min={0}
                          // Max agora é 80, mas a lógica de handleSetItemQuantity garante que o total não passe de 80.
                          max={80} 
                          placeholder="Qtd."
                          value={currentCount === 0 ? "" : currentCount}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleSetItemQuantity(key, value);
                            } else if (e.target.value === "") {
                              handleSetItemQuantity(key, 0);
                            }
                          }}
                          className="w-20 text-center h-9"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSetItemQuantity(key, 0)}
                          disabled={currentCount === 0}
                        >
                          Limpar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Ingredientes (Se não for o combinado personalizado) */}
          {!isCustomCombined && product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-semibold flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" /> Ingredientes
              </h4>
              <p className="text-sm text-muted-foreground">
                {product.ingredients.join(", ")}
              </p>
            </div>
          )}

          {/* Variações Simples (Se não for o combinado personalizado) */}
          {!isCustomCombined && product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-semibold">Opções</h4>
              {/* Implementação de RadioGroup ou Select para variações aqui */}
              <p className="text-sm text-muted-foreground">
                Selecione uma variação.
              </p>
            </div>
          )}

          <Separator />

          {/* Notas e Quantidade Geral (Apenas para produtos não combinados) */}
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
              {/* Controle de Quantidade Geral (Apenas para produtos não combinados) */}
              {!isCustomCombined && (
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
              )}
              
              <Button
                onClick={handleAddToCart}
                className={cn(
                  "bg-primary hover:bg-primary/90 text-primary-foreground text-base px-6 py-6",
                  isCustomCombined ? "w-full" : ""
                )}
                disabled={isCustomCombined && totalPieces !== 80}
              >
                {isCustomCombined ? (
                  totalPieces === 80 ? `Adicionar 80 Peças (${formatCurrency(product.price)})` : `Selecione 80 Peças`
                ) : (
                  `Adicionar ${formatCurrency(totalItemPrice)}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};