import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, Star } from "lucide-react";
import { useTotem } from "@/contexts/TotemContext";

const Prioridade = () => {
  const navigate = useNavigate();
  const { dispatch } = useTotem();
  const [showHelp, setShowHelp] = useState(false);

  const handleNaoPrioritario = () => {
    dispatch({ 
      type: 'SET_PRIORIDADE', 
      payload: { 
        isPrioritario: false,
        prioridadeSelecionada: {
          tipo: 'comum',
          descricao: 'Atendimento não preferencial',
          nivel: 3
        }
      } 
    });
    navigate("/confirmacao");
  };

  const handlePrioritario = () => {
    dispatch({ 
      type: 'SET_PRIORIDADE', 
      payload: { 
        isPrioritario: true 
      } 
    });
    navigate("/selecionar-prioridade");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-auto">
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-between p-[1.5vw] shadow-xl">
          <div className="text-center">
            <h1 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[2vh] text-foreground">
              ATENDIMENTO PREFERENCIAL
            </h1>
            
            <p className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] mb-[1vh] text-muted-foreground font-medium">
              Você tem direito a atendimento preferencial?
            </p>
            
            <Dialog open={showHelp} onOpenChange={setShowHelp}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-[1.5vw] sm:text-[1.3vw] md:text-[1.1vw] lg:text-[0.9vw] xl:text-[0.8vw] font-bold border-2 bg-green-100 hover:bg-green-200 text-green-800 border-green-300 px-2 py-1"
                >
                  <HelpCircle className="w-[2vw] h-[2vw] sm:w-[1.8vw] sm:h-[1.8vw] md:w-[1.6vw] md:h-[1.6vw] lg:w-[1.4vw] lg:h-[1.4vw] xl:w-[1.2vw] xl:h-[1.2vw] mr-2" />
                  O que é atendimento preferencial?
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-4xl h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-4">
                    ATENDIMENTO PREFERENCIAL - INFORMAÇÕES LEGAIS
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-lg space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">1º NÍVEL - SUPERPRIORIDADE</h3>
                    <p className="ml-4 flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500" /> <strong>Idosos de 80 anos ou mais</strong> - Atendimento imediato</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">2º NÍVEL - ATENDIMENTO PREFERENCIAL LEGAL</h3>
                    <div className="ml-4 space-y-1">
                      <p>Idosos de 60 a 79 anos (Lei 10.741/2003)</p>
                      <p>Pessoas com Deficiência (Lei 10.048/2000)</p>
                      <p>Gestantes (Lei 10.048/2000)</p>
                      <p>Lactantes (Lei 10.048/2000)</p>
                      <p>Pessoas com criança de colo (Lei 10.048/2000)</p>
                      <p>Autistas - TEA (Lei 12.764/2012)</p>
                      <p>Pessoas com mobilidade reduzida</p>
                      <p>Obesidade (mobilidade reduzida)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">3º NÍVEL - ATENDIMENTO NÃO PREFERENCIAL</h3>
                    <p className="ml-4">Atendimento por ordem de chegada</p>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                    <p className="text-sm font-medium">
                      <strong>Importante:</strong> O atendimento preferencial é um direito garantido por lei. 
                      Selecione apenas se você se enquadra em uma das categorias acima.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={() => setShowHelp(false)}
                      variant="outline"
                      size="lg"
                      className="px-8 py-3 text-lg font-bold bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      VOLTAR
                    </Button>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-[3vh]">
            <Button
              onClick={handlePrioritario}
              size="lg"
              className="w-full h-[15vh] text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black border-4 shadow-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-[3vw]"
            >
              <div className="text-center">
                <img 
                  src="/pcd.png" 
                  alt="Atendimento Preferencial" 
                  className="w-[5vw] h-[5vw] sm:w-[4vw] sm:h-[4vw] md:w-[3.5vw] md:h-[3.5vw] lg:w-[3vw] lg:h-[3vw] xl:w-[2.5vw] xl:h-[2.5vw] mx-auto mb-2"
                />
                <span className="text-white">SIM, SOU PREFERENCIAL</span>
              </div>
            </Button>

            <Button
              onClick={handleNaoPrioritario}
              size="lg"
              className="w-full h-[15vh] text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black border-4 shadow-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-[3vw]"
            >
              <span className="text-white">NÃO SOU PREFERENCIAL</span>
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/identificacao")}
              variant="outline"
              size="lg"
              className="w-[40vw] h-[7vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground"
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
