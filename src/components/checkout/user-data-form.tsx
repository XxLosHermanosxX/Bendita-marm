"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, ChevronLeft, Mail, Smartphone, FileText } from "lucide-react";

// Função de formatação de telefone (para (99) 99999-9999)
const formatPhone = (value: string) => {
  if (!value) return value;
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
  if (numbers.length <= 11) return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
  
  return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
};

// Função de formatação de CPF (para 999.999.999-99)
const formatCPF = (value: string) => {
  if (!value) return value;
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.substring(0, 3)}.${numbers.substring(3)}`;
  if (numbers.length <= 9) return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6)}`;
  if (numbers.length <= 11) return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9, 11)}`;
  
  return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9, 11)}`;
};


// Esquema de validação com Zod
const UserDataSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
  cpf: z.string().min(14, "CPF inválido").max(14, "CPF inválido"),
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
      email: "",
      phone: "",
      cpf: "",
    },
  });

  const onSubmit = (data: z.infer<typeof UserDataSchema>) => {
    // CPF and Email are now collected and validated
    onNext(data as UserData);
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
              <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" /> Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</FormLabel>
              <FormControl>
                <Input placeholder="seu.email@exemplo.com" {...field} type="email" />
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
              <FormLabel className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Telefone</FormLabel>
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
        
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4" /> CPF</FormLabel>
              <FormControl>
                <Input 
                  placeholder="999.999.999-99" 
                  {...field} 
                  maxLength={14}
                  onChange={(e) => {
                    const formattedValue = formatCPF(e.target.value);
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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