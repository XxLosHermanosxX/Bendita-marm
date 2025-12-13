"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { getUpsellProducts } from "@/lib/product-utils";
import { Product } from "@/types";
import { toast } from "sonner";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Componente interno para o card de upsell
const UpsellCard = ({ product, onClose }: { product: Product, onClose: () => void }) => {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        // Adiciona 1 unidade do produto sugerido
        addItem(product, 1);
        // Não fecha o modal, permitindo que o usuário adicione mais sugestões
        // toast.success(`${product.name} adicionado!`); // addItem already shows toast
    };

    return (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.description.substring(0, 40)}...</p>
                <p className="text-sm font-bold text-primary mt-1">{formatCurrency(product.price)}</p>
            </div>
            <Button 
                size="icon" 
                className="h-8 w-8 flex-shrink-0 bg-primary hover:bg-primary/90"
                onClick={handleAdd}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};


export const UpsellModal = ({ isOpen, onClose }: UpsellModalProps) => {
    const upsellProducts = getUpsellProducts();
    const totalCartItems = useCartStore((state) => state.getTotalItems());

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b bg-secondary/50">
                    <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary" /> Adicionado ao Carrinho!
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Seu pedido está ficando delicioso. Que tal adicionar algo mais?
                    </p>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Sugestões para o seu pedido:</h3>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {upsellProducts.map(product => (
                            <UpsellCard key={product.id} product={product} onClose={onClose} />
                        ))}
                    </div>

                    <div className="pt-4 flex justify-between gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1"
                        >
                            Continuar Comprando
                        </Button>
                        <Button 
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => {
                                onClose();
                                // Redireciona para o checkout
                                window.location.href = '/checkout';
                            }}
                        >
                            Finalizar Pedido ({totalCartItems} itens)
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};