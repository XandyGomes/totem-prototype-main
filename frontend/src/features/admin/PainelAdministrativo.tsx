'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Clock,
    CheckCircle,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Calendar,
    AlertCircle,
    FileText,
    Search,
    Monitor,
    Volume2,
    Server,
    Printer
} from 'lucide-react';
import { useTotem } from '@/contexts/TotemContext';
import { obterEstatisticasCompletas, resetarBancoDeDados, limparLogs } from '@/services/filaService';
import { toast } from "sonner";

export const PainelAdministrativo: React.FC = () => {
    const { state } = useTotem();
    const [stats, setStats] = useState<any>(null);
    const [periodo, setPeriodo] = useState<string>('hoje');

    useEffect(() => {
        const atualizarStats = async () => {
            try {
                const data = await obterEstatisticasCompletas(periodo);
                if (data) setStats(data);
            } catch (e) {
                console.error('Erro ao buscar estatísticas:', e);
            }
        };

        atualizarStats();
        const interval = setInterval(atualizarStats, 5000);
        return () => clearInterval(interval);
    }, [periodo]);

    if (!stats) return <div className="p-20 text-center font-black animate-pulse text-blue-600 uppercase text-4xl">Carregando Inteligência NGA...</div>;

    return (
        <div className="h-full w-full bg-slate-50 p-6 space-y-6 overflow-y-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase">Gestão & Performance NGA</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mt-1 uppercase">Console Administrativo Centralizado</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border-2 border-slate-200">
                    <Badge
                        onClick={() => setPeriodo('hoje')}
                        className={`px-4 py-2 cursor-pointer font-black uppercase transition-all ${periodo === 'hoje' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-transparent text-slate-400 hover:bg-slate-100'}`}
                        variant={periodo === 'hoje' ? 'default' : 'outline'}
                    >
                        Hoje
                    </Badge>
                    <Badge
                        onClick={() => setPeriodo('semana')}
                        className={`px-4 py-2 cursor-pointer font-black uppercase transition-all ${periodo === 'semana' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-transparent text-slate-400 hover:bg-slate-100 border-transparent'}`}
                        variant={periodo === 'semana' ? 'default' : 'outline'}
                    >
                        Semana
                    </Badge>
                    <Badge
                        onClick={() => setPeriodo('mes')}
                        className={`px-4 py-2 cursor-pointer font-black uppercase transition-all ${periodo === 'mes' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-transparent text-slate-400 hover:bg-slate-100 border-transparent'}`}
                        variant={periodo === 'mes' ? 'default' : 'outline'}
                    >
                        Mês
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Fluxo Total de Senhas"
                    value={stats.total}
                    icon={Users}
                    color="blue"
                    trend={stats.tendencias?.total?.texto || 'Sem dados'}
                    trendUp={stats.tendencias?.total?.positivo ?? true}
                />
                <KPICard
                    title="T.M.E. (Espera Real)"
                    value={stats.tempoMedioEspera}
                    icon={Clock}
                    color="amber"
                    trend={stats.tendencias?.tempo?.texto || 'Sem dados'}
                    trendUp={stats.tendencias?.tempo?.positivo ?? true}
                />
                <KPICard
                    title="Taxa de Atendimento"
                    value={stats.taxaEficiencia}
                    icon={CheckCircle}
                    color="emerald"
                    trend={stats.tendencias?.eficiencia?.texto || 'Sem dados'}
                    trendUp={stats.tendencias?.eficiencia?.positivo ?? true}
                />
                <KPICard
                    title="Pacientes na Espera"
                    value={stats.aguardando}
                    icon={Activity}
                    color="indigo"
                    trend="Tempo real"
                    trendUp={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-2 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b p-6">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-black uppercase flex items-center gap-3 uppercase">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                                Ocupação de Salas de Espera por Setor
                            </CardTitle>
                            <Badge variant="outline" className="font-bold border-2 animate-pulse text-emerald-600 border-emerald-200 bg-emerald-50 uppercase">Sistema Online</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {stats.statsPorSetor?.map((setor: any) => (
                                <div key={setor.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3 text-sm font-black text-slate-700 uppercase uppercase">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: setor.cor }}></div>
                                            {setor.nome}
                                        </div>
                                        <div className="text-right flex gap-4">
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 block uppercase">Aguardando</span>
                                                <span className="font-black text-slate-900 leading-none">{setor.aguardando}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 block uppercase">Atendidos</span>
                                                <span className="font-black text-blue-600 leading-none">{setor.atendidos}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border">
                                        <div
                                            className="h-full transition-all duration-1000 ease-out shadow-inner"
                                            style={{
                                                width: `${Math.min((setor.aguardando / 10) * 100, 100)}%`,
                                                backgroundColor: setor.cor
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="border-b p-6">
                        <CardTitle className="text-xl font-black uppercase flex items-center gap-3 uppercase">
                            <Activity className="w-6 h-6 text-emerald-600" />
                            Status do Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                            <SystemStatusItem
                                icon={Server}
                                label="API Backend (NestJS)"
                                status={stats?.systemHealth?.api || 'Conectando...'}
                                color={stats?.systemHealth?.api === 'Ativa' ? 'emerald' : 'blue'}
                            />
                            <SystemStatusItem
                                icon={Monitor}
                                label="Painel de Chamadas (TV)"
                                status={stats?.systemHealth?.tv || 'Aguardando'}
                                color={stats?.systemHealth?.tv === 'Operacional' ? 'emerald' : (stats?.systemHealth?.tv === 'Ocioso' ? 'amber' : 'slate')}
                            />
                            <SystemStatusItem
                                icon={Printer}
                                label="Totem de Autoatendimento"
                                status={stats?.systemHealth?.totem || 'Aguardando'}
                                color={stats?.systemHealth?.totem === 'Operacional' ? 'emerald' : (stats?.systemHealth?.totem === 'Ocioso' ? 'amber' : 'slate')}
                            />
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-black text-slate-700 uppercase mb-1">Legenda de Status</p>
                                    <div className="text-[10px] text-slate-600 font-bold space-y-1">
                                        <p>• <span className="text-emerald-600">Operacional</span>: Ativo nas últimas horas</p>
                                        <p>• <span className="text-amber-600">Ocioso</span>: Sem atividade recente</p>
                                        <p>• <span className="text-slate-500">Aguardando</span>: Nunca utilizado</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-black uppercase flex items-center gap-3 uppercase">
                            <Activity className="w-6 h-6 text-blue-600" />
                            Operacional (Logs)
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs font-bold border-orange-200 text-orange-600 hover:bg-orange-50 uppercase"
                                onClick={async () => {
                                    if (confirm('🗑️ Deseja limpar TODOS os logs operacionais?\n\nEsta ação não pode ser desfeita!')) {
                                        try {
                                            const result = await limparLogs();
                                            if (result.success) {
                                                toast.success(`${result.count} logs removidos!`, {
                                                    description: "Histórico de logs limpo com sucesso."
                                                });
                                                // Aguarda o toast aparecer antes de recarregar
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 1500);
                                            } else {
                                                toast.error("Erro ao limpar logs.");
                                            }
                                        } catch (error) {
                                            console.error("Erro ao limpar logs:", error);
                                            toast.error("Erro ao limpar logs. Verifique a conexão.");
                                        }
                                    }
                                }}
                            >
                                Limpar Logs
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs font-bold border-red-200 text-red-600 hover:bg-red-50 uppercase"
                                onClick={async () => {
                                    if (confirm('⚠️ ATENÇÃO: Isso vai LIMPAR:\n\n• Todos os pacientes na fila\n• Todas as chamadas da TV\n• Todos os médicos cadastrados\n• Todas as sessões ativas\n\n✅ Logs operacionais serão PRESERVADOS\n\nDeseja resetar o banco de dados?')) {
                                        try {
                                            await resetarBancoDeDados();
                                            toast.success("Banco de dados resetado!", {
                                                description: "Logs preservados para rastreabilidade."
                                            });
                                            // Aguarda o toast aparecer antes de recarregar
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 1500);
                                        } catch (error) {
                                            console.error("Erro ao resetar banco:", error);
                                            toast.error("Erro ao resetar banco de dados. Verifique a conexão.");
                                        }
                                    }
                                }}
                            >
                                Resetar Banco
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                        {!stats.logs || stats.logs.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 font-black uppercase italic tracking-widest text-sm">
                                Nenhuma atividade recente
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {stats.logs.map((log: any) => (
                                    <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge variant="outline" className={`text-[10px] font-black uppercase border mb-1 ${log.tipo === 'ERROR' ? 'text-red-600 border-red-200 bg-red-50' :
                                                log.tipo === 'WARN' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                                                    'text-blue-600 border-blue-200 bg-blue-50'
                                                }`}>
                                                {log.tipo}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 uppercase leading-snug">
                                            {log.mensagem}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b p-6">
                        <CardTitle className="text-xl font-black uppercase flex items-center gap-3 uppercase">
                            <Users className="w-6 h-6 text-indigo-600" />
                            Alocações Ativas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!stats.sessoesAtivas || stats.sessoesAtivas.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 font-black uppercase italic tracking-widest text-sm">
                                Nenhum médico conectado
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stats.sessoesAtivas.map((sessao: any) => (
                                    <div key={sessao.id} className="flex items-center gap-3 p-3 bg-white border-2 border-slate-100 rounded-xl shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                            {sessao.medico_nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase truncate max-w-[120px]" title={`DR(A). ${sessao.medico_nome}`}>
                                                DR(A). {sessao.medico_nome}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                SALA {sessao.sala} • {sessao.setor}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon: Icon, color, trend, trendUp }: any) => {
    const colorClasses: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100"
    };

    return (
        <Card className="border-2 shadow-sm rounded-2xl hover:translate-y-[-4px] transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl border-2 ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${trendUp ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {trend}
                    </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 leading-none">{value}</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2 uppercase">{title}</p>
            </CardContent>
        </Card>
    );
};

const SystemStatusItem = ({ label, status, color, icon: Icon }: any) => {
    const colorClasses: any = {
        emerald: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
        amber: { dot: 'bg-amber-500', text: 'text-amber-600' },
        slate: { dot: 'bg-slate-400', text: 'text-slate-500' },
        blue: { dot: 'bg-blue-500', text: 'text-blue-600' }
    };

    const colors = colorClasses[color] || colorClasses.slate;

    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-5 h-5 text-slate-400" />}
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider uppercase">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${colors.dot} ${color === 'emerald' ? 'animate-pulse' : ''}`}></div>
                <span className={`text-[10px] font-black uppercase ${colors.text} uppercase`}>{status}</span>
            </div>
        </div>
    );
};
