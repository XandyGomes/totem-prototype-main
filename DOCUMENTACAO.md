# 📖 Documentação Completa de Engenharia: Projeto Totem NGA

## 1. Visão Geral do Sistema
O **Totem NGA** é uma solução de gestão de fluxo de pacientes projetada para otimizar o atendimento ambulatorial. O sistema integra a identificação no totem, a triagem por prioridade, chamadas visuais e sonoras (TV) e o gerenciamento médico, fornecendo métricas de desempenho em tempo real.

---

## 2. Levantamento de Requisitos

### 2.1. Requisitos Funcionais (RF)
| ID | Descrição |
| :--- | :--- |
| **RF01** | O sistema deve permitir que o paciente se identifique por CPF ou Nome no Totem. |
| **RF02** | O sistema deve emitir uma senha única baseada na categoria de atendimento (Geral, Prioritário). |
| **RF03** | O sistema deve exibir em tempo real a lista de pacientes no Painel da TV. |
| **RF04** | O sistema deve emitir um aviso sonoro (TTS - Text to Speech) ao chamar um paciente. |
| **RF05** | O médico deve conseguir visualizar a fila de pacientes de seu setor. |
| **RF06** | O médico deve ter a funcionalidade de chamar, re-chamar ou finalizar o atendimento de um paciente. |
| **RF07** | O administrador deve visualizar o Tempo Médio de Espera (TME) e KPIs de desempenho. |
| **RF08** | O sistema deve permitir o reset do banco de dados e limpeza de logs operacionais. |

### 2.2. Requisitos Não Funcionais (RNF)
| ID | Descrição |
| :--- | :--- |
| **RNF01** | **Performance:** A chamada do paciente na TV deve ocorrer em menos de 2 segundos após o comando médico. |
| **RNF02** | **Disponibilidade:** O sistema deve operar em alta disponibilidade (SLA 99.9%) via Vercel/Render. |
| **RNF03** | **Segurança:** O banco de dados PostgreSQL deve ser acessível apenas via conexões autenticadas e criptografadas. |
| **RNF04** | **Escalabilidade:** A arquitetura deve suportar múltiplos setores simultâneos (Enfermagem, Médicos, Exames). |
| **RNF05** | **UX/UI:** A interface do totem deve ter botões grandes para fácil interação tátil. |

---

## 3. Regras de Negócio (RN)
1. **RN01 - Prioridade:** Pacientes com prioridade (Idosos, PCD, Gestantes) devem obrigatoriamente aparecer no topo da fila, ordenados por hora de chegada.
2. **RN02 - Chamada Repetida:** Um paciente pode ser chamado até 3 vezes. Após isso, o médico pode marcá-lo como "Não Compareceu" ou retornar à fila.
3. **RN03 - Persistência:** Dados de atendimento do dia anterior devem ser mantidos como Log Operacional para fins estatísticos, mesmo após o reset da fila.
4. **RN04 - Identificação Unificada:** O CPF deve ser validado (formatação) para evitar duplicidade de senhas no mesmo dia para o mesmo paciente.

---

## 4. Diagramas UML (Representação Mermaid)

### 4.1. Diagrama de Casos de Uso
```mermaid
flowchart LR
    Paciente((Paciente))
    Medico((Médico))
    Administrador((Administrador))
    
    subgraph Sistema Totem NGA
        UC1(Emitir Senha)
        UC2(Identificar-se)
        UC3(Visualizar Fila)
        UC4(Chamar Paciente)
        UC5(Finalizar Atendimento)
        UC6(Ver Estatísticas)
        UC7(Resetar Sistema)
        UC8(Atualizar TV)
    end
    
    Paciente --> UC1
    Paciente --> UC2
    
    Medico --> UC3
    Medico --> UC4
    Medico --> UC5
    
    Administrador --> UC6
    Administrador --> UC7
    
    UC4 -.->|include| UC8
```

### 4.2. Diagrama de Classes (Domínio)
```mermaid
classDiagram
    class Paciente {
        +String nome
        +String cpf
        +String senha
        +DateTime horaChegada
        +Enum prioridade
    }
    class Atendimento {
        +DateTime horaChamada
        +String sala
        +Status status
    }
    class Medico {
        +String id
        +String nome
        +String setor
    }
    Paciente "1" -- "1" Atendimento : possui
    Medico "1" -- "n" Atendimento : realiza
```

### 4.3. Diagrama de Sequência (Chamada de Paciente)
```mermaid
sequenceDiagram
    participant M as Interface Médico
    participant B as Backend (NestJS)
    participant DB as Supabase (Postgres)
    participant TV as Painel TV
    
    M->>B: PATCH /fila/:id/chamar
    B->>DB: Update status 'chamando'
    DB-->>B: Confirmação
    B-->>M: Sucesso
    B-->>TV: Push Event (Socket/Polling)
    TV->>TV: Anuncia Voz & Nome
```

---

## 5. Arquitetura Técnica
- **Arquitetura:** Monorepo System.
- **Frontend:** Next.js 15 (React 19) com Tailwind CSS.
- **Backend:** NestJS com Injeção de Dependências.
- **Persistência:** Prisma ORM sobre PostgreSQL.
- **Infraestrutura:** 
    - Frontend: Vercel (Edge Network).
    - Backend: Render (Web Service).
    - Database: Supabase (Managed Postgres).

---

## 7. Modelagem de Dados (DER - Diagrama Entidade Relacionamento)

Abaixo, a representação visual de como as tabelas se relacionam no banco de dados PostgreSQL:

```mermaid
erDiagram
    PACIENTE_FILA ||--o| CHAMADA_TV : "gera"
    PACIENTE_FILA ||--o| LOG_OPERACIONAL : "histórico"
    MEDICO ||--o{ CHAMADA_TV : "realiza"

    PACIENTE_FILA {
        uuid id PK
        string nome
        string cpf
        string prioridade
        string status
        datetime created_at
        datetime updated_at
    }

    CHAMADA_TV {
        uuid id PK
        uuid paciente_id FK
        string sala
        string setor
        datetime created_at
    }

    MEDICO {
        uuid id PK
        string nome
        string especialidade
        string status
    }

    LOG_OPERACIONAL {
        uuid id PK
        uuid paciente_id FK
        string acao
        string detalhes
        datetime created_at
    }
```

---

Este documento sintetiza toda a inteligência e o planejamento por trás do **Totem NGA**, garantindo que a implementação técnica esteja alinhada aos objetivos de negócio da unidade de saúde.
