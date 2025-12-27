import { supabase } from '@/lib/supabase';
import { Consulta, PrioridadeSelecionada, SenhaGerada, Medico, mockSetores } from '@/contexts/TotemContext';

export interface PacienteFila {
  id: string;
  consulta: Consulta;
  prioridade: PrioridadeSelecionada;
  horarioChegada: string;
  senha: SenhaGerada;
  status: 'aguardando' | 'chamando' | 'em_atendimento' | 'atendido';
}

export interface ChamadaTV {
  id?: string;
  senha: string;
  paciente_nome: string;
  medico: string;
  sala: string;
  setor: string;
  prioridade: PrioridadeSelecionada;
  created_at?: string;
}

// Adiciona paciente à fila no Supabase
export const adicionarPacienteNaFila = async (pacienteFila: Omit<PacienteFila, 'id' | 'status'>): Promise<any> => {
  const { data, error } = await supabase
    .from('pacientes_fila')
    .insert([{
      cpf: pacienteFila.consulta.paciente.cpf,
      nome_paciente: pacienteFila.consulta.paciente.nome,
      medico_id: pacienteFila.consulta.medico.id,
      medico_nome: pacienteFila.consulta.medico.nome,
      setor_id: pacienteFila.senha.setor.id,
      setor_nome: pacienteFila.senha.setor.nome,
      senha_numero: pacienteFila.senha.numero,
      prioridade_tipo: pacienteFila.prioridade.tipo,
      prioridade_nivel: pacienteFila.prioridade.nivel,
      status: 'aguardando'
    }])
    .select();

  if (error) {
    console.error('Erro ao adicionar paciente no Supabase:', error);
    throw error;
  }

  return data[0];
};

// Obtém fila de um médico específico
export const obterFilaMedico = async (medicoId: string): Promise<PacienteFila[]> => {
  const { data, error } = await supabase
    .from('pacientes_fila')
    .select('*')
    .eq('medico_id', medicoId)
    .neq('status', 'atendido')
    .order('prioridade_nivel', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar fila do médico:', error);
    return [];
  }

  // Mapeia o resultado do Supabase de volta para o formato PacienteFila do App
  return data.map(item => mapDbToPacienteFila(item));
};

// Chama paciente e envia para a TV
export const chamarPaciente = async (pacienteId: string, sala: string): Promise<boolean> => {
  // 1. Atualiza status do paciente
  const { error: errorUpdate } = await supabase
    .from('pacientes_fila')
    .update({ status: 'chamando' })
    .eq('id', pacienteId);

  if (errorUpdate) return false;

  // 2. Busca dados para o broadcast da TV
  const { data: paciente } = await supabase
    .from('pacientes_fila')
    .select('*')
    .eq('id', pacienteId)
    .single();

  if (!paciente) return false;

  // 3. Insere a chamada na tabela de chamadas da TV
  const { error: errorTV } = await supabase
    .from('chamadas_tv')
    .insert([{
      senha: paciente.senha_numero,
      paciente_nome: paciente.nome_paciente,
      medico: paciente.medico_nome,
      sala: sala,
      setor: paciente.setor_nome,
      prioridade_tipo: paciente.prioridade_tipo
    }]);

  return !errorTV;
};

export const iniciarAtendimento = async (pacienteId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('pacientes_fila')
    .update({ status: 'em_atendimento' })
    .eq('id', pacienteId);
  return !error;
};

export const finalizarAtendimento = async (pacienteId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('pacientes_fila')
    .update({ status: 'atendido' })
    .eq('id', pacienteId);
  return !error;
};

// Obtém as chamadas mais recentes para a TV
export const obterChamadasRecentes = async (): Promise<ChamadaTV[]> => {
  const { data, error } = await supabase
    .from('chamadas_tv')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return [];

  return data.map(item => ({
    ...item,
    prioridade: { tipo: item.prioridade_tipo } as any // Simplificado para a TV
  }));
};

// Estatísticas globais (utilizado pelo médico)
export const obterEstatisticasFila = async (medicoId?: string) => {
  let query = supabase.from('pacientes_fila').select('status');

  if (medicoId) {
    query = query.eq('medico_id', medicoId);
  }

  const { data, error } = await query;
  if (error || !data) return { total: 0, aguardando: 0, chamando: 0, emAtendimento: 0, atendidos: 0 };

  return {
    total: data.length,
    aguardando: data.filter(p => p.status === 'aguardando').length,
    chamando: data.filter(p => p.status === 'chamando').length,
    emAtendimento: data.filter(p => p.status === 'em_atendimento').length,
    atendidos: data.filter(p => p.status === 'atendido').length
  };
};

// Estatísticas detalhadas para o Painel de Gestão
export const obterEstatisticasCompletas = async () => {
  const { data, error } = await supabase
    .from('pacientes_fila')
    .select('*');

  if (error || !data) return null;

  const atendidos = data.filter(p => p.status === 'atendido');

  // Cálculo de tempo médio de espera (em minutos)
  const temposEspera = data
    .filter(p => p.status !== 'aguardando')
    .map(p => {
      const inicio = new Date(p.created_at).getTime();
      const fim = p.updated_at ? new Date(p.updated_at).getTime() : Date.now();

      if (isNaN(inicio) || isNaN(fim)) return 0;
      return Math.max(0, (fim - inicio) / (1000 * 60));
    });

  const tempoMedio = temposEspera.length > 0
    ? Math.round(temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length)
    : 0;

  return {
    total: data.length,
    aguardando: data.filter(p => p.status === 'aguardando').length,
    emAtendimento: data.filter(p => p.status === 'em_atendimento' || p.status === 'chamando').length,
    atendidos: atendidos.length,
    tempoMedioEspera: `${tempoMedio} min`,
    taxaEficiencia: atendidos.length > 0 ? `${Math.round((atendidos.length / data.length) * 100)}%` : '0%',
    statsPorSetor: mockSetores.map(setor => {
      const pSetor = data.filter(p => p.setor_id === setor.id);
      return {
        ...setor,
        total: pSetor.length,
        aguardando: pSetor.filter(p => p.status === 'aguardando').length,
        atendidos: pSetor.filter(p => p.status === 'atendido').length
      };
    })
  };
};

// Funções de limpeza para o Admin (Deploy Vercel precisa disso para resetar testes)
export const resetarBancoDeDados = async () => {
  await supabase.from('pacientes_fila').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('chamadas_tv').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  return true;
};

/**
 * Função Auxiliar: Converte os dados do Banco (SQL) para o modelo da Interface (Typescript)
 */
const mapDbToPacienteFila = (db: any): PacienteFila => {
  const setor = mockSetores.find(s => s.id === db.setor_id) || mockSetores[0];

  return {
    id: db.id,
    horarioChegada: db.created_at,
    status: db.status,
    prioridade: {
      tipo: db.prioridade_tipo,
      nivel: db.prioridade_nivel,
      descricao: '' // Será preenchido se necessário
    } as any,
    senha: {
      numero: db.senha_numero,
      setor: setor,
      sala: '',
      horario: new Date(db.created_at).toLocaleTimeString()
    } as any,
    consulta: {
      paciente: { nome: db.nome_paciente, cpf: db.cpf, idade: 0 },
      medico: { id: db.medico_id, nome: db.medico_nome, especialidade: '', crm: '' },
      setor: db.setor_nome
    } as any
  };
};
