import { Consulta, PrioridadeSelecionada, SenhaGerada, Medico } from '@/contexts/TotemContext';

export interface PacienteFila {
  id: string;
  consulta: Consulta;
  prioridade: PrioridadeSelecionada;
  horarioChegada: string;
  senha: SenhaGerada;
  status: 'aguardando' | 'chamando' | 'em_atendimento' | 'atendido';
}

export interface FilaEspecialidade {
  especialidade: string;
  pacientes: PacienteFila[];
}

export interface FilaMedico {
  medico: Medico;
  pacientes: PacienteFila[];
}

// Interface para alocação de médicos (integração com painel administrativo)
export interface MedicoAlocacao {
  id: string;
  medicoId: string;
  nomeMedico: string;
  especialidade: string;
  sala: string;
  setor: string;
  data: string;
  turno: 'manhã' | 'tarde' | 'noite';
  computadorId?: string;
}

// Função para obter alocações do localStorage
const obterAlocacoesMedicos = (): MedicoAlocacao[] => {
  const alocacoes = localStorage.getItem('medicosAlocacoes');
  return alocacoes ? JSON.parse(alocacoes) : [];
};

// Função para detectar sala atual do médico automaticamente
export const detectarSalaMedico = (medicoId: string): { sala: string; setor: string } | null => {
  const hoje = new Date().toISOString().split('T')[0];
  const horaAtual = new Date().getHours();
  
  // Determina o turno atual
  let turnoAtual: 'manhã' | 'tarde' | 'noite';
  if (horaAtual >= 6 && horaAtual < 12) {
    turnoAtual = 'manhã';
  } else if (horaAtual >= 12 && horaAtual < 18) {
    turnoAtual = 'tarde';
  } else {
    turnoAtual = 'noite';
  }
  
  const alocacoes = obterAlocacoesMedicos();
  const alocacaoAtual = alocacoes.find(a => 
    a.medicoId === medicoId && 
    a.data === hoje && 
    a.turno === turnoAtual
  );
  
  if (alocacaoAtual) {
    return {
      sala: alocacaoAtual.sala,
      setor: alocacaoAtual.setor
    };
  }
  
  // Se não encontrar alocação, tenta detectar por computador
  const computadorId = detectarComputadorAtual();
  if (computadorId) {
    const alocacaoPorComputador = alocacoes.find(a => 
      a.medicoId === medicoId && 
      a.computadorId === computadorId &&
      a.data === hoje
    );
    
    if (alocacaoPorComputador) {
      return {
        sala: alocacaoPorComputador.sala,
        setor: alocacaoPorComputador.setor
      };
    }
  }
  
  return null;
};

// Simula detecção do computador atual (seria implementado com lógica real)
const detectarComputadorAtual = (): string | null => {
  // Em um ambiente real, isso detectaria o ID do computador pela rede
  // Por enquanto, simulamos retornando um ID baseado no hostname
  try {
    const hostname = window.location.hostname;
    if (hostname.includes('nga-pc-01')) return 'NGA-PC-01';
    if (hostname.includes('nga-pc-02')) return 'NGA-PC-02';
    // ... mais computadores
    
    // Para desenvolvimento, retorna um ID aleatório
    const computadores = ['NGA-PC-01', 'NGA-PC-02', 'NGA-PC-03', 'NGA-PC-04'];
    return computadores[Math.floor(Math.random() * computadores.length)];
  } catch {
    return null;
  }
};

// Simulação de dados de filas para desenvolvimento
let filasEspecialidades: FilaEspecialidade[] = [
  {
    especialidade: 'Cardiologia',
    pacientes: []
  },
  {
    especialidade: 'Geriatria', 
    pacientes: []
  },
  {
    especialidade: 'Ortopedia',
    pacientes: []
  }
];

// Adiciona paciente à fila
export const adicionarPacienteNaFila = (pacienteFila: Omit<PacienteFila, 'id' | 'status'>): PacienteFila => {
  const novoPaciente: PacienteFila = {
    ...pacienteFila,
    id: Date.now().toString(),
    status: 'aguardando'
  };

  // Encontra a fila da especialidade
  let filaEspecialidade = filasEspecialidades.find(f => 
    f.especialidade === pacienteFila.consulta.medico.especialidade
  );

  // Se não existe, cria
  if (!filaEspecialidade) {
    filaEspecialidade = {
      especialidade: pacienteFila.consulta.medico.especialidade,
      pacientes: []
    };
    filasEspecialidades.push(filaEspecialidade);
  }

  // Adiciona o paciente na posição correta baseada na prioridade
  const posicaoInsercao = calcularPosicaoFila(filaEspecialidade.pacientes, novoPaciente);
  filaEspecialidade.pacientes.splice(posicaoInsercao, 0, novoPaciente);

  return novoPaciente;
};

// Calcula posição correta na fila baseada na prioridade
const calcularPosicaoFila = (filaAtual: PacienteFila[], novoPaciente: PacienteFila): number => {
  // Prioridade 1 (superprioridade) vai sempre para o início
  if (novoPaciente.prioridade.nivel === 1) {
    // Encontra a primeira posição após outros de superprioridade
    const ultimaSuperPrioridade = filaAtual.findIndex(p => p.prioridade.nivel !== 1);
    return ultimaSuperPrioridade === -1 ? filaAtual.length : ultimaSuperPrioridade;
  }

  // Prioridade 2 vai após superprioridade mas antes dos comuns
  if (novoPaciente.prioridade.nivel === 2) {
    const ultimaPrioridade = filaAtual.findIndex(p => p.prioridade.nivel === 3);
    return ultimaPrioridade === -1 ? filaAtual.length : ultimaPrioridade;
  }

  // Prioridade 3 (comum) vai para o final
  return filaAtual.length;
};

// Obtém fila do médico específico
export const obterFilaMedico = (medicoId: string): FilaMedico | null => {
  const todasFilas = filasEspecialidades.flatMap(f => f.pacientes);
  const pacientesMedico = todasFilas.filter(p => p.consulta.medico.id === medicoId);
  
  if (pacientesMedico.length === 0) return null;

  return {
    medico: pacientesMedico[0].consulta.medico,
    pacientes: pacientesMedico
  };
};

// Obtém próximo paciente da fila do médico
export const obterProximoPaciente = (medicoId: string): PacienteFila | null => {
  const filaMedico = obterFilaMedico(medicoId);
  if (!filaMedico) return null;

  const proximoPaciente = filaMedico.pacientes
    .filter(p => p.status === 'aguardando')
    .sort((a, b) => {
      // Ordena por prioridade primeiro
      if (a.prioridade.nivel !== b.prioridade.nivel) {
        return a.prioridade.nivel - b.prioridade.nivel;
      }
      // Se mesma prioridade, ordena por horário de chegada
      return new Date(a.horarioChegada).getTime() - new Date(b.horarioChegada).getTime();
    })[0];

  return proximoPaciente || null;
};

// Chama paciente
export const chamarPaciente = (pacienteId: string): boolean => {
  const paciente = encontrarPacientePorId(pacienteId);
  if (!paciente || paciente.status !== 'aguardando') return false;

  paciente.status = 'chamando';
  
  // Detecta automaticamente a sala do médico
  const localizacao = detectarSalaMedico(paciente.consulta.medico.id);
  
  // Simula broadcast para TVs
  broadcastChamada({
    senha: paciente.senha.numero,
    medico: paciente.consulta.medico.nome,
    sala: localizacao?.sala || paciente.consulta.sala || 'Recepção',
    setor: localizacao?.setor || paciente.consulta.setor,
    prioridade: paciente.prioridade
  });

  return true;
};

// Inicia atendimento
export const iniciarAtendimento = (pacienteId: string): boolean => {
  const paciente = encontrarPacientePorId(pacienteId);
  if (!paciente) return false;

  paciente.status = 'em_atendimento';
  return true;
};

// Finaliza atendimento
export const finalizarAtendimento = (pacienteId: string): boolean => {
  const paciente = encontrarPacientePorId(pacienteId);
  if (!paciente) return false;

  paciente.status = 'atendido';
  return true;
};

// Força prioridade de um paciente (médico pode priorizar)
export const priorizarPaciente = (pacienteId: string, medicoId: string): boolean => {
  const filaMedico = obterFilaMedico(medicoId);
  if (!filaMedico) return false;

  const pacienteIndex = filaMedico.pacientes.findIndex(p => p.id === pacienteId);
  if (pacienteIndex === -1) return false;

  const paciente = filaMedico.pacientes[pacienteIndex];
  if (paciente.status !== 'aguardando') return false;

  // Remove da posição atual
  filaMedico.pacientes.splice(pacienteIndex, 1);
  
  // Adiciona no início dos pacientes aguardando
  const primeiroAguardando = filaMedico.pacientes.findIndex(p => p.status === 'aguardando');
  const novaPosicao = primeiroAguardando === -1 ? filaMedico.pacientes.length : primeiroAguardando;
  filaMedico.pacientes.splice(novaPosicao, 0, paciente);

  return true;
};

// Funções auxiliares
const encontrarPacientePorId = (pacienteId: string): PacienteFila | null => {
  for (const fila of filasEspecialidades) {
    const paciente = fila.pacientes.find(p => p.id === pacienteId);
    if (paciente) return paciente;
  }
  return null;
};

// Simula broadcast para TVs
interface ChamadaTV {
  senha: string;
  medico: string;
  sala: string;
  setor: string;
  prioridade: PrioridadeSelecionada;
}

const chamadasRecentes: ChamadaTV[] = [];

const broadcastChamada = (chamada: ChamadaTV) => {
  chamadasRecentes.unshift(chamada);
  // Mantém apenas as 10 chamadas mais recentes
  if (chamadasRecentes.length > 10) {
    chamadasRecentes.splice(10);
  }
  
  console.log('📢 Chamada enviada para TVs:', chamada);
};

// Obtém chamadas recentes para exibir nas TVs
export const obterChamadasRecentes = (): ChamadaTV[] => {
  return [...chamadasRecentes];
};

// Obtém todas as filas (para administradores)
export const obterTodasFilas = (): FilaEspecialidade[] => {
  return [...filasEspecialidades];
};

// Estatísticas da fila
export const obterEstatisticasFila = (medicoId?: string) => {
  let pacientes: PacienteFila[];
  
  if (medicoId) {
    const filaMedico = obterFilaMedico(medicoId);
    pacientes = filaMedico?.pacientes || [];
  } else {
    pacientes = filasEspecialidades.flatMap(f => f.pacientes);
  }

  return {
    total: pacientes.length,
    aguardando: pacientes.filter(p => p.status === 'aguardando').length,
    chamando: pacientes.filter(p => p.status === 'chamando').length,
    emAtendimento: pacientes.filter(p => p.status === 'em_atendimento').length,
    atendidos: pacientes.filter(p => p.status === 'atendido').length,
    superprioridade: pacientes.filter(p => p.prioridade.nivel === 1).length,
    prioridade: pacientes.filter(p => p.prioridade.nivel === 2).length,
    comum: pacientes.filter(p => p.prioridade.nivel === 3).length
  };
};
