"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useProductModalStore } from "@/store/use-product-modal-store";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const openProductModal = useProductModalStore((state) => state.openModal);

  const handleOpenModal = () => {
    openProductModal(product);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0 relative h-40 w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="object-center"
        />
      </CardHeader>
      <CardContent className="flex-1 p-4 space-y-2">
        <CardTitle className="text-lg font-semibold line-clamp-2 min-h-[3rem]">
          {product.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-xl font-bold text-primary">
          {formatCurrency(product.price)}
        </span>
        <Button 
          size="icon" 
          className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
          onClick={handleOpenModal}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};