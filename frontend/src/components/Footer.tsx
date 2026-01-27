"use client";

import Image from "next/image";
import { ASSETS } from "@/data/assets";
import { useTranslation } from "@/lib/i18n";
import { MapPin, Clock, Phone, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  
  const faqs = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
  ];

  return (
    <footer className="bg-[#002244] text-white">
      {/* FAQ Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-black text-center mb-6">
            {t("faq")} <span className="text-[#FF8C00]">{t("faqHighlight")}</span>
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
              {t("footerDesc")}
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
            <h4 className="font-bold mb-3">{t("contact")}</h4>
            <div className="space-y-2 text-white/60 text-xs">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-4 w-4 text-[#FF8C00]" />
                <span>+595 981 000 000</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Clock className="h-4 w-4 text-[#FF8C00]" />
                <span>18h - 23h (Seg-Dom)</span>
              </div>
              <div className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="h-4 w-4 text-[#FF8C00] shrink-0 mt-0.5" />
                <span>Ciudad del Este, Paraguay</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-3">{t("links")}</h4>
            <div className="space-y-1 text-white/60 text-xs">
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                {t("privacy")}
              </a>
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                {t("terms")}
              </a>
              <a href="#" className="block hover:text-[#FF8C00] transition-colors">
                {t("careers")}
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 pt-6 text-center text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Plantão do Smash. {t("allRights")}</p>
        </div>
      </div>
    </footer>
  );
}
