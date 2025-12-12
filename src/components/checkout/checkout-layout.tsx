"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { AddressForm } from "./address-form";
import { UserDataForm } from "./user-data-form";
import { PaymentForm } from "./payment-form";
import { OrderSummary } from "./order-summary";
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
  const subtotal = getTotalPrice();
  const deliveryFee = 10.00; // Exemplo de taxa de entrega
  const total = subtotal + deliveryFee; // Preço final sem descontos

  useEffect(() => {
    if (items.length === 0) {
      toast.info("Seu carrinho está vazio. Adicione itens para continuar.");
      router.push("/products");
    }
  }, [items, router]);

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
      discount: 0, // Sem descontos
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
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5 mr-2" /> Voltar
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Finalizar Pedido
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal do Formulário */}
            <div className="lg:col-span-2 space-y-8">
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

              {currentStep > 1 && currentStep <= 3 && (
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="mt-4 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" /> Voltar
                </Button>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-5 w-5" /> 4. Revisar e Finalizar
                  </h3>
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
                          Email: {userData.email}
                          <br />
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

            {/* Coluna do Resumo do Pedido */}
            <div className="lg:col-span-1">
              <OrderSummary deliveryFee={deliveryFee} discount={0} />

              {/* Mini resumo do carrinho */}
              <div className="rounded-lg border bg-card p-6 shadow-sm mt-8">
                <h3 className="text-lg font-semibold mb-4">Itens no Carrinho</h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          item.quantity *
                            (item.details?.selectedVariation?.option.price ||
                              item.product.price)
                        )}
                      </span>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};