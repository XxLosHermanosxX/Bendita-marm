"use client";

import Image from "next/image";
import { ASSETS } from "@/data/assets";
import { MapPin, Clock, Phone, Instagram, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "¿Hacen delivery a hospitales?",
    a: "¡Sí! Hacemos entregas en todos los hospitales y clínicas de Ciudad del Este.",
  },
  {
    q: "¿Cuánto demora el delivery?",
    a: "Entre 25-40 minutos, dependiendo de tu ubicación y el horario del pedido.",
  },
  {
    q: "¿Aceptan tarjeta en la entrega?",
    a: "Aceptamos efectivo, transferencia y tarjeta de débito/crédito en la entrega.",
  },
  {
    q: "¿El Kit Reanimación para cuántos rinde?",
    a: "El Kit es ideal para 4-6 personas, ¡perfecto para equipos de guardia!",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#002244] text-white">
      {/* FAQ Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-black text-center mb-6">
            Preguntas <span className="text-[#FF8C00]">Frecuentes</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <h4 className="font-bold text-[#FF8C00] text-sm mb-1">{faq.q}</h4>
                <p className="text-white/70 text-xs">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <div className="relative h-10 w-28 mx-auto md:mx-0 mb-3">
              <Image
                src={ASSETS.logo}
                alt="Plantão do Smash"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/60 text-xs max-w-sm mx-auto md:mx-0">
              El mejor smash burger de Ciudad del Este. Delivery rápido para hospitales, 
              universidades y tu casa. ¡El combustible para tu guardia!
            </p>
            
            {/* Social */}
            <div className="flex gap-3 mt-4 justify-center md:justify-start">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF8C00] transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/595981000000"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-3">Contacto</h4>
            <div className="space-y-2 text-white/60 text-xs">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-4 w-4 text-[#FF8C00]" />
                <span>+595 981 000 000</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Clock className="h-4 w-4 text-[#FF8C00]" />
                <span>18h - 23h (Lun-Dom)</span>
              </div>
              <div className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="h-4 w-4 text-[#FF8C00] shrink-0 mt-0.5" />
                <span>Ciudad del Este, Paraguay</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-3">Links</h4>
            <div className="space-y-1 text-white/60 text-xs">
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                Trabajá con Nosotros
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 pt-6 text-center text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Plantão do Smash. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
