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
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-300 h-full"
      onClick={() => openModal(product)}
    >
      <div className="relative h-64 w-full bg-[#f1f3f5] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          quality={100}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-[#005A8D] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-[#005A8D] uppercase leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-black text-[#FF6B00]">
            {formatCurrency(product.price)}
          </span>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-2xl bg-[#005A8D] hover:bg-[#FF6B00] transition-colors shadow-lg"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};