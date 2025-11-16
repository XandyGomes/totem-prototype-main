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
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl p-8 sm:p-12 md:p-16 text-center shadow-xl border-destructive">
          <AlertTriangle className="w-[8vw] h-[8vw] sm:w-[6vw] sm:h-[6vw] md:w-[5vw] md:h-[5vw] lg:w-[4vw] lg:h-[4vw] xl:w-[3vw] xl:h-[3vw] text-destructive mx-auto mb-[3vw] sm:mb-[2.5vw] md:mb-[2vw]" />
          
          <h1 className="text-[6vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] xl:text-[3.5vw] font-black mb-[2.5vw] sm:mb-[2vw] md:mb-[1.5vw] text-foreground">
            FALHA NA IMPRESSÃO
          </h1>
          
          <p className="text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] xl:text-[1.5vw] font-black mb-[4vw] sm:mb-[3.5vw] md:mb-[3vw] text-muted-foreground">
            Não foi possível imprimir a senha.
          </p>

          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="w-full max-w-[40vw] h-[8vw] sm:h-[7vw] md:h-[6vw] lg:h-[5vw] xl:h-[4.5vw] text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] xl:text-[1.5vw] font-black border-4 shadow-lg mb-[3vw] sm:mb-[2.5vw]"
          >
            CONCLUIR
          </Button>

          <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black text-muted-foreground">
            Por favor, peça auxílio no atendimento.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default FalhaImpressao;
