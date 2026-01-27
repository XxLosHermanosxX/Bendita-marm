"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IMAGES } from "@/config/images";

export const Footer = () => {
  return (
    <footer className="bg-[#005A8D] text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="relative h-20 w-44">
              <Image 
                src={IMAGES.logoFooter} 
                alt="Plantão do Smash" 
                fill 
                className="object-contain brightness-0 invert"
                unoptimized
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed font-medium">
              A energia que o futuro médico precisa. Smashes potentes, entrega rápida e sabor que reanima em Ciudad del Este.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest">Unidades</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#FF6B00] shrink-0" />
                <p className="text-sm text-white/80 font-medium">
                  Av. Mariscal Estigarribia, 1234<br />
                  Ciudad del Este - Paraguay
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-black uppercase mb-1 text-[#FF6B00]">CNPJ / RUC</p>
                <p className="text-sm font-medium">80012345-6</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest">Pagamentos</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 p-2 rounded-xl border border-white/5 flex items-center justify-center">
                <Image src={IMAGES.pagamentos.pix} alt="Pix" width={50} height={20} className="object-contain brightness-0 invert opacity-60" unoptimized />
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/5 flex items-center justify-center">
                <Image src={IMAGES.pagamentos.pagseguro} alt="PagSeguro" width={80} height={20} className="object-contain brightness-0 invert opacity-60" unoptimized />
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/5 flex items-center justify-center col-span-2">
                <div className="flex gap-2">
                  <Image src={IMAGES.pagamentos.visa} alt="Visa" width={30} height={15} className="object-contain brightness-0 invert opacity-60" unoptimized />
                  <Image src={IMAGES.pagamentos.mastercard} alt="Mastercard" width={30} height={15} className="object-contain brightness-0 invert opacity-60" unoptimized />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-400">
              <ShieldCheck className="h-4 w-4" />
              Site 100% Seguro
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest">Horário Crítico</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Segunda - Sábado</span>
                <span className="font-bold">18:00 - 02:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Domingo</span>
                <span className="font-bold">19:00 - 00:00</span>
              </div>
              <p className="text-[10px] text-[#FF6B00] font-black uppercase mt-4">
                * Horário de Ciudad del Este (PY)
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
          <p>© 2024 Plantão do Smash • Todos os direitos reservados</p>
          <p>Desenvolvido com ❤️ para a comunidade médica de CDE</p>
        </div>
      </div>
    </footer>
  );
};