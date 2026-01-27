"use client";

import React, { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/data/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Image from "next/image";
import { Star, MessageCircle, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IMAGES } from "@/config/images";

// Helper function to group products
const getGroupedProducts = () => {
  return categories.reduce((acc, category) => {
    acc[category] = products.filter(p => p.category === category);
    return acc;
  }, {} as Record<string, Product[]>);
};

export const HomeContentWrapper = () => {
  const groupedProducts = useMemo(getGroupedProducts, []);
  
  const mainPromos = [
    {
      id: "p1",
      title: "Kit Reanimação",
      price: "R$ 85,00",
      desc: "Perfeito para o pós-prova! 2 Duplos Eletro-Choque, 2 Residentes, fritas, anéis e coxinhas.",
      img: IMAGES.produtos.kitReanimacaoBox,
      color: "bg-[#005A8D]"
    },
    {
      id: "p2",
      title: "Combo Plantão",
      price: "A partir de R$ 39,90",
      desc: "Seu Duplo Eletro-Choque com fritas e refri. A energia que você precisa para o plantão.",
      img: IMAGES.produtos.comboPlantaoDuplo,
      color: "bg-[#FF6B00]"
    },
    {
      id: "p3",
      title: "O Especialista",
      price: "R$ 42,90",
      desc: "Todo mês um burger novo criado por especialistas. Este mês: Bacon-Cardíaco + Fritas.",
      img: IMAGES.produtos.baconCardiaco,
      color: "bg-[#D90429]"
    }
  ];

  return (
    <div className="bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-[#005A8D] overflow-hidden">
        <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center gap-8 py-12">
          <div className="flex-1 space-y-6 text-white text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic leading-tight">
              Plantão do <span className="text-[#FF6B00]">Smash</span>
            </h1>
            <p className="text-lg md:text-xl font-medium opacity-90 max-w-xl">
              A energia que o futuro médico precisa. Smashes potentes, entrega rápida e sabor que reanima.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/products">
                <Button size="lg" className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-lg py-6 px-8 rounded-xl">
                  Pedir Agora
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-[#005A8D] text-lg py-6 px-8 rounded-xl backdrop-blur-sm">
                  Cardápio
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative h-[280px] w-full md:h-[400px]">
            <Image 
              src={IMAGES.produtos.duploEletroChoque} 
              alt="Hambúrguer Principal" 
              fill 
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-6 w-6 text-white rotate-90" />
        </div>
      </section>

      {/* Promo Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-[#005A8D] uppercase">Promoções Especiais</h2>
            <p className="text-lg text-muted-foreground">As promoções que vão salvar o seu dia.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mainPromos.map((promo) => (
              <div 
                key={promo.id}
                className={`group relative overflow-hidden rounded-2xl p-6 text-white ${promo.color} shadow-lg h-[400px] flex flex-col justify-between transition-transform hover:scale-[1.02]`}
              >
                <div className="space-y-3 relative z-10">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase">{promo.title}</span>
                  <h3 className="text-3xl font-black">{promo.price}</h3>
                  <p className="text-sm opacity-90">{promo.desc}</p>
                </div>

                <div className="relative h-48 w-full z-10">
                  <Image src={promo.img} alt={promo.title} fill className="object-contain" unoptimized />
                </div>
                
                <Link href="/products" className="relative z-10">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold h-12 rounded-xl">
                    VER CARDÁPIO
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Area */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <h2 className="text-3xl font-black text-[#005A8D] uppercase">Cardápio de Plantão</h2>
            
            <div className="flex bg-[#005A8D] p-1.5 rounded-xl gap-1 overflow-x-auto max-w-full">
              {categories.map(cat => (
                <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}>
                  <Button 
                    variant="ghost" 
                    className="rounded-lg px-4 py-2 whitespace-nowrap font-bold text-xs uppercase text-white hover:bg-white/20"
                  >
                    {cat}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/products">
              <Button size="lg" className="bg-[#005A8D] hover:bg-[#005A8D]/90">
                Ver Cardápio Completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#005A8D] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase">Dúvidas?</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="1" className="border-white/20">
                  <AccordionTrigger className="text-base font-bold hover:no-underline">Entregam em Ciudad del Este?</AccordionTrigger>
                  <AccordionContent className="text-white/80">Sim! Cobrimos as principais faculdades de medicina e arredores.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="2" className="border-white/20">
                  <AccordionTrigger className="text-base font-bold hover:no-underline">Quais as formas de pagamento?</AccordionTrigger>
                  <AccordionContent className="text-white/80">Aceitamos Cartão, Pix e Dinheiro.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="3" className="border-white/20">
                  <AccordionTrigger className="text-base font-bold hover:no-underline">Como funciona o Kit Reanimação?</AccordionTrigger>
                  <AccordionContent className="text-white/80">É a nossa maior box, pensada para grupos de estudos.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="space-y-4">
                <div className="flex gap-1 text-[#FF6B00]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-xl font-bold italic">"O melhor smash que já comi em CDE!"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">LM</div>
                  <div>
                    <p className="font-bold text-sm">Lucas Mendes</p>
                    <p className="text-xs opacity-60">Estudante de Medicina</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/5500000000000" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
};
