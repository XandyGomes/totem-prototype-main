'use client';

import { useRouter } from "next/navigation";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function ConsultaNaoEncontradaPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <TotemHeader />

            <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-auto">
                <Card className="w-[96vw] h-[76vh] flex flex-col justify-center items-center p-[2vw] shadow-xl text-center border-orange-200 border-4">
                    <div className="mb-[4vh]">
                        <AlertTriangle className="w-[15vw] h-[15vw] text-orange-500 mx-auto" />
                    </div>

                    <h1 className="text-[5vw] font-black mb-[3vh] text-orange-600 leading-tight uppercase">
                        Consulta Não Encontrada
                    </h1>

                    <div className="max-w-[90vw] mb-[6vh]">
                        <p className="text-[3vw] font-black mb-[4vh] text-foreground leading-tight">
                            Não encontramos consulta agendada para hoje com este CPF/CNS.
                        </p>

                        <div className="text-[2.5vw] text-muted-foreground font-bold space-y-[1.5vh] text-left inline-block">
                            <p>• Verifique se digitou o CPF corretamente</p>
                            <p>• Confirme a data do agendamento</p>
                            <p>• Procure a recepção se tiver dúvidas</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[2vh] w-full max-w-[80vw]">
                        <Button
                            onClick={() => router.push("/totem/identificacao")}
                            size="lg"
                            className="w-full h-[12vh] text-[4vw] font-black border-4 shadow-lg rounded-2xl bg-orange-600 hover:bg-orange-700"
                        >
                            TENTAR NOVAMENTE
                        </Button>
                        <Button
                            onClick={() => router.push("/totem")}
                            variant="outline"
                            size="lg"
                            className="w-full h-[12vh] text-[4vw] font-black border-4 shadow-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-2xl"
                        >
                            VOLTAR AO INÍCIO
                        </Button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
