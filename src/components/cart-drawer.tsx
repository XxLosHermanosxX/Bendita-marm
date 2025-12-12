"use client";
import React from "react";
import Image from "next/image";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const isMobile = useIsMobile();
  
  const subtotal = getSubtotal();
  const deliveryFee = 0; // Placeholder for delivery fee
  const total = subtotal + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"} 
        className={`flex flex-col ${isMobile ? "h-[90vh] rounded-t-xl" : "w-full sm:max-w-md"}`}
      >
        <SheetHeader className={isMobile ? "pb-4" : ""}>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>
        <Separator />
        
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p className="text-lg">Seu carrinho está vazio.</p>
              <p className="text-sm">Adicione alguns itens deliciosos!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li 
                  key={`${item.id}-${item.selectedVariation?.option.label || ''}-${item.customItems?.map(c => c.name).join('-') || ''}`} 
                  className="flex items-center gap-4"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      layout="fill" 
                      objectFit="cover" 
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-foreground">
                        {item.name}
                        {item.selectedVariation && (
                          <span className="block text-xs text-muted-foreground">
                            ({item.selectedVariation.option.label})
                          </span>
                        )}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(
                          item.id, 
                          item.selectedVariation?.name, 
                          item.selectedVariation?.option.label
                        )}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Detalhes dos Itens Personalizados (para o combinado de 80 peças) */}
                    {item.customItems && item.customItems.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                            {item.customItems.map((customItem, index) => (
                                <p key={index} className="text-xs text-muted-foreground italic">
                                    {customItem.count}x {customItem.name}
                                </p>
                            ))}
                        </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-1">
                      {formatCurrency(item.selectedVariation?.option.price || item.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        {/* O controle de quantidade só faz sentido para produtos não personalizados */}
                        {!(item.customItems && item.customItems.length > 0) && (
                            <>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(
                                    item.id, 
                                    item.quantity - 1,
                                    item.selectedVariation?.name,
                                    item.selectedVariation?.option.label
                                  )}
                                  disabled={item.quantity === 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(
                                    item.id, 
                                    item.quantity + 1,
                                    item.selectedVariation?.name,
                                    item.selectedVariation?.option.label
                                  )}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                        {item.customItems && item.customItems.length > 0 && (
                            <span className="text-sm font-medium text-primary">
                                {item.quantity}x (80 Peças)
                            </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(item.quantity * (item.selectedVariation?.option.price || item.price))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <SheetFooter className="flex flex-col gap-2 p-4 border-t border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxa de Entrega:</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary mt-2">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Link href="/checkout" passHref>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              disabled={items.length === 0}
              onClick={onClose}
            >
              Ir para Checkout
            </Button>
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};