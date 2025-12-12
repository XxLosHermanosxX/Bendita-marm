"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Package, Truck } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { toast } from "sonner";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart when component mounts
    clearCart();
  }, [clearCart]);

  const handleGoToHome = () => {
    router.push("/");
  };

  const handleTrackOrder = () => {
    // In a real app, you would redirect to an order tracking page
    toast.info("Funcionalidade de rastreamento em desenvolvimento");
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto space-y-6 w-full">
          <div className="text-center space-y-4">
            <div className="bg-success/10 p-6 rounded-full inline-block">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-success">
              Pedido Confirmado!
            </h1>
            <p className="text-lg text-muted-foreground">
              Seu pedido foi recebido e está sendo preparado.
            </p>
          </div>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Status do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                    <div>
                      <h3 className="font-semibold text-success">Pedido Confirmado</h3>
                      <p className="text-sm text-muted-foreground">
                        Seu pedido foi recebido com sucesso
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Agora</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Em Preparo</h3>
                      <p className="text-sm text-muted-foreground">
                        Seu pedido está sendo preparado
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Próximo</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold text-muted-foreground">A Caminho</h3>
                      <p className="text-sm text-muted-foreground">
                        Seu pedido está a caminho
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Em breve</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold text-muted-foreground">Entregue</h3>
                      <p className="text-sm text-muted-foreground">
                        Seu pedido foi entregue
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Em breve</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Acompanhe seu pedido
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Você receberá atualizações por email e SMS sobre o status do seu pedido.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Prepare-se para a entrega
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Esteja disponível no endereço de entrega no horário estimado.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Aproveite sua refeição
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Quando seu pedido chegar, verifique os itens e aproveite!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handleTrackOrder}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Acompanhar Pedido
            </Button>
            <Button
              onClick={handleGoToHome}
              variant="outline"
              className="w-full"
            >
              Voltar para a Página Inicial
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}