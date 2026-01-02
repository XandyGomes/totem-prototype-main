'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TotemHeader } from "@/components/TotemHeader";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import TicketImpresso from "@/components/TicketImpresso";

export default function SenhaPage() {
    const router = useRouter();

    useEffect(() => {
        const printTimer = setTimeout(() => {
            window.print();
        }, 800);

        const navTimer = setTimeout(() => {
            router.push("/totem/impressao-concluida");
        }, 5000);

        return () => {
            clearTimeout(printTimer);
            clearTimeout(navTimer);
        };
    }, [router]);

    return (
        <>
            <TicketImpresso />

            <div className="min-h-screen flex flex-col bg-background">
                <TotemHeader />

                <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
                    <Card className="w-[96vw] h-[81vh] flex flex-col justify-center items-center p-[2vw] text-center shadow-xl">
                        <div className="border-4 border-primary/20 shadow-2xl rounded-3xl p-[4vw] w-auto max-w-[85vw] flex flex-col items-center bg-card/50 backdrop-blur-sm">
                            <h1 className="text-[6vw] font-black mb-[4vh] text-foreground leading-tight uppercase">
                                Emitindo Senha...
                            </h1>

                            <div className="mb-[6vh]">
                                <Loader2 className="w-[15vw] h-[15vw] animate-spin text-primary mx-auto mb-[3vh]" />
                                <p className="text-[3vw] font-black text-muted-foreground">
                                    Aguarde, estamos concluindo a operação...
                                </p>
                            </div>

                            <div className="space-y-[4vh] w-full max-w-[70vw]">
                                <p className="text-[2.5vw] font-black text-muted-foreground uppercase">
                                    Por favor, retire sua senha impressa assim que finalizado.
                                </p>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </>
    );
}
