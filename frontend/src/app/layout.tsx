import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Plantão do Smash | Smash Burgers em Foz do Iguaçu",
  description: "O melhor smash burger de Foz do Iguaçu. Entrega rápida para hospitais, universidades e sua casa. Combos, Boxes e muito sabor!",
  keywords: ["smash burger", "hamburguer", "foz do iguaçu", "delivery", "plantão", "hospital"],
  openGraph: {
    title: "Plantão do Smash",
    description: "O Combustível para o seu Plantão. Smash Burgers, Combos e Boxes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
