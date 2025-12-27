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

    navigate("/welcome/confirmacao");
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

      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
        <Card className="w-[96vw] h-[76vh] flex flex-col p-[1.5vw] shadow-xl">

          <div className="text-center mb-[1vh] flex-none">
            <h1 className="text-[4vw] font-black mb-[0.5vh] text-foreground leading-tight">
              SELECIONE SEU TIPO DE ATENDIMENTO PREFERENCIAL
            </h1>

            <p className="text-[2vw] text-muted-foreground font-medium">
              Escolha apenas se você se enquadra em uma das categorias abaixo
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-[1vh] min-h-0">

            {/* Superprioridade */}
            <div className="text-center flex-none">
              <h2 className="text-[3vw] font-bold text-red-600 mb-[0.5vh]">
                SUPERPRIORIDADE
              </h2>

              <div className="flex justify-center">
                {superPrioridade.map(({ tipo, cor }) => (
                  <Button
                    key={tipo}
                    onClick={() => handleSelecionarPrioridade(tipo)}
                    size="lg"
                    className={`w-full max-w-[90vw] h-[9vh] text-[3.5vw] font-bold border-4 shadow-lg ${cor} flex items-center justify-center gap-[2vw] px-[2vw] rounded-xl`}
                  >
                    <IconePrioridade
                      tipo={tipo}
                      className="w-[6vw] h-[6vw]"
                    />
                    <span className="text-white text-center">
                      {tiposPrioridade[tipo].descricao}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Atendimento Preferencial Legal */}
            <div className="text-center flex-1 flex flex-col min-h-0">
              <h2 className="text-[3vw] font-bold text-orange-600 mb-[1vh] flex-none">
                ATENDIMENTO PREFERENCIAL LEGAL
              </h2>

              <div className="grid grid-cols-2 gap-[1.2vh] justify-items-center flex-1">
                {prioridadeLegal.map(({ tipo, cor }) => (
                  <Button
                    key={tipo}
                    onClick={() => handleSelecionarPrioridade(tipo)}
                    className={`w-full h-full text-[2.2vw] font-bold border-2 shadow-lg ${cor} flex items-center justify-center gap-[1vw] px-[1vw] leading-tight rounded-xl py-0.5`}
                  >
                    <IconePrioridade
                      tipo={tipo}
                      className="w-[5vw] h-[5vw] flex-shrink-0"
                    />
                    <span className="text-white text-center whitespace-normal leading-none">
                      {tiposPrioridade[tipo].descricao}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-[1vh] flex-none mb-[1vh]">
            <Button
              onClick={() => navigate("/welcome/prioridade")}
              variant="outline"
              size="lg"
              className="w-[50vw] h-[8vh] text-[3vw] font-black border-4 shadow-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-xl"
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
