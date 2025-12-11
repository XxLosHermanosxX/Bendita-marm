"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { AddressForm } from "@/components/checkout/address-form";
import { UserDataForm } from "@/components/checkout/user-data-form";
import { CouponForm } from "@/components/checkout/coupon-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Address, UserData, Coupon } from "@/types";
import { useCartStore } from "@/store/use-cart-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CheckoutStep = "address" | "user_data" | "coupon" | "summary";

const steps: { id: CheckoutStep; name: string }[] = [
  { id: "address", name: "1. Endereço" },
  { id: "user_data", name: "2. Dados Pessoais" },
  { id: "coupon", name: "3. Cupom" },
  { id: "summary", name: "4. Resumo" },
];

export const CheckoutLayout = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<Address | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const { items, getSubtotal } = useCartStore();
  const router = useRouter();

  const subtotal = getSubtotal();
  const deliveryFee = 10.00; // Placeholder
  const discount = coupon ? subtotal * (coupon.discount / 100) : 0; // Placeholder simples
  const total = subtotal - discount + deliveryFee;

  // Tipando 'data' com 'any' temporariamente, pois o tipo depende do 'step'
  const handleNext = (step: CheckoutStep, data: any) => {
    switch (step) {
      case "address":
        setAddress(data as Address);
        setCurrentStep("user_data");
        break;
      case "user_data":
        setUserData(data as UserData);
        setCurrentStep("coupon");
        break;
      case "coupon":
        setCoupon(data as Coupon); // data pode ser null se o cupom for removido
        setCurrentStep("summary");
        break;
      case "summary":
        // Finalizar Pedido (Próximo passo: PIX Payment)
        toast.loading("Finalizando pedido...");
        // Simulação de finalização e redirecionamento
        setTimeout(() => {
          toast.dismiss();
          router.push("/payment");
        }, 1500);
        break;
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    } else {
      router.push("/products"); // Volta para a loja se estiver no primeiro passo
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "address":
        return <AddressForm initialData={address} onNext={(data: Address) => handleNext("address", data)} />;
      case "user_data":
        return <UserDataForm initialData={userData} onNext={(data: UserData) => handleNext("user_data", data)} onBack={handleBack} />;
      case "coupon":
        return <CouponForm currentCoupon={coupon} onNext={(data: Coupon | null) => handleNext("coupon", data)} onBack={handleBack} />;
      case "summary":
        if (!address || !userData) {
          // Caso o usuário tente pular etapas
          toast.error("Por favor, preencha o endereço e dados pessoais primeiro.");
          setCurrentStep("address");
          return null;
        }
        return (
          <OrderSummary 
            address={address} 
            userData={userData} 
            coupon={coupon} 
            subtotal={subtotal} 
            deliveryFee={deliveryFee} 
            discount={discount} 
            total={total} 
            onFinalize={() => handleNext("summary", null)} 
            onBack={handleBack} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coluna Principal (Passos do Checkout) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Indicador de Progresso */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((step) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  currentStep === step.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {step.name.split('.')[0]}
                </div>
                <span className="text-xs mt-1 hidden sm:block text-center">
                  {step.name.split('. ')[1]}
                </span>
              </div>
              {step.id !== "summary" && (
                <Separator className={cn(
                  "flex-1 mx-2 h-0.5",
                  steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id)
                    ? "bg-primary"
                    : "bg-border"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Conteúdo do Passo Atual */}
        <div className="bg-card p-6 rounded-lg shadow-md border border-border">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Coluna Lateral (Resumo Fixo do Pedido) */}
      <div className="lg:col-span-1">
        <div className="sticky top-20 bg-secondary/50 p-6 rounded-lg shadow-md border border-border">
          <h2 className="text-xl font-bold mb-4 text-foreground">Seu Pedido</h2>
          <Separator className="mb-4" />
          {items.length === 0 ? (
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.quantity * (item.selectedVariation?.option.price || item.price))}
                  </span>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Desconto:</span>
                  <span className="text-destructive">-{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Entrega:</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};