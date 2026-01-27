"use client";

import Image from "next/image";
import { ASSETS } from "@/data/assets";
import { MapPin, Clock, Phone, Instagram, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "Vocês entregam em hospitais?",
    a: "Sim! Fazemos entregas em todos os hospitais e UPAs de Foz do Iguaçu e região.",
  },
  {
    q: "Qual o tempo médio de entrega?",
    a: "Entre 25-40 minutos, dependendo da sua localização e do horário do pedido.",
  },
  {
    q: "Aceitam cartão na entrega?",
    a: "Aceitamos PIX, cartão de crédito/débito na entrega e pelo app.",
  },
  {
    q: "O Kit Reanimação serve quantas pessoas?",
    a: "O Kit é ideal para 4-6 pessoas, perfeito para equipes de plantão!",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#002244] text-white">
      {/* FAQ Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-black text-center mb-8">
            Perguntas <span className="text-[#FF8C00]">Frequentes</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <h4 className="font-bold text-[#FF8C00] mb-2">{faq.q}</h4>
                <p className="text-white/70 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="relative h-12 w-36 mb-4">
              <Image
                src={ASSETS.logo}
                alt="Plantão do Smash"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/60 text-sm max-w-sm">
              O melhor smash burger de Foz do Iguaçu. Entrega rápida para hospitais, 
              universidades e sua casa. O combustível para o seu plantão!
            </p>
            
            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF8C00] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5545999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <div className="space-y-3 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#FF8C00]" />
                <span>(45) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FF8C00]" />
                <span>18h às 23h (Seg-Dom)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#FF8C00] shrink-0 mt-0.5" />
                <span>Foz do Iguaçu - PR</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Links</h4>
            <div className="space-y-2 text-white/60 text-sm">
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                Trabalhe Conosco
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Plantão do Smash. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
