import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  AlertCircle,
  History,
  FileText,
  Search
} from 'lucide-react';
import { useTotem, mockSetores } from '@/contexts/TotemContext';
import { obterEstatisticasCompletas, resetarBancoDeDados } from '@/services/filaService';

export const PainelAdministrativo: React.FC = () => {
  const { state } = useTotem();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const atualizarStats = async () => {
      const data = await obterEstatisticasCompletas();
      if (data) setStats(data);
    };

    atualizarStats();
    const interval = setInterval(atualizarStats, 5000); // Atualização mais rápida para gestão em tempo real
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="p-20 text-center font-black animate-bounce text-blue-600">CARREGANDO INTELIGÊNCIA NGA...</div>;

  return (
    <div className="h-full w-full bg-slate-50 p-6 space-y-6 overflow-y-auto pb-20">
      {/* Header com Titulo e Filtro Temporal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Gestão & Performance NGA</h1>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mt-1">Console Administrativo Centralizado</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border-2 border-slate-200">
          <Badge className="bg-blue-600 px-4 py-2 cursor-pointer font-black uppercase">Hoje</Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer font-bold uppercase opacity-50 border-transparent">Semana</Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer font-bold uppercase opacity-50 border-transparent">Mês</Badge>
        </div>
      </div>

      {/* KPIs Principais Dinâmicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Fluxo Total de Senhas"
          value={stats.total}
          icon={Users}
          color="blue"
          trend="+12% que ontem"
          trendUp={true}
        />
        <KPICard
          title="T.M.E. (Espera Real)"
          value={stats.tempoMedioEspera}
          icon={Clock}
          color="amber"
          trend="-2 min que a média"
          trendUp={false}
        />
        <KPICard
          title="Taxa de Atendimento"
          value={stats.taxaEficiencia}
          icon={CheckCircle}
          color="emerald"
          trend="+5% que ontem"
          trendUp={true}
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
        {/* Distribuição por Setor Real */}
        <Card className="lg:col-span-2 border-2 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-black uppercase flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Ocupação de Salas de Espera por Setor
              </CardTitle>
              <Badge variant="outline" className="font-bold border-2 animate-pulse text-emerald-600 border-emerald-200 bg-emerald-50">SISTEMA ONLINE</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {stats.statsPorSetor.map((setor: any) => (
                <div key={setor.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 text-sm font-black text-slate-700 uppercase">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: setor.cor }}></div>
                      {setor.nome}
                    </div>
                    <div className="text-right flex gap-4">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block uppercase">Aguardando</span>
                        <span className="font-black text-slate-900">{setor.aguardando}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block uppercase">Atendidos</span>
                        <span className="font-black text-blue-600">{setor.atendidos}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border">
                    <div
                      className="h-full transition-all duration-1000 ease-out shadow-inner"
                      style={{
                        width: `${Math.min((setor.aguardando / 10) * 100, 100)}%`, // Simulação de 10 como limite por setor
                        backgroundColor: setor.cor
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status da Rede / Wayfinding Systems */}
        <Card className="border-2 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b p-6">
            <CardTitle className="text-xl font-black uppercase flex items-center gap-3">
              <Activity className="w-6 h-6 text-emerald-600" />
              Wayfinding & IOT
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <SystemStatusItem label="Painéis de TV" status="Operacional" color="emerald" />
              <SystemStatusItem label="Emissores de Som" status="Operacional" color="emerald" />
              <SystemStatusItem label="WebSockets (Real-time)" status="12ms Latência" color="emerald" />
              <SystemStatusItem label="Impressoras" status="Alerta: Papel Baixo" color="amber" />
              <SystemStatusItem label="Sensores Digitais" status="Operacional" color="emerald" />
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border-2 border-blue-100 border-dashed">
              <div className="flex items-center gap-3 text-blue-700 font-black uppercase text-xs mb-2">
                <AlertCircle className="w-4 h-4" />
                Fallback de Lotação
              </div>
              <p className="text-[10px] text-blue-900 font-bold leading-relaxed uppercase">
                O sistema redirecionará automaticamente novos pacientes para a sala de espera principal se um setor atingir 100% (RF12).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registro de Auditoria e Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black uppercase flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              Painel Operacional (Real-time)
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold border-red-200 text-red-600 hover:bg-red-50"
                onClick={async () => {
                  if (confirm('Deseja limpar TODO o banco de dados remoto (Supabase)?')) {
                    await resetarBancoDeDados();
                    window.location.reload();
                  }
                }}
              >
                LIMPAR BANCO (SUPABASE)
              </Button>
              <Search className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[400px] overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {state.filaPacientes.slice().reverse().map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${item.status === 'chamado' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <FileText className={`w-4 h-4 ${item.status === 'chamado' ? 'text-blue-600' : 'text-slate-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-slate-800 uppercase">Evento: {item.status === 'chamado' ? 'Chamada no Painel' : 'Emissão de Senha'}</span>
                      <span className="text-[10px] font-bold text-slate-400">{new Date(item.horarioChegada).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Senha <span className="font-bold text-slate-700">{item.senha.numero}</span> ({item.senha.prioridade.descricao})
                      emitida para o setor <span className="font-bold text-slate-700 uppercase">{item.senha.setor.nome}</span>.
                    </p>
                  </div>
                </div>
              ))}
              {state.filaPacientes.length === 0 && (
                <div className="p-12 text-center text-slate-400 font-black uppercase italic tracking-widest text-sm">
                  Nenhum log registrado hoje
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b p-6">
            <CardTitle className="text-xl font-black uppercase flex items-center gap-3">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Alocações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">DR(A).</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">SALA</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.medicoSessao.medico ? (
                  <tr>
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-900 block uppercase">{state.medicoSessao.medico.nome}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{state.medicoSessao.medico.especialidade}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-700">{state.medicoSessao.sala}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-emerald-100 text-emerald-800 border-2 border-emerald-200 text-[10px] font-black uppercase">Online</Badge>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400 font-bold uppercase text-xs">Aguardando login médico</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componentes Auxiliares
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
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        </div>
        <h3 className="text-3xl font-black text-slate-900 leading-none">{value}</h3>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{title}</p>
      </CardContent>
    </Card>
  );
};

const SystemStatusItem = ({ label, status, color }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 animate-pulse`}></div>
      <span className={`text-[10px] font-black uppercase text-${color}-600`}>{status}</span>
    </div>
  </div>
);
