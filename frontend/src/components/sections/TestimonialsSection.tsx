"use client";

import { Star, Quote } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const testimonials = {
  pt: [
    {
      id: 1,
      name: "Dr. Lucas Mendes",
      role: "Residente de Cirurgia - Hospital Regional",
      content: "Melhor smash de Ciudad del Este! Pedi no meio do plantão e chegou quentinho em 20 minutos. O Kit Reanimação salvou toda a equipe!",
      rating: 5,
      avatar: "LM",
    },
    {
      id: 2,
      name: "Ana Clara Santos",
      role: "Estudante de Medicina - 6º ano UPAP",
      content: "O Duplo Eletro-Choque é absurdo! Pedi antes da prova e me deu a energia que eu precisava. Virou tradição no grupo de estudos.",
      rating: 5,
      avatar: "AC",
    },
    {
      id: 3,
      name: "Dr. Rafael Oliveira",
      role: "Médico - Sanatorio Migone",
      content: "Atendimento excelente e entrega sempre pontual. O pessoal já conhece nossos pedidos. Recomendo demais!",
      rating: 5,
      avatar: "RO",
    },
  ],
  es: [
    {
      id: 1,
      name: "Dr. Carlos Benítez",
      role: "Residente de Cirugía - Hospital Regional",
      content: "¡El mejor smash de Ciudad del Este! Pedí en medio de la guardia y llegó caliente en 20 minutos. El Kit Reanimación salvó a todo el equipo.",
      rating: 5,
      avatar: "CB",
    },
    {
      id: 2,
      name: "María González",
      role: "Estudiante de Medicina - 6º año UPAP",
      content: "El Duplo Eletro-Choque es increíble! Pedí antes del examen y me dio la energía que necesitaba. Ya es tradición en mi grupo de estudio.",
      rating: 5,
      avatar: "MG",
    },
    {
      id: 3,
      name: "Dr. Rafael Ortiz",
      role: "Médico - Sanatorio Migone",
      content: "Excelente atención y delivery siempre puntual. El personal ya conoce nuestros pedidos. ¡Super recomendado!",
      rating: 5,
      avatar: "RO",
    },
  ],
};

export function TestimonialsSection() {
  const { t, language } = useTranslation();
  const currentTestimonials = testimonials[language];

  return (
    <section className="py-8 md:py-12 bg-[#003366] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="px-3 py-1.5 rounded-full bg-white/10 text-[#7CFC00] text-xs font-bold uppercase tracking-wider">
            {t("testimonials")}
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-3">
            {t("ourPatients")} <span className="text-[#FF8C00]">{t("patientsHighlight")}</span>
          </h2>
        </div>

        {/* Counter */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-[#7CFC00]">10k+</p>
              <p className="text-[10px] text-white/60">{t("orders")}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-[#FF8C00]">4.9</p>
              <p className="text-[10px] text-white/60">{t("rating")}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-white">98%</p>
              <p className="text-[10px] text-white/60">{t("recommend")}</p>
            </div>
          </div>
        </div>

        {/* Testimonials - Horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 min-w-[280px] md:min-w-0 snap-start"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 h-6 w-6 text-[#FF8C00]/30" />

              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-[#FF8C00] text-[#FF8C00]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 text-sm mb-4 leading-relaxed line-clamp-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#FF8C00] flex items-center justify-center font-bold text-white text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm">{testimonial.name}</p>
                  <p className="text-[10px] text-white/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
