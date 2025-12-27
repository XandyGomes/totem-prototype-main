import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ScanLine,
    UserCog,
    MonitorPlay,
    Settings,
    Activity,
    ShieldCheck,
    ChevronRight
} from "lucide-react";

const Home = () => {
    const navigate = useNavigate();

    const profiles = [
        {
            title: "Totem de Autoatendimento",
            description: "Interface para identificação do paciente, validação de consulta e emissão de senha por setor.",
            icon: ScanLine,
            path: "/welcome",
            color: "bg-blue-600",
            textColor: "text-blue-600",
            lightColor: "bg-blue-50"
        },
        {
            title: "Painel do Médico",
            description: "Gerenciamento de fila individual, chamado de pacientes e controle de consultório.",
            icon: UserCog,
            path: "/medico",
            color: "bg-emerald-600",
            textColor: "text-emerald-600",
            lightColor: "bg-emerald-50"
        },
        {
            title: "Painel de Chamadas (TV)",
            description: "Visualização pública das chamadas (Geral ou Setorial) com anúncios e wayfinding.",
            icon: MonitorPlay,
            path: "/tv",
            color: "bg-amber-600",
            textColor: "text-amber-600",
            lightColor: "bg-amber-50"
        },
        {
            title: "Módulo Administrativo",
            description: "Configurações de rede, mapeamento de salas, logs e métricas de desempenho.",
            icon: Settings,
            path: "/admin",
            color: "bg-slate-700",
            textColor: "text-slate-700",
            lightColor: "bg-slate-100"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 sm:p-8 flex flex-col items-center justify-center font-sans overflow-x-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-blue-500 rounded-full blur-[80px] sm:blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[80px] sm:blur-[120px]"></div>
            </div>

            <div className="max-w-6xl w-full space-y-8 sm:space-y-12 py-8">
                <header className="text-center space-y-4">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="bg-white/10 p-3 sm:p-4 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/20">
                            <ShieldCheck className="w-10 h-10 sm:w-16 h-16 text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic px-2">
                        Saúde <span className="text-blue-500">Digital</span> NGA
                    </h1>
                    <p className="text-sm sm:text-lg md:text-2xl text-slate-400 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] px-4">
                        Selecione o Início do Sistema
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {profiles.map((profile, index) => (
                        <Card
                            key={index}
                            className="group relative bg-[#1e293b] border-2 border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl"
                            onClick={() => navigate(profile.path)}
                        >
                            <div className="absolute -right-12 -top-12 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full group-hover:bg-white/10 transition-all duration-500"></div>

                            <CardContent className="p-6 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
                                <div className={`${profile.color} p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                    <profile.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                                </div>

                                <div className="flex-1 space-y-2 sm:space-y-3">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white group-hover:text-blue-400 transition-colors uppercase">
                                        {profile.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-semibold">
                                        {profile.description}
                                    </p>
                                    <Button variant="ghost" className="p-0 text-blue-400 font-black uppercase text-xs sm:text-sm tracking-widest gap-2 group-hover:translate-x-2 transition-transform h-auto">
                                        Acessar Módulo <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <footer className="text-center space-y-4 sm:space-y-6 pt-8 sm:pt-12">
                    <div className="flex justify-center items-center gap-6 sm:gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <div className="flex flex-col items-center">
                            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2" />
                            <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">Real-Time Core</span>
                        </div>
                        <div className="h-6 sm:h-8 w-px bg-slate-700"></div>
                        <div className="flex flex-col items-center">
                            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2" />
                            <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">Data Privacy</span>
                        </div>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] sm:text-sm px-4">
                        © 2025 PET Saúde Digital • Versão 2.0 Prototipagem NGA
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
