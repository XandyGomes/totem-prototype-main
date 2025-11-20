import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTotem } from "@/contexts/TotemContext";

const Welcome = () => {
  const navigate = useNavigate();
  const { dispatch } = useTotem();

  const handleComecar = () => {
    // Resetar estado ao começar novo atendimento
    dispatch({ type: 'RESET_TOTEM' });
    navigate("/identificacao");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw]">
        <Card className="w-[96vw] h-[78vh] flex flex-col items-center justify-center p-[2vw] text-center shadow-xl">
          <h1 className="text-[5.5vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] xl:text-[3.5vw] font-black mb-[2vh] text-foreground">
            BEM-VINDO(A) AO NOVO NGA
          </h1>
          
          <p className="text-[2.5vw] sm:text-[2.2vw] md:text-[2vw] lg:text-[1.8vw] xl:text-[1.5vw] font-semibold mb-[1vh] text-muted-foreground leading-relaxed max-w-[80vw]">
            Você está na <span className="text-primary font-black">sala de espera principal</span>
          </p>
          
          <p className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.3vw] xl:text-[1.1vw] font-medium mb-[4vh] text-muted-foreground leading-relaxed max-w-[85vw]">
            Caso as salas de espera dos setores estejam cheias, você pode aguardar aqui.
            <br />
            Um atendente está disponível para ajudá-lo.
          </p>
          
          <h2 className="text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black mb-[4vh] text-primary">
            TOQUE PARA COMEÇAR
          </h2>
          
          <Button
            onClick={handleComecar}
            size="lg"
            className="w-[60vw] h-[12vh] text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black border-4 shadow-lg mb-[2vh] bg-primary hover:bg-primary/90"
          >
            COMEÇAR
          </Button>
          
          <p className="text-[1.8vw] sm:text-[1.6vw] md:text-[1.3vw] lg:text-[1.1vw] xl:text-[0.9vw] text-muted-foreground font-medium">
            Interaja com o totem ou chame o atendente se precisar de ajuda
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Welcome;
