# Especificações de Design - Sistema de Gerenciamento de Adega

## Paleta de Cores
- **Cor Principal**: #2D1B2E (Roxo escuro/preto)
- **Cor Secundária**: #8B2635 (Borgonha)
- **Cor de Destaque**: #D4AF37 (Dourado)
- **Cor de Fundo**: #1A1A1A (Preto suave)
- **Texto Principal**: #FFFFFF (Branco)
- **Texto Secundário**: #B0B0B0 (Cinza claro)

## Tipografia
- **Fonte Principal**: Inter, sans-serif
- **Tamanhos**:
  - Título Principal: 32px
  - Subtítulos: 24px
  - Texto Corpo: 16px
  - Texto Pequeno: 14px

## Layout
- **Sidebar**: 280px de largura, navegação vertical
- **Header**: 70px de altura, com logo e controles do usuário
- **Cards**: Border-radius de 12px, sombra sutil
- **Espaçamento**: Grid de 8px (8, 16, 24, 32px)

## Componentes Principais

### Dashboard
- Cards de estatísticas com ícones
- Gráficos de linha para vendas
- Tabela de transações recentes
- Indicadores de estoque

### Gestão de Estoque
- Tabela responsiva com filtros
- Botões de ação (editar, excluir)
- Modal para adicionar/editar produtos
- Indicadores visuais de estoque baixo

### Relatórios
- Gráficos interativos (linha, barra, pizza)
- Filtros de data
- Botões de exportação
- Cards de métricas principais

## Interações
- Hover states com transições suaves (0.3s)
- Loading states para operações assíncronas
- Feedback visual para ações do usuário
- Animações sutis para mudanças de estado

