"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Utensils, Check, Zap, Info, Layers } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAddonsStore } from "@/store/use-addons-store";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "@/config/images";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const openAddonsModal = useAddonsStore((state) => state.openModal);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isExploded, setIsExploded] = useState(false);
  // State to store selected options for each variation
  const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: any }>({});
  
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if the product has variations
  const hasVariations = product.variations && product.variations.length > 0;

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setQuantity(1);
      setNotes("");
      
      // Initialize default selections for variations (select first option by default)
      if (hasVariations && product.variations) {
        const initialSelections: { [key: string]: any } = {};
        product.variations.forEach(variation => {
          if (variation.options.length > 0) {
            initialSelections[variation.name] = variation.options[0];
          }
        });
        setSelectedVariations(initialSelections);
      }
    }
  }, [isOpen, product, hasVariations]);

  const handleContinue = () => {
    // Pass the configured item to the Addons Modal
    openAddonsModal({
      product: product,
      quantity: quantity,
      details: undefined,
      notes: notes,
      selectedVariations: { ...selectedVariations },
    });

    // Close the current modal
    onClose();
  };

  const handleVariationSelect = (variationName: string, option: any) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: option
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[95vh] flex flex-col rounded-[3rem] border-4 border-[#005A8D] shadow-2xl bg-white/90 backdrop-blur-xl">
        <div className="relative h-[450px] w-full bg-gradient-to-b from-[#005A8D]/10 to-transparent flex flex-center items-center overflow-hidden">
          {/* Background Decorative */}
          <div className="absolute inset-0 bg-[#005A8D]/5 pointer-events-none" />
          
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {!isExploded ? (
                <motion.div 
                  key="normal"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-full h-full"
                >
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-contain drop-shadow-2xl" 
                    quality={100}
                    unoptimized
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="exploded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full flex flex-col items-center justify-center space-y-[-60px]"
                >
                  <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.1 }} className="relative h-24 w-48"><Image src={IMAGES.produtos.smashResidente} alt="Bread Top" fill className="object-contain opacity-50" unoptimized /></motion.div>
                  <motion.div initial={{ y: -30 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="relative h-20 w-44"><div className="bg-orange-400/30 w-full h-4 rounded-full" /></motion.div>
                  <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.3 }} className="relative h-24 w-48"><Image src={IMAGES.produtos.duploEletroChoque} alt="Meat" fill className="object-contain" unoptimized /></motion.div>
                  <motion.div initial={{ y: 30 }} animate={{ y: 0 }} transition={{ delay: 0.4 }} className="relative h-24 w-48"><Image src={IMAGES.produtos.smashResidente} alt="Bread Bottom" fill className="object-contain opacity-50" unoptimized /></motion.div>
                  
                  <div className="absolute inset-0 flex flex-col justify-between py-10 pointer-events-none">
                    <div className="flex justify-between w-full px-10">
                      <span className="bg-[#FF6B00] text-white text-[10px] font-black px-2 py-1 rounded">PÃO BRIOCHE</span>
                      <span className="bg-[#005A8D] text-white text-[10px] font-black px-2 py-1 rounded">MOLHO SECRETO</span>
                    </div>
                    <div className="flex justify-between w-full px-10">
                      <span className="bg-[#D90429] text-white text-[10px] font-black px-2 py-1 rounded">SMASH 100G</span>
                      <span className="bg-[#005A8D] text-white text-[10px] font-black px-2 py-1 rounded">QUEIJO PRATO</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button 
            onClick={() => setIsExploded(!isExploded)}
            className="absolute bottom-6 right-6 bg-[#005A8D] hover:bg-[#FF6B00] text-white rounded-2xl gap-2 font-black uppercase text-xs shadow-xl transition-all hover:scale-105"
          >
            <Layers className="h-4 w-4" />
            {isExploded ? "Vista Normal" : "Ver Ingredientes"}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-3xl font-black text-[#005A8D] uppercase tracking-tight">
                {product.name}
              </DialogTitle>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="text-3xl font-black text-[#FF6B00] whitespace-nowrap">
              {formatCurrency(product.price)}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Special Notes */}
          <div className="space-y-4">
            <label className="text-sm font-black text-[#005A8D] uppercase block">
              Observações Médicas (Ex: Sem cebola, ponto da carne)
            </label>
            <Textarea 
              placeholder="Digite aqui suas recomendações..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              className="resize-none h-24 rounded-2xl border-2 focus-visible:ring-[#005A8D]" 
            />
          </div>
          
          <div className="flex items-center justify-between pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md pb-2 mt-4">
            <div className="flex items-center gap-4 bg-[#005A8D]/5 p-2 rounded-2xl border border-[#005A8D]/10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl hover:bg-white transition-all shadow-sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="text-xl font-black w-8 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl hover:bg-white transition-all shadow-sm"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <Button 
              onClick={handleContinue}
              className="bg-[#FF6B00] hover:bg-[#005A8D] text-white font-black text-lg px-10 py-8 rounded-2xl shadow-[0_15px_30px_rgba(255,107,0,0.3)] transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};