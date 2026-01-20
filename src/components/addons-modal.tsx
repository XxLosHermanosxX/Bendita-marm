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
import { freeAddons, paidAddons, Addon } from "@/data/addons";
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
    // If type is 'paid', item is an Addon with a price property
    const price = isPaid ? (item as Addon).price : 0; 
    const name = item.name;
    const description = item.description;

    const handleIncrement = () => onQuantityChange(item.id, currentQuantity + 1);
    const handleDecrement = () => onQuantityChange(item.id, Math.max(0, currentQuantity - 1));

    return (
        <div className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <Image 
                        src={item.imageUrl}
                        alt={name}
                        layout="fill"
                        objectFit="cover"
                        className="object-center"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
                    {isPaid && price !== undefined && (
                        <p className="text-xs font-medium text-primary mt-1">{formatCurrency(price)}</p>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleDecrement}
                    disabled={currentQuantity === 0}
                >
                    <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-sm font-medium w-6 text-center">{currentQuantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleIncrement}
                >
                    <Plus className="h-3.5 w-3.5" />
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

        // 2. Add the original item to the cart (with free addons and selected variations attached)
        cartStore.addItem(
            itemToConfigure.product,
            itemToConfigure.quantity,
            itemToConfigure.details,
            itemToConfigure.notes,
            selectedFreeAddons, // Passando os adicionais gratuitos
            itemToConfigure.selectedVariations // Passando as variações selecionadas
        );

        // 3. Add suggested paid items to the cart
        Object.entries(paidSuggestionQuantities)
            .filter(([, quantity]) => quantity > 0)
            .forEach(([id, quantity]) => {
                // Find the paid addon/product
                const paidAddon = paidAddons.find(p => p.id === id);
                
                if (paidAddon && paidAddon.price !== undefined) {
                    // Create a temporary Product object from the paid addon structure
                    const product: Product = {
                        id: paidAddon.id,
                        name: paidAddon.name,
                        description: paidAddon.description,
                        price: paidAddon.price,
                        category: "Adicionais Pagos", // New temporary category
                        imageUrl: paidAddon.imageUrl,
                    };
                    // Adiciona o produto sugerido como um item separado no carrinho
                    cartStore.addItem(product, quantity);
                }
            });

        toast.success("Itens adicionados ao carrinho!");
        closeModal();
    };

    // Use paidAddons as suggestions
    const suggestedPaidAddons = paidAddons; 

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent 
                className="flex flex-col max-w-md mx-auto h-[90vh] sm:h-[80vh] p-0 gap-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                {/* Header */}
                <DialogHeader className="text-left p-5 pb-3 border-b flex-shrink-0">
                    <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" /> Marmita Adicionada!
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Turbine seu pedido com adicionais gratuitos e pagos.
                    </p>
                </DialogHeader>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Seção de Adicionais Gratuitos */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary">
                            Adicionais (Cortesia da Casa)
                        </h3>
                        <p className="text-xs text-muted-foreground">
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

                    {/* Seção de Sugestões Pagas (Adicionais) */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">
                            Adicionais Pagos (Para Turbinar)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Adicione porções extras para deixar sua marmita perfeita.
                        </p>
                        <div className="space-y-3">
                            {suggestedPaidAddons.map(addon => (
                                <AddonCard
                                    key={addon.id}
                                    item={addon}
                                    type="paid"
                                    currentQuantity={paidSuggestionQuantities[addon.id] || 0}
                                    onQuantityChange={handlePaidSuggestionQuantityChange}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Fixed Footer with Button */}
                <div className="p-5 border-t flex-shrink-0">
                    <Button 
                        onClick={handleFinalize}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-5"
                    >
                        Finalizar e Ir para o Carrinho
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};