import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Senha = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate printing delay
    const timer = setTimeout(() => {
      // In a real app, this would wait for actual print confirmation
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />

      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-3xl p-16 text-center shadow-xl">
          <h1 className="text-5xl font-bold mb-12 text-foreground">
            SENHA EMITIDA
          </h1>

          <div className="mb-12">
            <Loader2 className="w-24 h-24 animate-spin text-primary mx-auto mb-6" />
            <p className="text-2xl text-muted-foreground">
              Aguarde, estamos concluindo a operação...
            </p>
          </div>

          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="w-full max-w-md h-20 text-2xl"
          >
            CONCLUIR
          </Button>

          <p className="mt-8 text-lg text-muted-foreground">
            Por favor, retire sua senha impressa



          </p>
          <Button
            onClick={() => navigate("/falha-impressao")}
            size="lg"
            className="flex-1 h-10 text-1xl"
            style={{ marginTop: "20px", backgroundColor: "red" }}
          >
            TESTE ERRO IMPRESSÃO
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Senha;
