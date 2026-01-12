import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SigsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.agendamentoSIGS.findMany({
            orderBy: { data_agendamento: 'asc' },
        });
    }

    async findByCpf(cpf: string) {
        // Remove pontuação do CPF para busca
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        return this.prisma.agendamentoSIGS.findMany({
            where: {
                OR: [
                    { cpf: cpfLimpo },
                    { cpf: cpf }
                ],
                check_in: false,
            },
        });
    }

    async create(data: any) {
        return this.prisma.agendamentoSIGS.create({
            data: {
                ...data,
                data_agendamento: new Date(data.data_agendamento),
            },
        });
    }

    async update(id: string, data: any) {
        const updateData = { ...data };
        if (updateData.data_agendamento) {
            updateData.data_agendamento = new Date(updateData.data_agendamento);
        }
        return this.prisma.agendamentoSIGS.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: string) {
        return this.prisma.agendamentoSIGS.delete({
            where: { id },
        });
    }

    async checkIn(id: string) {
        return this.prisma.agendamentoSIGS.update({
            where: { id },
            data: { check_in: true },
        });
    }
}
