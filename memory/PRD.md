# PRD - Plantão do Smash - Delivery Site

## Data de Criação
27 de Janeiro de 2026

## Original Problem Statement
Reconstruir o site de delivery "Plantão do Smash" com:
- Mobile-first (80% mobile)
- Ciudad del Este, Paraguay (estudantes de medicina brasileiros)
- Geolocalização automática via navegador
- Sistema bilíngue (PT/ES) com padrão português
- Preços duais (BRL maior em cima, PYG menor embaixo)
- Checkout simplificado em 3 etapas

## Arquitetura
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilização**: TailwindCSS + Mobile-first approach
- **State Management**: Zustand (persist)
- **i18n**: Sistema customizado com traduções PT/ES
- **APIs**: Geolocation API (browser) + Nominatim (reverse geocoding)

## User Personas
1. **Estudantes Brasileiros de Medicina**: Maioria do público em Ciudad del Este
2. **Estudantes Paraguaios**: Público secundário
3. **Residentes/Médicos**: Hospital Regional, Sanatorios

## Core Requirements (Estáticos)
- [x] Site 100% mobile-first
- [x] Geolocalização automática pelo navegador
- [x] Sistema de idiomas PT/ES (padrão português)
- [x] Preços duais: BRL (grande) + PYG (pequeno)
- [x] Cardápio com categorias e filtros
- [x] Carrinho com barra de progresso para frete grátis
- [x] Checkout simplificado (3 etapas)

## O que foi Implementado (27/01/2026)

### Sistema de Idiomas
- Toggle PT/ES no header
- Padrão: Português brasileiro
- Todas as strings traduzidas para ambos idiomas
- Persistência via localStorage

### Sistema de Preços Duais
- Preço em Real (BRL) em fonte maior e cor laranja (#FF8C00)
- Preço em Guarani (PYG) em fonte menor e cor cinza
- Taxa de conversão: 1 BRL = ~1400 PYG
- Componente DualPrice reutilizável

### Componentes
- **Header**: Logo, localização, toggle idioma, carrinho
- **Hero**: Animação floating, stats, CTAs traduzidos
- **Promoções**: 3 cards com preços duais
- **Cardápio**: Grid 2 colunas mobile, categorias scroll
- **Cards de Produto**: Preços BRL/PYG, botão +
- **Modal de Produto**: Ingredientes, contador, preços duais
- **Carrinho**: Totais em ambas moedas, frete grátis
- **Testimonios**: Depoimentos bilíngues
- **Footer**: FAQ traduzido

## Prioritized Backlog

### P0 (Concluído)
- [x] Site mobile-first funcional
- [x] Sistema de idiomas PT/ES
- [x] Preços duais BRL/PYG
- [x] Geolocalização automática

### P1 (Pendente)
- [ ] Backend com MongoDB
- [ ] Integração WhatsApp Business API
- [ ] Gateway de pagamento (PIX/Transferencia)

### P2 (Futuro)
- [ ] Sistema de autenticação
- [ ] Histórico de pedidos
- [ ] Push notifications
- [ ] Programa de fidelidade
- [ ] Dark mode

## Next Tasks
1. Implementar backend real com MongoDB
2. Integrar WhatsApp Business para pedidos
3. Adicionar mais produtos ao cardápio
4. Sistema de cupons de desconto
