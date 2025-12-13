"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Utensils, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { getUpsellProducts } from "@/lib/product-utils";
import { Product } from "@/types";
import { useExtrasStore, ExtraItem } from "@/store/use-extras-store"; // Importando o novo store
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Lista de adicionais gratuitos
const FREE_EXTRAS: ExtraItem[] = [
    'Wasabi Extra',
    'Gengibre (Gari) Extra',
    'Molho Tarê Extra',
    'Hashi Extra (Par)',
    'Cream Cheese Extra',
];

// Componente interno para o card de upsell
const UpsellCard = ({ product }: { product: Product }) => {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        // Adiciona 1 unidade do produto sugerido
        addItem(product, 1);
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

// Componente interno para os adicionais
const ExtraItemSelector = ({ item }: { item: ExtraItem }) => {
    const quantity = useExtrasStore((state) => state.getExtraQuantity(item));
    const setQuantity = useExtrasStore((state) => state.setExtraQuantity);

    const isChecked = quantity > 0;

    const handleToggle = () => {
        if (isChecked) {
            setQuantity(item, 0);
        } else {
            // Default to 1 when checking the box
            setQuantity(item, 1);
        }
    };

    const handleIncrement = () => setQuantity(item, quantity + 1);
    const handleDecrement = () => setQuantity(item, quantity - 1);

    return (
        <div className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center space-x-3">
                <Checkbox 
                    id={item} 
                    checked={isChecked}
                    onCheckedChange={handleToggle}
                    className="h-5 w-5"
                />
                <Label htmlFor={item} className="text-sm font-medium cursor-pointer">
                    {item} <span className="text-xs text-muted-foreground">(Grátis)</span>
                </Label>
            </div>
            
            {isChecked && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleIncrement}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};


export const UpsellModal = ({ isOpen, onClose }: UpsellModalProps) => {
    const router = useRouter();
    const upsellProducts = getUpsellProducts();
    const totalCartItems = useCartStore((state) => state.getTotalItems());

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Ajustando o DialogContent para melhor responsividade e scroll no mobile */}
            <DialogContent className="sm:max-w-[450px] w-[95%] max-w-full md:max-w-[450px] p-0 overflow-hidden data-[state=open]:slide-in-from-bottom data-[state=open]:sm:slide-in-from-right flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 pb-4 border-b bg-secondary/50 flex-shrink-0">
                    <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary" /> Adicionado ao Carrinho!
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Seu pedido está ficando delicioso. Que tal adicionar algo mais?
                    </p>
                </DialogHeader>

                {/* Conteúdo com scroll */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    
                    {/* Seção de Adicionais Gratuitos */}
                    <div className="space-y-3 p-4 border rounded-lg bg-background">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-primary" /> Adicionais Gratuitos
                        </h3>
                        <div className="space-y-1">
                            {FREE_EXTRAS.map(item => (
                                <ExtraItemSelector key={item} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Seção de Sugestões de Upsell */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Sugestões para o seu pedido:</h3>
                        
                        <div className="space-y-3">
                            {upsellProducts.map(product => (
                                <UpsellCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rodapé fixo */}
                <div className="p-6 pt-4 flex justify-between gap-3 border-t flex-shrink-0">
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
                            router.push('/checkout');
                        }}
                    >
                        Finalizar Pedido ({totalCartItems} itens)
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};