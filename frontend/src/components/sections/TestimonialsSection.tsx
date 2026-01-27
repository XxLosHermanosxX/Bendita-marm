"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Dr. Lucas Mendes",
    role: "Residente de Cirurgia - HMPGL",
    content: "Melhor smash de Foz! Pedi no meio do plantão e chegou quentinho em 20 minutos. O Kit Reanimação salvou toda a equipe!",
    rating: 5,
    avatar: "LM",
  },
  {
    id: 2,
    name: "Ana Clara Santos",
    role: "Estudante de Medicina - 6º ano",
    content: "O Duplo Eletro-Choque é absurdo! Pedi antes da prova e me deu a energia que eu precisava. Virou tradição no grupo de estudos.",
    rating: 5,
    avatar: "AC",
  },
  {
    id: 3,
    name: "Dr. Rafael Oliveira",
    role: "Médico - UPA Central",
    content: "Atendimento excelente e entrega sempre pontual. O pessoal já conhece nossos pedidos. Recomendo demais!",
    rating: 5,
    avatar: "RO",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-[#003366] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="px-4 py-2 rounded-full bg-white/10 text-[#7CFC00] text-sm font-bold uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-4">
            O que dizem nossos <span className="text-[#FF8C00]">Pacientes</span>
          </h2>
          <p className="text-white/60 mt-2">
            Feedback de quem já experimentou o melhor smash do plantão
          </p>
        </div>

        {/* Counter */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-center">
              <p className="text-4xl font-black text-[#7CFC00]">10.000+</p>
              <p className="text-sm text-white/60">Pedidos Entregues</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-black text-[#FF8C00]">4.9</p>
              <p className="text-sm text-white/60">Avaliação Média</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-black text-white">98%</p>
              <p className="text-sm text-white/60">Recomendariam</p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-[#FF8C00]/30" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#FF8C00] text-[#FF8C00]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#FF8C00] flex items-center justify-center font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-white/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
