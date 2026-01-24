"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { HomeContentWrapper } from "@/components/home-content-wrapper"; // Importando o novo wrapper
import { ProductCard } from "@/components/product-card";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CheckCircle2, XCircle, Clock, Star, ShieldCheck, MessageCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
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
    // Simulando verificação de CEP (atendendo apenas alguns prefixos por exemplo)
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

  return (
    <MainLayout>
      {/* Banner de Urgência */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium overflow-hidden">
        <div className="flex items-center justify-center gap-4 animate-pulse">
          <span>🔥 CUPOM: <strong>BENDITA15</strong> (15% OFF)</span>
          <span className="hidden sm:inline">|</span>
          <span>Expira em: {timeLeft}</span>
        </div>
      </div>

      <HeroCarousel />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Solução 1: Verificação de CEP */}
        <section className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
              <MapPin className="text-primary h-5 w-5" /> Verificar Cobertura
            </h2>
            <p className="text-sm text-muted-foreground">
              Verifique se entregamos na sua casa antes de começar seu pedido.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <Input 
                placeholder="Digite seu CEP" 
                value={cep} 
                onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
              />
              <Button onClick={handleCheckCep} disabled={cepStatus === 'loading'}>
                {cepStatus === 'loading' ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
            {cepStatus === 'success' && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm mt-2">
                <CheckCircle2 className="h-4 w-4" /> Atendemos Curitiba (30-45 min)
              </div>
            )}
            {cepStatus === 'error' && (
              <div className="flex items-center justify-center gap-2 text-destructive font-medium text-sm mt-2">
                <XCircle className="h-4 w-4" /> CEP fora da nossa área de entrega.
              </div>
            )}
          </div>
        </section>

        {/* Solução 2: Informações Críticas */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Clock, label: "30-45 min", sub: "Tempo Médio" },
            { icon: MapPin, label: "Curitiba", sub: "Atendimento" },
            { icon: Star, label: "4.8 / 5.0", sub: "500+ Avaliações" },
            { icon: ShieldCheck, label: "R$ 30,00", sub: "Pedido Mínimo" },
            { icon: ShieldCheck, label: "Garantia", sub: "Satisfação ou R$" },
          ].map((info, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-lg bg-secondary/30 border border-border">
              <info.icon className="h-6 w-6 text-primary mb-2" />
              <span className="font-bold text-sm">{info.label}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{info.sub}</span>
            </div>
          ))}
        </section>

        {/* Solução 3: Produtos Recomendados */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Produtos Recomendados</h2>
            <p className="text-muted-foreground">Escolha o que mais combina com seu paladar</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Sushi de Peixe", price: 45, image: "/sushi-peixe.jpg", description: "Peixe fresco com tempero especial" },
              { name: "Sushi de Frango", price: 38, image: "/sushi-frango.jpg", description: "Frango grelhado com molho especial" },
              { name: "Sushi de Carne", price: 52, image: "/sushi-carne.jpg", description: "Carne bovina com molho especial" },
            ].map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </section>

        {/* Solução 4: Depoimentos */}
        <section className="space-y-6 pt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">O Que Nossos Clientes Dizem</h2>
            <p className="text-muted-foreground">Experiências reais de quem ama a SushiAki</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ana Paula", text: "A melhor marmita de Curitiba! Sempre quente e muito bem servida.", rating: 5 },
              { name: "Carlos Eduardo", text: "Entrega super rápida e o tempero é incrível. Recomendo muito!", rating: 5 },
              { name: "Mariana Souza", text: "Excelente custo benefício. Virei cliente fiel!", rating: 5 },
            ].map((testimony, i) => (
              <div key={i} className="bg-card border rounded-xl p-6 space-y-3 relative shadow-sm">
                <div className="flex gap-1">
                  {[...Array(testimony.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm italic text-muted-foreground">"{testimony.text}"</p>
                <div className="font-semibold text-sm">— {testimony.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Solução 9: FAQ */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" /> Dúvidas Frequentes
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Quais as formas de pagamento?</AccordionTrigger>
              <AccordionContent>
                Aceitamos Pix, Cartão de Crédito e Débito (todas as bandeiras) e cartões de benefício no site ou na entrega.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Qual o horário de funcionamento?</AccordionTrigger>
              <AccordionContent>
                Estamos abertos todos os dias das 11h às 23h para pedidos no site e delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Como acompanho meu pedido?</AccordionTrigger>
              <AccordionContent>
                Após a confirmação, você receberá atualizações em tempo real pelo site e via WhatsApp.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Flutuante de Suporte/Chat */}
        <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2">
          <Button 
            className="rounded-full h-14 w-14 shadow-xl bg-primary hover:bg-primary/90"
            size="icon"
            onClick={() => toast.info("Olá! Como podemos te ajudar hoje? Chame no WhatsApp para suporte imediato.")}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}