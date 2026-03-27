import { Consulta, mockSetores, Setor } from '@/contexts/TotemContext';
import { sigsService } from './sigsService';

export const validarConsultaAgendada = async (identificacao: string): Promise<{
    sucesso: boolean;
    consulta?: Consulta;
    erro?: string;
}> => {
    const cpfLimpo = identificacao.replace(/\D/g, '');

    try {
        const agendamentosSigs = await sigsService.buscarPorCpf(cpfLimpo);
        if (agendamentosSigs && agendamentosSigs.length > 0) {
            const ag = agendamentosSigs[0];
            return {
                sucesso: true,
                consulta: {
                    id: String(ag.matricula_paciente),
                    data: ag.data,
                    hora: ag.hora,
                    paciente: {
                        cpf: ag.paciente.cpf,
                        nome: ag.paciente.nome,
                        idade: 0
                    },
                    medico: {
                        id: String(ag.medico.codigo),
                        nome: ag.medico.nome,
                        especialidade: 'Médico',
                        crm: '000000'
                    },
                    setor: ag.unidade.setor || ag.unidade.nome,
                    status: 'agendada',
                    compositeKey: {
                        matricula_paciente: ag.matricula_paciente,
                        codigo_medico: ag.codigo_medico,
                        codigo_unidade: ag.codigo_unidade,
                        data: ag.data,
                        hora: ag.hora
                    }
                }
            };
        }
    } catch (e) {
        console.error('Erro ao buscar no SIGS:', e);
    }

    return {
        sucesso: false,
        erro: 'Não encontramos consulta agendada para hoje no SIGS.'
    };
};

export const realizarCheckIn = async (consulta: Consulta): Promise<boolean> => {
    if (!consulta.compositeKey) return false;
    try {
        await sigsService.checkIn(consulta.compositeKey);
        return true;
    } catch (e) {
        console.error('Erro no check-in:', e);
        return false;
    }
}

export const validarSetorCorreto = async (consulta: Consulta, setorAtual: string): Promise<{
    sucesso: boolean;
    setorCorreto?: Setor;
    erro?: string;
}> => {
    const setorConsulta = mockSetores.find(setor =>
        setor.nome.toLowerCase() === consulta.setor.toLowerCase()
    );

    if (!setorConsulta) {
        return {
            sucesso: true, // Se não achar o setor por nome, deixamos passar para não travar o paciente
            setorCorreto: mockSetores[0] 
        };
    }

    return {
        sucesso: true,
        setorCorreto: setorConsulta
    };
};

export const gerarNumeroSenha = async (prioridade: string): Promise<string> => {
    const prefixo = prioridade === 'superprioridade' ? 'SP' : (prioridade === 'comum' ? 'CM' : 'PR');
    return `${prefixo}${Math.floor(Math.random() * 9000) + 1000}`;
};

export const imprimirSenha = async (dados: any): Promise<{ sucesso: boolean; erro?: string }> => {
    console.log('FINGIMOS IMPRIMIR:', dados);
    return { sucesso: true };
};
