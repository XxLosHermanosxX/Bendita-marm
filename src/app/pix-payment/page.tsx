"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Copy, QrCode, XCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
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
  const [error, setError] = useState<{ message: string; details?: any; status?: number } | null>(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

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
        setError({ message: "Nenhum dado de pedido encontrado" });
        setIsLoading(false);
      }
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : "Dados do pedido inválidos" });
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
            setError({ message: err });
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
        setError({
          message: result.error || "Falha ao criar transação PIX",
          details: 'response' in result ? result.response : undefined,
          status: 'status' in result ? Number(result.status) : undefined
        });
        setPaymentStatus('error');
        console.error("Transaction creation failed:", result.error);
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erro desconhecido',
        details: err
      });
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

  // Calculate progress bar width based on time remaining
  const calculateProgress = () => {
    const [minutes, seconds] = timeRemaining.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    const maxSeconds = 10 * 60; // 10 minutes
    return (totalSeconds / maxSeconds) * 100;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 md:p-6 min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-semibold text-foreground">Processando seu pagamento...</p>
            <p className="text-muted-foreground">Aguarde enquanto geramos sua chave PIX</p>
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
            <p className="text-muted-foreground">{error.message}</p>

            {error.details && (
              <div className="text-left text-sm text-muted-foreground bg-destructive/5 p-4 rounded-lg mt-4">
                <h3 className="font-semibold text-destructive mb-2">Detalhes do erro:</h3>
                <pre className="overflow-x-auto">{JSON.stringify(error.details, null, 2)}</pre>
                {error.status && (
                  <p className="mt-2">Código de status: {error.status}</p>
                )}
              </div>
            )}

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

  if (!transaction || !transaction.pixKey) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 md:p-6 min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-destructive/10 p-4 rounded-full inline-block">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-destructive">Erro no Pagamento</h2>
            <p className="text-muted-foreground">Não foi possível obter a chave PIX. Tente novamente.</p>
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
            <p className="text-muted-foreground">Copie a chave PIX para pagar</p>
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

          {/* Countdown Timer with Progress Bar */}
          {paymentStatus === 'pending' && (
            <div className="space-y-2">
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

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* PIX Key Display - Simplified */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center justify-between">
                Chave PIX (Copia e Cola)
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPixKey}
                  className="text-primary hover:text-primary/80"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Chave
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Copie esta chave e cole na área PIX Copia e Cola do aplicativo do seu banco para pagar.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Button (Right Side) */}
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
              onClick={() => setShowOrderSummary(!showOrderSummary)}
            >
              {showOrderSummary ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>

          {/* Order Summary Modal */}
          {showOrderSummary && (
            <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
              <Card className="bg-white shadow-lg max-w-md w-full">
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

                  <Button
                    onClick={() => setShowOrderSummary(false)}
                    className="w-full mt-4"
                  >
                    Fechar
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

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
                  <span>Selecione a opção "Pagar com PIX" ou "PIX Copia e Cola"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</span>
                  <span>Cole a chave PIX copiada acima</span>
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