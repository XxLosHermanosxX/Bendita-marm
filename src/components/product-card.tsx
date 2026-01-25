"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useProductModalStore } from "@/store/use-product-modal-store";
import { motion, AnimatePresence } from "framer-motion";

export const ProductCard = ({ product }: { product: Product }) => {
  const { openModal } = useProductModalStore();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-[#005A8D]/20 transition-all duration-300 h-full"
      onClick={() => openModal(product)}
    >
      <div className="relative h-56 w-full overflow-visible">
        <motion.div 
          animate={{ y: isHovered ? -10 : 0 }}
          className="absolute inset-0 z-10 -mt-8 px-4"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
            quality={100}
          />
        </motion.div>
        <div className="absolute top-10 left-6 z-20">
          <span className="bg-[#005A8D]/80 backdrop-blur-sm text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 pt-0 space-y-4 relative z-0">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-[#005A8D] uppercase leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground font-medium line-clamp-2 min-h-[32px]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#005A8D]/40 uppercase leading-none mb-1">Valor Unitário</span>
            <span className="text-2xl font-black text-[#FF6B00]">
              {formatCurrency(product.price)}
            </span>
          </div>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-2xl bg-[#005A8D] hover:bg-[#FF6B00] transition-all shadow-lg shadow-[#005A8D]/20"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};