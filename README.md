# 🍷 Sistema de Gerenciamento de Adega JV

Um sistema web completo para gerenciar sua adega com controle de estoque, vendas, caixa e relatórios financeiros.

## 🚀 Demo Online

**Acesse o sistema:** [https://nghki1cznol1.manus.space](https://nghki1cznol1.manus.space)

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral do negócio com métricas principais
- Gráficos de vendas dos últimos meses
- Últimas transações realizadas
- Alertas de estoque baixo

### 🍾 Gestão de Produtos
- Cadastro completo de bebidas
- Controle de fornecedores e preços
- Busca e filtros avançados
- Gestão de validade

### 📦 Controle de Estoque
- Registro de entradas e saídas
- Cálculo automático de estoque atual
- Indicadores visuais de estoque baixo
- Histórico completo de movimentações

### 💰 Gestão de Caixa
- Controle de receitas e despesas
- Integração automática com vendas
- Saldo em tempo real
- Histórico de transações

### 📈 Relatórios
- Análise de vendas por produto
- Relatórios financeiros por período
- Gráficos interativos (barras, linhas, pizza)
- Filtros por data personalizáveis

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework JavaScript moderno
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI elegantes
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones consistentes

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **Flask-CORS** - Suporte a CORS
- **SQLite** - Banco de dados local

## 📁 Estrutura do Projeto

```
sistema-adega/
├── adega-backend/          # Backend Flask
│   ├── src/
│   │   ├── models/         # Modelos do banco
│   │   ├── routes/         # APIs REST
│   │   ├── static/         # Frontend buildado
│   │   └── main.py         # App principal
│   └── requirements.txt    # Dependências Python
│
├── adega-frontend/         # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── App.jsx         # App principal
│   │   └── App.css         # Estilos
│   └── package.json        # Dependências Node
│
└── docs/                   # Documentação
    ├── manual_usuario.md
    └── documentacao_tecnica.md
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- pnpm (ou npm)

### Backend
```bash
cd adega-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows
pip install -r requirements.txt
python src/main.py
```

### Frontend (Desenvolvimento)
```bash
cd adega-frontend
pnpm install
pnpm run dev
```

### Build de Produção
```bash
cd adega-frontend
pnpm run build
cp -r dist/* ../adega-backend/src/static/
```

## 🎨 Design

O sistema utiliza um tema elegante inspirado em adegas tradicionais:
- **Cores principais:** Preto suave, roxo escuro, borgonha e dourado
- **Interface responsiva** para desktop e mobile
- **Componentes modernos** com animações suaves
- **Tipografia clara** e hierarquia visual bem definida

## 📊 Banco de Dados

### Tabelas Principais
- **produtos** - Catálogo de bebidas
- **entradas_estoque** - Compras e reposições
- **saidas_estoque** - Vendas e consumo
- **transacoes_caixa** - Movimentação financeira

## 🔌 API REST

### Endpoints Principais
- `GET/POST /api/produtos` - Gestão de produtos
- `GET/POST /api/estoque/entradas` - Entradas de estoque
- `GET/POST /api/estoque/saidas` - Saídas de estoque
- `GET/POST /api/caixa/transacoes` - Transações financeiras
- `GET /api/relatorios/*` - Relatórios e análises

## 📱 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Gestão de Produtos
![Produtos](docs/screenshots/produtos.png)

### Relatórios
![Relatórios](docs/screenshots/relatorios.png)

## 📝 Documentação

- [Manual do Usuário](docs/manual_usuario.md)
- [Documentação Técnica](docs/documentacao_tecnica.md)
- [Especificações de Design](docs/design_specifications.md)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para gestão profissional de adegas.

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

