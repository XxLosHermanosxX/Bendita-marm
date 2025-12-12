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

// Mapeamento de limites (opcional, mas bom para validação)
const ITEM_LIMITS: { [key: string]: number } = {
  "Sashimi Salmão": 10,
  "Niguiri Salmão": 10,
  "Uramaki Filadélfia": 20,
  "Hot Filadélfia": 20,
  "Hossomaki Salmão": 20,
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

  const handleItemQuantityChange = (item: keyof typeof INITIAL_COMBINED_ITEMS, delta: number) => {
    setSelectedItems(prev => {
      const currentCount = prev[item];
      const newCount = Math.max(0, currentCount + delta);
      
      // Limite individual (se aplicável)
      const limit = ITEM_LIMITS[item] || 80;
      const limitedCount = Math.min(newCount, limit);

      // Limite total de 80 peças
      const currentTotal = totalPieces;
      
      if (delta > 0) {
        // Tentando adicionar
        if (currentTotal < 80 && limitedCount > currentCount) {
          return { ...prev, [item]: limitedCount };
        }
      } else if (delta < 0) {
        // Tentando remover
        return { ...prev, [item]: limitedCount };
      }
      
      return prev;
    });
  };

  const handleAddToCart = () => {
    if (isCustomCombined && totalPieces !== 80) {
      // Aqui você pode adicionar um toast de erro se necessário
      console.error("Selecione exatamente 80 peças.");
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
            <DialogTitle className="text-2xl font-bold text-foreground">
              {product.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </DialogHeader>

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

              <div className="space-y-3">
                {Object.entries(INITIAL_COMBINED_ITEMS).map(([item, initialCount]) => {
                  const currentCount = selectedItems[item as keyof typeof INITIAL_COMBINED_ITEMS];
                  const limit = ITEM_LIMITS[item];
                  
                  return (
                    <div key={item} className="flex items-center justify-between">
                      <Label className="text-sm font-normal w-2/3">
                        {item} 
                        <span className="text-xs text-muted-foreground ml-2">
                          (Máx: {limit})
                        </span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleItemQuantityChange(item as keyof typeof INITIAL_COMBINED_ITEMS, -1)}
                          disabled={currentCount === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-md font-semibold w-6 text-center">{currentCount}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleItemQuantityChange(item as keyof typeof INITIAL_COMBINED_ITEMS, 1)}
                          disabled={totalPieces >= 80 || currentCount >= limit}
                        >
                          <Plus className="h-4 w-4" />
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