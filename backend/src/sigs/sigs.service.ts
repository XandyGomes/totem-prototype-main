import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SigsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.consultaIntegracao.findMany({
            include: {
                paciente: true,
                medico: true,
                unidade: true,
            },
            orderBy: { data: 'asc' },
        });
    }

    async findByCpf(cpf: string) {
        // Remove pontuação do CPF para busca
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        // Busca o paciente pelo CPF
        const pacientes = await this.prisma.pacienteIntegracao.findMany({
            where: {
                OR: [
                    { cpf: cpfLimpo },
                    { cpf: cpf }
                ]
            }
        });

        if (pacientes.length === 0) return [];

        const matriculas = pacientes.map(p => p.matricula);

        // Busca as consultas pendentes para o dia de hoje
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return this.prisma.consultaIntegracao.findMany({
            where: {
                matricula_paciente: { in: matriculas },
                presencaConfirmada: 'N',
                data: {
                    gte: hoje,
                    lt: new Date(hoje.getTime() + 24 * 60 * 60 * 1000)
                }
            },
            include: {
                paciente: true,
                medico: true,
                unidade: true
            }
        });
    }

    async checkIn(matricula: number, codigoMedico: number, codigoUnidade: number, data: Date, hora: number) {
        return this.prisma.consultaIntegracao.update({
            where: {
                matricula_paciente_codigo_medico_codigo_unidade_data_hora: {
                    matricula_paciente: matricula,
                    codigo_medico: codigoMedico,
                    codigo_unidade: codigoUnidade,
                    data: data,
                    hora: hora
                }
            },
            data: { 
                presencaConfirmada: 'S',
                status: 1 // Presente
            },
        });
    }

    async create(data: any) {
        return this.prisma.consultaIntegracao.create({
            data: {
                matricula_paciente: Number(data.matricula_paciente || 1000), // Simulação se zero
                codigo_medico: Number(data.medico_id),
                codigo_unidade: Number(data.codigo_unidade || 101),
                data: new Date(data.data_agendamento),
                hora: parseInt(data.horario.replace(':', '')),
                presencaConfirmada: 'N',
                status: 0
            }
        });
    }

    async delete(id: string) {
        // Como o ID na lista do front é uma string composta, fazemos o parse
        const [matricula, medico, data, hora] = id.split('-');
        return this.prisma.consultaIntegracao.delete({
            where: {
                matricula_paciente_codigo_medico_codigo_unidade_data_hora: {
                    matricula_paciente: Number(matricula),
                    codigo_medico: Number(medico),
                    codigo_unidade: 101, // Mock unidade se não enviada
                    data: new Date(data),
                    hora: Number(hora)
                }
            }
        });
    }
}
