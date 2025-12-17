"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, ChevronLeft } from "lucide-react";

// Função de formatação de telefone (para (99) 99999-9999)
const formatPhone = (value: string) => {
  if (!value) return value;
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
  if (numbers.length <= 11) return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
  
  return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
};

// Esquema de validação simplificado com Zod
const UserDataSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  // Email e CPF removidos
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
});

interface UserDataFormProps {
  initialData: UserData | null;
  onNext: (data: UserData) => void;
  onBack: () => void;
}

export const UserDataForm = ({ initialData, onNext, onBack }: UserDataFormProps) => {
  const form = useForm<z.infer<typeof UserDataSchema>>({
    resolver: zodResolver(UserDataSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      // email e cpf removidos
    },
  });

  const onSubmit = (data: z.infer<typeof UserDataSchema>) => {
    // A API espera email, então vamos adicionar um placeholder se não existir
    const fullData: UserData = {
      ...data,
      email: initialData?.email || "cliente@sushiaki.com", // Usando um placeholder ou dado anterior
      cpf: initialData?.cpf || "",
    };
    onNext(fullData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <User className="h-5 w-5" /> 2. Dados Pessoais
        </h3>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Apenas Telefone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(99) 99999-9999" 
                  {...field} 
                  onChange={(e) => {
                    const formattedValue = formatPhone(e.target.value);
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Email e CPF removidos */}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-lg py-6">
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
};