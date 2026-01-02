'use client';

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
    LogOut,
    Settings
} from 'lucide-react';
import { toast } from "sonner";
import {
    obterFilaMedico,
    chamarPaciente,
    iniciarAtendimento,
    finalizarAtendimento,
    obterEstatisticasFila,
    registrarSessao,
    removerSessao,
    type PacienteFila
} from '@/services/filaService';
import { useTotem, mockSetores, Medico, Setor } from '@/contexts/TotemContext';

interface InterfaceMedicoProps {
    medico: Medico;
    onLogout: () => void;
}

export const InterfaceMedico: React.FC<InterfaceMedicoProps> = ({ medico, onLogout }) => {
    const { state, dispatch } = useTotem();
    const [fila, setFila] = useState<PacienteFila[]>([]);
    const [estatisticas, setEstatisticas] = useState<any>(null);
    const [salaSelecionada, setSalaSelecionada] = useState<string>('');
    const [setorSelecionado, setSetorSelecionado] = useState<Setor | null>(null);
    const [configurandoSala, setConfigurandoSala] = useState<boolean>(false);

    useEffect(() => {
        if (state.medicoSessao?.medico?.id === medico.id) {
            setSalaSelecionada(state.medicoSessao.sala || '');
            setSetorSelecionado(state.medicoSessao.setor || null);
            if (!state.medicoSessao.sala) setConfigurandoSala(true);
        } else {
            setConfigurandoSala(true);
        }
    }, [state.medicoSessao, medico.id]);

    useEffect(() => {
        const atualizarDados = async () => {
            try {
                const pacientesFila = await obterFilaMedico(medico.id);
                setFila([...pacientesFila]);
                const stats = await obterEstatisticasFila(medico.id);
                setEstatisticas(stats);
            } catch (error) {
                console.error('Erro ao atualizar dados:', error);
            }
        };

        const heartbeat = async () => {
            if (salaSelecionada && setorSelecionado) {
                try {
                    await registrarSessao({
                        medico_id: medico.id,
                        medico_nome: medico.nome,
                        sala: salaSelecionada,
                        setor: setorSelecionado.nome
                    });
                } catch (e) {
                    console.error("Erro no heartbeat da sessão:", e);
                }
            }
        };

        atualizarDados();
        const interval = setInterval(atualizarDados, 5000);
        // Heartbeat a cada 15 segundos para manter alocação ativa
        const hbInterval = setInterval(heartbeat, 15000);

        return () => {
            clearInterval(interval);
            clearInterval(hbInterval);
        };
    }, [medico.id, salaSelecionada, setorSelecionado]);

    const handleSelecionarSala = (sala: string, setor: Setor) => {
        setSalaSelecionada(sala);
        setSetorSelecionado(setor);
        setConfigurandoSala(false);
        dispatch({
            type: 'SET_MEDICO_SESSAO',
            payload: { medico, sala, setor }
        });

        // Registra sessão no backend
        registrarSessao({
            medico_id: medico.id,
            medico_nome: medico.nome,
            sala: sala,
            setor: setor.nome
        }).catch(err => console.error("Erro ao registrar sessão", err));
    };

    const handleChamarPaciente = async (pacienteId: string) => {
        try {
            if (await chamarPaciente(pacienteId, salaSelecionada)) {
                toast.success("Paciente Chamado", {
                    description: "A chamada foi enviada para o painel da TV."
                });
            } else {
                toast.error("Erro ao Chamar");
            }
        } catch (error) {
            console.error("Erro na chamada:", error);
            toast.error("Erro Crítico", { description: "Falha na comunicação com o servidor." });
        }
    };

    const handleIniciarAtendimento = async (pacienteId: string) => {
        if (await iniciarAtendimento(pacienteId)) {
            const pacientesFila = await obterFilaMedico(medico.id);
            setFila([...pacientesFila]);
            toast.success("Atendimento Iniciado");
        }
    };

    const handleFinalizarAtendimento = async (pacienteId: string) => {
        if (await finalizarAtendimento(pacienteId)) {
            const pacientesFila = await obterFilaMedico(medico.id);
            setFila([...pacientesFila]);
            toast.success("Atendimento Finalizado");
        }
    };

    const getStatusColor = (status: string) => {
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

    const handleLogout = async () => {
        try {
            // Remove a sessão do backend para sair imediatamente da lista de Alocações Ativas
            await removerSessao(medico.id);
        } catch (error) {
            console.error('Erro ao remover sessão:', error);
        } finally {
            // Faz logout mesmo se houver erro ao remover sessão
            onLogout();
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
                                        className="font-black border-2 h-16 text-lg hover:bg-slate-50 uppercase"
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
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
            {/* Header Section */}
            <Card className="border-none shadow-sm bg-white rounded-xl overflow-visible">
                <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <User className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">
                                DR(A). {medico.nome}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-none font-bold rounded-lg px-2.5 py-0.5 text-xs uppercase tracking-wide">
                                    {medico.especialidade}
                                </Badge>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                    CRM: {medico.crm}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto flex items-center gap-3">
                        {setorSelecionado ? (
                            <div className="relative group">
                                <div
                                    className="flex items-center justify-between gap-6 px-5 py-2.5 bg-white rounded-xl border-2 shadow-sm transition-all"
                                    style={{ borderColor: setorSelecionado.cor }}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Vínculo Atual</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-black text-gray-800 uppercase leading-none">
                                                SALA {salaSelecionada}
                                            </span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: setorSelecionado.cor }} />
                                                <span className="text-sm font-black text-gray-700 uppercase leading-none mt-0.5">
                                                    {setorSelecionado.nome}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setConfigurandoSala(true)}
                                        className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg -mr-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setConfigurandoSala(true)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold uppercase shadow-sm"
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Selecionar Sala
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="bg-slate-100 border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 h-[52px] w-[52px] rounded-xl shadow-sm transition-all"
                            title="Sair do Sistema"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            {estatisticas && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total na Fila */}
                    <Card className="border shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow border-blue-100">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-[0.7rem] font-black text-blue-500 uppercase tracking-wider mb-1">Total na Fila</p>
                                <p className="text-3xl font-black text-blue-900 leading-none">{estatisticas.total}</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                                <Users className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Aguardando */}
                    <Card className="border shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow border-yellow-100">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-[0.7rem] font-black text-yellow-600 uppercase tracking-wider mb-1">Aguardando</p>
                                <p className="text-3xl font-black text-yellow-700 leading-none">{estatisticas.aguardando}</p>
                            </div>
                            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                                <Clock className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3: Em Atendimento */}
                    <Card className="border shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow border-green-100">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-[0.7rem] font-black text-green-600 uppercase tracking-wider mb-1">Em Atendimento</p>
                                <p className="text-3xl font-black text-green-700 leading-none">{estatisticas.emAtendimento}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <Activity className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 4: Finalizados */}
                    <Card className="border shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                        <CardContent className="p-5 flex items-start justify-between">
                            <div>
                                <p className="text-[0.7rem] font-black text-slate-400 uppercase tracking-wider mb-1">Finalizados</p>
                                <p className="text-3xl font-black text-slate-600 leading-none">{estatisticas.atendidos}</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Patient List */}
            <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Lista de Pacientes para Atendimento</h2>
                        <p className="text-xs text-gray-500 font-bold mt-1">Ordem baseada em prioridade legal e horário de chegada</p>
                    </div>
                    <div className="px-4 py-1.5 bg-blue-50 rounded-full text-blue-600 text-xs font-black border border-blue-100 shadow-sm uppercase">
                        {new Date().toLocaleDateString('pt-BR')}
                    </div>
                </div>

                <div className="flex-1">
                    {fila.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center select-none">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <User className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-black text-slate-300 uppercase mb-2">Nenhum paciente aguardando</h3>
                            <p className="text-sm text-slate-300 font-medium max-w-xs mx-auto">
                                Assim que um paciente fizer o check-in no totem, ele aparecerá aqui.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {fila.map((paciente, index) => (
                                <div
                                    key={paciente.id}
                                    className={`flex items-center justify-between p-6 transition-all ${paciente.status === 'em_atendimento' ? 'bg-green-50/30' :
                                        paciente.status === 'chamando' ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center justify-center w-12 h-12 bg-white border-2 border-slate-100 text-slate-400 rounded-xl font-black text-lg shadow-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-black text-gray-900 leading-none uppercase">
                                                    {paciente.senha.numero}
                                                </span>
                                                <Badge className={`${getPrioridadeColor(paciente.prioridade.nivel)} uppercase border-none px-2.5 py-0.5 text-[0.65rem]`}>
                                                    {paciente.prioridade.descricao}
                                                </Badge>
                                            </div>
                                            <div className="font-bold text-gray-700 mt-1 uppercase text-sm">
                                                {paciente.consulta.paciente.nome}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 font-black mt-1">
                                                <Clock className="w-3 h-3" />
                                                CHEGADA: {new Date(paciente.horarioChegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge className={`${getStatusColor(paciente.status)} font-black uppercase px-3 py-1 border shadow-sm text-xs`}>
                                            {paciente.status === 'aguardando' && 'Em Espera'}
                                            {paciente.status === 'chamando' && 'Chamado'}
                                            {paciente.status === 'em_atendimento' && 'Em Atendimento'}
                                            {paciente.status === 'atendido' && 'Finalizado'}
                                        </Badge>

                                        {paciente.status === 'aguardando' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleChamarPaciente(paciente.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase px-6 h-10 rounded-lg shadow-sm text-xs"
                                                disabled={!salaSelecionada}
                                            >
                                                <Phone className="w-3.5 h-3.5 mr-2" />
                                                Chamar
                                            </Button>
                                        )}

                                        {paciente.status === 'chamando' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleChamarPaciente(paciente.id)}
                                                    variant="outline"
                                                    className="font-black px-4 h-10 rounded-lg border-2 uppercase text-xs"
                                                >
                                                    Novamente
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleIniciarAtendimento(paciente.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase px-6 h-10 rounded-lg shadow-sm text-xs"
                                                >
                                                    Iniciar
                                                </Button>
                                            </div>
                                        )}

                                        {paciente.status === 'em_atendimento' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleFinalizarAtendimento(paciente.id)}
                                                className="bg-slate-800 hover:bg-slate-900 text-white font-black uppercase px-6 h-10 rounded-lg shadow-sm text-xs"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5 mr-2" />
                                                Finalizar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {!salaSelecionada && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                    <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-4 border-white">
                        <AlertCircle className="h-6 w-6" />
                        <div className="font-bold uppercase text-sm">
                            Configure sua sala para começar
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
