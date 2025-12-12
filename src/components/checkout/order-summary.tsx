"use client";

import React from "react";
import { Address, UserData, Coupon } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, MapPin, User, Tag, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";

interface OrderSummaryProps {
  address: Address;
  userData: UserData;
  coupon: Coupon | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  onFinalize: () => void;
  onBack: () => void;
}

export const OrderSummary = ({
  address,
  userData,
  coupon,
  subtotal,
  deliveryFee,
  discount,
  total,
  onFinalize,
  onBack,
}: OrderSummaryProps) => {
  const { items } = useCartStore();

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
        <ShoppingBag className="h-5 w-5" /> 4. Resumo do Pedido
      </h3>

      {/* Detalhes do Cliente e Endereço */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Endereço */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" /> Endereço
          </h4>
          <p className="text-sm text-muted-foreground">
            {address.street}, {address.number} {address.complement && `(${address.complement})`}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.neighborhood} - {address.city}/{address.state}
          </p>
          <p className="text-xs text-muted-foreground">CEP: {address.cep}</p>
        </div>

        {/* Dados Pessoais */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2 text-foreground">
            <User className="h-4 w-4 text-muted-foreground" /> Contato
          </h4>
          <p className="text-sm text-muted-foreground">{userData.name}</p>
          <p className="text-sm text-muted-foreground">{userData.email}</p>
          <p className="text-sm text-muted-foreground">{userData.phone}</p>
        </div>
      </div>

      <Separator />

      {/* Itens do Pedido */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Itens ({items.length})</h4>
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col justify-between text-sm border-b border-border/50 pb-2 last:border-b-0">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">
                  {item.quantity}x {item.name}
                  {item.selectedVariation && (
                      <span className="text-xs"> ({item.selectedVariation.option.label})</span>
                  )}
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(item.quantity * (item.selectedVariation?.option.price || item.price))}
                </span>
              </div>
              
              {/* Detalhes dos Itens Personalizados */}
              {item.customItems && item.customItems.length > 0 && (
                  <div className="mt-1 pl-4 text-xs text-muted-foreground italic">
                      {item.customItems.map((customItem, index) => (
                          <p key={index}>
                              {customItem.count}x {customItem.name}
                          </p>
                      ))}
                  </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Totais */}
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" /> Valores
        </h4>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Desconto ({coupon?.code || 'Nenhum'}):</span>
          <span className="text-destructive">-{formatCurrency(discount)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Taxa de Entrega:</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-xl font-bold text-primary">
          <span>Total a Pagar:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <Button type="button" onClick={onFinalize} className="bg-primary hover:bg-primary/90 text-lg py-6">
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
};