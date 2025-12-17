"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { HomeContentWrapper } from "@/components/home-content-wrapper"; // Importando o novo wrapper

export default function Home() {
  // Todo o conteúdo de renderização condicional foi movido para HomeContentWrapper
  return (
    <MainLayout>
      <HomeContentWrapper />
    </MainLayout>
  );
}