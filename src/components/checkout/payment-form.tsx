"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CreditCard, ChevronLeft, QrCode } from "lucide-react";
import Image from "next/image";

// Função para formatar o número do cartão
const formatCardNumber = (value: string) => {
  if (!value) return value;
  const numbers = value.replace(/\D/g, '');
  const parts = [];
  for (let i = 0; i < numbers.length; i += 4) {
    parts.push(numbers.substring(i, i + 4));
  }
  return parts.join(' ');
};

// Função para formatar a data de validade
const formatExpiryDate = (value: string) => {
  if (!value) return value;
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
};

// Função para detectar a bandeira do cartão
const detectCardBrand = (cardNumber: string): string | null => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.startsWith('4')) return 'Visa';
  if (cleaned.startsWith('51') || cleaned.startsWith('52') || cleaned.startsWith('53') || cleaned.startsWith('54') || cleaned.startsWith('55')) return 'Mastercard';
  if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'American Express';
  return null;
};

// Esquema de validação com Zod
const PaymentSchema = z.object({
  type: z.enum(["pix", "credit_card"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cardholderName: z.string().optional(),
  cvv: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "credit_card") {
    if (!data.cardNumber || data.cardNumber.replace(/\D/g, '').length < 13) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número do cartão inválido",
        path: ["cardNumber"],
      });
    }
    if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data de validade inválida (MM/AA)",
        path: ["expiryDate"],
      });
    }
    if (!data.cardholderName || data.cardholderName.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nome do titular é obrigatório",
        path: ["cardholderName"],
      });
    }
    if (!data.cvv || data.cvv.length < 3 || data.cvv.length > 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVV inválido",
        path: ["cvv"],
      });
    }
  }
});

type PaymentFormValues = z.infer<typeof PaymentSchema>;

interface PaymentFormProps {
  initialData: PaymentMethod | null;
  onNext: (data: PaymentMethod) => void;
}

export const PaymentForm = ({ initialData, onNext }: PaymentFormProps) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      type: initialData?.type || "pix",
      cardNumber: "",
      expiryDate: "",
      cardholderName: "",
      cvv: "",
    },
  });

  const selectedPaymentType = form.watch("type");
  const cardNumber = form.watch("cardNumber");
  const cardBrand = detectCardBrand(cardNumber || "");

  const onSubmit: SubmitHandler<PaymentFormValues> = (data) => {
    if (data.type === "pix") {
      onNext({
        type: "pix",
        customerData: {
          cpf: "33236600802",
          phone: "459977458596",
          email: "cliente@gmail.com"
        }
      });
    } else if (data.type === "credit_card") {
      // Para cartão de crédito, enviamos os dados mascarados e um token simulado
      const lastFourDigits = data.cardNumber?.replace(/\D/g, '').slice(-4) || '';
      const [expiryMonth, expiryYear] = data.expiryDate?.split('/') || ['', ''];
      
      onNext({
        type: "credit_card",
        creditCard: {
          brand: cardBrand || "Desconhecida",
          lastFourDigits,
          expiryMonth,
          expiryYear,
          cardholderName: data.cardholderName || '',
          token: `tok_${Math.random().toString(36).substring(2, 15)}`, // Token simulado
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <CreditCard className="h-5 w-5" /> 3. Método de Pagamento
        </h3>
        
        <div className="p-4 border rounded-md bg-secondary/50">
          <p className="text-muted-foreground mb-4">
            Selecione como você gostaria de pagar.
          </p>
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md bg-white">
                      <FormControl>
                        <RadioGroupItem value="pix" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-primary" /> PIX (pagamento online)
                      </FormLabel>
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md bg-white">
                      <FormControl>
                        <RadioGroupItem value="credit_card" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" /> Cartão de Crédito
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedPaymentType === "credit_card" && (
            <div className="mt-6 space-y-4 p-4 border rounded-md bg-white">
              <h4 className="text-md font-semibold text-foreground">Dados do Cartão</h4>
              
              {/* Número do Cartão com Bandeira */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Cartão</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="XXXX XXXX XXXX XXXX"
                          {...field}
                          maxLength={19}
                          onChange={(e) => {
                            const formattedValue = formatCardNumber(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      {cardBrand && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {cardBrand === 'Visa' && (
                            <Image src="/images/visa-logo.png" alt="Visa" width={40} height={25} className="object-contain" />
                          )}
                          {cardBrand === 'Mastercard' && (
                            <Image src="/images/mastercard-logo.png" alt="Mastercard" width={40} height={25} className="object-contain" />
                          )}
                          {cardBrand === 'American Express' && (
                            <Image src="/images/amex-logo.png" alt="American Express" width={40} height={25} className="object-contain" />
                          )}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Data de Validade */}
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade (MM/AA)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/AA"
                          {...field}
                          maxLength={5}
                          onChange={(e) => {
                            const formattedValue = formatExpiryDate(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CVV */}
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="CVV" type="password" {...field} maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Nome do Titular */}
              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Titular</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome impresso no cartão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pagamento processado por iFood */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                <span>Pagamento processado por</span>
                <div className="relative h-6 w-16">
                  <Image src="/images/ifood-logo.png" alt="iFood Logo" layout="fill" objectFit="contain" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-lg py-6">
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
};