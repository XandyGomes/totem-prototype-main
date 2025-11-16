import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw]">
        <Card className="w-[96vw] h-[80vh] flex flex-col items-center justify-center p-[2vw] text-center shadow-xl">
          <h1 className="text-[5.5vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] xl:text-[3.5vw] font-black mb-[1vh] text-foreground">
            BEM-VINDO(A) AO NGA
          </h1>
          
          <h2 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[3vh] text-primary">
            IDENTIFIQUE-SE
          </h2>
          
          <Button
            onClick={() => navigate("/identificacao")}
            size="lg"
            className="w-[75vw] h-[10vh] text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] xl:text-[1.5vw] font-black border-4 shadow-lg mb-[2vh]"
          >
            CONFIRMAR PRESENÇA
          </Button>
          
          <p className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] text-muted-foreground font-black">
            Toque na tela para iniciar
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Welcome;
