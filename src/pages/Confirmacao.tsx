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
import { adicionarPacienteNaFila } from "@/services/filaService";

const Confirmacao = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useTotem();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Se não tem consulta, redireciona para identificação
  if (!state.consulta) {
    navigate("/welcome/identificacao");
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
  const getLineColors = (corNome: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
      'verde': { bg: "bg-green-100", border: "border-green-500", text: "text-green-800" },
      'amarelo': { bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-800" },
      'azul': { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800" },
      'violeta': { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-800" },
      'laranja': { bg: "bg-orange-100", border: "border-orange-500", text: "text-orange-800" }
    };

    return colorMap[corNome] || { bg: "bg-gray-100", border: "border-gray-500", text: "text-gray-800" };
  };

  const lineColors = getLineColors(setor.corNome);

  // Determina o nome da linha baseado na corNome
  const getLineName = (corNome: string) => {
    const lineNames: { [key: string]: string } = {
      'verde': 'LINHA VERDE',
      'amarelo': 'LINHA AMARELA',
      'azul': 'LINHA AZUL',
      'violeta': 'LINHA VIOLETA',
      'laranja': 'LINHA LARANJA'
    };

    return lineNames[corNome] || 'LINHA CINZA';
  };

  const lineName = getLineName(setor.corNome);

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
        prioridade,
        setor,
        sala: consulta.sala || 'A definir'
      };

      // Salva senha no contexto
      dispatch({ type: 'SET_SENHA_GERADA', payload: senhaGerada });

      console.log('📡 Chamando adicionarPacienteNaFila (Supabase)...');

      // Adiciona à fila persistente no Supabase
      try {
        await adicionarPacienteNaFila({
          consulta,
          prioridade,
          senha: senhaGerada,
          horarioChegada: new Date().toISOString()
        });
        console.log('✅ Paciente salvo no Supabase com sucesso.');
      } catch (e) {
        console.error('❌ Falha ao salvar no Supabase:', e);
        toast({
          title: "Erro de Sincronização",
          description: "Sua senha foi gerada, mas houve um erro ao sincronizar com o painel médico.",
          variant: "destructive"
        });
      }

      // Adiciona à fila do contexto local (opcional, para UI local imediata)
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
        navigate("/welcome/falha-impressao");
        return;
      }

      toast({
        title: "Senha gerada com sucesso!",
        description: `Sua senha: ${numeroSenha}`,
        duration: 3000,
      });

      navigate("/welcome/senha");

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
              <div className="flex flex-col gap-[1vh]">
                <div className="flex-1 space-y-[2vh] text-[3.5vw] leading-tight p-[1vw]">

                  <div className="break-words">
                    <span className="text-[2.2vw] font-black uppercase text-muted-foreground block">PACIENTE</span>
                    <span className="font-bold text-foreground text-[4vw]">{consulta.paciente.nome}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[2.2vw] font-black uppercase text-muted-foreground block">DATA E HORA</span>
                      <span className="font-bold text-foreground">{formatDate(consulta.data)} às {consulta.hora}</span>
                    </div>
                    <div className="break-words">
                      <span className="text-[2.2vw] font-black uppercase text-muted-foreground block">SETOR</span>
                      <span className="font-bold text-foreground uppercase">{setor.nome}</span>
                    </div>
                  </div>

                  <div className="break-words">
                    <span className="text-[2.2vw] font-black uppercase text-muted-foreground block">ESPECIALIDADE / MÉDICO</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{consulta.medico.especialidade}</span>
                      <span className="text-[2.8vw] text-foreground/70 font-bold uppercase">{consulta.medico.nome}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[2.2vw] font-black uppercase text-muted-foreground block mb-1">TIPO DE ATENDIMENTO</span>
                    <Badge variant="outline" className="font-black inline-flex items-center gap-3 px-6 py-2 text-[3vw] h-auto border-4 mt-1 bg-white">
                      <IconePrioridade tipo={prioridade.tipo} className="w-[5vw] h-[5vw]" />
                      {prioridade.descricao}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className={`text-center p-[3vh] rounded-[2rem] border-[6px] shadow-lg ${lineColors.bg} ${lineColors.border} mt-[2vh]`}>
                <div className="text-[2.5vw] font-black text-muted-foreground uppercase mb-1">Instrução de Caminho</div>
                <div className={`font-black ${lineColors.text} text-[6vw] leading-none tracking-tighter`}>
                  SIGA A: {lineName}
                </div>
                <div className={`font-bold ${lineColors.text} text-[3vw] mt-1 uppercase`}>
                  Direção: {setor.nome}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-[2vh]">
            <div className="flex flex-row gap-[2vw] mb-[2vh]">
              <Button
                onClick={() => navigate(state.isPrioritario ? "/welcome/selecionar-prioridade" : "/welcome/prioridade")}
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
