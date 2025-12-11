import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const ImpressaoConcluida = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <TotemHeader />

            <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
                <Card className="w-[96vw] h-[81vh] flex flex-col justify-center items-center p-[2vw] text-center shadow-xl">
                    <div className="border-4 border-green-500 shadow-2xl rounded-3xl p-[4vw] w-auto max-w-[85vw] flex flex-col items-center bg-card/50 backdrop-blur-sm">
                        <CheckCircle className="w-[15vw] h-[15vw] text-green-500 mx-auto mb-[4vh]" />

                        <h1 className="text-[6vw] font-black mb-[3vh] text-foreground leading-tight">
                            IMPRESSÃO CONCLUÍDA
                        </h1>

                        <p className="text-[3vw] font-black mb-[6vh] text-muted-foreground">
                            Retire sua senha.
                        </p>

                        <Button
                            onClick={() => navigate("/")}
                            size="lg"
                            className="w-full max-w-[50vw] h-[10vh] text-[4vw] font-black border-4 shadow-lg mb-[2vh] rounded-2xl bg-green-600 hover:bg-green-700 text-white border-green-700"
                        >
                            CONCLUIR
                        </Button>

                        <p className="text-[2.5vw] font-black text-muted-foreground mt-[2vh]">
                            Obrigado por utilizar nosso totem.
                        </p>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default ImpressaoConcluida;
