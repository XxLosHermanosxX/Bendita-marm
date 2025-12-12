"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/splash-screen";
import React, { Suspense } from "react"; // Importando React e Suspense

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sushiaki Delivery",
  description: "O melhor sushi da cidade, entregue na sua porta!",
  icons: {
    icon: '/sushiaki-logo.png',
  },
};

// Componente Wrapper para gerenciar o estado do splash screen
const RootLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = React.useState(true);

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Forçando o tema claro como padrão
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Carregando...</div>}>
            <RootLayoutWrapper>{children}</RootLayoutWrapper>
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}