import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilaService {
    private medicoSessoes: any[] = []; // Memória para sessões ativas no Dashboard

    constructor(private prisma: PrismaService) { }

    // Simula a entrada do paciente na fila interna (Passo 4 e 5)
    async create(data: any) {
        // No mundo real, aqui apenas marcaríamos o check-in no SQL Server
        // Mas para manter a lógica do Totem funcionando, podemos usar o log operacional
        await this.log('INFO', `Paciente ${data.nome_paciente} (${data.senha_numero}) confirmou presença no Totem`);
        return { success: true, matricula: data.matricula_paciente };
    }

    // Busca todos os pacientes que deram check-in hoje (Simulando a lista que o médico vê no SIGS)
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

    // Simula o botão "Chamar" do médico dentro do SIGS
    async chamarPaciente(compositeKey: any, sala: string) {
        const { matricula_paciente, codigo_medico, codigo_unidade, data, hora } = compositeKey;

        // 1. Atualiza o status na tabela principal de consultas (O que o SIGS faria)
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

        // 2. Cria o registro na tabela de TV (O que o sistema de TV monitora)
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

    // Métodos para manter compatibilidade com o Front original
    async registrarSessao(data: any) {
        const agora = Date.now();
        
        // Atualiza ou adiciona na memória de sessões
        const index = this.medicoSessoes.findIndex(s => String(s.medico_id) === String(data.medico_id));
        if (index > -1) {
            this.medicoSessoes[index] = { ...data, lastSeen: agora };
        } else {
            console.log(`[SESSION] Médico ${data.medico_nome} ENTROU na Sala ${data.sala}`);
            this.medicoSessoes.push({ ...data, lastSeen: agora });
            
            // GRAVA PERMANENTE NO RELATÓRIO DE SESSÕES
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
        
        // Bloqueia se o login estiver em branco
        if (!data.login || data.login.trim() === '') {
            console.warn(`[LOGIN] Tentativa com campo Vazio. Bloqueado.`);
            return null;
        }

        const codigo = parseInt(data.login);
        
        let medico;
        if (!isNaN(codigo)) {
            medico = await this.prisma.medicoIntegracao.findUnique({
                where: { codigo }
            });
        } else {
            medico = await this.prisma.medicoIntegracao.findFirst({
                where: { 
                    nome: { contains: data.login.trim().toUpperCase() }
                }
            });
        }

        if (!medico) {
            console.warn(`[LOGIN] Médico "${data.login}" NÃO encontrado no banco.`);
            return null;
        }

        console.log(`[LOGIN] Sucesso! Médico encontrado: ${medico.nome}`);

        return {
            id: String(medico.codigo),
            codigo: medico.codigo,
            nome: medico.nome,
            especialidade: 'Médico SIGS',
            crm: medico.codigo === 500 ? '123456' : `SIGS-${medico.codigo}`
        };
    }

    async reset() {
        // 1. Limpa a memória das sessões ativas (expulsa todos os médicos do Dashboard)
        this.medicoSessoes = [];

        // 2. Limpa todas as tabelas transacionais e de cadastro
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
            // REGISTRA O INÍCIO DO ATENDIMENTO PERMANENTE
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

        // REGISTRA O FIM DO ATENDIMENTO PERMANENTE
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
