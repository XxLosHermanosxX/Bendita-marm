"use client";

import React from "react";
import Image from "next/image";
import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Dados de pagamento e selos (usando placeholders)
const paymentMethods = [
  { name: "Visa", icon: "/images/visa.png" },
  { name: "Mastercard", icon: "/images/mastercard.png" },
  { name: "Pix", icon: "/images/pix.png" },
];

const securitySeals = [
  { name: "SSL Secure", icon: "/images/ssl-seal.png" },
  { name: "Site Seguro", icon: "/images/site-seguro.png" },
];

export const Footer = () => {
  return (
    <footer className="w-full bg-secondary/50 border-t border-border mt-12">
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Coluna 1: Informações da Empresa */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="relative h-16 w-32">
              <Image 
                src="/images/sushiaki-logo-footer.png" 
                alt="Sushiaki Logo" 
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Parigot Comercio de Alimentos Ltda</p>
              <p>47.801.438/0001-32</p>
            </div>
          </div>

          {/* Coluna 2: Pagamento e Segurança */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-2">Formas de Pagamento</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {/* Placeholder para ícones de pagamento */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-card rounded border border-border">VISA</span>
                    <span className="px-2 py-1 bg-card rounded border border-border">MASTER</span>
                    <span className="px-2 py-1 bg-card rounded border border-border">PIX</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-2">Segurança</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {/* Placeholder para selos de segurança */}
                <div className="flex items-center gap-1 text-xs text-success">
                    <ShieldCheck className="h-4 w-4" />
                    Site Seguro
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    SSL Certificado
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 3: Criado por iFood */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-sm text-muted-foreground">Criado por</p>
            <div className="relative h-10 w-24">
              <Image 
                src="/images/ifood-logo.png" 
                alt="iFood Logo" 
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Sushiaki Delivery. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};