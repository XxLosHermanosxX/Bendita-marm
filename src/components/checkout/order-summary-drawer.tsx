"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { OrderSummary } from "./order-summary";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryFee: number;
  discount: number;
}

export const OrderSummaryDrawer = ({ isOpen, onClose, deliveryFee, discount }: OrderSummaryDrawerProps) => {
  const { items } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Resumo do Pedido</SheetTitle>
          <SheetDescription>
            Confira os detalhes e o valor total da sua compra.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Order Summary Totals */}
          <OrderSummary deliveryFee={deliveryFee} discount={discount} />

          <Separator />

          {/* Cart Items Mini Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Itens no Carrinho ({items.length})</h3>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex justify-between text-sm items-center"
                >
                  <span className="text-muted-foreground max-w-[70%] truncate">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium text-right">
                    {formatCurrency(
                      item.quantity *
                        (item.details?.selectedVariation?.option.price ||
                          item.product.price)
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};