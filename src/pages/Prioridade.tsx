import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, Star, Users, Heart, Baby, User, Brain, Scale, Clock, UserCheck, Info } from "lucide-react";
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
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-between p-[1.5vw] shadow-xl relative">
          {/* Botão de Ajuda - Canto Superior Direito */}
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="absolute top-4 right-4 w-16 h-16 rounded-full border-3 bg-blue-200 hover:bg-blue-300 text-blue-800 border-blue-500 animate-pulse z-10 shadow-xl flex items-center justify-center"
              >
                <img 
                  src="/informacao.png" 
                  alt="Informações" 
                  className="w-10 h-10"
                  style={{ 
                    filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.8))',
                  }}
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-5xl h-[85vh] flex flex-col">
              <DialogHeader className="flex-none pb-2">
                <DialogTitle className="text-xl font-bold text-center">
                  ATENDIMENTO PREFERENCIAL - INFORMAÇÕES LEGAIS
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col gap-3 text-base">
                  {/* 1º Nível - Superprioridade */}
                  <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      1º NÍVEL - SUPERPRIORIDADE
                    </h3>
                    <div className="ml-7 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-red-600" />
                      <strong>Idosos de 80 anos ou mais</strong> - Atendimento imediato
                    </div>
                  </div>
                  
                  {/* 2º Nível - Atendimento Preferencial */}
                  <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-500 flex-1">
                    <h3 className="text-lg font-bold text-orange-600 mb-2 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-orange-600" />
                      2º NÍVEL - ATENDIMENTO PREFERENCIAL LEGAL
                    </h3>
                    <div className="ml-7 grid grid-cols-2 gap-1 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-orange-600" />
                        Idosos de 60 a 79 anos (Lei 10.741/2003)
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-orange-600" />
                        Pessoas com Deficiência (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-pink-600" />
                        Gestantes (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center">
                        <Baby className="w-4 h-4 mr-2 text-blue-600" />
                        Lactantes (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center">
                        <Baby className="w-4 h-4 mr-2 text-green-600" />
                        Pessoas com criança de colo (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-purple-600" />
                        Autistas - TEA (Lei 12.764/2012)
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-orange-600" />
                        Pessoas com mobilidade reduzida
                      </div>
                      <div className="flex items-center">
                        <Scale className="w-4 h-4 mr-2 text-orange-600" />
                        Obesidade (mobilidade reduzida)
                      </div>
                    </div>
                  </div>
                  
                  {/* 3º Nível - Não Preferencial */}
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      3º NÍVEL - ATENDIMENTO NÃO PREFERENCIAL
                    </h3>
                    <div className="ml-7 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Atendimento por ordem de chegada
                    </div>
                  </div>
                  
                  {/* Aviso Importante */}
                  <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300 flex-none">
                    <p className="text-sm font-medium text-yellow-800">
                      <strong>Importante:</strong> O atendimento preferencial é um direito garantido por lei. 
                      Selecione apenas se você se enquadra em uma das categorias acima.
                    </p>
                  </div>
                </div>
              </DialogDescription>
              
              <div className="flex-none pt-3 flex justify-center">
                <Button 
                  onClick={() => setShowHelp(false)}
                  variant="outline"
                  size="lg"
                  className="px-8 py-2 text-base font-bold bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground"
                >
                  FECHAR
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Conteúdo Principal */}
          <div className="text-center mt-4">
            <h1 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[2vh] text-foreground">
              ATENDIMENTO PREFERENCIAL
            </h1>
            
            <p className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] mb-[1vh] text-muted-foreground font-medium">
              Você tem direito a atendimento preferencial?
            </p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-[3vh]">
            <Button
              onClick={handlePrioritario}
              size="lg"
              className="w-full h-[15vh] text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black border-4 shadow-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-[2vw]"
            >
              <div className="flex items-center gap-[2vw]">
                {/* Imagem PCD com sombra branca */}
                <div className="flex flex-col items-center">
                  <img 
                    src="/pcd.png" 
                    alt="PCD" 
                    className="w-[6vw] h-[6vw] sm:w-[5vw] sm:h-[5vw] md:w-[4.5vw] md:h-[4.5vw] lg:w-[4vw] lg:h-[4vw] xl:w-[3.5vw] xl:h-[3.5vw]"
                    style={{ 
                      filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.9)) drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.7))',
                    }}
                  />
                </div>
                
                <div className="text-center">
                  <span className="text-white">SIM, SOU PREFERENCIAL</span>
                  <div className="text-[1.2vw] sm:text-[1vw] md:text-[0.9vw] lg:text-[0.8vw] xl:text-[0.7vw] text-orange-100 mt-1">
                    PCD • IDOSO • GESTANTE • LACTANTE • OUTROS
                  </div>
                </div>
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
