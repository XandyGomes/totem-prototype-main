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

      <main className="flex-1 flex items-center justify-center p-[0.5vw]">
        <Card className="w-[96vw] h-[83vh] flex flex-col justify-center items-center p-[1.5vw] text-center shadow-xl">
          <h1 className="text-[5.5vw] sm:text-[4.5vw] md:text-[4vw] lg:text-[3.5vw] xl:text-[3vw] font-black mb-[3vh] text-foreground">
            SENHA EMITIDA
          </h1>

          <div className="mb-[4vh]">
            <Loader2 className="w-[8vw] h-[8vw] sm:w-[6vw] sm:h-[6vw] md:w-[5vw] md:h-[5vw] lg:w-[4vw] lg:h-[4vw] xl:w-[3vw] xl:h-[3vw] animate-spin text-primary mx-auto mb-[2vh]" />
            <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black text-muted-foreground">
              Aguarde, estamos concluindo a operação...
            </p>
          </div>

          <div className="space-y-[2vh] w-full max-w-[55vw]">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full h-[9vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg"
            >
              CONCLUIR
            </Button>

            <p className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-black text-muted-foreground">
              Por favor, retire sua senha impressa
            </p>
            
            <Button
              onClick={() => navigate("/falha-impressao")}
              size="lg"
              className="w-full h-[6vh] text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-black border-4 shadow-lg"
              style={{ backgroundColor: "red" }}
            >
              TESTE ERRO IMPRESSÃO
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Senha;
