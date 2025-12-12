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
import { CreditCard, DollarSign, ChevronLeft, QrCode } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Esquema de validação com Zod - agora só PIX
const PaymentSchema = z.object({
  type: z.literal("pix"), // Só permite PIX
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
      type: "pix", // Sempre PIX
    },
  });

  const onSubmit: SubmitHandler<PaymentFormValues> = (data) => {
    // Sempre retorna PIX como método de pagamento
    onNext({
      type: "pix",
      // Dados fixos que a BlackCatPay precisa
      customerData: {
        cpf: "33236600802",
        phone: "459977458596",
        email: "cliente@gmail.com"
      }
    } as unknown as PaymentMethod);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <QrCode className="h-5 w-5" /> 3. Método de Pagamento
        </h3>

        <div className="p-4 border rounded-md bg-secondary/50">
          <p className="text-muted-foreground mb-4">
            Atualmente, estamos aceitando apenas pagamentos via PIX.
          </p>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md bg-white">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center space-x-3"
                  >
                    <RadioGroupItem value="pix" checked={true} />
                  </RadioGroup>
                </FormControl>
                <FormLabel className="font-normal flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" /> PIX (pagamento online)
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-lg py-6">
            Continuar com PIX
          </Button>
        </div>
      </form>
    </Form>
  );
};