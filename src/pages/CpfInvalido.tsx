import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const CpfInvalido = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-3xl p-16 text-center shadow-xl border-destructive">
          <AlertCircle className="w-24 h-24 text-destructive mx-auto mb-8" />
          
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            CPF INVÁLIDO
          </h1>
          
          <p className="text-2xl mb-12 text-muted-foreground">
            Por favor, verifique o número informado.
          </p>

          <Button
            onClick={() => navigate("/identificacao")}
            size="lg"
            className="w-full max-w-md h-20 text-2xl"
          >
            TENTAR NOVAMENTE
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default CpfInvalido;
