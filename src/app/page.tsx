import { MadeWithDyad } from "@/components/made-with-dyad";
import { Header } from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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
          {/* Seção de produtos em destaque, etc. virá aqui */}
          <p className="text-muted-foreground">
            Comece a explorar nosso delicioso cardápio.
          </p>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}