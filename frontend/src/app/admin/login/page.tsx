'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginMedico } from "@/services/filaService";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
    const { login: authLogin } = useAuth();
    const [credenciais, setCredenciais] = useState({ login: '', senha: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await loginMedico(credenciais);
            if (data && data.access_token) {
                if (data.user.role !== 'ADMIN') {
                    toast.error("Acesso negado. Esta área é restrita a administradores.");
                    return;
                }
                authLogin(data.user, data.access_token);
                toast.success(`Bem-vindo ao Console NGA, ${data.user.nome}`);
            } else {
                toast.error("Credenciais administrativas inválidas.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao conectar ao servidor de segurança.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 overflow-hidden relative">
            {/* Background Decorativo */}
            <div className="absolute inset-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md border-0 shadow-2xl bg-white/5 backdrop-blur-2xl border-white/10 text-white z-10">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl" />
                <CardHeader className="text-center pt-10 pb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl -rotate-6 border-4 border-white/10">
                        <ShieldAlert className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">NGA Console</CardTitle>
                    <p className="text-blue-300 font-bold uppercase text-[10px] mt-2 tracking-widest">Painel Administrativo Restrito</p>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-200 ml-1">Identificador Admin</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-blue-400" />
                                <Input
                                    type="text"
                                    value={credenciais.login}
                                    onChange={e => setCredenciais({ ...credenciais, login: e.target.value })}
                                    className="pl-12 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500 transition-all font-bold"
                                    placeholder="USUÁRIO"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-200 ml-1">Senha de Acesso</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-blue-400" />
                                <Input
                                    type={mostrarSenha ? "text" : "password"}
                                    value={credenciais.senha}
                                    onChange={e => setCredenciais({ ...credenciais, senha: e.target.value })}
                                    className="pl-12 pr-12 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500 transition-all font-bold"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    className="absolute right-4 top-3.5 text-blue-400 hover:text-white transition-colors"
                                >
                                    {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-md tracking-wider rounded-xl shadow-lg transition-all"
                        >
                            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
                            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </Button>
                    </form>
                </CardContent>
                <div className="p-4 bg-black/40 text-center text-[9px] font-black text-white/30 tracking-widest uppercase rounded-b-xl border-t border-white/5">
                    Segurança de Dados NGA • Powered by PET Saúde
                </div>
            </Card>
        </div>
    );
}
