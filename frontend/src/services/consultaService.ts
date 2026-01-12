import { Consulta, mockConsultas, mockSetores, Setor } from '@/contexts/TotemContext';
import { sigsService } from './sigsService';

// Este serviço agora integra com o Banco SIGS Simulado no NestJS

export const validarConsultaAgendada = async (identificacao: string): Promise<{
    sucesso: boolean;
    consulta?: Consulta;
    erro?: string;
}> => {
    const cpfLimpo = identificacao.replace(/\D/g, '');

    // 1. Tentar buscar no Banco SIGS Simulado (NestJS)
    try {
        const agendamentosSigs = await sigsService.buscarPorCpf(cpfLimpo);
        if (agendamentosSigs && agendamentosSigs.length > 0) {
            const agendamento = agendamentosSigs[0];
            return {
                sucesso: true,
                consulta: {
                    id: agendamento.id, // Mantém o ID original para check-in posterior
                    data: agendamento.data_agendamento.split('T')[0],
                    hora: agendamento.horario || '00:00',
                    paciente: {
                        cpf: agendamento.cpf,
                        nome: agendamento.nome_paciente,
                        idade: 0
                    },
                    medico: {
                        id: agendamento.medico_id || 'mock',
                        nome: agendamento.medico_nome || 'Dr(a). Médico Desconhecido',
                        especialidade: agendamento.medico_especialidade || 'Clínico Geral',
                        crm: '000000'
                    },
                    setor: agendamento.setor_nome || 'Setor Verde',
                    status: 'agendada'
                }
            };
        }
    } catch (e) {
        console.error('Erro ao buscar no SIGS:', e);
    }

    // 2. Fallback para os mocks locais
    const consultaEncontrada = mockConsultas.find(
        consulta => consulta.paciente.cpf === cpfLimpo &&
            consulta.data === new Date().toISOString().split('T')[0] &&
            consulta.status === 'agendada'
    );

    if (!consultaEncontrada) {
        return {
            sucesso: false,
            erro: 'Não encontramos consulta agendada para hoje no SIGS.'
        };
    }

    return {
        sucesso: true,
        consulta: consultaEncontrada
    };
};


export const validarSetorCorreto = async (consulta: Consulta, setorAtual: string): Promise<{
    sucesso: boolean;
    setorCorreto?: Setor;
    erro?: string;
}> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const setorConsulta = mockSetores.find(setor =>
        setor.nome.toLowerCase() === consulta.setor.toLowerCase()
    );

    if (!setorConsulta) {
        return {
            sucesso: false,
            erro: 'Setor não encontrado no sistema.'
        };
    }

    return {
        sucesso: true,
        setorCorreto: setorConsulta
    };
};

export const gerarNumeroSenha = async (prioridade: 'superprioridade' | 'prioritario' | 'comum'): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const agora = new Date();
    const timestamp = agora.getTime().toString().slice(-4);

    switch (prioridade) {
        case 'superprioridade': return `SP${timestamp}`;
        case 'prioritario': return `PR${timestamp}`;
        case 'comum': return `CM${timestamp}`;
        default: return `CM${timestamp}`;
    }
};

export const imprimirSenha = async (dados: any): Promise<{ sucesso: boolean; erro?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Imprimindo senha:', dados);
    return { sucesso: true };
};
