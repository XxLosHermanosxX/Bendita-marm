"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { PromoSection } from "@/components/sections/PromoSection";
import { MenuSection } from "@/components/sections/MenuSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <PromoSection />
      <MenuSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
