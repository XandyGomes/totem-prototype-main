import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusFila } from '@prisma/client';

@Injectable()
export class FilaService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        const paciente = await this.prisma.pacienteFila.create({
            data: {
                cpf: data.cpf,
                nome_paciente: data.nome_paciente,
                medico_id: data.medico_id,
                medico_nome: data.medico_nome,
                setor_id: data.setor_id,
                setor_nome: data.setor_nome,
                senha_numero: data.senha_numero,
                prioridade_tipo: data.prioridade_tipo,
                prioridade_nivel: data.prioridade_nivel,
                status: 'aguardando',
            },
        });
        await this.log('INFO', `Paciente ${data.nome_paciente} (${data.senha_numero}) entrou na fila para ${data.medico_nome}`);
        return paciente;
    }

    async findAll(medicoId?: string) {
        return this.prisma.pacienteFila.findMany({
            where: medicoId ? { medico_id: medicoId } : {},
            orderBy: [
                { prioridade_nivel: 'asc' },
                { created_at: 'asc' },
            ],
        });
    }

    async updateStatus(id: string, status: StatusFila) {
        const paciente = await this.prisma.pacienteFila.update({
            where: { id },
            data: { status },
        });
        await this.log('INFO', `Status de ${paciente.nome_paciente} alterado para ${status}`);
        return paciente;
    }

    async chamarPaciente(id: string, sala: string) {
        const paciente = await this.prisma.pacienteFila.update({
            where: { id },
            data: { status: 'chamando' },
        });

        await this.prisma.chamadaTV.create({
            data: {
                senha: paciente.senha_numero,
                paciente_nome: paciente.nome_paciente,
                medico: paciente.medico_nome,
                sala: sala,
                setor: paciente.setor_nome,
                prioridade_tipo: paciente.prioridade_tipo,
            },
        });

        await this.log('INFO', `Paciente ${paciente.nome_paciente} chamado para ${sala}`);
        return paciente;
    }

    async getChamadasTV() {
        return this.prisma.chamadaTV.findMany({
            orderBy: { created_at: 'desc' },
            take: 10,
        });
    }

    async getEstatisticas(medicoId: string) {
        const [total, aguardando, emAtendimento, atendidos] = await Promise.all([
            this.prisma.pacienteFila.count({ where: { medico_id: medicoId } }),
            this.prisma.pacienteFila.count({ where: { medico_id: medicoId, status: 'aguardando' } }),
            this.prisma.pacienteFila.count({ where: { medico_id: medicoId, status: 'em_atendimento' } }),
            this.prisma.pacienteFila.count({ where: { medico_id: medicoId, status: 'atendido' } }),
        ]);

        return {
            total,
            aguardando,
            emAtendimento,
            atendidos,
        };
    }

    async getDashboard(periodo: string = 'hoje') {
        console.log(`📊 Dashboard solicitado para período: ${periodo}`);
        let dataInicio = new Date();
        dataInicio.setHours(0, 0, 0, 0); // Default: Hoje 00:00

        // Define período anterior para comparação
        let dataInicioAnterior = new Date();
        let dataFimAnterior = new Date();

        if (periodo === 'semana') {
            const diaDaSemana = dataInicio.getDay(); // 0 (Domingo) a 6 (Sábado)
            const diff = dataInicio.getDate() - diaDaSemana + (diaDaSemana === 0 ? -6 : 1); // Ajusta para segunda-feira
            dataInicio.setDate(diff);

            // Semana anterior
            dataInicioAnterior = new Date(dataInicio);
            dataInicioAnterior.setDate(dataInicioAnterior.getDate() - 7);
            dataFimAnterior = new Date(dataInicio);
        } else if (periodo === 'mes') {
            dataInicio.setDate(1); // Dia 1 do mês atual

            // Mês anterior
            dataInicioAnterior = new Date(dataInicio);
            dataInicioAnterior.setMonth(dataInicioAnterior.getMonth() - 1);
            dataFimAnterior = new Date(dataInicio);
        } else {
            // Ontem
            dataInicioAnterior = new Date(dataInicio);
            dataInicioAnterior.setDate(dataInicioAnterior.getDate() - 1);
            dataFimAnterior = new Date(dataInicio);
        }

        const wherePeriodo = { created_at: { gte: dataInicio } };
        const wherePeriodoAnterior = {
            created_at: {
                gte: dataInicioAnterior,
                lt: dataFimAnterior
            }
        };

        const [total, aguardando, atendidos, totalAnterior, atendidosAnterior, logs, sessoesAtivas, lastPatient, lastTvCall] = await Promise.all([
            this.prisma.pacienteFila.count({ where: wherePeriodo }),
            this.prisma.pacienteFila.count({ where: { status: 'aguardando' } }), // Aguardando é sempre snapshot atual
            this.prisma.pacienteFila.count({ where: { ...wherePeriodo, status: 'atendido' } }),
            this.prisma.pacienteFila.count({ where: wherePeriodoAnterior }),
            this.prisma.pacienteFila.count({ where: { ...wherePeriodoAnterior, status: 'atendido' } }),
            this.prisma.logOperacional.findMany({ orderBy: { timestamp: 'desc' }, take: 20 }),
            this.prisma.sessaoMedico.findMany({
                where: { ultima_atividade: { gt: new Date(Date.now() - 1000 * 45) } }, // Considera ativo se atividade < 45 seg
                orderBy: { ultima_atividade: 'desc' }
            }),
            this.prisma.pacienteFila.findFirst({ orderBy: { created_at: 'desc' } }),
            this.prisma.chamadaTV.findFirst({ orderBy: { created_at: 'desc' } })
        ]);

        // Calcula tendências
        const calcularTendencia = (atual: number, anterior: number): { texto: string, positivo: boolean } => {
            if (anterior === 0) {
                return atual > 0
                    ? { texto: `+${atual} novos`, positivo: true }
                    : { texto: 'Sem dados anteriores', positivo: true };
            }
            const diferenca = atual - anterior;
            const percentual = Math.round((diferenca / anterior) * 100);

            if (diferenca === 0) return { texto: 'Sem mudanças', positivo: true };

            const sinal = diferenca > 0 ? '+' : '';
            return {
                texto: `${sinal}${percentual}% que ${periodo === 'hoje' ? 'ontem' : periodo === 'semana' ? 'semana passada' : 'mês passado'}`,
                positivo: diferenca > 0
            };
        };

        const tendenciaTotal = calcularTendencia(total, totalAnterior);
        const tendenciaAtendidos = calcularTendencia(atendidos, atendidosAnterior);

        // Calcula tempo médio de espera real
        const pacientesAtendidos = await this.prisma.pacienteFila.findMany({
            where: { ...wherePeriodo, status: 'atendido' },
            select: { created_at: true, updated_at: true }
        });

        let tempoMedioEspera = '0 min';
        let diferencaTempo = { texto: 'Sem dados', positivo: true };

        if (pacientesAtendidos.length > 0) {
            const temposEspera = pacientesAtendidos.map(p =>
                (p.updated_at.getTime() - p.created_at.getTime()) / (1000 * 60) // em minutos
            );
            const mediaAtual = temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length;
            tempoMedioEspera = `${Math.round(mediaAtual)} min`;

            // Calcula média do período anterior
            const pacientesAnterior = await this.prisma.pacienteFila.findMany({
                where: { ...wherePeriodoAnterior, status: 'atendido' },
                select: { created_at: true, updated_at: true }
            });

            if (pacientesAnterior.length > 0) {
                const temposAnterior = pacientesAnterior.map(p =>
                    (p.updated_at.getTime() - p.created_at.getTime()) / (1000 * 60)
                );
                const mediaAnterior = temposAnterior.reduce((a, b) => a + b, 0) / temposAnterior.length;
                const diff = Math.round(mediaAtual - mediaAnterior);

                if (diff !== 0) {
                    const sinal = diff > 0 ? '+' : '';
                    diferencaTempo = {
                        texto: `${sinal}${diff} min que a média`,
                        positivo: diff < 0 // Negativo é bom (menos tempo de espera)
                    };
                } else {
                    diferencaTempo = { texto: 'Igual à média', positivo: true };
                }
            }
        }

        // Taxa de eficiência (atendidos / total)
        const taxaEficiencia = total > 0 ? Math.round((atendidos / total) * 100) : 100;
        const taxaAnterior = totalAnterior > 0 ? Math.round((atendidosAnterior / totalAnterior) * 100) : 100;
        const difTaxa = taxaEficiencia - taxaAnterior;
        const tendenciaEficiencia = {
            texto: difTaxa === 0 ? 'Mantida' : `${difTaxa > 0 ? '+' : ''}${difTaxa}% que ${periodo === 'hoje' ? 'ontem' : periodo === 'semana' ? 'semana passada' : 'mês passado'}`,
            positivo: difTaxa >= 0
        };

        const statsSetores = await this.prisma.pacienteFila.groupBy({
            by: ['setor_id', 'setor_nome', 'status'],
            where: {
                OR: [
                    { status: 'aguardando' }, // Aguardando pega todos
                    { status: 'chamando' },   // Chamando pega todos
                    { ...wherePeriodo, status: 'atendido' },      // Atendidos filtra por data
                    { ...wherePeriodo, status: 'em_atendimento' } // Em atendimento filtra por data (sessão do dia/período)
                ]
            },
            _count: { id: true }
        });

        const coresSetores: Record<string, string> = {
            'Setor Verde': '#22c55e',
            'Setor Amarelo': '#eab308',
            'Setor Azul': '#3b82f6',
            'Setor Violeta': '#a855f7',
            'Setor Laranja': '#f97316'
        };

        const setoresMap = new Map();
        ['Setor Verde', 'Setor Amarelo', 'Setor Azul', 'Setor Violeta', 'Setor Laranja'].forEach(nome => {
            setoresMap.set(nome, { id: nome.toLowerCase().replace(' ', '-'), nome, cor: coresSetores[nome], aguardando: 0, atendidos: 0 });
        });

        statsSetores.forEach(stat => {
            const setor = setoresMap.get(stat.setor_nome) || { id: stat.setor_id, nome: stat.setor_nome, cor: '#94a3b8', aguardando: 0, atendidos: 0 };
            if (!setoresMap.has(stat.setor_nome)) setoresMap.set(stat.setor_nome, setor);

            if (['aguardando', 'chamando'].includes(stat.status)) setor.aguardando += stat._count.id;
            else if (['atendido', 'em_atendimento'].includes(stat.status)) setor.atendidos += stat._count.id;
        });

        // Lógica de Status IoT Simplificada
        const now = new Date().getTime();
        const oneHour = 60 * 60 * 1000;
        // Check de reset apenas se periodo for hoje, senão pode dar falso positivo
        const isFreshReset = total === 0 && periodo === 'hoje';

        const impressoraStatus = lastPatient && (now - lastPatient.created_at.getTime() < oneHour) ? 'Operacional' : 'Ocioso';
        const tvStatus = lastTvCall && (now - lastTvCall.created_at.getTime() < oneHour) ? 'Operacional' : (lastTvCall ? 'Ocioso' : 'Aguardando');

        return {
            total,
            aguardando,
            atendidos,
            tempoMedioEspera,
            taxaEficiencia: `${taxaEficiencia}%`,
            statsPorSetor: Array.from(setoresMap.values()),
            logs,
            sessoesAtivas,
            systemHealth: {
                api: 'Ativa',
                tv: isFreshReset ? 'Aguardando' : tvStatus,
                totem: isFreshReset ? 'Aguardando' : impressoraStatus
            },
            // Tendências calculadas
            tendencias: {
                total: tendenciaTotal,
                tempo: diferencaTempo,
                eficiencia: tendenciaEficiencia
            }
        };
    }

    async resetData() {
        try {
            // Limpa TODAS as tabelas para reset completo (útil para testes)
            // EXCETO logs operacionais (mantém histórico de rastreabilidade)
            await this.prisma.chamadaTV.deleteMany();
            await this.prisma.pacienteFila.deleteMany();

            // Limpa sessões de médicos
            if ((this.prisma as any).sessaoMedico) {
                await (this.prisma as any).sessaoMedico.deleteMany();
            }

            // Limpa médicos cadastrados
            if ((this.prisma as any).medico) {
                await (this.prisma as any).medico.deleteMany();
            }

            // Limpa agendamentos do SIGS (Simulador)
            if ((this.prisma as any).agendamentoSIGS) {
                await (this.prisma as any).agendamentoSIGS.deleteMany();
            }

            // Registra o reset nos logs (mantém histórico)
            await this.log('WARN', 'Banco de dados resetado via Painel Administrativo', 'Pacientes, chamadas TV, sessões, médicos e agendamentos SIGS foram removidos');

            console.log('✅ Banco de dados resetado (logs preservados para rastreabilidade)');
            return { success: true, message: 'Banco de dados resetado (logs preservados)' };
        } catch (error) {
            console.error("Erro ao resetar dados:", error);
            return { success: false, error: 'Erro ao resetar banco de dados' };
        }
    }

    async limparLogs() {
        try {
            if ((this.prisma as any).logOperacional) {
                const count = await (this.prisma as any).logOperacional.count();
                await (this.prisma as any).logOperacional.deleteMany();
                console.log(`🗑️ ${count} logs operacionais foram limpos`);
                return { success: true, message: `${count} logs removidos`, count };
            }
            return { success: false, error: 'Tabela de logs não disponível' };
        } catch (error) {
            console.error("Erro ao limpar logs:", error);
            return { success: false, error: 'Erro ao limpar logs' };
        }
    }

    // Novos Métodos de Sessão e Log
    async registrarSessao(data: { medico_id: string, medico_nome: string, sala: string, setor: string }) {
        if (!(this.prisma as any).sessaoMedico) return null;
        try {
            return await (this.prisma as any).sessaoMedico.upsert({
                where: { medico_id: data.medico_id },
                update: {
                    medico_nome: data.medico_nome,
                    sala: data.sala,
                    setor: data.setor,
                    ultima_atividade: new Date()
                },
                create: {
                    medico_id: data.medico_id,
                    medico_nome: data.medico_nome,
                    sala: data.sala,
                    setor: data.setor,
                    ultima_atividade: new Date()
                }
            });
        } catch (e) {
            console.error("Erro ao registrar sessão", e);
            return null;
        }
    }

    async removerSessao(medicoId: string) {
        if (!(this.prisma as any).sessaoMedico) return null;
        try {
            await (this.prisma as any).sessaoMedico.delete({
                where: { medico_id: medicoId }
            });
            await this.log('INFO', `Sessão do médico ${medicoId} removida (logout)`);
            return { success: true };
        } catch (e) {
            console.error("Erro ao remover sessão", e);
            return null;
        }
    }

    async createMedico(data: { nome: string; crm: string; especialidade: string; login: string; senha: string }) {
        if (!(this.prisma as any).medico) throw new Error("Tabela de Médicos não disponível. Reinicie o backend.");
        const medico = await this.prisma.medico.create({ data });
        await this.log('INFO', `Novo Médico Cadastrado: ${medico.nome} (${medico.crm})`);
        return medico;
    }

    async loginMedico(data: { login: string; senha: string }) {
        if (!(this.prisma as any).medico) return null;
        const medico = await this.prisma.medico.findUnique({
            where: { login: data.login }
        });

        if (medico && medico.senha === data.senha) {
            return medico;
        }
        return null;
    }

    async findAllMedicos() {
        if (!(this.prisma as any).medico) return [];
        return this.prisma.medico.findMany({
            where: { ativo: true },
            orderBy: { nome: 'asc' }
        });
    }

    async log(tipo: string, mensagem: string, detalhes?: string) {
        if (!(this.prisma as any).logOperacional) return null;
        try {
            return await (this.prisma as any).logOperacional.create({
                data: { tipo, mensagem, detalhes }
            });
        } catch (e) {
            // Silently fail logging if it breaks
            return null;
        }
    }
}
