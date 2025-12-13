"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { AddressForm } from "./address-form";
import { UserDataForm } from "./user-data-form";
import { PaymentForm } from "./payment-form";
import { OrderSummaryDrawer } from "./order-summary-drawer"; // New import
import { ReviewOrderSummary } from "./review-order-summary"; // New import
import { Address, UserData, PaymentMethod, Order } from "@/types";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export const CheckoutLayout = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<Address | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false); // New state for drawer
  
  const mainRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(currentStep);
  
  const subtotal = getTotalPrice();
  const deliveryFee = 10.00; // Exemplo de taxa de entrega
  const discount = 0; // Sem descontos por enquanto
  const total = subtotal + deliveryFee - discount; // Preço final

  useEffect(() => {
    if (items.length === 0) {
      toast.info("Seu carrinho está vazio. Adicione itens para continuar.");
      router.push("/products");
    }
  }, [items, router]);

  // Efeito para scroll automático ao mudar de etapa
  useEffect(() => {
    if (currentStep !== previousStepRef.current && mainRef.current) {
      // Scroll para o topo da área principal
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
      previousStepRef.current = currentStep;
    }
  }, [currentStep]);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePlaceOrder = () => {
    if (!address || !userData || !paymentMethod || items.length === 0) {
      toast.error("Por favor, complete todas as etapas antes de finalizar.");
      return;
    }

    // Create order object
    const order: Order = {
      id: `ORDER-${Date.now()}`,
      date: new Date().toISOString(),
      items: items.map(item => ({
        ...item.product,
        quantity: item.quantity,
        details: item.details,
        notes: item.notes
      })),
      subtotal: subtotal,
      discount: discount, // Usando o desconto calculado
      deliveryFee: deliveryFee,
      total: total, // Preço final
      status: "pending",
      address: address,
      customer: userData,
      paymentMethod: "PIX",
      pixDetails: {
        qrCode: "",
        pixKey: "",
        transactionId: "",
        expiresAt: ""
      }
    };

    // Redirect to PIX payment page with order data
    const orderData = encodeURIComponent(JSON.stringify(order));
    router.push(`/pix-payment?order=${orderData}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressForm
            initialData={address}
            onNext={(data: Address) => {
              setAddress(data);
              handleNextStep();
            }}
          />
        );
      case 2:
        return (
          <UserDataForm
            initialData={userData}
            onNext={(data: UserData) => {
              setUserData(data);
              handleNextStep();
            }}
            onBack={handlePreviousStep}
          />
        );
      case 3:
        return (
          <PaymentForm
            initialData={paymentMethod}
            onNext={(data: PaymentMethod) => {
              setPaymentMethod(data);
              handleNextStep();
            }}
          />
        );
      default:
        return null;
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!address;
      case 2:
        return !!userData;
      case 3:
        return !!paymentMethod;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Reduced top padding for closer proximity to header */}
      <main ref={mainRef} className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header controls: Back button and Summary button */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground p-0 h-auto"
            >
              <ChevronLeft className="h-5 w-5 mr-2" /> Voltar
            </Button>
            
            <Button
              variant="link"
              onClick={() => setShowSummaryDrawer(true)}
              className="p-0 h-auto text-primary font-semibold"
            >
              Ver resumo do pedido
            </Button>
          </div>

          {/* Título único e ajustado */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Finalizar Pedido
          </h1>

          <div className="grid grid-cols-1 gap-8">
            {/* Coluna Principal do Formulário (now full width) */}
            <div className="space-y-8">
              {/* Indicador de Progresso */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > 1 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    Endereço
                  </span>
                </div>
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > 1 ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > 2 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    Dados Pessoais
                  </span>
                </div>
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > 2 ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > 3 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    Pagamento
                  </span>
                </div>
              </div>

              {renderStepContent()}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-5 w-5" /> 4. Revisar e Finalizar
                  </h3>
                  
                  {/* NOVO: Resumo do Pedido Colapsável */}
                  <ReviewOrderSummary deliveryFee={deliveryFee} discount={discount} />

                  <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Endereço de Entrega
                      </h4>
                      {address ? (
                        <p className="text-muted-foreground">
                          {address.street}, {address.number}{" "}
                          {address.complement && `(${address.complement})`}
                          <br />
                          {address.neighborhood}, {address.city} - {address.state}
                          <br />
                          CEP: {address.cep}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          Nenhum endereço selecionado.
                        </p>
                      )}
                      <Button
                        variant="link"
                        onClick={() => setCurrentStep(1)}
                        className="p-0 h-auto mt-2"
                      >
                        Editar
                      </Button>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Dados Pessoais
                      </h4>
                      {userData ? (
                        <p className="text-muted-foreground">
                          Nome: {userData.name}
                          <br />
                          {/* Email removido */}
                          Telefone: {userData.phone}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          Nenhum dado pessoal informado.
                        </p>
                      )}
                      <Button
                        variant="link"
                        onClick={() => setCurrentStep(2)}
                        className="p-0 h-auto mt-2"
                      >
                        Editar
                      </Button>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Método de Pagamento
                      </h4>
                      {paymentMethod ? (
                        <p className="text-muted-foreground">
                          PIX (pagamento online)
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          Nenhum método de pagamento selecionado.
                        </p>
                      )}
                      <Button
                        variant="link"
                        onClick={() => setCurrentStep(3)}
                        className="p-0 h-auto mt-2"
                      >
                        Editar
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 mt-6"
                    disabled={
                      !address || !userData || !paymentMethod || items.length === 0
                    }
                  >
                    Finalizar Pedido ({formatCurrency(total)})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Order Summary Drawer */}
      <OrderSummaryDrawer
        isOpen={showSummaryDrawer}
        onClose={() => setShowSummaryDrawer(false)}
        deliveryFee={deliveryFee}
        discount={discount}
      />
    </div>
  );
};