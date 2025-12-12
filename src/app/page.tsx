import { MadeWithDyad } from "@/components/made-with-dyad";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";
import { products } from "@/data/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/hero-carousel";

export default function Home() {
  // Pegamos os 3 primeiros produtos exclusivos para destaque
  const exclusiveProducts = products.filter(p => p.category === "Exclusivos do App").slice(0, 3); 
  const newProducts = products.filter(p => p.isNew && p.category !== "Exclusivos do App").slice(0, 3); // Novidades que não são exclusivos

  return (
    <MainLayout>
      {/* Banner de Boas-vindas (Agora Carrossel) */}
      <section className="mb-8">
        <HeroCarousel />
      </section>

      <div className="container mx-auto p-4 md:p-6 pt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Bem-vindo ao Sushiaki Delivery!
        </h1>
        
        {/* Seção de Produtos Exclusivos do App (Destaque) */}
        {exclusiveProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-primary">
                🔥 Destaques Exclusivos do App
              </h2>
              <Link href="/products?category=Exclusivos%20do%20App" passHref>
                <Button variant="link" className="text-primary p-0 h-auto">Ver todos</Button>
              </Link>
            </div>
            {/* Exibindo apenas os 3 principais destaques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exclusiveProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Seção de Novidades (Produtos que são novos, mas não exclusivos) */}
        {newProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                Novidades
              </h2>
              <Link href="/products?category=Novidades" passHref>
                <Button variant="link" className="text-primary p-0 h-auto">Ver todos</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <div className="text-center mt-8">
          <Link href="/products" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
              Explorar Cardápio Completo
            </Button>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </MainLayout>
  );
}