'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TotemHeader } from "@/components/TotemHeader";
import { NumericKeypad } from "@/components/NumericKeypad";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTotem } from "@/contexts/TotemContext";
import { validarConsultaAgendada, validarSetorCorreto } from "@/services/consultaService";
import { toast } from "sonner";

export default function IdentificacaoPage() {
    const router = useRouter();
    const { state, dispatch } = useTotem();
    const [cpf, setCpf] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const handleNumberClick = (num: string) => {
        if (cpf.length < 11) {
            setCpf(cpf + num);
        }
    };

    const handleBackspace = () => {
        setCpf(cpf.slice(0, -1));
    };

    const handleClear = () => {
        setCpf("");
    };

    const formatCPF = (value: string) => {
        if (value.length <= 3) return value;
        if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`;
        if (value.length <= 9) return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
        return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    };

    const handleNext = async () => {
        if (cpf.length !== 11) {
            toast.error("Por favor, digite os 11 dígitos do CPF");
            return;
        }

        setIsValidating(true);

        try {
            dispatch({ type: 'SET_IDENTIFICACAO', payload: cpf });

            const resultadoConsulta = await validarConsultaAgendada(cpf);

            if (!resultadoConsulta.sucesso) {
                dispatch({
                    type: 'SET_VALIDACAO_CONSULTA',
                    payload: {
                        temConsulta: false,
                        setorCorreto: false,
                        erro: resultadoConsulta.erro
                    }
                });
                router.push("/totem/consulta-nao-encontrada");
                return;
            }

            dispatch({ type: 'SET_CONSULTA', payload: resultadoConsulta.consulta! });

            const resultadoSetor = await validarSetorCorreto(resultadoConsulta.consulta!, 'setor-atual');

            if (!resultadoSetor.sucesso) {
                dispatch({
                    type: 'SET_VALIDACAO_CONSULTA',
                    payload: {
                        temConsulta: true,
                        setorCorreto: false,
                        erro: resultadoSetor.erro
                    }
                });
                router.push("/totem/setor-incorreto");
                return;
            }

            dispatch({
                type: 'SET_VALIDACAO_CONSULTA',
                payload: {
                    temConsulta: true,
                    setorCorreto: true
                }
            });

            toast.success(`Olá, ${resultadoConsulta.consulta!.paciente.nome}`, {
                description: "Consulta encontrada com sucesso!",
            });

            router.push("/totem/prioridade");

        } catch (error) {
            console.error('Erro na validação:', error);
            toast.error("Erro no sistema", {
                description: "Tente novamente ou procure o atendente.",
            });
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <TotemHeader />

            <main className="flex-1 flex items-center justify-center p-[1vw] overflow-hidden">
                <Card className="w-[98vw] h-[82vh] flex flex-col justify-between p-[2vw] shadow-2xl border-4">
                    <div className="text-center flex-none">
                        <h1 className="text-[5vw] font-black mb-[0.5vh] text-foreground uppercase leading-tight">
                            Identifique-se
                        </h1>
                        <p className="text-[2.5vw] text-muted-foreground font-black">
                            Informe seu CPF ou número do Cartão SUS (CNS)
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center gap-[1.5vh] min-h-0 overflow-visible">
                        <div className="w-[70vw] p-[1vw] border-4 border-primary/20 rounded-2xl bg-card shadow-inner flex-none">
                            <input
                                type="text"
                                value={formatCPF(cpf)}
                                readOnly
                                placeholder="XXX.XXX.XXX-XX"
                                className="w-full text-[5vw] text-center font-mono font-black bg-transparent border-none outline-none tracking-widest text-primary"
                            />
                        </div>

                        <div className="flex-none scale-[0.9] origin-center translate-y-[-1vh]">
                            <NumericKeypad
                                onNumberClick={handleNumberClick}
                                onBackspace={handleBackspace}
                                onClear={handleClear}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-[2vw] flex-none mt-auto">
                        <Button
                            onClick={() => router.push("/totem")}
                            variant="outline"
                            size="lg"
                            disabled={isValidating}
                            className="flex-1 h-[10vh] text-[3vw] font-black border-4 shadow-xl order-2 sm:order-1 bg-destructive/5 hover:bg-destructive hover:text-destructive-foreground rounded-2xl transition-all"
                        >
                            VOLTAR
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={cpf.length !== 11 || isValidating}
                            size="lg"
                            className="flex-1 h-[10vh] text-[3vw] font-black border-4 shadow-xl order-1 sm:order-2 rounded-2xl transition-all"
                        >
                            {isValidating ? (
                                <>
                                    <Loader2 className="mr-2 h-[4vw] w-[4vw] animate-spin" />
                                    VALIDANDO...
                                </>
                            ) : (
                                "AVANÇAR"
                            )}
                        </Button>
                    </div>
                </Card>
            </main>
        </div>
    );
}

