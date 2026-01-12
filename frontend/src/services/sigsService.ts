import api from './api';

export interface AgendamentoSIGS {
    id: string;
    cpf: string;
    nome_paciente: string;
    medico_id?: string;
    medico_nome?: string;
    medico_especialidade?: string;
    setor_id?: string;
    setor_nome?: string;
    data_agendamento: string;
    horario?: string;
    check_in: boolean;
    created_at: string;
    updated_at: string;
}

export const sigsService = {
    async getAll(): Promise<AgendamentoSIGS[]> {
        const response = await api.get('/sigs');
        return response.data;
    },

    async buscarPorCpf(cpf: string): Promise<AgendamentoSIGS[]> {
        const response = await api.get('/sigs/buscar', { params: { cpf } });
        return response.data;
    },

    async create(data: Partial<AgendamentoSIGS>): Promise<AgendamentoSIGS> {
        const response = await api.post('/sigs', data);
        return response.data;
    },

    async update(id: string, data: Partial<AgendamentoSIGS>): Promise<AgendamentoSIGS> {
        const response = await api.put(`/sigs/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/sigs/${id}`);
    },

    async checkIn(id: string): Promise<AgendamentoSIGS> {
        const response = await api.post(`/sigs/${id}/check-in`);
        return response.data;
    }
};
