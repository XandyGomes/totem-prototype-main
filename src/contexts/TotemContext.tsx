import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  Star,
  Users,
  Accessibility,
  Heart,
  Baby,
  User,
  Puzzle,
  Scale,
  UserCheck
} from 'lucide-react';

// Tipos de dados do sistema
export interface Paciente {
  cpf: string;
  cns?: string;
  nome: string;
  idade: number;
}

export interface Medico {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
}

export interface Consulta {
  id: string;
  data: string;
  hora: string;
  paciente: Paciente;
  medico: Medico;
  setor: string;
  sala?: string;
  status: 'agendada' | 'em_andamento' | 'finalizada';
}

export interface Setor {
  id: string;
  nome: string;
  cor: string; // Hexadecimal da cor
  corNome: 'verde' | 'amarelo' | 'azul' | 'violeta' | 'laranja';
  salas: string[];
}

export type TipoPrioridade =
  | 'superprioridade' // 80+
  | 'legal'           // PCD, Gestantes, etc
  | 'comum';

export interface PrioridadeSelecionada {
  tipo: TipoPrioridade;
  subtipo?: string; // Ex: "Gestante", "PCD"
  descricao: string;
  nivel: 1 | 2 | 3; // 1=Super (80+), 2=Legal, 3=Comum
}

export interface SenhaGerada {
  numero: string;
  tipo: string;
  horario: string;
  prioridade: PrioridadeSelecionada;
  setor: Setor;
  sala: string;
}

// Estado global do totem
export interface TotemState {
  // Dados do paciente atual
  pacienteIdentificacao: string; // CPF ou CNS digitado
  consulta: Consulta | null;

  // Validações
  temConsultaAgendada: boolean;
  setorCorreto: boolean;

  // Prioridade
  isPrioritario: boolean;
  prioridadeSelecionada: PrioridadeSelecionada | null;

  // Sistema de senhas
  senhaGerada: SenhaGerada | null;

  // Erro messages
  erroConsulta: string | null;

  // Sistema de filas (Global)
  filaPacientes: Array<{
    consulta: Consulta;
    prioridade: PrioridadeSelecionada;
    horarioChegada: string;
    senha: SenhaGerada;
    status: 'aguardando' | 'chamado' | 'em_atendimento' | 'finalizado';
  }>;

  // Configurações do Médico (Mocado para agora)
  medicoSessao: {
    medico: Medico | null;
    sala: string | null;
    setor: Setor | null;
  };
}

// Ações do reducer
type TotemAction =
  | { type: 'SET_IDENTIFICACAO'; payload: string }
  | { type: 'SET_CONSULTA'; payload: Consulta | null }
  | { type: 'SET_VALIDACAO_CONSULTA'; payload: { temConsulta: boolean; setorCorreto: boolean; erro?: string } }
  | { type: 'SET_PRIORIDADE'; payload: { isPrioritario: boolean; prioridadeSelecionada?: PrioridadeSelecionada } }
  | { type: 'SET_SENHA_GERADA'; payload: SenhaGerada }
  | { type: 'ADD_TO_FILA'; payload: { consulta: Consulta; prioridade: PrioridadeSelecionada; senha: SenhaGerada } }
  | { type: 'SET_MEDICO_SESSAO'; payload: { medico: Medico; sala: string; setor: Setor } }
  | { type: 'CHAMAR_PACIENTE'; payload: string } // ID da consulta
  | { type: 'RESET_TOTEM' }
  | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: TotemState = {
  pacienteIdentificacao: '',
  consulta: null,
  temConsultaAgendada: false,
  setorCorreto: false,
  isPrioritario: false,
  prioridadeSelecionada: null,
  senhaGerada: null,
  erroConsulta: null,
  filaPacientes: [],
  medicoSessao: {
    medico: null,
    sala: null,
    setor: null
  }
};

// Reducer
const totemReducer = (state: TotemState, action: TotemAction): TotemState => {
  switch (action.type) {
    case 'SET_IDENTIFICACAO':
      return {
        ...state,
        pacienteIdentificacao: action.payload,
        erroConsulta: null
      };

    case 'SET_CONSULTA':
      return {
        ...state,
        consulta: action.payload
      };

    case 'SET_VALIDACAO_CONSULTA':
      return {
        ...state,
        temConsultaAgendada: action.payload.temConsulta,
        setorCorreto: action.payload.setorCorreto,
        erroConsulta: action.payload.erro || null
      };

    case 'SET_PRIORIDADE':
      return {
        ...state,
        isPrioritario: action.payload.isPrioritario,
        prioridadeSelecionada: action.payload.prioridadeSelecionada || null
      };

    case 'SET_SENHA_GERADA':
      return {
        ...state,
        senhaGerada: action.payload
      };

    case 'ADD_TO_FILA':
      return {
        ...state,
        filaPacientes: [
          ...state.filaPacientes,
          {
            consulta: action.payload.consulta,
            prioridade: action.payload.prioridade,
            horarioChegada: new Date().toISOString(),
            senha: action.payload.senha,
            status: 'aguardando'
          }
        ]
      };

    case 'SET_MEDICO_SESSAO':
      return {
        ...state,
        medicoSessao: action.payload
      };

    case 'CHAMAR_PACIENTE':
      return {
        ...state,
        filaPacientes: state.filaPacientes.map(p =>
          p.consulta.id === action.payload ? { ...p, status: 'chamado' } : p
        )
      };

    case 'RESET_TOTEM':
      return {
        ...initialState,
        filaPacientes: state.filaPacientes // Mantém a fila histórica
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        erroConsulta: null
      };

    default:
      return state;
  }
};

// Context
const TotemContext = createContext<{
  state: TotemState;
  dispatch: React.Dispatch<TotemAction>;
} | undefined>(undefined);

// Provider
export const TotemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(totemReducer, initialState);

  return (
    <TotemContext.Provider value={{ state, dispatch }}>
      {children}
    </TotemContext.Provider>
  );
};

// Hook customizado
export const useTotem = () => {
  const context = useContext(TotemContext);
  if (!context) {
    throw new Error('useTotem deve ser usado dentro de TotemProvider');
  }
  return context;
};

// Dados mockados atualizados conforme a planta nova
export const mockSetores: Setor[] = [
  { id: 'verde', nome: 'Setor Verde', cor: '#22c55e', corNome: 'verde', salas: ['01', '02', '03', '04'] },
  { id: 'amarelo', nome: 'Setor Amarelo', cor: '#eab308', corNome: 'amarelo', salas: ['05', '06', '07', '08'] },
  { id: 'azul', nome: 'Setor Azul', cor: '#3b82f6', corNome: 'azul', salas: ['09', '10', '11', '12'] },
  { id: 'violeta', nome: 'Setor Violeta', cor: '#a855f7', corNome: 'violeta', salas: ['13', '14', '15', '16'] },
  { id: 'laranja', nome: 'Setor Laranja', cor: '#f97316', corNome: 'laranja', salas: ['17', '18', '19', '20'] }
];

export const mockConsultas: Consulta[] = [
  {
    id: '1',
    data: new Date().toISOString().split('T')[0],
    hora: '09:00',
    paciente: { cpf: '11111111111', nome: 'João Silva Santos', idade: 45 },
    medico: { id: 'med1', nome: 'Dr. Carlos Oliveira', especialidade: 'Cardiologia', crm: 'CRM/SP 123456' },
    setor: 'Setor Verde',
    sala: '01',
    status: 'agendada'
  },
  {
    id: '2',
    data: new Date().toISOString().split('T')[0],
    hora: '10:30',
    paciente: { cpf: '22222222222', nome: 'Maria José Ferreira', idade: 82 },
    medico: { id: 'med2', nome: 'Dra. Ana Santos', especialidade: 'Geriatria', crm: 'CRM/SP 654321' },
    setor: 'Setor Amarelo',
    sala: '05',
    status: 'agendada'
  }
];

// Mapeamento de ícones para tipos de prioridade
export const iconesTicket = {
  superprioridade: Star,
  legal: Accessibility,
  comum: User
};

export const tiposPrioridade: Record<string, { descricao: string; nivel: 1 | 2 | 3; icone: string; IconeComponente: React.ComponentType }> = {
  superprioridade: { descricao: 'Idoso 80+ anos (Superprioridade)', nivel: 1, icone: '⭐', IconeComponente: Star },
  pcd: { descricao: 'Pessoa com Deficiência', nivel: 2, icone: '♿', IconeComponente: Accessibility },
  idoso_60_79: { descricao: 'Idoso (60 a 79 anos)', nivel: 2, icone: '👴', IconeComponente: Users },
  gestante: { descricao: 'Gestante', nivel: 2, icone: '💗', IconeComponente: Heart },
  lactante: { descricao: 'Lactante', nivel: 2, icone: '🤱', IconeComponente: Baby },
  crianca_colo: { descricao: 'Criança de colo', nivel: 2, icone: '👶', IconeComponente: Baby },
  autista: { descricao: 'Autista (TEA)', nivel: 2, icone: '🧩', IconeComponente: Puzzle },
  mobilidade_reduzida: { descricao: 'Mobilidade Reduzida', nivel: 2, icone: '🚶', IconeComponente: UserCheck },
  obeso: { descricao: 'Obesidade Grante', nivel: 2, icone: '⚖️', IconeComponente: Scale },
  comum: { descricao: 'Atendimento Comum', nivel: 3, icone: '👤', IconeComponente: User }
};
