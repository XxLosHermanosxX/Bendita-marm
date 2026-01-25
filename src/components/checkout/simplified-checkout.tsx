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
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Truck,
  CheckCircle2,
  Loader2,
  Apple,
  Smartphone
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
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Button>
          <h1 className="font-bold text-lg">Finalizar Pedido</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Seção: Dados Pessoais */}
            <section className="space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Seus Dados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
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
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(45) 99999-9999" 
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

            <Separator />

            {/* Seção: Endereço */}
            <section className="space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                <MapPin className="h-4 w-4" /> Endereço de Entrega
              </h2>

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="85850-000" 
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Buscando endereço...
                </div>
              )}

              {showAddressFields && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Rua</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento <span className="text-muted-foreground">(opcional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Apto, bloco..." {...field} />
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
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Foz do Iguaçu - PR</span>
                    <span className="ml-auto text-green-600 font-medium">Frete Grátis</span>
                  </div>
                </div>
              )}
            </section>

            <Separator />

            {/* Seção: Pagamento */}
            <section className="space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                <CreditCard className="h-4 w-4" /> Pagamento
              </h2>

              {/* Express Checkout moved here and updated */}
              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pagamento expresso</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 p-0 overflow-hidden border-2 hover:bg-secondary/50" disabled>
                    <div className="relative h-6 w-16">
                      <Image src="/images/apple-pay-logo.png" alt="Apple Pay" fill className="object-contain" />
                    </div>
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 p-0 overflow-hidden border-2 hover:bg-secondary/50" disabled>
                    <div className="relative h-6 w-16">
                      <Image src="/images/google-pay-logo.png" alt="Google Pay" fill className="object-contain" />
                    </div>
                  </Button>
                </div>
                <div className="relative py-2">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[10px] text-muted-foreground uppercase font-bold">
                    Ou selecione abaixo
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
                        <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${field.value === 'pix' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                          <RadioGroupItem value="pix" className="sr-only" />
                          <QrCode className={`h-8 w-8 mb-2 ${field.value === 'pix' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-medium">PIX</span>
                          <span className="text-xs text-muted-foreground">Aprovação imediata</span>
                        </label>
                        
                        <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${field.value === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                          <RadioGroupItem value="credit_card" className="sr-only" />
                          <CreditCard className={`h-8 w-8 mb-2 ${field.value === 'credit_card' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-medium">Cartão</span>
                          <span className="text-xs text-muted-foreground">Crédito ou débito</span>
                        </label>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {paymentType === "credit_card" && (
                <div className="space-y-4 p-4 border-2 rounded-xl bg-card animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold">Dados do Cartão</h4>
                    <div className="relative h-5 w-24">
                      <Image src="/images/pagseguro-logo-new.png" alt="PagSeguro" fill className="object-contain" />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Cartão</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              placeholder="0000 0000 0000 0000" 
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
                          <FormLabel>Validade</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/AA" 
                              {...field}
                              maxLength={5}
                              onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                            />
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
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" type="password" maxLength={4} {...field} />
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
                        <FormLabel>Nome no Cartão</FormLabel>
                        <FormControl>
                          <Input placeholder="Como está impresso no cartão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center pt-2 border-t">
                    <ShieldCheck className="h-3 w-3 text-green-600" />
                    Pagamento 100% processado e protegido pelo PagSeguro
                  </div>
                </div>
              )}
            </section>

            <Separator />

            {/* Resumo do Pedido */}
            <section className="space-y-3 bg-secondary/30 p-4 rounded-xl">
              <h3 className="font-semibold">Resumo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{items.length} item(s)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entrega</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </section>

            {/* Botão de Finalizar */}
            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Finalizar Pedido • {formatCurrency(total)}
                  </>
                )}
              </Button>

              {/* Trust Badges and Security Seals */}
              <div className="grid grid-cols-1 gap-4 pt-4">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative h-8 w-24 grayscale opacity-70">
                      <Image src="/images/pagseguro-logo-new.png" alt="PagSeguro Secure" fill className="object-contain" />
                    </div>
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Ambiente Seguro</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">SSL Criptografado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>30-45 min</span>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};