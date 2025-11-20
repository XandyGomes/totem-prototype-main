import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTotem, mockSetores, tiposPrioridade } from "@/contexts/TotemContext";
import { gerarNumeroSenha, imprimirSenha } from "@/services/consultaService";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { IconePrioridade } from "@/components/IconePrioridade";

const Confirmacao = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useTotem();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Se não tem consulta, redireciona para identificação
  if (!state.consulta) {
    navigate("/identificacao");
    return null;
  }

  const consulta = state.consulta;
  const prioridade = state.prioridadeSelecionada || {
    tipo: 'comum' as const,
    descricao: 'Atendimento não preferencial',
    nivel: 3 as const
  };

  // Busca o setor e sua cor
  const setor = mockSetores.find(s => 
    s.nome.toLowerCase() === consulta.setor.toLowerCase()
  ) || mockSetores[0];

  // Função para obter cores baseadas no setor
  const getLineColors = (cor: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
      '#FF0000': { bg: "bg-red-100", border: "border-red-500", text: "text-red-800" },
      '#00FF00': { bg: "bg-green-100", border: "border-green-500", text: "text-green-800" },
      '#0000FF': { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800" },
      '#FFFF00': { bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-800" },
      '#FF00FF': { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-800" },
      '#800080': { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-800" },
      '#FFA500': { bg: "bg-orange-100", border: "border-orange-500", text: "text-orange-800" }
    };
    
    return colorMap[cor] || { bg: "bg-gray-100", border: "border-gray-500", text: "text-gray-800" };
  };

  const lineColors = getLineColors(setor.cor);

  // Determina o nome da linha baseado na cor
  const getLineName = (cor: string) => {
    const lineNames: { [key: string]: string } = {
      '#FF0000': 'LINHA VERMELHA',
      '#00FF00': 'LINHA VERDE', 
      '#0000FF': 'LINHA AZUL',
      '#FFFF00': 'LINHA AMARELA',
      '#FF00FF': 'LINHA ROSA',
      '#800080': 'LINHA ROXA',
      '#FFA500': 'LINHA LARANJA'
    };
    
    return lineNames[cor] || 'LINHA CINZA';
  };

  const lineName = getLineName(setor.cor);

  const handleConfirm = async () => {
    setIsGenerating(true);

    try {
      // Determina tipo de prioridade para geração de senha
      let tipoPrioridadeSenha: 'superprioridade' | 'prioritario' | 'comum';
      
      if (prioridade.nivel === 1) {
        tipoPrioridadeSenha = 'superprioridade';
      } else if (prioridade.nivel === 2) {
        tipoPrioridadeSenha = 'prioritario';
      } else {
        tipoPrioridadeSenha = 'comum';
      }

      // Gera número da senha
      const numeroSenha = await gerarNumeroSenha(tipoPrioridadeSenha);
      
      const senhaGerada = {
        numero: numeroSenha,
        tipo: prioridade.descricao,
        horario: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        prioridade
      };

      // Salva senha no contexto
      dispatch({ type: 'SET_SENHA_GERADA', payload: senhaGerada });

      // Adiciona à fila
      dispatch({ 
        type: 'ADD_TO_FILA', 
        payload: { 
          consulta, 
          prioridade, 
          senha: senhaGerada 
        } 
      });

      // Tenta imprimir
      const resultadoImpressao = await imprimirSenha({
        numeroSenha,
        nomeSetor: setor.nome,
        nomeMedico: consulta.medico.nome,
        sala: consulta.sala || 'A definir',
        prioridade: prioridade.descricao,
        corSetor: setor.cor
      });

      if (!resultadoImpressao.sucesso) {
        navigate("/falha-impressao");
        return;
      }

      toast({
        title: "Senha gerada com sucesso!",
        description: `Sua senha: ${numeroSenha}`,
        duration: 3000,
      });

      navigate("/senha");

    } catch (error) {
      console.error('Erro ao gerar senha:', error);
      toast({
        title: "Erro ao gerar senha",
        description: "Tente novamente ou procure o atendente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today ? 'Hoje' : new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[1.5vw]">
        <Card className="w-[90vw] max-w-[800px] h-[78vh] flex flex-col justify-between p-[2.5vw] sm:p-[2vw] md:p-[1.5vw] shadow-xl">
          <div className="text-center">
            <h1 className="text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black mb-[1vh] text-foreground">
              CONFIRMAÇÃO DOS DADOS
            </h1>
            
            <p className="text-[1.8vw] sm:text-[1.5vw] md:text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] font-black mb-[1.5vh] text-muted-foreground">
              Verifique se todos os dados estão corretos
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full p-[2vw] sm:p-[1.8vw] md:p-[1.3vw] bg-muted/50 border-4">
              <div className="space-y-[1vh] text-[2.3vw] sm:text-[1.9vw] md:text-[1.6vw] lg:text-[1.3vw] xl:text-[1vw]">
                
                <div className="break-words">
                  <span className="font-black">PACIENTE:</span> 
                  <span className="font-bold ml-2">{consulta.paciente.nome}</span>
                </div>
                
                <div>
                  <span className="font-black">DATA:</span> 
                  <span className="font-bold ml-2">{formatDate(consulta.data)} ({consulta.hora})</span>
                </div>
                
                <div className="break-words">
                  <span className="font-black">ESPECIALIDADE:</span> 
                  <span className="font-bold ml-2">{consulta.medico.especialidade}</span>
                </div>
                
                <div className="break-words">
                  <span className="font-black">MÉDICO:</span> 
                  <span className="font-bold ml-2">{consulta.medico.nome}</span>
                </div>
                
                <div className="break-words">
                  <span className="font-black">SETOR:</span> 
                  <span className="font-bold ml-2">{setor.nome}</span>
                </div>
                
                <div className="break-words">
                  <span className="font-black">SALA:</span> 
                  <span className="font-bold ml-2">{consulta.sala || 'Será informada na recepção'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-black">ATENDIMENTO:</span>
                  <Badge variant="outline" className="font-bold flex items-center gap-2">
                    <IconePrioridade tipo={prioridade.tipo} className="w-4 h-4" />
                    {prioridade.descricao}
                  </Badge>
                </div>
                
                <div className={`text-center p-[1vh] rounded-lg border-4 ${lineColors.bg} ${lineColors.border} mt-[1.5vh]`}>
                  <div className={`font-black ${lineColors.text} text-[2.8vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[1.4vw] xl:text-[1.1vw]`}>
                    SIGA A: {lineName}
                  </div>
                  <div className={`font-medium ${lineColors.text} text-[1.6vw] sm:text-[1.2vw] md:text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw] mt-1`}>
                    Direção: {setor.nome}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <div className="flex flex-row gap-[1.5vw] mb-[1vh]">
              <Button
                onClick={() => navigate(state.isPrioritario ? "/selecionar-prioridade" : "/prioridade")}
                variant="outline"
                size="lg"
                disabled={isGenerating}
                className="flex-1 h-[8vh] text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-black border-4 shadow-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground"
              >
                VOLTAR
              </Button>
              <Button
                onClick={handleConfirm}
                size="lg"
                disabled={isGenerating}
                className="flex-1 h-[8vh] font-black border-4 shadow-lg flex flex-col items-center justify-center"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-[2.5vw] w-[2.5vw] sm:h-[2vw] sm:w-[2vw] md:h-[1.5vw] md:w-[1.5vw] lg:h-[1.2vw] lg:w-[1.2vw] xl:h-[1vw] xl:w-[1vw] animate-spin mb-1" />
                    <span className="text-[1.8vw] sm:text-[1.5vw] md:text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] leading-tight">
                      GERANDO SENHA...
                    </span>
                  </div>
                ) : (
                  <div className="text-center leading-tight">
                    <div className="text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw]">
                      CONFIRMAR E
                    </div>
                    <div className="text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw]">
                      IMPRIMIR SENHA
                    </div>
                  </div>
                )}
              </Button>
            </div>

            <p className="text-center text-[1.3vw] sm:text-[1vw] md:text-[0.8vw] lg:text-[0.7vw] xl:text-[0.6vw] font-black text-muted-foreground">
              Ao confirmar, aguarde a impressão da sua senha.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Confirmacao;
