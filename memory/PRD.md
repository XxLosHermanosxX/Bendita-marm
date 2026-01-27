# PRD - Plantão do Smash - Delivery Site

## Data de Criação
27 de Janeiro de 2026

## Original Problem Statement
Reconstruir o site de delivery "Plantão do Smash" como Template Base de Alta Performance focado em:
- Mobile-first (80% mobile)
- Ciudad del Este, Paraguay (estudantes de medicina)
- Geolocalização automática via navegador
- Checkout simplificado em 3 etapas
- Design moderno com glassmorphism e animações

## Arquitetura
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilização**: TailwindCSS + Mobile-first approach
- **State Management**: Zustand (persist)
- **Animações**: CSS custom + Framer Motion
- **APIs**: Geolocation API (browser) + Nominatim (reverse geocoding)

## User Personas
1. **Estudantes de Medicina**: UPAP e outras universidades em Ciudad del Este
2. **Residentes/Médicos**: Hospital Regional, Sanatorios
3. **Público Geral**: Ciudad del Este e região

## Core Requirements (Estáticos)
- [x] Site 100% mobile-first
- [x] Geolocalização automática pelo navegador
- [x] Verificação de área de entrega (bounds de Ciudad del Este)
- [x] Cardápio com categorias e filtros
- [x] Carrinho com barra de progresso para frete grátis
- [x] Checkout simplificado (3 etapas: Endereço → Dados → Pagamento)
- [x] Preços em Guaraníes (PYG)
- [x] Textos em espanhol

## O que foi Implementado (27/01/2026)

### Fase 1: Migração e Bug Fix
- Corrigido loop infinito no splash-screen (useEffect)
- Corrigido botão invisível no hero

### Fase 2: Reconstrução Completa
- **Header**: Fixo com glassmorphism, botão de localização, carrinho com contador
- **Hero Section**: Imagem floating com animação, stats, CTAs
- **Promoções**: 3 cards destacados com scroll horizontal no mobile
- **Cardápio**: Grid 2 colunas mobile, categorias com scroll horizontal
- **Cards de Produto**: Imagens arredondadas, botão + flutuante, animação fly-to-cart
- **Modal de Produto**: Full-screen mobile, ingredientes em pills, contador de quantidade
- **Carrinho (Drawer)**: Full-screen mobile, barra de frete grátis, totais em Guaraníes
- **Checkout**: 3 etapas simplificadas, mobile-optimized
- **Testimonios**: Depoimentos de médicos e estudantes de Ciudad del Este
- **Footer**: FAQ, contatos, redes sociais

### Features Técnicas
- Geolocalização via navigator.geolocation
- Reverse geocoding via Nominatim API
- Validação de área de entrega por bounds geográficos
- Formatação de moeda PYG (Guaraníes)
- Safe area support para iPhone notch
- Scroll horizontal snap para mobile

## Prioritized Backlog

### P0 (Concluído)
- [x] Site mobile-first funcional
- [x] Geolocalização automática
- [x] Botão de adicionar ao carrinho funcionando
- [x] Checkout simplificado

### P1 (Pendente)
- [ ] Integração com WhatsApp Business API para confirmação de pedidos
- [ ] Backend real com MongoDB para persistência
- [ ] Gateway de pagamento (PIX/Transferencia)

### P2 (Futuro)
- [ ] Sistema de autenticação
- [ ] Histórico de pedidos
- [ ] Push notifications
- [ ] Programa de fidelidade
- [ ] Dark mode

## Next Tasks
1. Integrar WhatsApp Business para recebimento de pedidos
2. Implementar backend com MongoDB
3. Adicionar mais produtos ao cardápio
4. Implementar sistema de cupons de desconto
