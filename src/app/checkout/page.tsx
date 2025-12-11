import { MainLayout } from "@/components/layout/main-layout";
import { CheckoutLayout } from "@/components/checkout/checkout-layout";

export default function CheckoutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 min-h-[80vh]">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Finalizar Pedido
        </h1>
        <CheckoutLayout />
      </div>
    </MainLayout>
  );
}