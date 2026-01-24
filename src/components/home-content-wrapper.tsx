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
import { MapPin, CheckCircle2, XCircle, Clock, Star, ShieldCheck, MessageCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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
  const [timeLeft, setTimeLeft] = useState("23:59:59");

  // Timer de Urgência
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckCep = () => {
    if (cep.length < 8) {
      toast.error("Por favor, digite um CEP válido.");
      return;
    }
    setCepStatus('loading');
    setTimeout(() => {
      if (cep.startsWith("80") || cep.startsWith("81") || cep.startsWith("82")) {
        setCepStatus('success');
        toast.success("Ótima notícia! Atendemos sua região.");
      } else {
        setCepStatus('error');
        toast.error("Infelizmente ainda não atendemos sua região.");
      }
    }, 1000);
  };

  const groupedProducts = useMemo(getGroupedProducts, []);
  const visibleCategories = useMemo(() => getVisibleCategories(groupedProducts), [groupedProducts]);

  // Data for desktop layout
  // Destaque do Dia (m1)
  const exclusiveProducts = products.filter(p => p.category === "Marmita Destaque do Dia").slice(0, 3); 
  // Combos (c1)
  const comboProducts = products.filter(p => p.category === "Combos").slice(0, 3);

  // Render nothing until isMobile is defined (i.e., client-side)
  if (isMobile === undefined) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {/* Banner de Urgência */}
        <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs font-medium sticky top-0 z-40">
          🔥 CUPOM: <strong>BENDITA15</strong> (15% OFF) | Expira em: {timeLeft}
        </div>

        {/* Banner de Boas-vindas (Carrossel) */}
        <section className="mb-4">
          <HeroCarousel />
        </section>

        {/* Solução 1: Verificação de CEP */}
        <section className="px-4 mb-8">
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MapPin className="text-primary h-5 w-5" /> Verificar Cobertura
            </h2>
            <p className="text-xs text-muted-foreground">
              Entregamos na sua casa? Verifique seu CEP agora.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="00000-000" 
                value={cep} 
                className="h-10"
                onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
              />
              <Button onClick={handleCheckCep} disabled={cepStatus === 'loading'} className="h-10">
                {cepStatus === 'loading' ? '...' : 'Verificar'}
              </Button>
            </div>
            {cepStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 font-medium text-xs">
                <CheckCircle2 className="h-4 w-4" /> Atendemos sua região (30-45 min)
              </div>
            )}
            {cepStatus === 'error' && (
              <div className="flex items-center gap-2 text-destructive font-medium text-xs">
                <XCircle className="h-4 w-4" /> Não atendemos este CEP.
              </div>
            )}
          </div>
        </section>

        {/* Solução 2: Informações Críticas */}
        <section className="px-4 mb-8 grid grid-cols-2 gap-3">
          {[
            { icon: Clock, label: "30-45 min", sub: "Entrega" },
            { icon: Star, label: "4.8/5.0", sub: "Avaliações" },
            { icon: ShieldCheck, label: "R$ 30", sub: "Mínimo" },
            { icon: ShieldCheck, label: "Garantia", sub: "Satisfação" },
          ].map((info, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
              <info.icon className="h-5 w-5 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-[13px]">{info.label}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{info.sub}</span>
              </div>
            </div>
          ))}
        </section>
        
        {/* Full Menu for Mobile */}
        <MenuLayout 
          activeCategory="Marmita Destaque do Dia" // Updated default category
          visibleCategories={visibleCategories}
          groupedProducts={groupedProducts}
        />

        {/* Solução 4 & 9: Testemunhos e FAQ Mobile */}
        <div className="px-4 py-8 space-y-10 bg-secondary/10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-center">O Que Dizem Nossos Clientes</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
              {[
                { name: "Ana P.", text: "A melhor marmita de Curitiba! Sempre quente." },
                { name: "Carlos E.", text: "Entrega rápida e tempero incrível." },
                { name: "Mariana S.", text: "Virei cliente fiel, excelente custo benefício!" },
              ].map((testimony, i) => (
                <div key={i} className="bg-card border rounded-xl p-4 min-w-[240px] snap-center space-y-2 shadow-sm">
                   <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-primary text-primary" />)}
                  </div>
                  <p className="text-xs italic text-muted-foreground">"{testimony.text}"</p>
                  <div className="font-semibold text-xs">— {testimony.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> FAQ
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-sm">Pagamento?</AccordionTrigger>
                <AccordionContent className="text-xs">Pix, Cartão e Benefícios no site ou entrega.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-sm">Horário?</AccordionTrigger>
                <AccordionContent className="text-xs">Todos os dias das 11h às 23h.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        {/* Botão Flutuante de Suporte */}
        <div className="fixed bottom-20 right-4 z-50">
          <Button 
            className="rounded-full h-12 w-12 shadow-xl bg-green-500 hover:bg-green-600"
            size="icon"
            onClick={() => window.open('https://wa.me/5500000000000', '_blank')}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      {/* Banner de Urgência Desktop */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
        🔥 CUPOM: <strong>BENDITA15</strong> (15% OFF) | Expira em: {timeLeft} | Compre nos próximos 30 min e ganhe um brinde!
      </div>

      {/* Banner de Boas-vindas (Agora Carrossel) */}
      <section className="mb-8">
        <HeroCarousel />
      </section>

      {/* Solução 1 & 2 Desktop */}
      <div className="container mx-auto px-6 mb-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* CEP Check */}
          <div className="md:col-span-1 bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-center">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <MapPin className="text-primary h-5 w-5" /> Entregamos pra você?
            </h2>
            <div className="flex gap-2 mb-2">
              <Input 
                placeholder="Seu CEP" 
                value={cep} 
                onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
              />
              <Button onClick={handleCheckCep} disabled={cepStatus === 'loading'}>Verificar</Button>
            </div>
            {cepStatus === 'success' && <span className="text-green-600 text-xs font-medium">✅ Atendemos sua região!</span>}
            {cepStatus === 'error' && <span className="text-destructive text-xs font-medium">❌ Fora da área de cobertura.</span>}
          </div>

          {/* Info Section */}
          <div className="md:col-span-2 grid grid-cols-4 gap-4">
             {[
              { icon: Clock, label: "30-45 min", sub: "Entrega Rápida" },
              { icon: Star, label: "4.8 Estrelas", sub: "500+ Pedidos" },
              { icon: ShieldCheck, label: "R$ 30", sub: "Pedido Mínimo" },
              { icon: ShieldCheck, label: "Dinheiro de Volta", sub: "Garantia 24h" },
            ].map((info, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/20 border border-border text-center">
                <info.icon className="h-7 w-7 text-primary mb-2" />
                <span className="font-bold text-sm">{info.label}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium">{info.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Bem-vindo à Bendita Marmita!
        </h1>
        
        {/* Seção de Produtos Exclusivos do App (Destaque) */}
        {exclusiveProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-primary">
                🔥 Destaque do Dia & Combos
              </h2>
            </div>
            
            {/* Exibindo Destaques + Combos na mesma linha (grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Destaque do Dia */}
              {exclusiveProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}

              {/* Combos (agora junto com o destaque) */}
              {comboProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Seção de Combos (Se houver mais, pode manter separado, mas o usuário pediu junto) */}
        {/* O código acima já exibe o combo junto. Se quiser remover a seção separada de combos: */}
        {/* 
        {comboProducts.length > 0 && (
          <section className="mb-8">
            ...
          </section>
        )}
        */}

        <div className="text-center mt-8">
          <Link href="/products" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
              Explorar Cardápio Completo
            </Button>
          </Link>
        </div>
      </div>

      {/* Seção de Depoimentos & FAQ Desktop */}
      <div className="mt-20 border-t pt-16">
        <div className="grid md:grid-cols-2 gap-16">
          <section className="space-y-8">
            <h2 className="text-3xl font-bold italic">"A SushiAki mudou meus almoços..."</h2>
            <div className="grid gap-6">
              {[
                { name: "Ana Paula", text: "A melhor marmita de Curitiba! Sempre quente e muito bem servida.", rating: 5 },
                { name: "Carlos Eduardo", text: "Entrega super rápida e o tempero é incrível. Recomendo muito!", rating: 5 },
              ].map((testimony, i) => (
                <div key={i} className="bg-card border rounded-xl p-6 space-y-3 shadow-sm">
                  <div className="flex gap-1">
                    {[...Array(testimony.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground italic">"{testimony.text}"</p>
                  <div className="font-semibold text-sm text-primary">— {testimony.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" /> Perguntas Comuns
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1" className="border-b-2">
                <AccordionTrigger className="text-lg hover:no-underline">Como funciona o pagamento?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground py-4">
                  Aceitamos Pix com aprovação imediata no site, cartões de crédito/débito e cartões de benefício (Alelo, Sodexo, Ticket) tanto no site quanto na maquininha na entrega.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2" className="border-b-2">
                <AccordionTrigger className="text-lg hover:no-underline">Qual o raio de atendimento?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground py-4">
                  Atendemos toda a região central de Curitiba e bairros vizinhos em um raio de até 10km. Use nosso verificador de CEP acima para confirmar!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3" className="border-b-2">
                <AccordionTrigger className="text-lg hover:no-underline">Garantia de Satisfação?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground py-4">
                  Sim! Se você não gostar da sua marmita por qualquer motivo de qualidade, devolvemos seu dinheiro em até 24h. Sua satisfação é nossa prioridade nº 1.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </div>

      {/* Flutuante de Suporte Desktop */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          className="rounded-full h-16 w-16 shadow-2xl bg-green-500 hover:bg-green-600 transition-transform hover:scale-110"
          size="icon"
          onClick={() => window.open('https://wa.me/5500000000000', '_blank')}
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      </div>
    </>
  );
};