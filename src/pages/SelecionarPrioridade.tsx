import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTotem, tiposPrioridade, TipoPrioridade } from "@/contexts/TotemContext";
import { IconePrioridade } from "@/components/IconePrioridade";

const SelecionarPrioridade = () => {
  const navigate = useNavigate();
  const { dispatch } = useTotem();

  const handleSelecionarPrioridade = (tipo: TipoPrioridade) => {
    const prioridade = tiposPrioridade[tipo];
    
    dispatch({ 
      type: 'SET_PRIORIDADE', 
      payload: { 
        isPrioritario: true,
        prioridadeSelecionada: {
          tipo,
          descricao: prioridade.descricao,
          nivel: prioridade.nivel
        }
      } 
    });
    
    navigate("/confirmacao");
  };

  // Grupos de prioridades
  const superPrioridade = [
    { tipo: 'superprioridade' as TipoPrioridade, cor: 'bg-red-600 hover:bg-red-700' }
  ];

  const prioridadeLegal = [
    { tipo: 'idoso_60_79' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
    { tipo: 'pcd' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
    { tipo: 'gestante' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
    { tipo: 'lactante' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
    { tipo: 'crianca_colo' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
    { tipo: 'autista' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
    { tipo: 'mobilidade_reduzida' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' },
    { tipo: 'obeso' as TipoPrioridade, cor: 'bg-orange-600 hover:bg-orange-700' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-auto">
        <Card className="w-[96vw] h-[81vh] flex flex-col p-[1.5vw] shadow-xl">
          
          <div className="text-center mb-[2vh]">
            <h1 className="text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] xl:text-[1.8vw] font-black mb-[1vh] text-foreground">
              SELECIONE SEU TIPO DE ATENDIMENTO PREFERENCIAL
            </h1>
            
            <p className="text-[1.8vw] sm:text-[1.5vw] md:text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] text-muted-foreground font-medium">
              Escolha apenas se você se enquadra em uma das categorias abaixo
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-[2vh]">
            
            {/* Superprioridade */}
            <div>
              <h2 className="text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-bold text-red-600 mb-[1vh] flex items-center">
                SUPERPRIORIDADE
              </h2>
              
              {superPrioridade.map(({ tipo, cor }) => (
                <Button
                  key={tipo}
                  onClick={() => handleSelecionarPrioridade(tipo)}
                  size="lg"
                  className={`w-full h-[8vh] text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-bold border-2 shadow-lg ${cor} mb-[1vh] flex items-center justify-start gap-[2vw] px-[2vw]`}
                >
                  <IconePrioridade 
                    tipo={tipo}
                    className="w-[3vw] h-[3vw] sm:w-[2.5vw] sm:h-[2.5vw] md:w-[2vw] md:h-[2vw] lg:w-[1.5vw] lg:h-[1.5vw] xl:w-[1.2vw] xl:h-[1.2vw]" 
                  />
                  <span className="text-white text-left">
                    {tiposPrioridade[tipo].descricao}
                  </span>
                </Button>
              ))}
            </div>

            {/* Atendimento Preferencial Legal */}
            <div>
              <h2 className="text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-bold text-orange-600 mb-[1vh] flex items-center">
                ATENDIMENTO PREFERENCIAL LEGAL
              </h2>
              
              <div className="grid grid-cols-1 gap-[1vh]">
                {prioridadeLegal.map(({ tipo, cor }) => (
                  <Button
                    key={tipo}
                    onClick={() => handleSelecionarPrioridade(tipo)}
                    size="lg"
                    className={`w-full h-[7vh] text-[2vw] sm:text-[1.6vw] md:text-[1.3vw] lg:text-[1vw] xl:text-[0.9vw] font-medium border-2 shadow-lg ${cor} flex items-center justify-start gap-[2vw] px-[2vw]`}
                  >
                    <IconePrioridade 
                      tipo={tipo}
                      className="w-[2.5vw] h-[2.5vw] sm:w-[2vw] sm:h-[2vw] md:w-[1.8vw] md:h-[1.8vw] lg:w-[1.3vw] lg:h-[1.3vw] xl:w-[1.1vw] xl:h-[1.1vw]" 
                    />
                    <span className="text-white text-left">
                      {tiposPrioridade[tipo].descricao}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-[2vh]">
            <Button
              onClick={() => navigate("/prioridade")}
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

export default SelecionarPrioridade;
