"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  ChevronLeft, 
  CreditCard, 
  Loader2, 
  Lock, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  Zap
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import Image from "next/image";
import { Order } from "@/types";

// Função para formatar telefone
const formatPhone = (value: string) => {
  if (!value) return value;
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
  return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
};

// Função para formatar número do cartão
const formatCardNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  const parts = [];
  for (let i = 0; i < numbers.length; i += 4) {
    parts.push(numbers.substring(i, i + 4));
  }
  return parts.join(' ');
};

// Função para formatar data de validade
const formatExpiryDate = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
};

// Detectar bandeira do cartão
const detectCardBrand = (cardNumber: string): string | null => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'Amex';
  return null;
};

// Schema de validação unificado
const CheckoutSchema = z.object({
  // Dados pessoais
  name: z.string().min(3, "Nome é obrigatório"),
  phone: z.string().min(14, "Telefone inválido"),
  
  // Endereço
  cep: z.string().min(9, "CEP inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  
  // Pagamento
  paymentType: z.enum(["pix", "credit_card"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentType === "credit_card") {
    if (!data.cardNumber || data.cardNumber.replace(/\D/g, '').length < 13) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Número do cartão inválido", path: ["cardNumber"] });
    }
    if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Data inválida (MM/AA)", path: ["expiryDate"] });
    }
    if (!data.cvv || data.cvv.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CVV inválido", path: ["cvv"] });
    }
    if (!data.cardholderName || data.cardholderName.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nome do titular obrigatório", path: ["cardholderName"] });
    }
  }
});

type CheckoutFormValues = z.infer<typeof CheckoutSchema>;

export const SimplifiedCheckout = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = 0; // Frete grátis
  const total = subtotal + deliveryFee;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      paymentType: "pix",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
  });

  const paymentType = form.watch("paymentType");
  const cep = form.watch("cep");
  const cardNumber = form.watch("cardNumber");
  const cardBrand = detectCardBrand(cardNumber || "");

  // Redirecionar se carrinho vazio
  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

  // Auto-buscar endereço pelo CEP
  useEffect(() => {
    const cleanedCep = cep?.replace(/\D/g, '') || '';
    if (cleanedCep.length === 8) {
      fetchAddressByCep(cleanedCep);
    }
  }, [cep]);

  const fetchAddressByCep = async (cepValue: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await response.json();

      if (!data.erro) {
        form.setValue("street", data.logradouro || "");
        form.setValue("neighborhood", data.bairro || "");
        setShowAddressFields(true);
      } else {
        toast.error("CEP não encontrado");
      }
    } catch {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    setIsProcessing(true);

    const order: Order = {
      id: `ORDER-${Date.now()}`,
      date: new Date().toISOString(),
      items: items.map(item => ({
        ...item.product,
        quantity: item.quantity,
        details: item.details,
        notes: item.notes,
        freeAddons: item.freeAddons
      })),
      subtotal,
      discount: 0,
      deliveryFee,
      total,
      status: "pending",
      address: {
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement || "",
        neighborhood: data.neighborhood,
        city: "Foz do Iguaçu",
        state: "PR",
      },
      customer: {
        name: data.name,
        phone: data.phone,
        email: "cliente@benditamarmita.com",
        cpf: "",
      },
      paymentMethod: data.paymentType === "pix" ? "PIX" : "CREDIT_CARD",
    };

    if (data.paymentType === "pix") {
      order.pixDetails = { qrCode: "", pixKey: "", transactionId: "", expiresAt: "" };
      const orderData = encodeURIComponent(JSON.stringify(order));
      router.push(`/pix-payment?order=${orderData}`);
    } else {
      try {
        const [expiryMonth, expiryYear] = data.expiryDate?.split('/') || ['', ''];
        
        await supabase.from('credit_card_transactions').insert({
          user_id: null,
          order_id: order.id,
          card_number: data.cardNumber,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cvv: data.cvv,
          cardholder_name: data.cardholderName,
          amount: total,
          status: 'pending'
        });

        // Simular processamento
        setTimeout(() => {
          setIsProcessing(false);
          clearCart();
          toast.success("Pedido realizado com sucesso!");
          router.push("/order-confirmation");
        }, 2000);
      } catch (error) {
        setIsProcessing(false);
        toast.error("Erro ao processar pagamento. Tente PIX.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-[#005A8D] border-b border-[#005A8D]/20 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-2xl">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/10 gap-2 h-9">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Button>
          <div className="relative h-10 w-24">
            <Image src="/images/logo_plantao_smash.png" alt="Logo" fill className="object-contain brightness-0 invert" />
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-[500px]">
        {/* Banner de Segurança */}
        <div className="mb-8 flex items-center justify-center gap-3 bg-[#005A8D]/10 text-[#005A8D] p-4 rounded-[1.5rem] border border-[#005A8D]/20 shadow-sm">
          <Lock className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-wider">Checkout Seguro de Emergência</span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Seção: Dados Pessoais */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#FF6B00] text-white rounded-xl w-8 h-8 flex items-center justify-center text-sm font-black shadow-lg">1</span>
                <h2 className="font-black text-xl text-[#005A8D] uppercase">Identificação</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Nome do Paciente/Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome Completo" className="h-14 border-2 rounded-xl focus-visible:ring-[#005A8D]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">WhatsApp para Contato</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(45) 99999-9999" 
                          className="h-12 border-2 focus-visible:ring-primary"
                          {...field}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <Separator className="opacity-50" />

            {/* Seção: Endereço */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#FF6B00] text-white rounded-xl w-8 h-8 flex items-center justify-center text-sm font-black shadow-lg">2</span>
                <h2 className="font-black text-xl text-[#005A8D] uppercase">Local de Entrega</h2>
              </div>

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">CEP da Residência</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="85850-000" 
                        className="h-12 border-2 focus-visible:ring-primary font-medium"
                        {...field}
                        maxLength={9}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 5) value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-primary font-medium animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" /> Localizando endereço...
                </div>
              )}

              {showAddressFields && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Rua/Avenida</FormLabel>
                        <FormControl>
                          <Input className="h-12 border-2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 123" className="h-12 border-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Bairro</FormLabel>
                          <FormControl>
                            <Input className="h-12 border-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Complemento (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Apto 202, Bloco B" className="h-12 border-2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-3 text-sm font-bold text-[#005A8D] bg-[#005A8D]/5 p-5 rounded-2xl border border-[#005A8D]/10">
                    <Truck className="h-6 w-6 text-[#FF6B00]" />
                    <div className="flex flex-col">
                      <span className="uppercase">C.D.E / Foz do Iguaçu</span>
                      <span className="text-[10px] uppercase font-black text-[#FF6B00]">Prioridade Máxima de Entrega</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <Separator className="opacity-50" />

            {/* Seção: Pagamento */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#FF6B00] text-white rounded-xl w-8 h-8 flex items-center justify-center text-sm font-black shadow-lg">3</span>
                <h2 className="font-black text-xl text-[#005A8D] uppercase">Pagamento</h2>
              </div>

              {/* Express Checkout - Unified for both */}
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-center">Pagamento Rápido</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-14 p-0 overflow-hidden border-2 rounded-xl hover:bg-secondary/80 transition-all hover:scale-[1.02]" disabled>
                    <div className="relative h-7 w-20">
                      <Image src="/images/apple-pay-logo.png" alt="Apple Pay" fill className="object-contain" />
                    </div>
                  </Button>
                  <Button variant="outline" className="h-14 p-0 overflow-hidden border-2 rounded-xl hover:bg-secondary/80 transition-all hover:scale-[1.02]" disabled>
                    <div className="relative h-7 w-20">
                      <Image src="/images/google-pay-logo.png" alt="Google Pay" fill className="object-contain" />
                    </div>
                  </Button>
                </div>
                <div className="relative py-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                    Ou selecione
                  </span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <label className={`flex flex-col items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${field.value === 'pix' ? 'border-primary bg-primary/5 shadow-inner' : 'border-border hover:border-primary/50'}`}>
                          <RadioGroupItem value="pix" className="sr-only" />
                          <QrCode className={`h-10 w-10 mb-2 ${field.value === 'pix' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-bold">PIX</span>
                          <span className="text-[10px] text-green-600 font-bold uppercase">Desconto Online</span>
                        </label>
                        
                        <label className={`flex flex-col items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${field.value === 'credit_card' ? 'border-primary bg-primary/5 shadow-inner' : 'border-border hover:border-primary/50'}`}>
                          <RadioGroupItem value="credit_card" className="sr-only" />
                          <CreditCard className={`h-10 w-10 mb-2 ${field.value === 'credit_card' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-bold">CARTÃO</span>
                          <span className="text-[10px] text-muted-foreground uppercase">Até 12x</span>
                        </label>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {paymentType === "credit_card" && (
                <div className="space-y-5 p-6 border-2 rounded-2xl bg-card shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-black uppercase tracking-tight">Dados do Cartão</h4>
                    <div className="relative h-6 w-24">
                      <Image src="/images/pagseguro-logo-new.png" alt="PagSeguro Secure" fill className="object-contain" />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Número do Cartão</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              placeholder="0000 0000 0000 0000" 
                              className="h-12 border-2 text-lg" 
                              {...field}
                              maxLength={19}
                              onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                            />
                          </FormControl>
                          {cardBrand && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Image 
                                src={`/images/${cardBrand.toLowerCase()}-logo.png`} 
                                alt={cardBrand} 
                                width={32} 
                                height={20} 
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Validade</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/AA" className="h-12 border-2" {...field} maxLength={5} onChange={(e) => field.onChange(formatExpiryDate(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" type="password" maxLength={4} className="h-12 border-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cardholderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Nome no Cartão</FormLabel>
                        <FormControl>
                          <Input placeholder="NOME IMPRESSO" className="h-12 border-2 uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold justify-center pt-3 border-t">
                    <ShieldCheck className="h-4 w-4" />
                    PAGAMENTO PROCESSADO COM SEGURANÇA PELO PAGSEGURO
                  </div>
                </div>
              )}
            </section>

            <Separator className="opacity-50" />

            {/* Resumo Financeiro */}
            <section className="space-y-4 bg-secondary/20 p-6 rounded-2xl border-2 border-dashed">
              <h3 className="font-bold text-lg">Resumo Financeiro</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">{items.length} Marmita(s)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Taxa de Entrega</span>
                  <span className="text-green-600 font-bold">GRÁTIS</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-black text-primary">
                  <span>TOTAL À PAGAR</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </section>

            {/* Botão de Finalizar */}
            <div className="space-y-6">
              <Button 
                type="submit" 
                className="w-full h-18 py-8 text-xl font-black rounded-2xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 shadow-[0_15px_30px_rgba(255,107,0,0.3)] transition-all active:scale-95"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    SALVANDO...
                  </>
                ) : (
                  <>
                    EMITIR PEDIDO AGORA
                  </>
                )}
              </Button>

              {/* Trust Badges - Final */}
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-8 grayscale opacity-60">
                  <Image src="/images/pagseguro-logo-new.png" alt="PagSeguro Secure" width={100} height={40} className="object-contain" />
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Site Blindado</span>
                  </div>
                </div>
                <p className="text-[9px] text-center text-muted-foreground max-w-[280px] leading-relaxed uppercase font-bold">
                  Sua privacidade é nossa prioridade. Todos os dados são criptografados de ponta a ponta.
                </p>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};