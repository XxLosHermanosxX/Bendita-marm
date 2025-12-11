import { MainLayout } from "@/components/layout/main-layout";

export default function CheckoutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 min-h-[80vh]">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <p className="text-muted-foreground">
            Aqui será implementado o fluxo de 4 abas: Endereço, Dados Pessoais, Cupom e Resumo.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}