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
      
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-3xl p-16 text-center shadow-xl border-destructive">
          <AlertTriangle className="w-24 h-24 text-destructive mx-auto mb-8" />
          
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            FALHA NA IMPRESSÃO
          </h1>
          
          <p className="text-2xl mb-12 text-muted-foreground">
            Não foi possível imprimir a senha.
          </p>

          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="w-full max-w-md h-20 text-2xl"
          >
            CONCLUIR
          </Button>

          <p className="mt-8 text-lg text-muted-foreground">
            Por favor, peça auxílio no atendimento.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default FalhaImpressao;
