'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    Plus,
    Trash2,
    User,
    CreditCard,
    Stethoscope,
    MapPin,
    Search,
    ArrowLeft,
    CheckCircle2,
    Clock,
    AlertCircle,
    Server
} from 'lucide-react';
import { sigsService, AgendamentoSIGS } from '@/services/sigsService';
import { obterMedicos } from '@/services/filaService';
import { toast } from "sonner";
import Link from 'next/link';

export const SigsManager: React.FC = () => {
    const [agendamentos, setAgendamentos] = useState<AgendamentoSIGS[]>([]);
    const [medicos, setMedicos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        cpf: '',
        nome_paciente: '',
        medico_id: '',
        medico_nome: '',
        medico_especialidade: '',
        setor_nome: '',
        horario: '',
        data_agendamento: new Date().toISOString().split('T')[0]
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [agendamentosData, medicosData] = await Promise.all([
                sigsService.getAll(),
                obterMedicos()
            ]);
            setAgendamentos(agendamentosData);
            setMedicos(medicosData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar banco de dados');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const handleSelectMedico = (id: string) => {
        const medico = medicos.find(m => m.id === id);
        if (medico) {
            setFormData({
                ...formData,
                medico_id: medico.id,
                medico_nome: medico.nome,
                medico_especialidade: medico.especialidade
            });
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.medico_id) {
            toast.error('Selecione um médico real para vincular ao agendamento');
            return;
        }

        try {
            await sigsService.create(formData);
            toast.success('Agendamento vinculado ao médico real criado');
            setIsAdding(false);
            setFormData({
                cpf: '',
                nome_paciente: '',
                medico_id: '',
                medico_nome: '',
                medico_especialidade: '',
                setor_nome: '',
                horario: '',
                data_agendamento: new Date().toISOString().split('T')[0]
            });
            carregarDados();
        } catch (error) {
            toast.error('Erro ao criar agendamento');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Deseja excluir este agendamento simulado?')) {
            try {
                await sigsService.delete(id);
                toast.success('Agendamento removido');
                carregarDados();
            } catch (error) {
                toast.error('Erro ao remover agendamento');
            }
        }
    };

    const filteredAgendamentos = agendamentos.filter(a =>
        a.nome_paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.cpf.includes(searchTerm)
    );

    return (
        <div className="h-full w-full bg-slate-100 p-6 space-y-6 overflow-y-auto min-h-screen pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-slate-200">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase">Simulador de Banco SIGS</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mt-1">Gerenciamento de Agendamentos Externos (Mock)</p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`font-black uppercase gap-2 shadow-lg transition-all ${isAdding ? 'bg-slate-600 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isAdding ? <ArrowLeft className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isAdding ? 'Voltar para Lista' : 'Novo Agendamento'}
                </Button>
            </div>

            {isAdding ? (
                <Card className="border-2 shadow-xl rounded-2xl overflow-hidden max-w-2xl mx-auto">
                    <CardHeader className="bg-white border-b p-6">
                        <CardTitle className="text-xl font-black uppercase flex items-center gap-3">
                            <Plus className="w-6 h-6 text-blue-600" />
                            Cadastrar Agendamento Simulado
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                                        <CreditCard className="w-3 h-3" /> CPF do Paciente
                                    </label>
                                    <Input
                                        required
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                        className="font-bold border-2 focus:ring-blue-500 h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                                        <User className="w-3 h-3" /> Nome Completo
                                    </label>
                                    <Input
                                        required
                                        placeholder="Nome do Paciente"
                                        value={formData.nome_paciente}
                                        onChange={e => setFormData({ ...formData, nome_paciente: e.target.value })}
                                        className="font-bold border-2 focus:ring-blue-500 h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                                        <Stethoscope className="w-3 h-3" /> Selecionar Médico Real
                                    </label>
                                    <Select onValueChange={handleSelectMedico} value={formData.medico_id}>
                                        <SelectTrigger className="font-bold border-2 focus:ring-blue-500 h-12">
                                            <SelectValue placeholder="Escolha um médico cadastrado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {medicos.map((medico) => (
                                                <SelectItem key={medico.id} value={medico.id}>
                                                    {medico.nome} ({medico.especialidade})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> Setor / Bloco
                                    </label>
                                    <Select
                                        onValueChange={(val) => setFormData({ ...formData, setor_nome: val })}
                                        value={formData.setor_nome}
                                    >
                                        <SelectTrigger className="font-bold border-2 focus:ring-blue-500 h-12">
                                            <SelectValue placeholder="Escolha o setor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Setor Verde">Setor Verde</SelectItem>
                                            <SelectItem value="Setor Amarelo">Setor Amarelo</SelectItem>
                                            <SelectItem value="Setor Azul">Setor Azul</SelectItem>
                                            <SelectItem value="Setor Violeta">Setor Violeta</SelectItem>
                                            <SelectItem value="Setor Laranja">Setor Laranja</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Data
                                    </label>
                                    <Input
                                        type="date"
                                        required
                                        value={formData.data_agendamento}
                                        onChange={e => setFormData({ ...formData, data_agendamento: e.target.value })}
                                        className="font-bold border-2 focus:ring-blue-500 h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> Horário
                                    </label>
                                    <Input
                                        required
                                        placeholder="08:30"
                                        value={formData.horario}
                                        onChange={e => setFormData({ ...formData, horario: e.target.value })}
                                        className="font-bold border-2 focus:ring-blue-500 h-12"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-black uppercase shadow-lg shadow-emerald-200">
                                Salvar Agendamento no SIGS
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder="PESQUISAR POR NOME OU CPF NO BANCO SIGS..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-12 h-16 border-2 shadow-sm rounded-2xl font-black text-lg focus:ring-blue-500 uppercase tracking-widest"
                        />
                    </div>

                    <Card className="border-2 shadow-sm rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50 border-b p-6">
                            <CardTitle className="text-xl font-black uppercase flex items-center gap-3">
                                <ServerIcon className="w-6 h-6 text-slate-600" />
                                Registros Atuais no SIGS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400 font-black animate-pulse uppercase tracking-[0.2em]">Carregando registros...</div>
                            ) : filteredAgendamentos.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-bold uppercase italic tracking-widest text-sm flex flex-col items-center gap-4">
                                    <AlertCircle className="w-12 h-12 text-slate-300" />
                                    <span>Nenhum agendamento encontrado no banco simulado</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Paciente</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Atendimento</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-center">Status SIGS</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAgendamentos.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-6 py-6 border-b">
                                                        <div className="font-black text-slate-900 uppercase text-base">{item.nome_paciente}</div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mt-1">
                                                            <CreditCard className="w-3 h-3" /> CPF: {item.cpf}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 border-b">
                                                        <div className="font-black text-slate-700 uppercase text-sm">DR(A). {item.medico_nome}</div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mt-1">
                                                            <MapPin className="w-3 h-3" /> {item.setor_nome} • {item.horario}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 border-b text-center">
                                                        {item.check_in ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase font-black px-3 py-1">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Compareceu
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-slate-400 border-slate-200 uppercase font-black px-3 py-1">
                                                                <Clock className="w-3 h-3 mr-1" /> Aguardando
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-6 border-b text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

const ServerIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
);
