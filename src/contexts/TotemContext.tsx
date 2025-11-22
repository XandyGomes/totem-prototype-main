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
  cor: string; // Cor da linha no chão
  salas: string[];
}

export type TipoPrioridade = 
  | 'superprioridade' // 80+
  | 'idoso_60_79'
  | 'pcd'
  | 'gestante'
  | 'lactante'
  | 'crianca_colo'
  | 'autista'
  | 'mobilidade_reduzida'
  | 'obeso'
  | 'comum';

export interface PrioridadeSelecionada {
  tipo: TipoPrioridade;
  descricao: string;
  nivel: 1 | 2 | 3; // 1=Super, 2=Legal, 3=Comum
}

export interface SenhaGerada {
  numero: string;
  tipo: string;
  horario: string;
  prioridade: PrioridadeSelecionada;
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
  
  // Sistema de filas (para médicos e administradores)
  filaPacientes: Array<{
    consulta: Consulta;
    prioridade: PrioridadeSelecionada;
    horarioChegada: string;
    senha: SenhaGerada;
  }>;
}

// Ações do reducer
type TotemAction =
  | { type: 'SET_IDENTIFICACAO'; payload: string }
  | { type: 'SET_CONSULTA'; payload: Consulta | null }
  | { type: 'SET_VALIDACAO_CONSULTA'; payload: { temConsulta: boolean; setorCorreto: boolean; erro?: string } }
  | { type: 'SET_PRIORIDADE'; payload: { isPrioritario: boolean; prioridadeSelecionada?: PrioridadeSelecionada } }
  | { type: 'SET_SENHA_GERADA'; payload: SenhaGerada }
  | { type: 'ADD_TO_FILA'; payload: { consulta: Consulta; prioridade: PrioridadeSelecionada; senha: SenhaGerada } }
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
  filaPacientes: []
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
            senha: action.payload.senha
          }
        ]
      };
    
    case 'RESET_TOTEM':
      return {
        ...initialState,
        filaPacientes: state.filaPacientes // Mantém a fila
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

// Dados mockados para desenvolvimento
export const mockConsultas: Consulta[] = [
  {
    id: '1',
    data: new Date().toISOString().split('T')[0],
    hora: '09:00',
    paciente: { cpf: '11111111111', nome: 'João Silva Santos', idade: 45 },
    medico: { id: 'med1', nome: 'Dr. Carlos Oliveira', especialidade: 'Cardiologia', crm: 'CRM/SP 123456' },
    setor: 'Cardiologia',
    sala: '11',
    status: 'agendada'
  },
  {
    id: '2',
    data: new Date().toISOString().split('T')[0],
    hora: '10:30',
    paciente: { cpf: '22222222222', nome: 'Maria José Ferreira', idade: 82 },
    medico: { id: 'med2', nome: 'Dra. Ana Santos', especialidade: 'Geriatria', crm: 'CRM/SP 654321' },
    setor: 'Geriatria',
    sala: '15',
    status: 'agendada'
  }
];

export const mockSetores: Setor[] = [
  { id: 'cardiologia', nome: 'Cardiologia', cor: '#FF0000', salas: ['11', '12', '13'] },
  { id: 'geriatria', nome: 'Geriatria', cor: '#00FF00', salas: ['14', '15', '16'] },
  { id: 'ortopedia', nome: 'Ortopedia', cor: '#0000FF', salas: ['17', '18', '19'] }
];

// Mapeamento de ícones para tipos de prioridade
export const iconesTicket = {
  superprioridade: Star,
  idoso_60_79: Users,
  pcd: Accessibility,
  gestante: Heart,
  lactante: Baby,
  crianca_colo: Baby,
  autista: Puzzle,
  mobilidade_reduzida: Accessibility,
  obeso: Scale,
  comum: User
};

// Configuração de tipos de prioridade
export const tiposPrioridade: Record<TipoPrioridade, { descricao: string; nivel: 1 | 2 | 3; icone: string; IconeComponente: React.ComponentType }> = {
  superprioridade: { descricao: 'Idoso 80+ anos (Superprioridade)', nivel: 1, icone: '⭐', IconeComponente: Star },
  idoso_60_79: { descricao: 'Idoso 60-79 anos', nivel: 2, icone: '👴', IconeComponente: Users },
  pcd: { descricao: 'Pessoa com Deficiência', nivel: 2, icone: '♿', IconeComponente: Accessibility },
  gestante: { descricao: 'Gestante', nivel: 2, icone: '💗', IconeComponente: Heart },
  lactante: { descricao: 'Lactante', nivel: 2, icone: '🤱', IconeComponente: Baby },
  crianca_colo: { descricao: 'Pessoa com criança de colo', nivel: 2, icone: '👶', IconeComponente: Baby },
  autista: { descricao: 'Autista (TEA)', nivel: 2, icone: '🧩', IconeComponente: Puzzle },
  mobilidade_reduzida: { descricao: 'Mobilidade reduzida', nivel: 2, icone: '🦽', IconeComponente: Accessibility },
  obeso: { descricao: 'Obeso (mobilidade reduzida)', nivel: 2, icone: '⚖️', IconeComponente: Scale },
  comum: { descricao: 'Atendimento não preferencial', nivel: 3, icone: '👤', IconeComponente: User }
};
