"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuLayout } from "@/components/menu-layout";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/data/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { MapPin, CheckCircle2, XCircle, Clock, Star, ShieldCheck, MessageCircle, HelpCircle, ArrowRight, Zap, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Elements for Floating Elements background
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/30"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            rotate: 0 
          }}
          animate={{ 
            y: [null, "-20%", "20%", null],
            rotate: 360 
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {i % 2 === 0 ? <Zap className="h-8 w-8" /> : <Stethoscope className="h-8 w-8" />}
        </motion.div>
      ))}
    </div>
  );
};

// Helper function to group products (copied from page.tsx)
const getGroupedProducts = () => {
  return categories.reduce((acc, category) => {
    acc[category] = products.filter(p => p.category === category);
    return acc;
  }, {} as Record<string, Product[]>);
};

const getVisibleCategories = (groupedProducts: Record<string, Product[]>) => {
  return categories.filter(c => groupedProducts[c] && groupedProducts[c].length > 0);
};

export const HomeContentWrapper = () => {
  const isMobile = useIsMobile();
  const [cep, setCep] = useState("");
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { scrollYProgress } = useScroll();
  
  // Scrollytelling values
  const burgerScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const burgerOpacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);

  // Data
  const groupedProducts = useMemo(getGroupedProducts, []);
  const visibleCategories = useMemo(() => getVisibleCategories(groupedProducts), [groupedProducts]);
  const mainPromos = [
    {
      id: "p1",
      title: "Kit Reanimação",
      price: "R$ 85,00",
      desc: "Perfeito para o pós-prova! 2 Duplos Eletro-Choque, 2 Residentes, fritas, anéis e coxinhas.",
      img: "/images/plantao_kit_reanimacao_box.png",
      color: "bg-[#005A8D]/90 backdrop-blur-md"
    },
    {
      id: "p2",
      title: "Combo Plantão",
      price: "A partir de R$ 39,90",
      desc: "Seu Duplo Eletro-Choque com fritas e refri. A energia que você precisa para o plantão.",
      img: "/images/banner_combo_duplo_promo.png",
      color: "bg-[#FF6B00]"
    },
    {
      id: "p3",
      title: "O Especialista",
      price: "R$ 42,90",
      desc: "Todo mês um burger novo criado por especialistas. Este mês: Bacon-Cardíaco + Fritas.",
      img: "/images/plantao_bacon_cardiaco.png",
      color: "bg-[#D90429]"
    }
  ];

  if (isMobile === undefined) return null;

  return (
    <div className="bg-[#f8f9fa] relative">
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-[#005A8D]">
        <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-white text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black uppercase italic leading-tight"
            >
              Plantão do <span className="text-[#FF6B00]">Smash</span>
            </motion.h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 max-w-xl">
              A energia que o futuro médico precisa. Smashes potentes, entrega rápida e sabor que reanima.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-xl py-8 px-12 rounded-2xl shadow-xl hover:scale-105 transition-all">
                Pedir Agora
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#005A8D] text-xl py-8 px-12 rounded-2xl">
                Cardápio
              </Button>
            </div>
          </div>
          
          <motion.div 
            style={{ scale: burgerScale }}
            className="flex-1 relative h-[300px] w-full md:h-[500px]"
          >
            <Image 
              src="/images/plantao_duplo_eletrochoque.png" 
              alt="Hambúrguer Principal" 
              fill 
              className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-8 w-8 text-white rotate-90" />
        </div>
      </section>

      {/* Scrollytelling Section */}
      <section className="relative py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="sticky top-32 h-[400px]">
            <motion.div style={{ opacity: burgerOpacity }} className="relative h-full w-full">
              <Image 
                src="/images/plantao_duplo_eletrochoque.png" 
                alt="Detalhes do Burger" 
                fill 
                className="object-contain"
              />
            </motion.div>
          </div>
          <div className="space-y-32 py-20">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-[#005A8D] uppercase">O Blend de Emergência</h3>
              <p className="text-xl text-muted-foreground">100% Carne Premium prensada na chapa quente para aquela crostinha perfeita que libera todo o sabor.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-[#FF6B00] uppercase">Pão Brioche Cirúrgico</h3>
              <p className="text-xl text-muted-foreground">Macio, amanteigado e selado com perfeição. O suporte ideal para o nosso recheio potente.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-[#D90429] uppercase">Molho Adrenalina</h3>
              <p className="text-xl text-muted-foreground">Nossa receita secreta que eleva os batimentos e a satisfação a cada mordida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Sections (Sticky) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-[#005A8D] uppercase tracking-tighter">Unidade de Terapia Intensiva de Sabor</h2>
            <p className="text-xl text-muted-foreground">As promoções que vão salvar o seu dia (e sua carteira).</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {mainPromos.map((promo, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-[3rem] p-10 text-white ${promo.color} border border-white/20 shadow-2xl h-[550px] flex flex-col justify-between`}
              >
                <div className="space-y-4 relative z-10">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{promo.title}</span>
                  <h3 className="text-5xl font-black leading-none">{promo.price}</h3>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{promo.desc}</p>
                </div>
                
                <div className="absolute -right-10 top-1/2 -translate-y-1/2 h-80 w-80 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500 opacity-20 pointer-events-none">
                  <Image src={promo.img} alt={promo.title} fill className="object-contain grayscale" />
                </div>

                <div className="relative h-64 w-full mt-auto transition-transform group-hover:scale-110 duration-500 z-10">
                  <Image src={promo.img} alt={promo.title} fill className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
                </div>
                
                <Button className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-black h-16 rounded-2xl relative z-10 text-sm uppercase tracking-widest shadow-xl">
                  ADICIONAR AO CARRINHO
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Area */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <h2 className="text-4xl font-black text-[#005A8D] uppercase tracking-tighter">Cardápio de Plantão</h2>
            
            <div className="flex bg-white p-2 rounded-2xl shadow-sm border gap-2 overflow-x-auto no-scrollbar max-w-full">
              {categories.map(cat => (
                <Button key={cat} variant="ghost" className="rounded-xl whitespace-nowrap font-bold hover:bg-[#005A8D]/10 hover:text-[#005A8D]">
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & FAQ */}
      <section className="py-20 bg-[#005A8D] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-black uppercase">Dúvidas Clínicas?</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="1" className="border-white/20">
                  <AccordionTrigger className="text-lg font-bold hover:no-underline">Entregam em Ciudad del Este?</AccordionTrigger>
                  <AccordionContent className="text-white/80">Sim! Cobrimos as principais faculdades de medicina e arredores com tempo recorde.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="2" className="border-white/20">
                  <AccordionTrigger className="text-lg font-bold hover:no-underline">Quais as formas de pagamento?</AccordionTrigger>
                  <AccordionContent className="text-white/80">Aceitamos Cartão, Pix e Dinheiro. Pagamento seguro processado via PagSeguro.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="3" className="border-white/20">
                  <AccordionTrigger className="text-lg font-bold hover:no-underline">Como funciona o Kit Reanimação?</AccordionTrigger>
                  <AccordionContent className="text-white/80">É a nossa maior box, pensada para grupos de estudos ou pós-plantão exaustivo.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-[2.5rem] p-8 border border-white/20 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-[#FF6B00]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-2xl font-bold italic">"O melhor smash que já comi em CDE. O Kit Reanimação salvou minha semana de provas!"</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 border flex items-center justify-center font-black">LM</div>
                  <div>
                    <p className="font-bold">Lucas Mendes</p>
                    <p className="text-sm opacity-60">Estudante de Medicina - UPE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button className="h-16 w-16 rounded-full bg-[#FF6B00] shadow-2xl hover:scale-110 transition-transform">
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  );
};