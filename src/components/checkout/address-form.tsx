"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Address } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { MapPin, Search } from "lucide-react";

// Esquema de validação com Zod
const AddressSchema = z.object({
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP deve ter 8 dígitos").regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido"),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, "Bairro é obrigatório"),
  city: z.string().min(3, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

interface AddressFormProps {
  initialData: Address | null;
  onNext: (data: Address) => void;
}

export const AddressForm = ({ initialData, onNext }: AddressFormProps) => {
  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    defaultValues: initialData || {
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleCepSearch = async () => {
    const cepValue = form.getValues("cep").replace(/\D/g, '');
    if (cepValue.length !== 8) {
      form.setError("cep", { message: "CEP deve ter 8 dígitos." });
      return;
    }

    setIsSearching(true);
    try {
      // Simulação de busca de CEP (ViaCEP)
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado.");
        form.setError("cep", { message: "CEP não encontrado." });
        form.setValue("street", "");
        form.setValue("neighborhood", "");
        form.setValue("city", "");
        form.setValue("state", "");
      } else {
        form.setValue("street", data.logradouro || "");
        form.setValue("neighborhood", data.bairro || "");
        form.setValue("city", data.localidade || "");
        form.setValue("state", data.uf || "");
        toast.success("Endereço preenchido automaticamente!");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = (data: z.infer<typeof AddressSchema>) => {
    onNext(data as Address);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" /> 1. Endereço de Entrega
        </h3>

        {/* Campo de CEP e Botão de Busca */}
        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 12345-678" 
                    {...field} 
                    maxLength={9}
                    onChange={(e) => {
                        // Formatação simples de CEP
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 5) {
                            value = value.substring(0, 5) + '-' + value.substring(5, 8);
                        }
                        field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            onClick={handleCepSearch} 
            disabled={isSearching || form.getValues("cep").replace(/\D/g, '').length !== 8}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>

        {/* Campos de Endereço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input placeholder="Rua dos Sushis" {...field} />
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
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Centro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Apto 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado (UF)</FormLabel>
                <FormControl>
                  <Input placeholder="SP" {...field} maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6 mt-6">
          Usar este endereço
        </Button>
      </form>
    </Form>
  );
};