import api from './api';
import { Consulta, PrioridadeSelecionada, SenhaGerada, mockSetores } from '@/contexts/TotemContext';

export interface PacienteFila {
    id: string;
    consulta: Consulta;
    prioridade: PrioridadeSelecionada;
    horarioChegada: string;
    senha: SenhaGerada;
    status: 'aguardando' | 'chamando' | 'em_atendimento' | 'atendido';
}

export const adicionarPacienteNaFila = async (pacienteFila: Omit<PacienteFila, 'id' | 'status'>): Promise<any> => {
    const { data } = await api.post('/fila', {
        cpf: pacienteFila.consulta.paciente.cpf,
        nome_paciente: pacienteFila.consulta.paciente.nome,
        medico_id: pacienteFila.consulta.medico.id,
        medico_nome: pacienteFila.consulta.medico.nome,
        setor_id: pacienteFila.senha.setor.id,
        setor_nome: pacienteFila.senha.setor.nome,
        senha_numero: pacienteFila.senha.numero,
        prioridade_tipo: pacienteFila.prioridade.tipo,
        prioridade_nivel: pacienteFila.prioridade.nivel,
    });

    return data;
};

export const obterFilaMedico = async (medicoId: string): Promise<PacienteFila[]> => {
    const { data } = await api.get('/fila', { params: { medicoId } });
    return data.map((item: any) => ({
        id: item.id,
        consulta: {
            paciente: {
                cpf: item.cpf,
                nome: item.nome_paciente
            },
            medico: {
                id: item.medico_id,
                nome: item.medico_nome,
                especialidade: '', // Não temos no banco, mas pode ser adicionado se necessário
                crm: ''
            }
        },
        prioridade: {
            tipo: item.prioridade_tipo,
            nivel: item.prioridade_nivel,
            descricao: item.prioridade_tipo // Simplicado por enquanto
        },
        horarioChegada: item.created_at,
        senha: {
            numero: item.senha_numero,
            setor: {
                id: item.setor_id,
                nome: item.setor_nome,
                cor: '',
                salas: []
            }
        },
        status: item.status
    }));
};

export const chamarPaciente = async (pacienteId: string, sala: string): Promise<boolean> => {
    const { data } = await api.patch(`/fila/${pacienteId}/chamar`, { sala });
    return !!data;
};

export const obterChamadasTV = async () => {
    const { data } = await api.get('/fila/tv');
    return data;
};

export const iniciarAtendimento = async (pacienteId: string): Promise<boolean> => {
    const { data } = await api.patch(`/fila/${pacienteId}/status`, { status: 'em_atendimento' });
    return !!data;
};

export const finalizarAtendimento = async (pacienteId: string): Promise<boolean> => {
    const { data } = await api.patch(`/fila/${pacienteId}/status`, { status: 'atendido' });
    return !!data;
};

export const obterEstatisticasFila = async (medicoId: string): Promise<any> => {
    const { data } = await api.get('/fila/estatisticas', { params: { medicoId } });
    return data;
};

export const obterEstatisticasCompletas = async (periodo?: string): Promise<any> => {
    const { data } = await api.get('/fila/dashboard', { params: { periodo } });
    return data;
};

export const resetarBancoDeDados = async (): Promise<void> => {
    await api.post('/fila/reset');
};

export const limparLogs = async (): Promise<any> => {
    const { data } = await api.post('/fila/limpar-logs');
    return data;
};

export const registrarSessao = async (data: { medico_id: string, medico_nome: string, sala: string, setor: string }): Promise<void> => {
    await api.post('/fila/sessao', data);
};

export const removerSessao = async (medicoId: string): Promise<void> => {
    await api.post('/fila/sessao/remover', { medico_id: medicoId });
};

export const obterMedicos = async (): Promise<any[]> => {
    const { data } = await api.get('/fila/medicos');
    return data;
};

export const cadastrarMedico = async (medico: { nome: string, crm: string, especialidade: string; login: string; senha: string }): Promise<any> => {
    const { data } = await api.post('/fila/medicos', medico);
    return data;
};

export const loginMedico = async (credenciais: { login: string; senha: string }): Promise<any> => {
    const { data } = await api.post('/fila/login', credenciais);
    return data;
};
