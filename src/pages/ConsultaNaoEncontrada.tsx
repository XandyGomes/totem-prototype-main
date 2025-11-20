import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ConsultaNaoEncontrada = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-auto">
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-center items-center p-[2vw] shadow-xl text-center">
          
          <div className="mb-[4vh]">
            <AlertTriangle className="w-[15vw] h-[15vw] max-w-32 max-h-32 text-orange-500 mx-auto mb-[2vh]" />
          </div>
          
          <h1 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[3vh] text-orange-600">
            CONSULTA NÃO ENCONTRADA
          </h1>
          
          <div className="max-w-[85vw] mb-[4vh]">
            <p className="text-[2.5vw] sm:text-[2.2vw] md:text-[2vw] lg:text-[1.8vw] xl:text-[1.5vw] font-bold mb-[2vh] text-foreground">
              Não encontramos consulta agendada para hoje com este CPF/CNS.
            </p>
            
            <div className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] text-muted-foreground font-medium space-y-2">
              <p>• Verifique se digitou o CPF/CNS corretamente</p>
              <p>• Confirme se sua consulta está agendada para hoje</p>
              <p>• Procure a recepção para mais informações</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-[2vw] w-full max-w-[80vw]">
            <Button
              onClick={() => navigate("/identificacao")}
              variant="outline"
              size="lg"
              className="flex-1 h-[8vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg"
            >
              TENTAR NOVAMENTE
            </Button>
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="flex-1 h-[8vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg"
            >
              VOLTAR AO INÍCIO
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ConsultaNaoEncontrada;
