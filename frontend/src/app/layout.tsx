"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SplashScreen } from "@/components/splash-screen";
import React, { Suspense, useEffect, useState, useCallback } from "react";
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

// Componente Wrapper para gerenciar o estado do splash screen
const RootLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // useCallback para evitar recriação da função a cada render
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
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
          <RootLayoutWrapper>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase text-[#005A8D] animate-pulse">Carregando Plantão...</div>}>
              {children}
            </Suspense>
          </RootLayoutWrapper>
          <ProductModalProvider />
          <AddonsModal />
        </ThemeProvider>
      </body>
    </html>
  );
}