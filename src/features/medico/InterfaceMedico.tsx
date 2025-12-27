import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Users,
  Activity,
  MapPin,
  Wifi,
  WifiOff,
  Settings
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  obterFilaMedico,
  chamarPaciente,
  iniciarAtendimento,
  finalizarAtendimento,
  obterEstatisticasFila,
  type PacienteFila
} from '@/services/filaService';
import { useTotem, mockSetores, Medico, Setor } from '@/contexts/TotemContext';

interface InterfaceMedicoProps {
  medico: Medico;
}

export const InterfaceMedico: React.FC<InterfaceMedicoProps> = ({ medico }) => {
  const { state, dispatch } = useTotem();
  const { toast } = useToast();
  const [fila, setFila] = useState<PacienteFila[]>([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [salaSelecionada, setSalaSelecionada] = useState<string>('');
  const [setorSelecionado, setSetorSelecionado] = useState<Setor | null>(null);
  const [configurandoSala, setConfigurandoSala] = useState<boolean>(false);

  // Sincroniza com contexto global
  useEffect(() => {
    if (state.medicoSessao.medico?.id === medico.id) {
      setSalaSelecionada(state.medicoSessao.sala || '');
      setSetorSelecionado(state.medicoSessao.setor || null);
    } else {
      // Se não tem sala, abre configuração
      setConfigurandoSala(true);
    }
  }, [state.medicoSessao, medico.id]);

  // Atualiza dados a cada 2 segundos para dar sensação de real-time (RF08)
  useEffect(() => {
    const atualizarDados = async () => {
      const pacientesFila = await obterFilaMedico(medico.id);
      setFila([...pacientesFila]);

      const stats = await obterEstatisticasFila(medico.id);
      setEstatisticas(stats);
    };

    atualizarDados();
    const interval = setInterval(atualizarDados, 5000); // Polling moderado

    return () => clearInterval(interval);
  }, [medico.id]);

  const handleSelecionarSala = (sala: string, setor: Setor) => {
    setSalaSelecionada(sala);
    setSetorSelecionado(setor);
    setConfigurandoSala(false);
    dispatch({
      type: 'SET_MEDICO_SESSAO',
      payload: { medico, sala, setor }
    });
  };

  const handleChamarPaciente = async (pacienteId: string) => {
    try {
      if (await chamarPaciente(pacienteId, salaSelecionada)) {
        const pacientesFila = await obterFilaMedico(medico.id);
        setFila([...pacientesFila]);
        toast({
          title: "Paciente Chamado",
          description: "A chamada foi enviada para o painel da TV.",
        });
      } else {
        toast({
          title: "Erro ao Chamar",
          description: "Verifique a conexão ou se as tabelas do banco foram criadas corretamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro na chamada:", error);
      toast({
        title: "Erro Crítico",
        description: "Falha na comunicação com o Supabase.",
        variant: "destructive",
      });
    }
  };

  const handleIniciarAtendimento = async (pacienteId: string) => {
    if (await iniciarAtendimento(pacienteId)) {
      const pacientesFila = await obterFilaMedico(medico.id);
      setFila([...pacientesFila]);
    }
  };

  const handleFinalizarAtendimento = async (pacienteId: string) => {
    if (await finalizarAtendimento(pacienteId)) {
      const pacientesFila = await obterFilaMedico(medico.id);
      setFila([...pacientesFila]);
    }
  };

  const getStatusColor = (status: PacienteFila['status']) => {
    switch (status) {
      case 'aguardando': return 'bg-yellow-100 text-yellow-800';
      case 'chamando': return 'bg-blue-100 text-blue-800';
      case 'em_atendimento': return 'bg-green-100 text-green-800';
      case 'atendido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (nivel: number) => {
    switch (nivel) {
      case 1: return 'bg-red-500 text-white font-black';
      case 2: return 'bg-orange-500 text-white font-black';
      case 3: return 'bg-blue-500 text-white font-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (configurandoSala) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-slate-50 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-gray-900 uppercase">Configuração de Sala</h1>
          <p className="text-xl text-gray-600">Selecione onde você atenderá hoje, Dr(a). {medico.nome}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {mockSetores.map(setor => (
            <Card key={setor.id} className="border-4 overflow-hidden shadow-lg" style={{ borderColor: setor.cor }}>
              <CardHeader className="p-4" style={{ backgroundColor: `${setor.cor}15` }}>
                <CardTitle className="text-xl font-black flex items-center justify-between uppercase">
                  {setor.nome}
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: setor.cor }}></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-3">
                {setor.salas.map(sala => (
                  <Button
                    key={sala}
                    variant="outline"
                    className="font-black border-2 h-16 text-lg hover:bg-slate-50"
                    onClick={() => handleSelecionarSala(sala, setor)}
                  >
                    SALA {sala}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header com informações do médico */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md border-2 border-slate-200">
        <div className="flex items-center gap-6">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase">Dr(a). {medico.nome}</h1>
            <div className="flex items-center gap-3 text-gray-600 mt-1">
              <Badge variant="secondary" className="font-black text-blue-700 bg-blue-50 border border-blue-100 uppercase">
                {medico.especialidade}
              </Badge>
              <span className="font-bold text-sm bg-slate-100 px-2 py-0.5 rounded">CRM: {medico.crm}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {setorSelecionado && (
            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border-4 shadow-sm" style={{ borderColor: setorSelecionado.cor }}>
              <div className="flex flex-col items-center">
                <span className="text-[0.6rem] font-black text-gray-400 uppercase leading-none">Vínculo Atual</span>
                <span className="font-black text-xl text-gray-800">
                  SALA {salaSelecionada}
                </span>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: setorSelecionado.cor }}></div>
                <span className="font-black text-gray-700 uppercase">{setorSelecionado.nome}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-100 text-gray-400"
                onClick={() => setConfigurandoSala(true)}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-blue-400 uppercase">Total na Fila</p>
                  <p className="text-3xl font-black text-blue-700">{estatisticas.total}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-yellow-500 uppercase">Aguardando</p>
                  <p className="text-3xl font-black text-yellow-600">{estatisticas.aguardando}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-green-500 uppercase">Em Atendimento</p>
                  <p className="text-3xl font-black text-green-600">{estatisticas.emAtendimento}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase">Finalizados</p>
                  <p className="text-3xl font-black text-slate-600">{estatisticas.atendidos}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-slate-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de pacientes */}
      <Card className="border-2 border-slate-200 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black text-gray-900 uppercase">Lista de Pacientes para Atendimento</CardTitle>
            <p className="text-sm text-slate-500 font-bold mt-1">Ordem baseada em prioridade legal e horário de chegada</p>
          </div>
          <Badge variant="outline" className="font-black px-4 py-1 text-blue-600 border-2 border-blue-100 uppercase">
            {new Date().toLocaleDateString('pt-BR')}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {fila.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 opacity-30" />
              </div>
              <p className="text-xl font-black uppercase opacity-40">Nenhum paciente aguardando</p>
              <p className="font-bold opacity-30 mt-2">Assim que um paciente fizer o check-in no totem, ele aparecerá aqui.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fila.map((paciente, index) => (
                <div
                  key={paciente.id}
                  className={`flex items-center justify-between p-6 transition-all ${paciente.status === 'em_atendimento' ? 'bg-green-50/50' :
                    paciente.status === 'chamando' ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-14 h-14 bg-white border-4 border-slate-100 text-slate-400 rounded-2xl font-black text-xl shadow-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-gray-900">
                          {paciente.senha.numero}
                        </span>
                        <Badge
                          className={`${getPrioridadeColor(paciente.prioridade.nivel)} uppercase border-none px-3 py-0.5`}
                        >
                          {paciente.prioridade.descricao}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-gray-700 mt-1 uppercase">
                        {paciente.consulta.paciente.nome}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 font-black mt-1">
                        <Clock className="w-4 h-4" />
                        CHEGADA: {new Date(paciente.horarioChegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(paciente.status)} font-black uppercase px-4 py-2 border-2 shadow-sm`}>
                      {paciente.status === 'aguardando' && 'Em Espera'}
                      {paciente.status === 'chamando' && 'Chamado (Painel)'}
                      {paciente.status === 'em_atendimento' && 'Em Atendimento'}
                      {paciente.status === 'atendido' && 'Finalizado'}
                    </Badge>

                    {paciente.status === 'aguardando' && (
                      <Button
                        size="lg"
                        onClick={() => handleChamarPaciente(paciente.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase h-14 px-8 rounded-xl shadow-lg border-b-4 border-blue-800"
                        disabled={!salaSelecionada}
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        Chamar no Painel
                      </Button>
                    )}

                    {paciente.status === 'chamando' && (
                      <div className="flex gap-2">
                        <Button
                          size="lg"
                          onClick={() => handleChamarPaciente(paciente.id)}
                          variant="outline"
                          className="font-black h-14 px-4 rounded-xl border-2"
                        >
                          Novamente
                        </Button>
                        <Button
                          size="lg"
                          variant="default"
                          onClick={() => handleIniciarAtendimento(paciente.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase h-14 px-8 rounded-xl shadow-lg border-b-4 border-emerald-800"
                        >
                          <Activity className="w-5 h-5 mr-3" />
                          Iniciar Atendimento
                        </Button>
                      </div>
                    )}

                    {paciente.status === 'em_atendimento' && (
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => handleFinalizarAtendimento(paciente.id)}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-black uppercase h-14 px-8 rounded-xl shadow-lg border-b-4 border-slate-950"
                      >
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Finalizar Consulta
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!salaSelecionada && (
        <Alert className="bg-red-50 border-red-200 text-red-800 border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-bold text-lg">
            Você ainda não vinculou sua sala! Os pacientes não poderão ser chamados até que você selecione uma sala de atendimento.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
