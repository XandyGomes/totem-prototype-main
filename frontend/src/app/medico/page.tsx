'use client';

import { useState } from "react";
import { InterfaceMedico } from "@/features/medico/InterfaceMedico";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Stethoscope, Lock, KeyRound, ArrowRight, Plus, Eye, EyeOff } from "lucide-react";
import { Medico } from "@/contexts/TotemContext";
import { toast } from "sonner";
import { loginMedico, cadastrarMedico } from "@/services/filaService";

export default function PaginaMedico() {
    const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(null);
    const [credenciais, setCredenciais] = useState({ login: '', senha: '' });
    const [isNovoMedicoOpen, setIsNovoMedicoOpen] = useState(false);
    const [novoMedico, setNovoMedico] = useState({ nome: '', crm: '', especialidade: '', login: '', senha: '', confirmarSenha: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Estados para controlar visibilidade das senhas
    const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);
    const [mostrarSenhaCadastro, setMostrarSenhaCadastro] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await loginMedico(credenciais);
            if (data && !data.error) {
                setMedicoSelecionado(data);
                toast.success(`Bem-vindo(a), Dr(a). ${data.nome}`);
            } else {
                toast.error("Credenciais inválidas. Tente novamente.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao conectar ao servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCadastrar = async () => {
        if (!novoMedico.nome || !novoMedico.crm || !novoMedico.login || !novoMedico.senha || !novoMedico.confirmarSenha) {
            toast.error("Preencha todos os campos obrigatórios!");
            return;
        }

        if (novoMedico.senha !== novoMedico.confirmarSenha) {
            toast.error("As senhas não coincidem!");
            return;
        }

        try {
            await cadastrarMedico({
                nome: novoMedico.nome,
                crm: novoMedico.crm,
                especialidade: novoMedico.especialidade,
                login: novoMedico.login,
                senha: novoMedico.senha
            });
            toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
            setIsNovoMedicoOpen(false);
            setNovoMedico({ nome: '', crm: '', especialidade: '', login: '', senha: '', confirmarSenha: '' });
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            toast.error("Erro ao cadastrar. O Login ou CRM pode já estar em uso.");
        }
    };

    if (!medicoSelecionado) {
        return (
            <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-slate-900">
                {/* Background Decorativo */}
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" />
                </div>

                <Card className="w-full max-w-md border-0 shadow-2xl relative bg-white/10 backdrop-blur-xl border-white/10 z-10 text-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    <CardHeader className="text-center pb-8 pt-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3 ring-4 ring-white/10">
                            <Stethoscope className="w-12 h-12 text-white" />
                        </div>
                        <CardTitle className="text-4xl font-black text-white uppercase tracking-tight">
                            Portal do Médico
                        </CardTitle>
                        <p className="text-blue-200 font-bold uppercase text-xs mt-2 tracking-widest">Acesso Restrito ao Corpo Clínico</p>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-blue-100 font-bold uppercase text-xs ml-1">Usuário / Login</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-blue-300" />
                                    <Input
                                        type="text"
                                        value={credenciais.login}
                                        onChange={e => setCredenciais({ ...credenciais, login: e.target.value })}
                                        className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/20 transition-all font-medium"
                                        placeholder="Seu usuário de acesso"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-blue-100 font-bold uppercase text-xs ml-1">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-blue-300" />
                                    <Input
                                        type={mostrarSenhaLogin ? "text" : "password"}
                                        value={credenciais.senha}
                                        onChange={e => setCredenciais({ ...credenciais, senha: e.target.value })}
                                        className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/20 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenhaLogin(!mostrarSenhaLogin)}
                                        className="absolute right-4 top-3.5 text-blue-300 hover:text-blue-100 transition-colors"
                                    >
                                        {mostrarSenhaLogin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-lg tracking-wide rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? 'Entrando...' : 'Acessar Portal'}
                                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                            </Button>
                        </form>

                        <div className="mt-8 flex items-center justify-between text-xs font-bold text-blue-300 uppercase">
                            <button className="hover:text-white transition-colors flex items-center gap-1">
                                <KeyRound className="w-3 h-3" />
                                Recuperar Senha
                            </button>

                            <Dialog open={isNovoMedicoOpen} onOpenChange={setIsNovoMedicoOpen}>
                                <DialogTrigger asChild>
                                    <button className="text-white hover:text-blue-200 transition-colors bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20">
                                        Cadastrar-se
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 text-white border-slate-700">
                                    <DialogHeader>
                                        <DialogTitle>Novo Cadastro Médico</DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Crie suas credenciais de acesso ao sistema NGA.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nome Completo</Label>
                                                <Input className="bg-slate-800 border-slate-700" value={novoMedico.nome} onChange={e => setNovoMedico({ ...novoMedico, nome: e.target.value })} placeholder="Nome e Sobrenome" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Especialidade</Label>
                                                <Input className="bg-slate-800 border-slate-700" value={novoMedico.especialidade} onChange={e => setNovoMedico({ ...novoMedico, especialidade: e.target.value })} placeholder="Ex: Cardiologia" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CRM (com UF)</Label>
                                            <Input className="bg-slate-800 border-slate-700" value={novoMedico.crm} onChange={e => setNovoMedico({ ...novoMedico, crm: e.target.value })} placeholder="123456-SP" />
                                        </div>
                                        <div className="pt-2 border-t border-slate-800 space-y-4">
                                            <div className="space-y-2">
                                                <Label>Usuário (Login)</Label>
                                                <Input className="bg-slate-800 border-slate-700" value={novoMedico.login} onChange={e => setNovoMedico({ ...novoMedico, login: e.target.value })} placeholder="usuario.acesso" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Senha</Label>
                                                    <div className="relative">
                                                        <Input
                                                            className="bg-slate-800 border-slate-700 pr-10"
                                                            type={mostrarSenhaCadastro ? "text" : "password"}
                                                            value={novoMedico.senha}
                                                            onChange={e => setNovoMedico({ ...novoMedico, senha: e.target.value })}
                                                            placeholder="••••••"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setMostrarSenhaCadastro(!mostrarSenhaCadastro)}
                                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                                                        >
                                                            {mostrarSenhaCadastro ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Confirmar Senha</Label>
                                                    <div className="relative">
                                                        <Input
                                                            className="bg-slate-800 border-slate-700 pr-10"
                                                            type={mostrarConfirmarSenha ? "text" : "password"}
                                                            value={novoMedico.confirmarSenha}
                                                            onChange={e => setNovoMedico({ ...novoMedico, confirmarSenha: e.target.value })}
                                                            placeholder="••••••"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                                                        >
                                                            {mostrarConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button onClick={handleCadastrar} className="w-full font-black uppercase bg-emerald-600 hover:bg-emerald-500 text-white mt-4">
                                            Concluir Cadastro
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>

                    <div className="bg-black/20 p-4 text-center text-[10px] text-white/40 uppercase font-black tracking-widest">
                        Sistema de Gestão NGA • Versão 2.0
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <InterfaceMedico
            medico={medicoSelecionado}
            onLogout={() => {
                setMedicoSelecionado(null);
                setCredenciais({ login: '', senha: '' });
                toast.info("Você saiu do sistema.");
            }}
        />
    );
}
