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
      className="group relative mt-12 flex flex-col bg-white/40 backdrop-blur-md border border-white/30 rounded-[2.5rem] overflow-visible shadow-xl hover:shadow-[#005A8D]/20 transition-all duration-300 h-full"
      onClick={() => openModal(product)}
    >
      <div className="relative h-48 w-full overflow-visible flex justify-center">
        <motion.div 
          animate={{ 
            y: isHovered ? -20 : -35,
            scale: isHovered ? 1.1 : 1 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="absolute -top-4 w-52 h-52 z-10"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]"
            quality={100}
            unoptimized
          />
        </motion.div>
        <div className="absolute top-16 left-6 z-20">
          <span className="bg-[#005A8D] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 pt-0 space-y-4 relative z-0">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#005A8D] uppercase leading-tight tracking-tighter">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#005A8D]/70 font-bold line-clamp-2 min-h-[32px] leading-tight">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-[#FF6B00] uppercase tracking-widest mb-1">Prescrição</span>
            <span className="text-2xl font-black text-[#005A8D]">
              {formatCurrency(product.price)}
            </span>
          </div>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-2xl bg-[#FF6B00] hover:bg-[#005A8D] text-white transition-all shadow-lg shadow-[#FF6B00]/20 active:scale-90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};