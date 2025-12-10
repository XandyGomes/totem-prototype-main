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

      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
        <Card className="w-[96vw] h-[76vh] flex flex-col justify-between p-[2vw] shadow-xl relative">
          {/* Botão de Ajuda - Canto Superior Direito */}
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 w-[12vw] h-[12vw] rounded-full border-4 bg-blue-200 hover:bg-blue-300 text-blue-800 border-blue-500 animate-pulse z-10 shadow-xl flex items-center justify-center"
              >
                <img
                  src="/informacao.png"
                  alt="Informações"
                  className="w-[7vw] h-[7vw]"
                  style={{
                    filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.8))',
                  }}
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-none h-[90vh] flex flex-col p-[3vw]">
              <DialogHeader className="flex-none pb-[2vh]">
                <DialogTitle className="text-[4vw] font-black text-center leading-tight">
                  ATENDIMENTO PREFERENCIAL - INFORMAÇÕES LEGAIS
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-[2vh] text-[2.5vw] leading-relaxed">
                  {/* 1º Nível - Superprioridade */}
                  <div className="bg-red-50 p-[2vw] rounded-2xl border-l-[1rem] border-red-500">
                    <h3 className="text-[3vw] font-bold text-red-600 mb-[1vh] flex items-center gap-[2vw]">
                      <Star className="w-[4vw] h-[4vw] text-yellow-500" />
                      1º NÍVEL - SUPERPRIORIDADE
                    </h3>
                    <div className="ml-[6vw] flex items-center gap-[1vw]">
                      <Users className="w-[3vw] h-[3vw] text-red-600" />
                      <strong>Idosos de 80 anos ou mais</strong> - Atendimento imediato
                    </div>
                  </div>

                  {/* 2º Nível - Atendimento Preferencial */}
                  <div className="bg-orange-50 p-[2vw] rounded-2xl border-l-[1rem] border-orange-500 flex-1">
                    <h3 className="text-[3vw] font-bold text-orange-600 mb-[1vh] flex items-center gap-[2vw]">
                      <Heart className="w-[4vw] h-[4vw] text-orange-600" />
                      2º NÍVEL - ATENDIMENTO PREFERENCIAL LEGAL
                    </h3>
                    <div className="ml-[6vw] grid grid-cols-1 gap-[1.5vh] text-[2.5vw]">
                      <div className="flex items-center gap-[1.5vw]">
                        <Users className="w-[3vw] h-[3vw] text-orange-600" />
                        Idosos de 60 a 79 anos (Lei 10.741/2003)
                      </div>
                      <div className="flex items-center gap-[1.5vw]">
                        <User className="w-[3vw] h-[3vw] text-orange-600" />
                        Pessoas com Deficiência (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center gap-[1.5vw]">
                        <Heart className="w-[3vw] h-[3vw] text-pink-600" />
                        Gestantes (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center gap-[1.5vw]">
                        <Baby className="w-[3vw] h-[3vw] text-blue-600" />
                        Lactantes (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center gap-[1.5vw]">
                        <Baby className="w-[3vw] h-[3vw] text-green-600" />
                        Pessoas com criança de colo (Lei 10.048/2000)
                      </div>
                      <div className="flex items-center gap-[1.5vw]">
                        <Brain className="w-[3vw] h-[3vw] text-purple-600" />
                        Autistas - TEA (Lei 12.764/2012)
                      </div>
                      <div className="flex items-center gap-[1.5vw]">
                        <User className="w-[3vw] h-[3vw] text-orange-600" />
                        Pessoas com mobilidade reduzida
                      </div>
                      <div className="flex items-center gap-[1.5vw]">
                        <Scale className="w-[3vw] h-[3vw] text-orange-600" />
                        Obesidade (mobilidade reduzida)
                      </div>
                    </div>
                  </div>

                  {/* 3º Nível - Não Preferencial */}
                  <div className="bg-blue-50 p-[2vw] rounded-2xl border-l-[1rem] border-blue-500">
                    <h3 className="text-[3vw] font-bold text-blue-600 mb-[1vh] flex items-center gap-[2vw]">
                      <Clock className="w-[4vw] h-[4vw] text-blue-600" />
                      3º NÍVEL - ATENDIMENTO NÃO PREFERENCIAL
                    </h3>
                    <div className="ml-[6vw] flex items-center gap-[1vw]">
                      <Clock className="w-[3vw] h-[3vw] text-blue-600" />
                      Atendimento por ordem de chegada
                    </div>
                  </div>

                  {/* Aviso Importante */}
                  <div className="bg-yellow-100 p-[2vw] rounded-2xl border border-yellow-300 flex-none">
                    <p className="text-[2.2vw] font-medium text-yellow-800 leading-normal">
                      <strong>Importante:</strong> O atendimento preferencial é um direito garantido por lei.
                      Selecione apenas se você se enquadra em uma das categorias acima.
                    </p>
                  </div>
                </div>
              </DialogDescription>

              <div className="flex-none pt-[2vh] flex justify-center">
                <Button
                  onClick={() => setShowHelp(false)}
                  variant="outline"
                  size="lg"
                  className="w-[40vw] h-[8vh] text-[3vw] font-bold bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-2xl"
                >
                  FECHAR
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Conteúdo Principal */}
          <div className="text-center flex-none mt-[1vh]">
            <h1 className="text-[6vw] font-black mb-[1vh] text-foreground">
              ATENDIMENTO PREFERENCIAL
            </h1>

            <p className="text-[3vw] mb-[1vh] text-muted-foreground font-black">
              Você tem direito a atendimento preferencial?
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-[2vh] min-h-0">
            <Button
              onClick={handlePrioritario}
              size="lg"
              className="w-full h-[18vh] text-[5vw] font-black border-4 shadow-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-[3vw] rounded-3xl"
            >
              <div className="flex items-center gap-[3vw]">
                {/* Imagem PCD com sombra branca */}
                <div className="flex flex-col items-center">
                  <img
                    src="/pcd.png"
                    alt="PCD"
                    className="w-[8vw] h-[8vw]"
                    style={{
                      filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.9)) drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.7))',
                    }}
                  />
                </div>

                <div className="text-center">
                  <span className="text-white">SIM, SOU PREFERENCIAL</span>
                  <div className="text-[2vw] text-orange-100 mt-2 font-bold">
                    PCD • IDOSO • GESTANTE • LACTANTE • OUTROS
                  </div>
                </div>
              </div>
            </Button>

            <Button
              onClick={handleNaoPrioritario}
              size="lg"
              className="w-full h-[18vh] text-[5vw] font-black border-4 shadow-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-[3vw] rounded-3xl"
            >
              <span className="text-white">NÃO SOU PREFERENCIAL</span>
            </Button>
          </div>

          <div className="flex justify-center mt-[2vh] flex-none mb-[1vh]">
            <Button
              onClick={() => navigate("/identificacao")}
              variant="outline"
              size="lg"
              className="w-[50vw] h-[10vh] text-[3.5vw] font-black border-4 shadow-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-2xl"
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
