"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Address } from "@/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Compass, Search } from "lucide-react";

// Esquema de validação com Zod
const AddressSchema = z.object({
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP deve ter 8 dígitos"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

type AddressFormValues = z.infer<typeof AddressSchema>;

interface AddressFormProps {
  initialData: Address | null;
  onNext: (data: Address) => void;
}

export const AddressForm = ({ initialData, onNext }: AddressFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const form = useForm<AddressFormValues>({
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

  const cep = form.watch("cep");

  // Auto-format CEP as user types
  useEffect(() => {
    if (cep && cep.length > 0) {
      // Remove any non-digit characters
      const cleanedCep = cep.replace(/\D/g, '');

      // Format CEP as user types (e.g., 12345-678)
      if (cleanedCep.length <= 8) {
        let formattedCep = cleanedCep;
        if (cleanedCep.length > 5) {
          formattedCep = `${cleanedCep.slice(0, 5)}-${cleanedCep.slice(5)}`;
        }
        form.setValue("cep", formattedCep, { shouldValidate: true });
      }

      // Auto-fetch address when CEP has 8 digits
      if (cleanedCep.length === 8) {
        fetchAddressByCep(cleanedCep);
      }
    }
  }, [cep]);

  const fetchAddressByCep = async (cep: string) => {
    try {
      setIsLoading(true);
      setLocationError(null);

      // Use ViaCEP API to fetch address data
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setLocationError("CEP não encontrado. Por favor, verifique o CEP digitado.");
        return;
      }

      // Auto-fill address fields
      form.setValue("street", data.logradouro || "");
      form.setValue("neighborhood", data.bairro || "");
      form.setValue("city", data.localidade || "");
      form.setValue("state", data.uf || "");
      setShowAddressFields(true);

    } catch (error) {
      setLocationError("Erro ao buscar endereço. Por favor, tente novamente.");
      console.error("Error fetching address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setIsLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use Nominatim (OpenStreetMap) to reverse geocode
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;
            const cep = address.postcode ? address.postcode.replace(/\D/g, '') : "";

            // Fill form with location data
            form.setValue("cep", cep || "");
            form.setValue("street", address.road || address.street || "");
            form.setValue("neighborhood", address.suburb || address.neighbourhood || address.village || "");
            form.setValue("city", address.city || address.town || address.village || "");
            form.setValue("state", address.state || "");

            setShowAddressFields(true);
          } else {
            setLocationError("Não foi possível obter o endereço da sua localização.");
          }
        } catch (error) {
          setLocationError("Erro ao obter endereço da localização.");
          console.error("Error reverse geocoding:", error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Permissão de localização negada. Por favor, permita o acesso à localização.");
        } else {
          setLocationError("Erro ao obter localização. Por favor, tente novamente.");
        }
      }
    );
  };

  const onSubmit: SubmitHandler<AddressFormValues> = (data) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" /> 1. Endereço de Entrega
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu CEP"
                      {...field}
                      maxLength={9}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={isLoading}
                className="w-full gap-2"
              >
                <Compass className="h-4 w-4" />
                Usar minha localização
              </Button>
            </div>
          </div>

          {locationError && (
            <div className="text-sm text-destructive">
              {locationError}
            </div>
          )}

          {isLoading && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Buscando endereço...
            </div>
          )}

          {showAddressFields && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da rua" {...field} />
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
                        <Input placeholder="Nome do bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Número" {...field} />
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
                      <FormLabel>Complemento (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, bloco, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Estado" {...field} maxLength={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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