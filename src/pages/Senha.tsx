import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Senha = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Timer para ir automaticamente para a tela de erro após 5 segundos
    const timer = setTimeout(() => {
      navigate("/falha-impressao");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />

      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-center items-center p-[2vw] text-center shadow-xl">
          <h1 className="text-[6vw] font-black mb-[4vh] text-foreground leading-tight">
            EMITINDO SENHA...
          </h1>

          <div className="mb-[6vh]">
            <Loader2 className="w-[15vw] h-[15vw] animate-spin text-primary mx-auto mb-[3vh]" />
            <p className="text-[3vw] font-black text-muted-foreground">
              Aguarde, estamos concluindo a operação...
            </p>
          </div>

          <div className="space-y-[4vh] w-full max-w-[70vw]">
            <Button
              onClick={() => navigate("")}
              size="lg"
              className="w-full h-[12vh] text-[4vw] font-black border-4 shadow-lg rounded-2xl"
            >
              CONCLUIR
            </Button>

            <p className="text-[2.5vw] font-black text-muted-foreground">
              Por favor, retire sua senha impressa
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Senha;
