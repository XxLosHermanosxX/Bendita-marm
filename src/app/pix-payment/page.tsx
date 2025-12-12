"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Copy, QrCode, XCircle } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { createPixTransaction, pollPaymentStatus, formatTimeRemaining } from "@/lib/blackcatpay";
import { Order } from "@/types";

export default function PixPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [orderData, setOrderData] = useState<Order | null>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'declined' | 'expired' | 'error'>('pending');
  const [timeRemaining, setTimeRemaining] = useState<string>("10:00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse order data from URL search params
    try {
      const orderParam = searchParams.get('order');
      if (orderParam) {
        const parsedOrder = JSON.parse(decodeURIComponent(orderParam));
        setOrderData(parsedOrder);

        // Create PIX transaction
        createTransaction(parsedOrder);
      } else {
        setError("Nenhum dado de pedido encontrado");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dados do pedido inválidos");
      setIsLoading(false);
      console.error("Error parsing order data:", err);
    }
  }, [searchParams]);

  const createTransaction = async (order: Order) => {
    try {
      setIsLoading(true);
      console.log("Creating transaction with order:", order);

      const result = await createPixTransaction(order);

      if (result.success) {
        setTransaction(result);
        setPaymentStatus('pending');

        // Start polling for payment status
        const stopPolling = pollPaymentStatus(
          result.transactionId,
          (data) => {
            setPaymentStatus('approved');
            setTransaction((prev: any) => ({ ...prev, paidAt: data.paidAt }));
          },
          (err) => {
            setPaymentStatus('error');
            setError(err);
          },
          () => {
            setPaymentStatus('expired');
          }
        );

        // Start countdown timer
        const timer = setInterval(() => {
          if (result.expiresAt) {
            const remaining = formatTimeRemaining(result.expiresAt);
            setTimeRemaining(remaining);

            if (remaining === "00:00") {
              clearInterval(timer);
              setPaymentStatus('expired');
            }
          }
        }, 1000);

        return () => {
          stopPolling();
          clearInterval(timer);
        };
      } else {
        setError(result.error || "Falha ao criar transação PIX");
        setPaymentStatus('error');
        console.error("Transaction creation failed:", result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setPaymentStatus('error');
      console.error("Unexpected error in createTransaction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPixKey = () => {
    if (transaction?.pixKey) {
      navigator.clipboard.writeText(transaction.pixKey);
      toast.success("Chave PIX copiada para a área de transferência!");
    }
  };

  const handleBackToCheckout = () => {
    router.push("/checkout");
  };

  const handleGoToHome = () => {
    clearCart();
    router.push("/");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 md:p-6 min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-semibold text-foreground">Processando seu pagamento...</p>
            <p className="text-muted-foreground">Aguarde enquanto geramos seu QR Code PIX</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 md:p-6 min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-destructive/10 p-4 rounded-full inline-block">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-destructive">Erro no Pagamento</h2>
            <p className="text-muted-foreground">{error}</p>
            <div className="space-y-2">
              <Button onClick={handleBackToCheckout} className="w-full">
                Tentar novamente
              </Button>
              <Button onClick={handleGoToHome} variant="outline" className="w-full">
                Voltar para o início
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!transaction) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 md:p-6 min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-destructive/10 p-4 rounded-full inline-block">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-destructive">Erro no Pagamento</h2>
            <p className="text-muted-foreground">Não foi possível criar a transação PIX</p>
            <Button onClick={handleBackToCheckout} className="w-full">
              Voltar para o checkout
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 min-h-[80vh]">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Pagamento via PIX</h1>
            <p className="text-muted-foreground">Escaneie o QR Code ou copie a chave PIX para pagar</p>
          </div>

          {/* Payment Status */}
          <div className="flex justify-center">
            {paymentStatus === 'pending' && (
              <div className="bg-yellow-500/10 p-3 rounded-full inline-flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-yellow-600">Aguardando pagamento</span>
              </div>
            )}
            {paymentStatus === 'approved' && (
              <div className="bg-success/10 p-3 rounded-full inline-flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-medium text-success">Pagamento confirmado!</span>
              </div>
            )}
            {paymentStatus === 'expired' && (
              <div className="bg-destructive/10 p-3 rounded-full inline-flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="font-medium text-destructive">QR Code expirado</span>
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          {paymentStatus === 'pending' && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-muted p-2 rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-lg font-semibold text-foreground">
                  {timeRemaining}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tempo restante para pagar
              </p>
            </div>
          )}

          {/* QR Code Display */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold">QR Code PIX</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {transaction.qrCodeUrl ? (
                <div className="bg-white p-4 rounded-lg border">
                  <img
                    src={transaction.qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-64 h-64 mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 p-8 rounded-lg border-dashed border-2 border-gray-300">
                  <QrCode className="h-16 w-16 mx-auto text-gray-400" />
                  <p className="text-muted-foreground mt-2">QR Code não disponível</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PIX Key Display */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center justify-between">
                Chave PIX
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPixKey}
                  className="text-primary hover:text-primary/80"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded-md break-all text-sm font-mono">
                  {transaction.pixKey}
                </div>
                <p className="text-xs text-muted-foreground">
                  Copie esta chave e cole no aplicativo do seu banco para pagar
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor total:</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Itens do pedido:</h4>
                <ul className="space-y-1 text-sm">
                  {items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          item.quantity * (item.details?.selectedVariation?.option.price || item.product.price)
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Como pagar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span>Abra o aplicativo do seu banco</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>Selecione a opção "Pagar com PIX"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</span>
                  <span>Escaneie o QR Code ou cole a chave PIX</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">4</span>
                  <span>Confirme o pagamento no valor de {formatCurrency(transaction.amount)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">5</span>
                  <span>Aguarde a confirmação (geralmente instantânea)</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Success Message (when approved) */}
          {paymentStatus === 'approved' && (
            <Card className="bg-success/5 border-success">
              <CardContent className="text-center space-y-4 p-6">
                <div className="bg-success/10 p-4 rounded-full inline-block">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-success">Pagamento Confirmado!</h3>
                <p className="text-muted-foreground">
                  Seu pedido foi pago com sucesso e está sendo preparado.
                </p>
                <Button onClick={handleGoToHome} className="bg-success hover:bg-success/90 text-success-foreground">
                  Voltar para a página inicial
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Expired Message */}
          {paymentStatus === 'expired' && (
            <Card className="bg-destructive/5 border-destructive">
              <CardContent className="text-center space-y-4 p-6">
                <div className="bg-destructive/10 p-4 rounded-full inline-block">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-destructive">QR Code Expirado</h3>
                <p className="text-muted-foreground">
                  O tempo para pagar expirou. Por favor, faça um novo pedido.
                </p>
                <div className="space-y-2">
                  <Button onClick={handleBackToCheckout} className="w-full">
                    Tentar novamente
                  </Button>
                  <Button onClick={handleGoToHome} variant="outline" className="w-full">
                    Voltar para o início
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}