'use client';

import { useRouter } from "next/navigation";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTotem, typesPriority, TipoPrioridade } from "@/contexts/TotemContext";
import { IconePrioridade } from "@/components/IconePrioridade";

export default function SelecionarPrioridadePage() {
    const router = useRouter();
    const { dispatch } = useTotem();

    const handleSelecionarPrioridade = (tipo: TipoPrioridade) => {
        const prioridade = typesPriority[tipo];

        dispatch({
            type: 'SET_PRIORIDADE',
            payload: {
                isPrioritario: true,
                prioridadeSelecionada: {
                    tipo,
                    descricao: prioridade.descricao,
                    nivel: prioridade.nivel
                }
            }
        });

        router.push("/totem/confirmacao");
    };

    const superPrioridade = [
        { tipo: 'superprioridade' as TipoPrioridade, cor: 'bg-red-600 hover:bg-red-700' }
    ];

    const prioridadeLegal = [
        { tipo: 'idoso_60_79' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
        { tipo: 'pcd' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
        { tipo: 'gestante' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
        { tipo: 'lactante' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
        { tipo: 'crianca_colo' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
        { tipo: 'autista' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
        { tipo: 'mobilidade_reduzida' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
        { tipo: 'obeso' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <TotemHeader />

            <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
                <Card className="w-[96vw] h-[76vh] flex flex-col p-[1.5vw] shadow-xl">
                    <div className="text-center mb-[1vh] flex-none">
                        <h1 className="text-[4vw] font-black mb-[0.5vh] text-foreground leading-tight uppercase">
                            Selecione seu tipo de atendimento preferencial
                        </h1>
                        <p className="text-[2vw] text-muted-foreground font-medium">
                            Escolha apenas se você se enquadra em uma das categorias abaixo
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col gap-[1vh] min-h-0">
                        {/* Superprioridade */}
                        <div className="text-center flex-none">
                            <h2 className="text-[3vw] font-bold text-red-600 mb-[0.5vh] uppercase">
                                Superprioridade
                            </h2>
                            <div className="flex justify-center">
                                {superPrioridade.map(({ tipo, cor }) => (
                                    <Button
                                        key={tipo}
                                        onClick={() => handleSelecionarPrioridade(tipo)}
                                        size="lg"
                                        className={`w-full max-w-[90vw] h-[10vh] text-[3.5vw] font-black border-4 shadow-xl ${cor} flex items-center justify-between px-[4vw] rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
                                    >
                                        <div className="absolute right-[-2vw] bottom-[-4vh] w-[15vw] h-[15vw] bg-white/10 rounded-full blur-2xl transform rotate-12 group-hover:bg-white/20 transition-all" />

                                        <div className="bg-white/20 p-[1.2vw] rounded-full backdrop-blur-md border border-white/40 shadow-inner flex items-center justify-center">
                                            <IconePrioridade tipo={tipo} className="w-[5vw] h-[5vw] text-white drop-shadow-md" />
                                        </div>

                                        <span className="text-white text-center flex-1 drop-shadow-md tracking-wide">
                                            {typesPriority[tipo].descricao}
                                        </span>

                                        <div className="w-[6vw]" /> {/* Spacer for balance */}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Atendimento Preferencial Legal */}
                        <div className="text-center flex-1 flex flex-col min-h-0">
                            <h2 className="text-[3vw] font-bold text-orange-600 mb-[1vh] flex-none uppercase">
                                Atendimento Preferencial Legal
                            </h2>
                            <div className="grid grid-cols-2 gap-[1.5vh] justify-items-center flex-1 content-start">
                                {prioridadeLegal.map(({ tipo, cor }) => (
                                    <Button
                                        key={tipo}
                                        onClick={() => handleSelecionarPrioridade(tipo)}
                                        className={`w-full h-full min-h-[8vh] text-[2.2vw] font-bold border-2 shadow-lg ${cor} flex items-center justify-start gap-[1.5vw] px-[1.5vw] leading-tight rounded-2xl py-1 relative overflow-hidden group hover:scale-[1.02] transition-all duration-200`}
                                    >
                                        <div className="absolute -right-2 -bottom-2 w-[8vw] h-[8vw] bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />

                                        <div className="bg-white/20 p-[1vw] rounded-full backdrop-blur-sm border border-white/30 shadow-sm flex-shrink-0">
                                            <IconePrioridade tipo={tipo} className="w-[4.5vw] h-[4.5vw] text-white drop-shadow-sm" />
                                        </div>

                                        <span className="text-white text-left whitespace-normal leading-none uppercase tracking-wide drop-shadow-sm flex-1">
                                            {typesPriority[tipo].descricao}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-[1vh] flex-none mb-[1vh]">
                        <Button
                            onClick={() => router.push("/totem/prioridade")}
                            variant="outline"
                            size="lg"
                            className="w-[50vw] h-[8vh] text-[3vw] font-black border-4 shadow-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-xl"
                        >
                            VOLTAR
                        </Button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
