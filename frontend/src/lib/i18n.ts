import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "pt" | "es";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: "pt", // Padrão português
      setLanguage: (language) => set({ language }),
    }),
    { name: "plantao-language" }
  )
);

// Traduções
export const translations = {
  pt: {
    // Header
    myLocation: "Minha localização",
    locating: "Localizando...",
    outOfZone: "Fora da área",
    
    // Hero
    heroTag: "Entrega Rápida em Hospitais",
    heroTitle: "O Combustível para o seu",
    heroTitleHighlight: "Plantão.",
    heroSubtitle: "Smash Burgers, Combos e Boxes. Entrega Rápida para estudantes de medicina e hospitais.",
    orderNow: "Pedir Agora",
    viewMenu: "Ver Cardápio",
    orders: "Pedidos",
    average: "Média",
    rating: "Avaliação",
    
    // Promos
    promos: "Promoções",
    highlights: "Destaques",
    from: "A partir de",
    
    // Menu
    menu: "Cardápio",
    ourMenu: "Nosso Cardápio",
    ingredients: "Ingredientes",
    
    // Cart
    yourOrder: "Seu Pedido",
    emptyCart: "Seu carrinho está vazio",
    addItems: "Adicione itens do cardápio",
    freeDelivery: "Frete GRÁTIS!",
    missingForFree: "Faltam {value} para frete grátis",
    subtotal: "Subtotal",
    delivery: "Taxa de entrega",
    free: "GRÁTIS",
    total: "Total",
    checkout: "Finalizar Pedido",
    enableLocation: "Habilite sua localização para continuar",
    verifyLocation: "Verificar Localização",
    
    // Testimonials
    testimonials: "Depoimentos",
    ourPatients: "Nossos",
    patientsHighlight: "Pacientes",
    recommend: "Recomendam",
    
    // Footer
    faq: "Perguntas",
    faqHighlight: "Frequentes",
    contact: "Contato",
    links: "Links",
    privacy: "Política de Privacidade",
    terms: "Termos de Uso",
    careers: "Trabalhe Conosco",
    footerDesc: "O melhor smash burger de Ciudad del Este. Entrega rápida para hospitais, universidades e sua casa. O combustível para o seu plantão!",
    allRights: "Todos os direitos reservados.",
    
    // Checkout
    confirmAddress: "Confirme seu endereço",
    whereDeliver: "Para onde devemos entregar?",
    number: "Número",
    reference: "Referência (opcional)",
    deliveryTime: "Entrega em 25-40 min",
    deliveryCost: "Taxa",
    continue: "Continuar",
    yourData: "Seus dados",
    contactInfo: "Para entrarmos em contato",
    fullName: "Nome completo",
    paymentMethod: "Método de Pagamento",
    howPay: "Como você vai pagar?",
    transfer: "Transferência",
    instantPayment: "Pagamento instantâneo",
    cashCard: "Dinheiro/Cartão",
    atDelivery: "Na entrega",
    orderSummary: "Resumo do Pedido",
    securePayment: "Pagamento 100% seguro",
    confirm: "Confirmar",
    
    // Success
    orderConfirmed: "Pedido Confirmado!",
    orderReceived: "Seu pedido foi recebido com sucesso. Em breve você receberá uma confirmação no WhatsApp.",
    preparing: "Preparando seu pedido",
    estimatedTime: "Tempo estimado: 25-40 min",
    contactWhatsapp: "Contatar por WhatsApp",
    backHome: "Voltar ao Início",
    
    // FAQ
    faq1q: "Vocês entregam em hospitais?",
    faq1a: "Sim! Fazemos entregas em todos os hospitais e clínicas de Ciudad del Este.",
    faq2q: "Qual o tempo médio de entrega?",
    faq2a: "Entre 25-40 minutos, dependendo da sua localização e do horário do pedido.",
    faq3q: "Aceitam cartão na entrega?",
    faq3a: "Aceitamos dinheiro, transferência e cartão de débito/crédito na entrega.",
    faq4q: "O Kit Reanimação serve quantas pessoas?",
    faq4a: "O Kit é ideal para 4-6 pessoas, perfeito para equipes de plantão!",
    
    // Location errors
    locationDenied: "Permissão de localização negada",
    locationUnavailable: "Localização não disponível",
    locationError: "Erro ao obter localização",
    outsideArea: "Infelizmente não atendemos sua região ainda",
    geolocationNotSupported: "Geolocalização não suportada pelo navegador",
  },
  es: {
    // Header
    myLocation: "Mi ubicación",
    locating: "Ubicando...",
    outOfZone: "Fuera de zona",
    
    // Hero
    heroTag: "Delivery Rápido a Hospitales",
    heroTitle: "El Combustible para tu",
    heroTitleHighlight: "Guardia.",
    heroSubtitle: "Smash Burgers, Combos y Boxes. Delivery rápido para estudiantes de medicina y hospitales.",
    orderNow: "Pedir Ahora",
    viewMenu: "Ver Menú",
    orders: "Pedidos",
    average: "Promedio",
    rating: "Rating",
    
    // Promos
    promos: "Promociones",
    highlights: "Destacados",
    from: "Desde",
    
    // Menu
    menu: "Menú",
    ourMenu: "Nuestro Menú",
    ingredients: "Ingredientes",
    
    // Cart
    yourOrder: "Tu Pedido",
    emptyCart: "Tu carrito está vacío",
    addItems: "Agrega items del menú",
    freeDelivery: "¡Delivery GRATIS!",
    missingForFree: "Faltan {value} para delivery gratis",
    subtotal: "Subtotal",
    delivery: "Costo de delivery",
    free: "GRATIS",
    total: "Total",
    checkout: "Finalizar Pedido",
    enableLocation: "Habilita tu ubicación para continuar",
    verifyLocation: "Verificar Ubicación",
    
    // Testimonials
    testimonials: "Testimonios",
    ourPatients: "Nuestros",
    patientsHighlight: "Pacientes",
    recommend: "Recomiendan",
    
    // Footer
    faq: "Preguntas",
    faqHighlight: "Frecuentes",
    contact: "Contacto",
    links: "Links",
    privacy: "Política de Privacidad",
    terms: "Términos de Uso",
    careers: "Trabajá con Nosotros",
    footerDesc: "El mejor smash burger de Ciudad del Este. Delivery rápido para hospitales, universidades y tu casa. ¡El combustible para tu guardia!",
    allRights: "Todos los derechos reservados.",
    
    // Checkout
    confirmAddress: "Confirma tu dirección",
    whereDeliver: "¿Dónde te llevamos tu pedido?",
    number: "Número",
    reference: "Referencia (opcional)",
    deliveryTime: "Delivery en 25-40 min",
    deliveryCost: "Costo",
    continue: "Continuar",
    yourData: "Tus datos",
    contactInfo: "Para contactarte sobre tu pedido",
    fullName: "Nombre completo",
    paymentMethod: "Método de Pago",
    howPay: "¿Cómo vas a pagar?",
    transfer: "Transferencia",
    instantPayment: "Pago instantáneo",
    cashCard: "Efectivo/Tarjeta",
    atDelivery: "En la entrega",
    orderSummary: "Resumen del Pedido",
    securePayment: "Pago 100% seguro",
    confirm: "Confirmar",
    
    // Success
    orderConfirmed: "¡Pedido Confirmado!",
    orderReceived: "Tu pedido fue recibido con éxito. Pronto recibirás una confirmación por WhatsApp.",
    preparing: "Preparando tu pedido",
    estimatedTime: "Tiempo estimado: 25-40 min",
    contactWhatsapp: "Contactar por WhatsApp",
    backHome: "Volver al Inicio",
    
    // FAQ
    faq1q: "¿Hacen delivery a hospitales?",
    faq1a: "¡Sí! Hacemos entregas en todos los hospitales y clínicas de Ciudad del Este.",
    faq2q: "¿Cuánto demora el delivery?",
    faq2a: "Entre 25-40 minutos, dependiendo de tu ubicación y el horario del pedido.",
    faq3q: "¿Aceptan tarjeta en la entrega?",
    faq3a: "Aceptamos efectivo, transferencia y tarjeta de débito/crédito en la entrega.",
    faq4q: "¿El Kit Reanimación para cuántos rinde?",
    faq4a: "El Kit es ideal para 4-6 personas, ¡perfecto para equipos de guardia!",
    
    // Location errors
    locationDenied: "Permiso de ubicación denegado",
    locationUnavailable: "Ubicación no disponible",
    locationError: "Error al obtener ubicación",
    outsideArea: "Lo sentimos, no hacemos entregas en tu zona todavía",
    geolocationNotSupported: "Geolocalización no soportada por el navegador",
  },
} as const;

export type TranslationKey = keyof typeof translations.pt;

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    let text: string = translations[language][key] || translations.pt[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    
    return text;
  };
  
  return { t, language };
}
