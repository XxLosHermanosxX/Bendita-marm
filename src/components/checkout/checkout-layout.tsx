"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { AddressForm } from "./address-form";
import { UserDataForm } from "./user-data-form";
import { PaymentForm } from "./payment-form";
import { OrderSummaryDrawer } from "./order-summary-drawer";
import { ReviewOrderSummary } from "./review-order-summary";
import { DeliveryPromoModal } from "./delivery-promo-modal";
import { Address, UserData, PaymentMethod, Order } from "@/types";
import { useCartStore } from "@/store/use-cart-store";
import { useCheckoutStore } from "@/store/use-checkout-store"; // Importando o novo store
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Simulação: Assume que é o primeiro pedido até que tenhamos lógica de autenticação
const IS_FIRST_ORDER_SIMULATION = true; 

export const CheckoutLayout = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  // Usando o store persistente para gerenciar o estado do checkout
  const { 
    address, userData, paymentMethod, currentStep,
    setAddress, setUserData, setPaymentMethod, setCurrentStep,
    clearCheckout
  } = useCheckoutStore();
  
  // Estado local para a taxa de entrega (não persistente, pode ser recalculada)
  const [deliveryFee, setDeliveryFee] = useState(10.00); 
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false);
  const [showDeliveryPromoModal, setShowDeliveryPromoModal] = useState(false); 
  
  const mainRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(currentStep);
  
  const subtotal = getTotalPrice();
  const discount = 0; 
  const total = subtotal + deliveryFee - discount; 

  // 1. Redirecionamento se o carrinho estiver vazio
  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

  // 2. Scroll automático ao mudar de etapa
  useEffect(() => {
    if (currentStep !== previousStepRef.current && mainRef.current) {
      if (currentStep === 4) {
        // Scroll to the bottom of the page/container when reaching step 4
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else {
        // Scroll to the top of the main area for steps 1, 2, 3
        mainRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      previousStepRef.current = currentStep;
    }
    // Atualiza o ref da etapa anterior
    previousStepRef.current = currentStep;
  }, [currentStep]);

  const handleNextStep = () => {
    // O store já incrementa a etapa ao salvar os dados, mas precisamos de um fallback
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddressNext = (data: Address) => {
    setAddress(data); // Salva e avança para step 2 no store
    
    // Lógica da Promoção de Entrega Grátis
    if (IS_FIRST_ORDER_SIMULATION && deliveryFee > 0) {
        setDeliveryFee(0.00);
        setShowDeliveryPromoModal(true);
    }
    
    // Não precisamos chamar handleNextStep() aqui, pois setAddress já atualiza currentStep no store.
  };

  const handleUserDataNext = (data: UserData) => {
    setUserData(data); // Salva e avança para step 3 no store
  };

  const handlePaymentNext = (data: PaymentMethod) => {
    setPaymentMethod(data); // Salva e avança para step 4 no store
  };


  const handlePlaceOrder = () => {
    if (!address || !userData || !paymentMethod || items.length === 0) {
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
      discount: discount, 
      deliveryFee: deliveryFee, 
      total: total, 
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

    // Clear checkout state and cart after placing the order
    clearCheckout();
    clearCart();

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
            onNext={handleAddressNext} 
          />
        );
      case 2:
        return (
          <UserDataForm
            initialData={userData}
            onNext={handleUserDataNext}
            onBack={handlePreviousStep}
          />
        );
      case 3:
        return (
          <PaymentForm
            initialData={paymentMethod}
            onNext={handlePaymentNext}
          />
        );
      default:
        return null;
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
      
      {/* Delivery Promo Modal */}
      <DeliveryPromoModal
        isOpen={showDeliveryPromoModal}
        onClose={() => setShowDeliveryPromoModal(false)}
      />
    </div>
  );
};