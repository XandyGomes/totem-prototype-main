import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FilaService {
    private medicoSessoes: any[] = []; // Memória para sessões ativas no Dashboard

    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        // Registro de presença no log operacional
        await this.log('INFO', `Paciente ${data.nome_paciente} (${data.senha_numero}) confirmou presença no Totem`);
        return { success: true, matricula: data.matricula_paciente };
    }

    async findAll(codigoMedico?: number) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return this.prisma.consultaIntegracao.findMany({
            where: {
                codigo_medico: codigoMedico ? Number(codigoMedico) : undefined,
                presencaConfirmada: 'S',
                data: {
                    gte: hoje,
                    lt: new Date(hoje.getTime() + 24 * 60 * 60 * 1000)
                }
            },
            include: {
                paciente: true,
                medico: true,
                unidade: true
            },
            orderBy: { hora: 'asc' }
        });
    }

    async chamarPaciente(compositeKey: any, sala: string) {
        const { matricula_paciente, codigo_medico, codigo_unidade, data, hora } = compositeKey;

        // Atualiza o status da consulta
        const consulta = await this.prisma.consultaIntegracao.update({
            where: {
                matricula_paciente_codigo_medico_codigo_unidade_data_hora: {
                    matricula_paciente: Number(matricula_paciente),
                    codigo_medico: Number(codigo_medico),
                    codigo_unidade: Number(codigo_unidade),
                    data: new Date(data),
                    hora: Number(hora)
                }
            },
            data: { 
                status: 2, // 2 = Chamando
                sala: sala 
            },
            include: { paciente: true, medico: true, unidade: true }
        });

        // Envia para o painel de chamadas
        await this.prisma.chamadaTV.create({
            data: {
                senha: `S-${consulta.matricula_paciente}`,
                paciente_nome: consulta.paciente.nome,
                medico_nome: consulta.medico.nome,
                sala: sala,
                setor: consulta.unidade.setor || consulta.unidade.nome,
                prioridade_tipo: 'Geral',
            },
        });

        await this.log('INFO', `MÉDICO CHAMOU: ${consulta.paciente.nome} para a ${sala}`);
        return consulta;
    }

    async getChamadasTV() {
        return this.prisma.chamadaTV.findMany({
            orderBy: { created_at: 'desc' },
            take: 10,
        });
    }

    async getDashboard() {
        // Limpa sessões inativas (fantasmas) antes de retornar os dados
        const agora = Date.now();
        const sessoesOriginais = this.medicoSessoes.length;
        this.medicoSessoes = this.medicoSessoes.filter(s => (agora - s.lastSeen) < 30000); 
        
        if (sessoesOriginais > this.medicoSessoes.length) {
            console.log(`[SESSION] Limpeza de ${sessoesOriginais - this.medicoSessoes.length} sessões inativas efetuada.`);
        }

        const [total, confirmados, chamados, unidades] = await Promise.all([
            this.prisma.consultaIntegracao.count(),
            this.prisma.consultaIntegracao.count({ where: { presencaConfirmada: 'S' } }),
            this.prisma.chamadaTV.count(),
            this.prisma.unidadeIntegracao.findMany()
        ]);

        const statsPorSetor = unidades.map(u => ({
            id: String(u.codigo),
            nome: u.setor || u.nome,
            cor: '#3b82f6',
            aguardando: 0,
            atendidos: 0
        }));

        return {
            total,
            aguardando: total - confirmados,
            atendidos: confirmados,
            tempoMedioEspera: '0 min',
            taxaEficiencia: total > 0 ? `${Math.round((confirmados / total) * 100)}%` : '100%',
            statsPorSetor,
            systemHealth: {
                api: 'Ativa',
                tv: 'Operacional',
                totem: 'Operacional'
            },
            tendencias: {
                total: { texto: 'Estável', positivo: true },
                tempo: { texto: '0 min', positivo: true },
                eficiencia: { texto: '100%', positivo: true }
            },
            logs: await this.prisma.logOperacional.findMany({ take: 10, orderBy: { timestamp: 'desc' } }),
            sessoesAtivas: this.medicoSessoes
        };
    }

    async log(tipo: string, mensagem: string, detalhes?: string) {
        try {
            return await this.prisma.logOperacional.create({
                data: { tipo, mensagem, detalhes }
            });
        } catch (e) {
            return null;
        }
    }

    // Gerenciamento de sessões
    async registrarSessao(data: any) {
        const agora = Date.now();
        
        // Atualiza ou adiciona na memória de sessões
        const index = this.medicoSessoes.findIndex(s => String(s.medico_id) === String(data.medico_id));
        if (index > -1) {
            this.medicoSessoes[index] = { ...data, lastSeen: agora };
        } else {
            console.log(`[SESSION] Médico ${data.medico_nome} ENTROU na Sala ${data.sala}`);
            this.medicoSessoes.push({ ...data, lastSeen: agora });
            
            // Registra início da sessão
            await this.prisma.historicoSessao.create({
                data: {
                    medico_id: Number(data.medico_id),
                    medico_nome: data.medico_nome,
                    sala: String(data.sala),
                    setor: String(data.setor),
                    inicio: new Date()
                }
            });

            await this.log('INFO', `MÉDICO ${data.medico_nome.toUpperCase()} INDICOU SALA ${data.sala}`);
        }
        
        return { success: true };
    }

    async removerSessao(medicoId: any) {
        // Marca o fim no histórico permanente se houver uma sessão aberta
        const sessaoMemoria = this.medicoSessoes.find(s => String(s.medico_id) === String(medicoId));
        if (sessaoMemoria) {
            await this.prisma.historicoSessao.updateMany({
                where: { 
                    medico_id: Number(medicoId),
                    fim: null 
                },
                data: { fim: new Date() }
            });
        }

        this.medicoSessoes = this.medicoSessoes.filter(s => String(s.medico_id) !== String(medicoId));
        return { success: true };
    }

    async findAllMedicos() {
        return this.prisma.medicoIntegracao.findMany();
    }

    async loginMedico(data: { login: string; senha: string }) {
        console.log(`[LOGIN] Tentativa para: "${data.login}"`);
        
        if (!data.login || data.login.trim() === '') return null;

        const codigo = parseInt(data.login);
        const medico = await this.prisma.medicoIntegracao.findUnique({
            where: { codigo }
        });

        if (!medico || !medico.senha) return null;

        const isMatch = await bcrypt.compare(data.senha, medico.senha);
        if (!isMatch) return null;

        return {
            id: String(medico.codigo),
            codigo: medico.codigo,
            nome: medico.nome,
            role: medico.role,
            especialidade: 'Médico SIGS',
            crm: medico.codigo === 500 ? '123456' : `SIGS-${medico.codigo}`
        };
    }

    async cadastrar(data: any) {
        const hashedPassword = await bcrypt.hash(data.senha, 10);
        
        // Se o código não for provido, geramos um baseado no último
        let codigo = data.codigo;
        if (!codigo) {
            const ultimo = await this.prisma.medicoIntegracao.findFirst({ orderBy: { codigo: 'desc' } });
            codigo = (ultimo?.codigo || 1000) + 1;
        }

        return this.prisma.medicoIntegracao.create({
            data: {
                codigo: Number(codigo),
                nome: data.nome,
                senha: hashedPassword,
                role: data.role || 'MEDICO'
            }
        });
    }

    async reset() {
        this.medicoSessoes = [];

        // Limpeza de tabelas transacionais
        await Promise.all([
            this.prisma.chamadaTV.deleteMany({}),
            this.prisma.consultaIntegracao.deleteMany({}),
            this.prisma.medicoIntegracao.deleteMany({}),
            this.prisma.pacienteIntegracao.deleteMany({}),
            this.prisma.unidadeIntegracao.deleteMany({})
        ]);

        await this.log('WARN', 'O banco de dados foi resetado completamente');
        return { success: true };
    }

    async limparLogs() {
        const count = await this.prisma.logOperacional.count();
        await this.prisma.logOperacional.deleteMany({});
        return { success: true, count };
    }

    async iniciarAtendimento(compositeKey: any) {
        const { matricula_paciente, codigo_medico, codigo_unidade, data, hora } = compositeKey;
        
        // Busca dados do paciente/médico para o relatório
        const consulta = await this.prisma.consultaIntegracao.findUnique({
            where: {
                matricula_paciente_codigo_medico_codigo_unidade_data_hora: {
                    matricula_paciente: Number(matricula_paciente),
                    codigo_medico: Number(codigo_medico),
                    codigo_unidade: Number(codigo_unidade),
                    data: new Date(data),
                    hora: Number(hora)
                }
            },
            include: { paciente: true, medico: true, unidade: true }
        });

        if (consulta) {
            // Registro histórico de atendimento
            await this.prisma.registroAtendimento.create({
                data: {
                    matricula_paciente: Number(matricula_paciente),
                    paciente_nome: consulta.paciente.nome || 'Paciente',
                    codigo_medico: Number(codigo_medico),
                    medico_nome: consulta.medico.nome || 'Médico',
                    sala: consulta.sala || 'N/A',
                    setor: consulta.unidade.setor || 'N/A',
                    status: 3,
                    timestamp: new Date()
                }
            });
        }

        return this.prisma.consultaIntegracao.update({
            where: {
                matricula_paciente_codigo_medico_codigo_unidade_data_hora: {
                    matricula_paciente: Number(matricula_paciente),
                    codigo_medico: Number(codigo_medico),
                    codigo_unidade: Number(codigo_unidade),
                    data: new Date(data),
                    hora: Number(hora)
                }
            },
            data: { status: 3 }
        });
    }

    async finalizarAtendimento(compositeKey: any) {
        const { matricula_paciente, codigo_medico, codigo_unidade, data, hora } = compositeKey;
        
        // Busca o início deste atendimento para calcular a duração
        const inicial = await this.prisma.registroAtendimento.findFirst({
            where: {
                matricula_paciente: Number(matricula_paciente),
                codigo_medico: Number(codigo_medico),
                status: 3
            },
            orderBy: { timestamp: 'desc' }
        });

        let duracao: number | null = null;
        if (inicial) {
            duracao = Math.floor((Date.now() - inicial.timestamp.getTime()) / 1000);
        }

        // Registro de encerramento
        const consulta = await this.prisma.consultaIntegracao.findUnique({
            where: {
                matricula_paciente_codigo_medico_codigo_unidade_data_hora: {
                    matricula_paciente: Number(matricula_paciente),
                    codigo_medico: Number(codigo_medico),
                    codigo_unidade: Number(codigo_unidade),
                    data: new Date(data),
                    hora: Number(hora)
                }
            },
            include: { paciente: true, medico: true, unidade: true }
        });

        if (consulta) {
            await this.prisma.registroAtendimento.create({
                data: {
                    matricula_paciente: Number(matricula_paciente),
                    paciente_nome: consulta.paciente.nome || 'Paciente',
                    codigo_medico: Number(codigo_medico),
                    medico_nome: consulta.medico.nome || 'Médico',
                    sala: consulta.sala || 'N/A',
                    setor: consulta.unidade.setor || 'N/A',
                    status: 4,
                    timestamp: new Date(),
                    duracao_segundos: duracao
                }
            });
        }

        return this.prisma.consultaIntegracao.update({
            where: {
                matricula_paciente_codigo_medico_codigo_unidade_data_hora: {
                    matricula_paciente: Number(matricula_paciente),
                    codigo_medico: Number(codigo_medico),
                    codigo_unidade: Number(codigo_unidade),
                    data: new Date(data),
                    hora: Number(hora)
                }
            },
            data: { status: 4 }
        });
    }
}
