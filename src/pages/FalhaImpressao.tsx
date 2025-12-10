import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const FalhaImpressao = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />

      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-center items-center p-[2vw] text-center shadow-xl border-destructive border-4">
          <AlertTriangle className="w-[15vw] h-[15vw] text-destructive mx-auto mb-[4vh]" />

          <h1 className="text-[6vw] font-black mb-[3vh] text-foreground leading-tight">
            FALHA NA IMPRESSÃO
          </h1>

          <p className="text-[3vw] font-black mb-[6vh] text-muted-foreground">
            Não foi possível imprimir a senha.
          </p>

          <Button
            onClick={() => navigate("/teste")}
            size="lg"
            className="w-full max-w-[70vw] h-[12vh] text-[4vw] font-black border-4 shadow-lg mb-[4vh] rounded-2xl"
          >
            CONCLUIR
          </Button>

          <p className="text-[2.5vw] font-black text-muted-foreground">
            Por favor, peça auxílio no atendimento.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default FalhaImpressao;
