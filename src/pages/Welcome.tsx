import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-3xl p-16 text-center shadow-xl">
          <h1 className="text-6xl font-bold mb-12 text-foreground">
            BEM-VINDO(A) AO NGA
          </h1>
          
          <Button
            onClick={() => navigate("/identificacao")}
            size="lg"
            className="w-full max-w-xl h-24 text-3xl font-bold"
          >
            CONFIRMAR PRESENÇA
          </Button>
          
          <p className="mt-8 text-xl text-muted-foreground">
            Toque na tela para iniciar
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Welcome;
