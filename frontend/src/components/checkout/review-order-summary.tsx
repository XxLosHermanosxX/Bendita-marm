"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { OrderSummary } from "./order-summary"; // Reusing the existing summary component

interface ReviewOrderSummaryProps {
  deliveryFee: number;
  discount: number;
}

export const ReviewOrderSummary = ({ deliveryFee, discount }: ReviewOrderSummaryProps) => {
  const { items, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee - discount;
  
  // Começa aberto
  const [isOpen, setIsOpen] = useState(true);

  // Efeito para fechar após 5 segundos
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 5000); // 5000 milissegundos = 5 segundos
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border bg-card shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">
            Resumo do Pedido ({items.length} itens)
          </h4>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto p-1 text-primary">
            {isOpen ? "Ver menos" : "Ver mais"}
            {isOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>
        </CollapsibleTrigger>
      </div>

      <div className="mt-2 flex justify-between text-sm font-medium">
        <span className="text-muted-foreground">Total:</span>
        {/* Alterando a cor do total para verde */}
        <span className="text-lg font-bold text-green-600">{formatCurrency(total)}</span>
      </div>

      <CollapsibleContent className="space-y-4 pt-4">
        <Separator />
        {/* Reusing OrderSummary component for detailed view */}
        <OrderSummary deliveryFee={deliveryFee} discount={discount} />
      </CollapsibleContent>
    </Collapsible>
  );
};