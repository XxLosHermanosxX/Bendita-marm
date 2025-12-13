"use client";

import React from "react";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Package, Gift } from "lucide-react";

interface OrderSummaryProps {
  deliveryFee: number;
  discount: number;
}

export const OrderSummary = ({ deliveryFee, discount }: OrderSummaryProps) => {
  const { items, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-foreground">Resumo do Pedido</h2>
      <ul className="mb-4 space-y-4">
        {items.map((item) => (
            <li key={`${item.product.id}-${item.details?.selectedVariation?.option.label || ''}-${item.details?.customItems?.map((c: { name: string }) => c.name).join('-') || ''}-${item.freeAddons?.map(a => `${a.id}:${a.quantity}`).join(',') || ''}`} className="flex flex-col justify-between text-sm border-b border-border/50 pb-2 last:border-b-0">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">
                  {item.quantity}x {item.product.name}
                  {item.details?.selectedVariation && (
                      <span className="text-xs"> ({item.details.selectedVariation.option.label})</span>
                  )}
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(item.quantity * (item.details?.selectedVariation?.option.price || item.product.price))}
                </span>
              </div>
              {/* Detalhes dos Itens Personalizados */}
              {item.details?.customItems && item.details.customItems.length > 0 && (
                  <div className="mt-1 pl-4 text-xs text-muted-foreground italic">
                      <p className="font-semibold flex items-center gap-1">
                          <Package className="h-3 w-3" /> Itens:
                      </p>
                      {item.details.customItems.map((customItem: { name: string; count: number }, index: number) => (
                          <p key={index}>
                              - {customItem.count}x {customItem.name}
                          </p>
                      ))}
                  </div>
              )}
              {/* Adicionais Gratuitos */}
              {item.freeAddons && item.freeAddons.length > 0 && (
                  <div className="mt-1 pl-4 text-xs text-muted-foreground italic">
                      <p className="font-semibold text-success flex items-center gap-1">
                          <Gift className="h-3 w-3" /> Adicionais (Cortesia):
                      </p>
                      {item.freeAddons.map((addon, index) => (
                          <p key={index}>
                              - {addon.quantity}x {addon.name}
                          </p>
                      ))}
                  </div>
              )}
              {item.notes && (
                <p className="text-xs text-muted-foreground italic mt-1">Obs: {item.notes}</p>
              )}
            </li>
        ))}
      </ul>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxa de Entrega:</span>
          <span className="font-medium">{formatCurrency(deliveryFee)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="text-muted-foreground">Desconto:</span>
            <span className="font-medium">- {formatCurrency(discount)}</span>
          </div>
        )}
        <Separator className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};