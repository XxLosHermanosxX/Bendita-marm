// Configuração centralizada de imagens - URLs externas ajustáveis
// Substitua pelos seus links do Cloudinary, Supabase Storage, ou outro CDN

export const IMAGES = {
  // ===== LOGO E BRANDING =====
  logo: "https://placehold.co/200x80/1e3a5f/ffffff?text=Plantão+Smash",
  logoFooter: "https://placehold.co/200x80/1e3a5f/ffffff?text=Plantão+Smash",
  favicon: "/favicon.ico",

  // ===== BANNERS HERO =====
  banners: {
    hero: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    principal: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
    banner1: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80",
    banner2: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200&q=80",
  },

  // ===== PROMOÇÕES =====
  promos: {
    comboBenditoCompleto: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80",
    kitReanimacao: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80",
    comboDuplo: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&q=80",
  },

  // ===== PRODUTOS - COMBOS =====
  produtos: {
    // Combos de Plantão
    kitReanimacaoBox: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80",
    comboPlantaoDuplo: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&q=80",
    
    // Smashes Residentes
    baconCardiaco: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80",
    smashResidente: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    duploEletroChoque: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
    frangoTecnico: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80",
    saladaPlantao: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
    
    // Acompanhamentos
    doseFritas: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80",
    aneisAdrenalina: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80",
    
    // Bebidas
    refrigerante: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500&q=80",
    agua: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&q=80",
    suco: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&q=80",
  },

  // ===== ÍCONES DE PAGAMENTO =====
  pagamentos: {
    pix: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg/200px-Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg.png",
    visa: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png",
    mastercard: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
    pagseguro: "https://logospng.org/download/pagseguro/logo-pagseguro-escudo-256.png",
  },

  // ===== PARCEIROS =====
  parceiros: {
    ifood: "https://logodownload.org/wp-content/uploads/2017/05/ifood-logo-0.png",
    rappi: "https://logodownload.org/wp-content/uploads/2019/11/rappi-logo-0.png",
    food99: "https://logospng.org/download/99/logo-99-food-256.png",
  },

  // ===== PLACEHOLDERS =====
  placeholders: {
    produto: "https://placehold.co/500x500/f5f5f5/999999?text=Produto",
    banner: "https://placehold.co/1200x400/1e3a5f/ffffff?text=Banner",
    avatar: "https://placehold.co/100x100/1e3a5f/ffffff?text=User",
  },

  // ===== WHATSAPP =====
  whatsapp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png",
};

// Mapeamento de IDs de produtos para imagens
export const PRODUCT_IMAGES: Record<string, string> = {
  "p1": IMAGES.produtos.kitReanimacaoBox,
  "p2": IMAGES.produtos.comboPlantaoDuplo,
  "p3": IMAGES.produtos.baconCardiaco,
  "p4": IMAGES.produtos.smashResidente,
  "p5": IMAGES.produtos.duploEletroChoque,
  "p6": IMAGES.produtos.frangoTecnico,
  "p7": IMAGES.produtos.saladaPlantao,
  "p8": IMAGES.produtos.doseFritas,
  "p9": IMAGES.produtos.aneisAdrenalina,
};

// Helper para obter imagem de produto com fallback
export function getProductImage(productId: string): string {
  return PRODUCT_IMAGES[productId] || IMAGES.placeholders.produto;
}
