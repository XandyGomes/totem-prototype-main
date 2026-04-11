import api from './api';
import { Consulta, PrioridadeSelecionada, SenhaGerada, mockSetores } from '@/contexts/TotemContext';

export interface PacienteFila {
    id: string; // Na integração, usamos a matrícula ou a chave composta stringificada
    consulta: Consulta;
    prioridade: PrioridadeSelecionada;
    horarioChegada: string;
    senha: SenhaGerada;
    status: 'aguardando' | 'chamando' | 'em_atendimento' | 'atendido' | string;
}

export const adicionarPacienteNaFila = async (pacienteFila: Omit<PacienteFila, 'id' | 'status'>): Promise<any> => {
    const { data } = await api.post('/sigs/check-in', pacienteFila.consulta.compositeKey);
    return data;
};

export const obterFilaMedico = async (medicoId: string | number): Promise<PacienteFila[]> => {
    const { data } = await api.get('/fila', { params: { medicoId } });
    return data.map((item: any) => ({
        id: `${item.matricula_paciente}-${item.hora}`,
        consulta: {
            id: String(item.matricula_paciente),
            data: item.data,
            hora: item.hora,
            paciente: {
                cpf: item.paciente.cpf,
                nome: item.paciente.nome,
                idade: 0
            },
            medico: {
                id: String(item.medico.codigo),
                nome: item.medico.nome,
                especialidade: 'Médico',
                crm: ''
            },
            setor: item.unidade.setor || item.unidade.nome,
            status: item.status === 2 ? 'em_andamento' : 'agendada',
            compositeKey: {
                matricula_paciente: item.matricula_paciente,
                codigo_medico: item.codigo_medico,
                codigo_unidade: item.codigo_unidade,
                data: item.data,
                hora: item.hora
            }
        },
        prioridade: {
            tipo: 'comum',
            nivel: 3,
            descricao: 'Atendimento'
        },
        horarioChegada: item.data_hora || item.data,
        senha: {
            numero: `S-${item.matricula_paciente}`,
            setor: {
                id: String(item.codigo_unidade),
                nome: item.unidade.nome,
                cor: '',
                salas: []
            }
        },
        status: item.status === 2 ? 'chamando' : (item.status === 1 ? 'aguardando' : 'atendido')
    }));
};

export const chamarPaciente = async (compositeKey: any, sala: string): Promise<boolean> => {
    const { data } = await api.patch(`/fila/chamar`, { compositeKey, sala });
    return !!data;
};

export const obterChamadasTV = async () => {
    const { data } = await api.get('/fila/tv');
    return data;
};

export const iniciarAtendimento = async (compositeKey: any): Promise<boolean> => {
    const { data } = await api.patch('/fila/iniciar', { compositeKey });
    return !!data;
};

export const finalizarAtendimento = async (compositeKey: any): Promise<boolean> => {
    const { data } = await api.patch('/fila/finalizar', { compositeKey });
    return !!data;
};

export const obterEstatisticasFila = async (medicoId: string | number): Promise<any> => {
    return { total: 0, aguardando: 0, emAtendimento: 0, atendidos: 0 };
};

export const obterEstatisticasCompletas = async (periodo?: string): Promise<any> => {
    const { data } = await api.get('/fila/dashboard', { params: { periodo } });
    return data;
};

export const registrarSessao = async (data: { medico_id: string | number, medico_nome: string, sala: string, setor: string }): Promise<void> => {
    await api.post('/fila/sessao', data);
};

export const removerSessao = async (medicoId: string | number): Promise<void> => {
    await api.post('/fila/sessao/remover', { medico_id: medicoId });
};

export const resetarBancoDeDados = async (): Promise<void> => {
    await api.post('/fila/reset');
};

export const limparLogs = async (): Promise<any> => {
    const { data } = await api.post('/fila/limpar-logs');
    return data;
};

export const loginMedico = async (credenciais: { login: string; senha: string }): Promise<any> => {
    const { data } = await api.post('/fila/login', credenciais);
    return data;
};

export const obterMedicos = async (): Promise<any[]> => {
    const { data } = await api.get('/fila/medicos');
    return data;
};

export const cadastrarMedico = async (medico: any): Promise<any> => {
    const { data } = await api.post('/fila/cadastrar', medico);
    return data;
};
