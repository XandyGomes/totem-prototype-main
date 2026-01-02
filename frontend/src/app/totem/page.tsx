'use client';

import { useRouter } from 'next/navigation';
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTotem } from "@/contexts/TotemContext";

export default function WelcomePage() {
    const router = useRouter();
    const { dispatch } = useTotem();

    const handleComecar = () => {
        dispatch({ type: 'RESET_TOTEM' });
        router.push("/totem/identificacao");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <TotemHeader />

            <main className="flex-1 flex items-center justify-center p-[1vw]">
                <Card className="w-[90vw] h-[85vh] flex flex-col items-center justify-center p-[4vw] text-center shadow-xl">
                    <h1 className="text-[7vw] font-black mb-[4vh] text-foreground leading-tight uppercase">
                        Bem-vindo(a) ao Novo NGA
                    </h1>

                    <p className="text-[3.5vw] font-semibold mb-[2vh] text-muted-foreground leading-relaxed max-w-[85vw]">
                        Você está na <span className="text-primary font-black">sala de espera principal</span>
                    </p>

                    <p className="text-[3vw] font-medium mb-[6vh] text-muted-foreground leading-relaxed max-w-[90vw]">
                        Caso as salas de espera dos setores estejam cheias, você pode aguardar aqui.
                        <br />
                        Um atendente está disponível para ajudá-lo.
                    </p>

                    <h2 className="text-[5vw] font-black mb-[4vh] text-primary">
                        TOQUE PARA COMEÇAR
                    </h2>

                    <Button
                        onClick={handleComecar}
                        size="lg"
                        className="w-[70vw] h-[15vh] text-[5vw] font-black border-4 shadow-lg mb-[4vh] bg-primary hover:bg-primary/90 rounded-2xl"
                    >
                        COMEÇAR
                    </Button>

                    <p className="text-[2.5vw] text-muted-foreground font-medium max-w-[80vw]">
                        Interaja com o totem ou chame o atendente se precisar de ajuda
                    </p>
                </Card>
            </main>
        </div>
    );
}
