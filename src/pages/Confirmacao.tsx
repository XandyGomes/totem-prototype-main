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

      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-hidden">
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-between p-[2vw] shadow-xl">
          <div className="text-center mb-[2vh]">
            <h1 className="text-[5vw] font-black mb-[1vh] text-foreground leading-tight">
              CONFIRMAÇÃO DOS DADOS
            </h1>

            <p className="text-[3vw] font-black mb-[1vh] text-muted-foreground">
              Verifique se todos os dados estão corretos
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-[2vh]">
            <Card className="w-full p-[2vw] bg-muted/50 border-4 rounded-2xl shadow-inner">
              <div className="flex flex-col gap-[2vh]">
                <div className="flex flex-row gap-[2vw]">
                  <div className="flex-1 space-y-[1.5vh] text-[3vw] leading-tight">

                    <div className="break-words">
                      <span className="font-black text-muted-foreground block text-[2.2vw]">PACIENTE</span>
                      <span className="font-bold text-foreground">{consulta.paciente.nome}</span>
                    </div>

                    <div>
                      <span className="font-black text-muted-foreground block text-[2.2vw]">DATA E HORA</span>
                      <span className="font-bold text-foreground">{formatDate(consulta.data)} às {consulta.hora}</span>
                    </div>

                    <div className="break-words">
                      <span className="font-black text-muted-foreground block text-[2.2vw]">ESPECIALIDADE/MÉDICO</span>
                      <span className="font-bold text-foreground">{consulta.medico.especialidade}</span>
                      <div className="text-[2.5vw] text-foreground/80">{consulta.medico.nome}</div>
                    </div>

                    <div className="break-words">
                      <span className="font-black text-muted-foreground block text-[2.2vw]">SETOR</span>
                      <span className="font-bold text-foreground">{setor.nome}</span>
                    </div>

                    <div>
                      <span className="font-black text-muted-foreground block text-[2.2vw]">ATENDIMENTO</span>
                      <Badge variant="outline" className="font-bold inline-flex items-center gap-2 px-3 py-1 text-[2.5vw] h-auto border-2 mt-1">
                        <IconePrioridade tipo={prioridade.tipo} className="w-[4vw] h-[4vw]" />
                        {prioridade.descricao}
                      </Badge>
                    </div>
                  </div>

                  <Card className={`min-w-[30%] bg-background border-4 flex flex-col items-center justify-center p-[1vw] shadow-sm ${lineColors.border} rounded-xl self-start`}>
                    <span className="text-[2.5vw] font-black text-muted-foreground uppercase mb-1">
                      SALA
                    </span>
                    <span className={`text-[12vw] font-black ${lineColors.text} leading-none`}>
                      {consulta.sala || '--'}
                    </span>
                    {!consulta.sala && (
                      <span className="text-[2vw] text-center font-bold text-muted-foreground leading-tight mt-1">
                        A definir
                      </span>
                    )}
                  </Card>
                </div>
              </div>

              <div className={`text-center p-[2vh] rounded-xl border-4 ${lineColors.bg} ${lineColors.border} mt-[3vh]`}>
                <div className={`font-black ${lineColors.text} text-[4vw] leading-none`}>
                  SIGA A: {lineName}
                </div>
                <div className={`font-medium ${lineColors.text} text-[2.5vw] mt-[0.5vh]`}>
                  Direção: {setor.nome}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-[2vh]">
            <div className="flex flex-row gap-[2vw] mb-[2vh]">
              <Button
                onClick={() => navigate(state.isPrioritario ? "/selecionar-prioridade" : "/prioridade")}
                variant="outline"
                size="lg"
                disabled={isGenerating}
                className="flex-1 h-[12vh] text-[3.5vw] font-black border-4 shadow-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-2xl"
              >
                VOLTAR
              </Button>
              <Button
                onClick={handleConfirm}
                size="lg"
                disabled={isGenerating}
                className="flex-1 h-[12vh] font-black border-4 shadow-lg flex flex-col items-center justify-center rounded-2xl bg-primary hover:bg-primary/90"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-[4vw] w-[4vw] animate-spin mb-1" />
                    <span className="text-[2.5vw] leading-tight">
                      GERANDO...
                    </span>
                  </div>
                ) : (
                  <div className="text-center leading-tight">
                    <div className="text-[3.5vw]">
                      CONFIRMAR
                    </div>
                  </div>
                )}
              </Button>
            </div>

            <p className="text-center text-[2vw] font-black text-muted-foreground">
              Ao confirmar, aguarde a impressão da sua senha.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Confirmacao;
