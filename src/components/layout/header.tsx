"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Minha Loja
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            Produtos
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            Sobre
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">
            Contato
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}