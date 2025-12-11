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

// Esquema de validação com Zod
const UserDataSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
  cpf: z.string().optional(), // Simplificado, sem validação de CPF por enquanto
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
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} type="email" />
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
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(99) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="000.000.000-00" {...field} />
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