"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingCart, Package, Gift } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateItemQuantity, getTotalPrice } = useCartStore();
  const isMobile = useIsMobile();
  const router = useRouter();

  const subtotal = getTotalPrice();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" /> Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mb-4" />
            <p className="text-lg font-semibold">Seu carrinho está vazio.</p>
            <p className="text-sm text-center mt-2">
              Adicione alguns itens deliciosos para fazer seu pedido!
            </p>
            <Button onClick={onClose} className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              Ver Cardápio
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map((item) => (
                <li 
                  // Usando uma chave mais robusta que inclui freeAddons para diferenciar itens
                  key={`${item.product.id}-${item.details?.selectedVariation?.option.label || ''}-${item.details?.customItems?.map((c: { name: string }) => c.name).join('-') || ''}-${item.freeAddons?.map(a => `${a.id}:${a.quantity}`).join(',') || ''}`}
                  className="flex items-center gap-4"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-secondary">
                    <Image 
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      layout="fill"
                      objectFit="cover"
                      className="object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-foreground">
                          {item.product.name}
                          {item.details?.selectedVariation && (
                            <span className="block text-xs text-muted-foreground">
                              ({item.details.selectedVariation.option.label})
                            </span>
                          )}
                        </h3>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground italic mt-1">Obs: {item.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(
                          item.product.id,
                          item.details
                        )}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Detalhes dos Itens Personalizados (para o combinado de 80 peças) */}
                    {item.details?.customItems && item.details.customItems.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                            <p className="text-xs font-semibold text-primary flex items-center gap-1">
                                <Package className="h-3 w-3" /> Itens do Combinado:
                            </p>
                            {item.details.customItems.map((customItem: { name: string; count: number }, index: number) => (
                                <p key={index} className="text-xs text-muted-foreground italic">
                                    - {customItem.count}x {customItem.name}
                                </p>
                            ))}
                        </div>
                    )}
                    
                    {/* Adicionais Gratuitos */}
                    {item.freeAddons && item.freeAddons.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                            <p className="text-xs font-semibold text-success flex items-center gap-1">
                                <Gift className="h-3 w-3" /> Adicionais:
                            </p>
                            {item.freeAddons.map((addon, index) => (
                                <p key={index} className="text-xs text-muted-foreground italic">
                                    - {addon.quantity}x {addon.name}
                                </p>
                            ))}
                        </div>
                    )}


                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(item.details?.selectedVariation?.option.price || item.product.price)}
                      </p>
                      {/* O controle de quantidade só faz sentido para produtos não personalizados */}
                        {!(item.details?.customItems && item.details.customItems.length > 0) && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => updateItemQuantity(
                                            item.product.id,
                                            item.quantity - 1,
                                            item.details
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
                                        onClick={() => updateItemQuantity(
                                            item.product.id,
                                            item.quantity + 1,
                                            item.details
                                        )}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                        {item.details?.customItems && item.details.customItems.length > 0 && (
                            <span className="text-sm font-medium text-primary">
                                {item.quantity}x Combinado
                            </span>
                        )}
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(item.quantity * (item.details?.selectedVariation?.option.price || item.product.price))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-6 border-t space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                onClick={handleCheckout}
              >
                Finalizar Pedido
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};