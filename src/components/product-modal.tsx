"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Utensils, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAddonsStore } from "@/store/use-addons-store";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const openAddonsModal = useAddonsStore((state) => state.openModal);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  // State to store selected options for each variation
  const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: any }>({});
  
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if the product has variations
  const hasVariations = product.variations && product.variations.length > 0;

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setQuantity(1);
      setNotes("");
      
      // Initialize default selections for variations (select first option by default)
      if (hasVariations && product.variations) {
        const initialSelections: { [key: string]: any } = {};
        product.variations.forEach(variation => {
          if (variation.options.length > 0) {
            initialSelections[variation.name] = variation.options[0];
          }
        });
        setSelectedVariations(initialSelections);
      }
    }
  }, [isOpen, product, hasVariations]);

  const handleContinue = () => {
    // Pass the configured item to the Addons Modal
    openAddonsModal({
      product: product,
      quantity: quantity,
      details: undefined,
      notes: notes,
      selectedVariations: selectedVariations,
    });

    // Close the current modal
    onClose();
  };

  const handleVariationSelect = (variationName: string, option: any) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: option
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative h-64 w-full">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            layout="fill" 
            objectFit="cover" 
            className="object-center" 
            quality={100}
          />
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
          className="flex-1 overflow-y-auto p-6 pt-4 space-y-6"
        >
          {/* Ingredients/Details */}
          <div className="space-y-2">
            <h4 className="text-md font-semibold flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Detalhes
            </h4>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Variations Section */}
          {hasVariations && product.variations?.map((variation, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-md font-semibold">{variation.name}</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {variation.options.map((option, optIndex) => {
                  const isSelected = selectedVariations[variation.name]?.label === option.label;
                  
                  return (
                    <div 
                      key={optIndex}
                      onClick={() => handleVariationSelect(variation.name, option)}
                      className={cn(
                        "relative flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-accent/50",
                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                      )}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className={cn(
                          "h-4 w-4 rounded-full border border-primary flex items-center justify-center",
                          isSelected ? "bg-primary" : "bg-transparent"
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      
                      {/* Image if available */}
                      {option.imageUrl && (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-muted">
                          <Image 
                            src={option.imageUrl} 
                            alt={option.label} 
                            layout="fill" 
                            objectFit="cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          {option.price > 0 && (
                            <span className="text-sm font-semibold text-primary">
                              + {formatCurrency(option.price)}
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}

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
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                ref={buttonRef}
                onClick={handleContinue}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6 shadow-md"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
