import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Prioridade = () => {
  const navigate = useNavigate();

  const handlePreferencial = () => {
    // Aqui você pode salvar a escolha em estado ou context se necessário
    navigate("/confirmacao");
  };

  const handleNaoPreferencial = () => {
    // Aqui você pode salvar a escolha em estado ou context se necessário  
    navigate("/confirmacao");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-auto">
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-between p-[1.5vw] shadow-xl">
          <h1 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[2vh] text-center text-foreground">
            TIPO DE ATENDIMENTO
          </h1>
          
          <div className="flex-1 flex flex-col justify-center gap-[3vh]">
            <Button
              onClick={handlePreferencial}
              size="lg"
              className="w-full h-[15vh] text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black border-4 shadow-lg bg-green-600 hover:bg-green-700 flex items-center justify-center gap-[3vw]"
            >
              <img 
                src="/pcd.png" 
                alt="Símbolo PCD" 
                className="w-[10vw] h-[10vw] sm:w-[8vw] sm:h-[8vw] md:w-[6.5vw] md:h-[6.5vw] lg:w-[5vw] lg:h-[5vw] xl:w-[4vw] xl:h-[4vw]"
              />
              <span className="text-white">PREFERENCIAL</span>
            </Button>

            <Button
              onClick={handleNaoPreferencial}
              size="lg"
              className="w-full h-[15vh] text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black border-4 shadow-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-[3vw]"
            >
              <span className="text-white">NÃO PREFERENCIAL</span>
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/identificacao")}
              variant="outline"
              size="lg"
              className="w-[40vw] h-[7vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg"
            >
              VOLTAR
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Prioridade;
