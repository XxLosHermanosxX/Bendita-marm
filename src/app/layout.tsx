"use client";

// import type { Metadata } from "next"; // Removed as metadata is now in a separate file
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
// import { Toaster } from "@/components/ui/sonner"; // Removed Toaster import
import { SplashScreen } from "@/components/splash-screen";
import React, { Suspense, useEffect, useState } from "react"; // Importando React e Suspense
import { ProductModalProvider } from "@/components/product-modal-provider";
import { AddonsModal } from "@/components/addons-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata is now defined in src/app/metadata.ts
// export const metadata: Metadata = {
//   title: "Sushiaki Delivery",
//   description: "O melhor sushi da cidade, entregue na sua porta!",
//   icons: {
//     icon: '/sushiaki-logo.png',
//   },
// };

// Componente Wrapper para gerenciar o estado do splash screen
const RootLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div style={{ display: showSplash ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden bg-[#f8f9fa]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Carregando...</div>}>
            <RootLayoutWrapper>{children}</RootLayoutWrapper>
          </Suspense>
          <ProductModalProvider />
          <AddonsModal />
        </ThemeProvider>
      </body>
    </html>
  );
}