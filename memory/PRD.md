# PRD - Bendita Marm (Plantão do Smash) Delivery Site

## Data de Criação
27 de Janeiro de 2026

## Original Problem Statement
Trazer site de delivery "Bendita Marm" do repositório GitHub (https://github.com/XxLosHermanosxX/Bendita-marm) para a IDE/preview e corrigir bugs de UX/design. O site travava o navegador ao entrar (ficava piscando).

## Arquitetura
- **Frontend**: Next.js 15.3.6 com React 19
- **Estilização**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand (cart, modals, location)
- **Animações**: Framer Motion
- **Formulários**: React Hook Form + Zod
- **Integração**: Supabase (opcional para transações)

## User Personas
1. **Estudantes de Medicina**: Público principal em Ciudad del Este
2. **Usuários de Delivery**: Pessoas que querem pedir comida online

## Core Requirements (Estáticos)
- [x] Site carrega sem travar o navegador
- [x] Splash screen funcional
- [x] Navegação entre páginas (Home, Produtos, Checkout)
- [x] Cards de produtos com visualização
- [x] Carrinho de compras funcional
- [x] Modal de promoções
- [x] Integração WhatsApp para suporte
- [x] Checkout com PIX/Cartão de crédito

## O que foi Implementado

### Correções de Bugs (27/01/2026)
1. **Bug crítico resolvido**: Loop infinito no splash-screen causava travamento do navegador
   - Causa: `onFinish` callback no useEffect criava re-renders infinitos
   - Solução: Usado `useRef` para armazenar a função e `useCallback` no layout.tsx

2. **Bug de UX corrigido**: Botão "Cardápio" tinha texto invisível
   - Causa: Cor branca sobre fundo transparente sem contraste
   - Solução: Adicionado `bg-white/10`, `border-2` e `!text-white` para garantir visibilidade

### Estrutura do Projeto
- Migrado repositório para estrutura compatível com Emergent IDE
- Configurado build Next.js na porta 3000
- Todas as páginas funcionando: Home, Products, Checkout, Pix Payment, Order Confirmation

## Prioritized Backlog

### P0 (Concluído)
- [x] Corrigir travamento do navegador
- [x] Corrigir visibilidade do botão Cardápio

### P1 (Pendente)
- [ ] Adicionar logo real (atualmente usando placeholder)
- [ ] Configurar imagens reais dos produtos
- [ ] Integrar backend real para processamento de pedidos

### P2 (Futuro)
- [ ] Sistema de autenticação de usuários
- [ ] Histórico de pedidos
- [ ] Sistema de notificações push
- [ ] Integração com gateway de pagamento real (Stripe/PagSeguro)

## Next Tasks
1. Personalizar logo e branding
2. Configurar imagens reais dos produtos
3. Testar fluxo completo de checkout com itens no carrinho
4. Implementar backend para persistência de pedidos
