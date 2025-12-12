"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Coupon } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tag, ChevronLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

// Cupons disponíveis (Hardcoded para simulação)
const availableCoupons: { [key: string]: Coupon } = {
    BEMVINDO20: { code: "BEMVINDO20", discount: 20, type: "percentage", appliesTo: "first_purchase" },
    BARCA49: { code: "BARCA49", discount: 49.90, type: "fixed", appliesTo: "all" },
};

const CouponSchema = z.object({
  couponCode: z.string().optional(),
});

interface CouponFormProps {
  currentCoupon: Coupon | null;
  onNext: (coupon: Coupon | null) => void;
  onBack: () => void;
  onApply: (coupon: Coupon) => void; // Adicionado
  onRemove: () => void; // Adicionado
}

export const CouponForm = ({ currentCoupon, onNext, onBack, onApply, onRemove }: CouponFormProps) => {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(currentCoupon);
  
  const form = useForm<z.infer<typeof CouponSchema>>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      couponCode: "",
    },
  });

  const handleApplyCoupon = (data: z.infer<typeof CouponSchema>) => {
    const code = data.couponCode?.toUpperCase();
    if (!code) {
        setAppliedCoupon(null);
        onRemove(); // Chamar onRemove
        toast.info("Cupom removido.");
        return;
    }

    const couponData = availableCoupons[code];

    if (couponData) {
        setAppliedCoupon(couponData);
        onApply(couponData); // Chamar onApply
        toast.success(`Cupom ${code} aplicado! Você ganhou ${couponData.discount}${couponData.type === 'percentage' ? '%' : ' R$'} de desconto.`);
    } else {
        setAppliedCoupon(null);
        onRemove(); // Chamar onRemove
        toast.error("Cupom inválido ou expirado.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    form.setValue("couponCode", "");
    onRemove(); // Chamar onRemove
    toast.info("Cupom removido.");
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <Tag className="h-5 w-5" /> 3. Cupom/Promoção
        </h3>

        <form onSubmit={form.handleSubmit(handleApplyCoupon)} className="flex gap-2">
          <FormField
            control={form.control}
            name="couponCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sr-only">Código do Cupom</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o código do cupom" 
                    {...field} 
                    disabled={!!appliedCoupon}
                    className="uppercase"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={!!appliedCoupon}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Aplicar
          </Button>
        </form>

        {appliedCoupon && (
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success rounded-md">
                <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-success" />
                    <span className="text-sm font-medium text-success">
                        Cupom aplicado: {appliedCoupon.code}
                    </span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleRemoveCoupon}>
                    <X className="h-4 w-4 text-success" />
                </Button>
            </div>
        )}

        <div className="pt-4">
            <h4 className="text-md font-semibold mb-2">Cupons Disponíveis (Simulação)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
                <li>- BEMVINDO20: 20% de desconto (Primeira compra)</li>
                <li>- BARCA49: Barca 80 peças por R$ 49,90 (Desconto fixo)</li>
            </ul>
        </div>


        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <Button type="button" onClick={() => onNext(appliedCoupon)} className="bg-primary hover:bg-primary/90 text-lg py-6">
            Continuar
          </Button>
        </div>
      </div>
    </Form>
  );
};