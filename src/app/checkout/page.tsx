import { MainLayout } from "@/components/layout/main-layout";
import { CheckoutLayout } from "@/components/checkout/checkout-layout";

export default function CheckoutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 min-h-[80vh]">
        <CheckoutLayout />
      </div>
    </MainLayout>
  );
}