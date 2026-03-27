import api from './api';

export interface AgendamentoSIGS {
    matricula_paciente: number;
    codigo_medico: number;
    codigo_unidade: number;
    data: string;
    hora: number;
    data_hora?: string;
    presencaConfirmada: string;
    status: number;
    sala?: string;
    paciente: {
        matricula: number;
        nome: string;
        nomeSocial?: string;
        cpf: string;
    };
    medico: {
        codigo: number;
        nome: string;
    };
    unidade: {
        codigo: number;
        nome: string;
        setor?: string;
    };
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

    async checkIn(compositeKey: {
        matricula_paciente: number;
        codigo_medico: number;
        codigo_unidade: number;
        data: string;
        hora: number;
    }): Promise<AgendamentoSIGS> {
        const response = await api.post(`/sigs/check-in`, compositeKey);
        return response.data;
    },

    async create(data: any): Promise<any> {
        const response = await api.post('/sigs', data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/sigs/${id}`);
    }
};
