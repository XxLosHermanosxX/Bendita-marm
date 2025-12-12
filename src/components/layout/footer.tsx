"use client";

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Minha Loja</h3>
            <p className="text-sm text-muted-foreground">
              A melhor loja online para suas necessidades.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: contato@minhaloja.com</p>
              <p>Telefone: (11) 99999-9999</p>
              <p>Endereço: Rua Exemplo, 123</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Minha Loja. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}