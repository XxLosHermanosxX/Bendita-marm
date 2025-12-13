"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useAddonsStore } from "@/store/use-addons-store";
import { useCartStore } from "@/store/use-cart-store";
import { freeAddons, Addon } from "@/data/addons";
import { beverageProducts } from "@/data/products/bebidas";
import { FreeAddon, Product } from "@/types";
import { toast } from "sonner";

// Componente auxiliar para o card de adicional/sugestão
interface AddonCardProps {
    item: Addon | Product;
    type: 'free' | 'paid';
    onQuantityChange: (id: string, quantity: number) => void;
    currentQuantity: number;
}

const AddonCard = ({ item, type, onQuantityChange, currentQuantity }: AddonCardProps) => {
    const isPaid = type === 'paid';
    const price = isPaid ? (item as Product).price : 0;
    const name = item.name;
    const description = isPaid ? (item as Product).description : (item as Addon).description;

    const handleIncrement = () => onQuantityChange(item.id, currentQuantity + 1);
    const handleDecrement = () => onQuantityChange(item.id, Math.max(0, currentQuantity - 1));

    return (
        <div className="flex items-center justify-between gap-2 p-2 border rounded-lg bg-secondary/50 overflow-hidden">
            
            {/* Left Section: Image and Text (Flex-1, constrained) */}
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                {/* Imagem reduzida para h-12 w-12 */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <Image 
                        src={item.imageUrl}
                        alt={name}
                        layout="fill"
                        objectFit="cover"
                        className="object-center"
                    />
                </div>
                {/* Bloco de Texto: min-w-0 e truncate para garantir compressão */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
                    {isPaid && (
                        <p className="text-xs font-medium text-primary mt-1">{formatCurrency(price)}</p>
                    )}
                </div>
            </div>
            
            {/* Right Section: Controles de Quantidade (Fixed Width) */}
            <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleDecrement}
                    disabled={currentQuantity === 0}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-4 text-center">{currentQuantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleIncrement}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
};


export const AddonsModal = () => {
    const { isOpen, itemToConfigure, closeModal } = useAddonsStore();
    const cartStore = useCartStore();
    
    // State for free addons (quantity tracking)
    const [freeAddonQuantities, setFreeAddonQuantities] = useState<Record<string, number>>({});
    
    // State for suggested paid products (quantity tracking)
    const [paidSuggestionQuantities, setPaidSuggestionQuantities] = useState<Record<string, number>>({});

    // Reset states when modal opens for a new item
    React.useEffect(() => {
        if (isOpen) {
            setFreeAddonQuantities({});
            setPaidSuggestionQuantities({});
        }
    }, [isOpen, itemToConfigure]);

    const handleFreeAddonQuantityChange = (id: string, quantity: number) => {
        setFreeAddonQuantities(prev => ({ ...prev, [id]: quantity }));
    };

    const handlePaidSuggestionQuantityChange = (id: string, quantity: number) => {
        setPaidSuggestionQuantities(prev => ({ ...prev, [id]: quantity }));
    };

    const handleFinalize = () => {
        if (!itemToConfigure) return;

        // 1. Process Free Addons
        const selectedFreeAddons: FreeAddon[] = Object.entries(freeAddonQuantities)
            .filter(([, quantity]) => quantity > 0)
            .map(([id, quantity]) => {
                const addon = freeAddons.find(a => a.id === id);
                return {
                    id: id,
                    name: addon?.name || 'Adicional',
                    quantity: quantity,
                };
            });

        // 2. Add the original item to the cart (with free addons attached)
        cartStore.addItem(
            itemToConfigure.product,
            itemToConfigure.quantity,
            itemToConfigure.details,
            itemToConfigure.notes,
            selectedFreeAddons // Passando os adicionais gratuitos
        );

        // 3. Add suggested paid items to the cart
        Object.entries(paidSuggestionQuantities)
            .filter(([, quantity]) => quantity > 0)
            .forEach(([id, quantity]) => {
                const product = beverageProducts.find(p => p.id === id);
                if (product) {
                    // Adiciona o produto sugerido como um item separado no carrinho
                    cartStore.addItem(product, quantity);
                }
            });

        toast.success("Itens adicionados ao carrinho!");
        closeModal();
    };

    // Filter beverages to show only the first 3 as suggestions
    const suggestedBeverages = beverageProducts.slice(0, 3);

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            {/* Garantindo que o DialogContent não cause overflow horizontal */}
            <DialogContent className="sm:max-w-[600px] p-0 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="text-left p-6 pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-success" /> Item Adicionado!
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Turbine seu pedido com adicionais gratuitos e bebidas sugeridas.
                    </p>
                </DialogHeader>

                <div className="p-6 space-y-8">
                    
                    {/* Seção de Adicionais Gratuitos */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">
                            Adicionais (Cortesia da Casa)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Selecione quantos itens gratuitos você deseja adicionar ao seu pedido.
                        </p>
                        <div className="space-y-3">
                            {freeAddons.map(addon => (
                                <AddonCard
                                    key={addon.id}
                                    item={addon}
                                    type="free"
                                    currentQuantity={freeAddonQuantities[addon.id] || 0}
                                    onQuantityChange={handleFreeAddonQuantityChange}
                                />
                            ))}
                        </div>
                    </section>

                    <Separator />

                    {/* Seção de Sugestões Pagas (Bebidas) */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground">
                            Sugestões (Para Acompanhar)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Que tal uma bebida gelada para acompanhar seu sushi?
                        </p>
                        <div className="space-y-3">
                            {suggestedBeverages.map(product => (
                                <AddonCard
                                    key={product.id}
                                    item={product}
                                    type="paid"
                                    currentQuantity={paidSuggestionQuantities[product.id] || 0}
                                    onQuantityChange={handlePaidSuggestionQuantityChange}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t">
                    <Button 
                        onClick={handleFinalize}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                    >
                        Finalizar e Ir para o Carrinho
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};