"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentMethod } from "@/types";
import { createOrder } from "@/lib/api/orders";
import { toast } from "sonner";
import { Loader2, ArrowLeft, MapPin, CreditCard, QrCode, AlertTriangle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(5.00);
  const [discount, setDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total price
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee - discount;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!deliveryAddress) {
        setError("Por favor, informe o endereço de entrega");
        return;
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          variationId: item.details?.selectedVariation?.option.id,
          customItems: item.details?.customItems?.map(c => ({
            id: c.id,
            count: c.count
          })),
          notes: item.notes
        })),
        deliveryAddress,
        paymentMethod,
        totalAmount: total,
        orderNotes
      };

      const result = await createOrder(orderData);

      if (result.success) {
        // Redirect to payment page based on payment method
        if (paymentMethod === "pix") {
          router.push(`/pix-payment?order=${encodeURIComponent(JSON.stringify(result.order))}`);
        } else {
          // For other payment methods, we'll implement later
          toast.success("Pedido criado com sucesso!");
          clearCart();
          router.push("/");
        }
      } else {
        setError(result.error || "Falha ao criar pedido");
        toast.error(result.error || "Falha ao criar pedido");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      toast.error("Erro ao processar pedido");
      console.error("Error creating order:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 min-h-[80vh]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryAddress">Endereço completo</Label>
                      <Textarea
                        id="deliveryAddress"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Digite seu endereço completo"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Método de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-2 font-medium">
                        <QrCode className="h-5 w-5 text-primary" />
                        PIX (Recomendado)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center gap-2 font-medium">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Cartão de Crédito
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Observações do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Alguma observação especial para o seu pedido?"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Order Summary - Moved below review section */}
                <OrderSummary deliveryFee={deliveryFee} discount={discount} />

                {/* Review Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Revisar e Finalizar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de Entrega:</span>
                        <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span className="text-muted-foreground">Desconto:</span>
                          <span className="font-medium">- {formatCurrency(discount)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-destructive/10 p-3 rounded-lg flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Finalizar Pedido"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}