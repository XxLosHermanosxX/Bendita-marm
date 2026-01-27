"use client";

import Image from "next/image";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { X, Plus, Minus, Trash2, Truck, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getDeliveryFee, 
    getTotal,
    getFreeDeliveryProgress,
    isDeliveryAvailable 
  } = useStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const freeDeliveryProgress = getFreeDeliveryProgress();
  const remainingForFreeDelivery = Math.max(0, 80 - subtotal);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-[#003366] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="font-bold text-lg">Seu Pedido</h2>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free Delivery Progress */}
          {items.length > 0 && (
            <div className="p-4 bg-[#7CFC00]/10 border-b">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-[#003366]" />
                {freeDeliveryProgress >= 100 ? (
                  <span className="text-sm font-bold text-[#003366]">
                    Frete GRÁTIS!
                  </span>
                ) : (
                  <span className="text-sm text-[#003366]">
                    Faltam <strong>{formatCurrency(remainingForFreeDelivery)}</strong> para frete grátis
                  </span>
                )}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#7CFC00] rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-400 mt-1">Adicione itens do cardápio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-white shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-[#003366] truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-[#FF8C00] font-bold text-sm mt-1">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full bg-[#FF8C00] text-white flex items-center justify-center hover:bg-[#FF8C00]/90 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto h-7 w-7 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4 bg-white">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxa de entrega</span>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-[#7CFC00]" : ""}`}>
                    {deliveryFee === 0 ? "GRÁTIS" : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#003366] pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {isDeliveryAvailable ? (
                <Link href="/checkout" onClick={onClose}>
                  <button className="w-full h-14 rounded-xl bg-[#FF8C00] text-white font-bold text-lg hover:bg-[#FF8C00]/90 transition-all active:scale-[0.98]">
                    Finalizar Pedido
                  </button>
                </Link>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Informe seu CEP para finalizar
                  </p>
                  <button 
                    onClick={onClose}
                    className="w-full h-14 rounded-xl bg-gray-200 text-gray-600 font-bold text-lg cursor-not-allowed"
                  >
                    Verificar CEP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
