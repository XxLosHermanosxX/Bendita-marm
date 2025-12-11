import { MadeWithDyad } from "@/components/made-with-dyad";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";
import { products } from "@/data/products";

export default function Home() {
  const exclusiveProducts = products.filter(p => p.isExclusive);
  const newProducts = products.filter(p => p.isNew);

  return (
    <MainLayout>
      {/* Banner de Boas-vindas */}
      <section className="relative w-full h-[200px] md:h-[300px] bg-primary flex items-center justify-center overflow-hidden">
        <Image
          src="/images/banner-sushiaki.png" // Placeholder para o banner
          alt="Ganhe 20% de desconto"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="relative z-10 text-center text-white p-4">
          {/* Conteúdo do banner, se houver texto sobreposto */}
        </div>
      </section>

      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Bem-vindo ao Sushiaki Delivery!
        </h1>
        
        {/* Seção de Produtos Exclusivos do App */}
        {exclusiveProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              Exclusivos do App
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exclusiveProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Seção de Novidades */}
        {newProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              Novidades
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <p className="text-muted-foreground">
          Comece a explorar nosso delicioso cardápio.
        </p>
      </div>
      <MadeWithDyad />
    </MainLayout>
  );
}