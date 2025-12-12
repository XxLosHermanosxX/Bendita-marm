"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CreditCard, DollarSign, ChevronLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Esquema de validação com Zod
const PaymentSchema = z.object({
  type: z.enum(["credit_card", "money"], {
    required_error: "Por favor, selecione um método de pagamento.",
  }),
  cardBrand: z.string().optional(), // Para futuras implementações de seleção de bandeira
  changeNeeded: z.boolean().optional(),
  changeFor: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "O valor do troco não pode ser negativo.").optional()
  ),
});

interface PaymentFormProps {
  initialData: PaymentMethod | null;
  onNext: (data: PaymentMethod) => void;
}

export const PaymentForm = ({ initialData, onNext }: PaymentFormProps) => {
  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: initialData || {
      type: "credit_card",
      changeNeeded: false,
      changeFor: undefined,
    },
  });

  const selectedPaymentType = form.watch("type");
  const changeNeeded = form.watch("changeNeeded");

  const onSubmit = (data: z.infer<typeof PaymentSchema>) => {
    onNext(data as PaymentMethod);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <CreditCard className="h-5 w-5" /> 3. Método de Pagamento
        </h3>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Selecione a forma de pagamento</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md">
                    <FormControl>
                      <RadioGroupItem value="credit_card" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" /> Cartão de Crédito/Débito (na entrega)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md">
                    <FormControl>
                      <RadioGroupItem value="money" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" /> Dinheiro (na entrega)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedPaymentType === "money" && (
          <div className="space-y-4 p-4 border rounded-md bg-secondary/50">
            <h4 className="font-semibold text-foreground">Precisa de troco?</h4>
            <FormField
              control={form.control}
              name="changeNeeded"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange} // Corrigido: onCheckedChange para onChange
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Sim, preciso de troco
                  </FormLabel>
                </FormItem>
              )}
            />
            {changeNeeded && (
              <FormField
                control={form.control}
                name="changeFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Troco para quanto?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={formatCurrency(0)}
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? undefined : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-lg py-6">
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
};