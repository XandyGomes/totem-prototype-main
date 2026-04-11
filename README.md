# 🏥 Totem Prototype - NGA (Núcleo de Gestão Assistencial)

Este é um sistema completo de gestão de filas e atendimento para o **NGA**, desenvolvido com uma arquitetura moderna de monorepo, focado em performance, design premium e escalabilidade.

## 🚀 Arquitetura e Tecnologias

O projeto é dividido em dois grandes módulos (Monorepo):

### 💻 Frontend (Next.js)
- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS & Shadcn/UI
- **Icons:** Lucide React
- **Estado/API:** Axios & Sonner (Notificações)
- **Deploy:** Vercel

### ⚙️ Backend (NestJS)
- **Framework:** NestJS (Node.js)
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL (Hospedado no Supabase)
- **Deploy:** Render

---

## 📂 Estrutura do Projeto

```text
totem-prototype/
├── frontend/           # Aplicação Next.js (Totem, TV, Médico, Painel)
├── backend/            # API NestJS (Lógica de negócio, Banco de Dados)
├── package.json        # Configuração de scripts da raiz
└── vercel.json         # Configuração de deploy Vercel
```

---

## 🛠️ Configuração Local

### Pré-requisitos
- Node.js 20+
- NPM ou Bun

### 1. Clone e Instalação
```bash
git clone https://github.com/XandyGomes/totem-prototype-main.git
cd totem-prototype
npm install
```

### 2. Configuração de Variáveis de Ambiente
Crie um arquivo `.env` na pasta `backend/` e outro na pasta `frontend/` seguindo os exemplos abaixo:

**No Backend (`backend/.env`):**
```env
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
PORT=3001
```

**No Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

### 3. Execução
Para rodar os dois projetos simultaneamente:
```bash
# Na raiz do projeto
npm run dev
```

Ou individualmente:
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run start:dev
```

---

## 🚀 Deploy em Produção

O projeto está configurado para Deploy Contínuo (CI/CD):

- **Frontend:** Implantado na **Vercel** apontando para o diretório `frontend/`.
- **Backend:** Implantado no **Render** apontando para o diretório `backend/`.
- **Banco de Dados:** Gerenciado pelo **Supabase**.

---

## 🖥️ Funcionalidades principais

1.  **Totem de Identificação:** Cadastro simplificado e emissão de senhas.
2.  **Painel da TV:** Chamadas em tempo real com voz e histórico.
3.  **Interface Médica:** Gestão da fila, chamada de pacientes e finalização de consultas.
4.  **Gestão & Performance NGA:** Dashboard administrativo com KPIs (TME, Atendimentos por setor, Status do sistema).

---

## 📄 Licença
Este projeto é privado e destinado ao uso do Núcleo de Gestão Assistencial (NGA).
