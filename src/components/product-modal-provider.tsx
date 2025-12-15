"use client";

import React from 'react';
import { useProductModalStore } from '@/store/use-product-modal-store';
import { ProductModal } from './product-modal';

export const ProductModalProvider = () => {
  const { isOpen, product, closeModal } = useProductModalStore();

  if (!product) return null;

  return (
    <ProductModal
      product={product}
      isOpen={isOpen}
      onClose={closeModal}
    />
  );
};