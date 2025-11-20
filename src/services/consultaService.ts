import { Consulta, mockConsultas, mockSetores, Setor } from '@/contexts/TotemContext';

// Simula API para validar se o paciente tem consulta agendada
export const validarConsultaAgendada = async (identificacao: string): Promise<{
  sucesso: boolean;
  consulta?: Consulta;
  erro?: string;
}> => {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Normaliza o CPF removendo formatação
  const cpfLimpo = identificacao.replace(/\D/g, '');
  
  // Busca consulta por CPF
  const consultaEncontrada = mockConsultas.find(
    consulta => consulta.paciente.cpf === cpfLimpo &&
    consulta.data === new Date().toISOString().split('T')[0] && // Data de hoje
    consulta.status === 'agendada'
  );
  
  if (!consultaEncontrada) {
    return {
      sucesso: false,
      erro: 'Não encontramos consulta agendada para hoje.'
    };
  }
  
  return {
    sucesso: true,
    consulta: consultaEncontrada
  };
};

// Simula API para validar se o setor está correto
export const validarSetorCorreto = async (consulta: Consulta, setorAtual: string): Promise<{
  sucesso: boolean;
  setorCorreto?: Setor;
  erro?: string;
}> => {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const setorConsulta = mockSetores.find(setor => 
    setor.nome.toLowerCase() === consulta.setor.toLowerCase()
  );
  
  if (!setorConsulta) {
    return {
      sucesso: false,
      erro: 'Setor não encontrado no sistema.'
    };
  }
  
  // Aqui você poderia verificar se o totem está no setor correto
  // Por enquanto, vamos assumir que está sempre correto para o desenvolvimento
  return {
    sucesso: true,
    setorCorreto: setorConsulta
  };
};

// Simula API para verificar se o médico está disponível
export const verificarMedicoDisponivel = async (medicoId: string): Promise<{
  disponivel: boolean;
  sala?: string;
  horarioProximo?: string;
}> => {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Por enquanto, simula que o médico está sempre disponível
  return {
    disponivel: true,
    sala: 'Sala 11', // Seria obtido do sistema de alocação de salas
    horarioProximo: '15 minutos'
  };
};

// Gera número de senha baseado na prioridade
export const gerarNumeroSenha = async (prioridade: 'superprioridade' | 'prioritario' | 'comum'): Promise<string> => {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const agora = new Date();
  const timestamp = agora.getTime().toString().slice(-4);
  
  switch (prioridade) {
    case 'superprioridade':
      return `SP${timestamp}`;
    case 'prioritario':
      return `PR${timestamp}`;
    case 'comum':
      return `CM${timestamp}`;
    default:
      return `CM${timestamp}`;
  }
};

// Simula impressão da senha
export const imprimirSenha = async (dadosImpressao: {
  numeroSenha: string;
  nomeSetor: string;
  nomeMedico: string;
  sala: string;
  prioridade: string;
  corSetor: string;
}): Promise<{
  sucesso: boolean;
  erro?: string;
}> => {
  // Simula delay da impressora
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simula falha de impressão em 5% dos casos
  if (Math.random() < 0.05) {
    return {
      sucesso: false,
      erro: 'Falha na impressora. Procure o atendente.'
    };
  }
  
  console.log('Imprimindo senha:', dadosImpressao);
  return { sucesso: true };
};
