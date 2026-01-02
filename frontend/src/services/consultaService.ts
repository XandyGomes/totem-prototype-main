import { Consulta, mockConsultas, mockSetores, Setor } from '@/contexts/TotemContext';

// Este serviço será futuramente integrado ao NestJS
// Por enquanto, mantém a lógica de mock para garantir o funcionamento do fluxo

export const validarConsultaAgendada = async (identificacao: string): Promise<{
    sucesso: boolean;
    consulta?: Consulta;
    erro?: string;
}> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const cpfLimpo = identificacao.replace(/\D/g, '');

    const consultaEncontrada = mockConsultas.find(
        consulta => consulta.paciente.cpf === cpfLimpo &&
            consulta.data === new Date().toISOString().split('T')[0] &&
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
