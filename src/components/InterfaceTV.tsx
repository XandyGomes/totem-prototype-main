import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { obterChamadasRecentes } from "@/services/filaService";
import { tiposPrioridade, mockSetores } from "@/contexts/TotemContext";
import { Monitor, Volume2 } from "lucide-react";

interface InterfaceTVProps {
  setorFoco?: string; // Se especificado, foca apenas no setor
  titulo?: string;
}

const InterfaceTV = ({ setorFoco, titulo = "CHAMADAS NGA" }: InterfaceTVProps) => {
  const [chamadas, setChamadas] = useState<any[]>([]);
  const [horaAtual, setHoraAtual] = useState(new Date());

  useEffect(() => {
    const atualizarChamadas = () => {
      const chamadasRecentes = obterChamadasRecentes();
      
      // Filtra por setor se especificado
      const chamadasFiltradas = setorFoco 
        ? chamadasRecentes.filter(c => c.setor.toLowerCase() === setorFoco.toLowerCase())
        : chamadasRecentes;
      
      setChamadas(chamadasFiltradas.slice(0, 8)); // Mostra apenas as 8 mais recentes
    };

    const atualizarHora = () => {
      setHoraAtual(new Date());
    };

    atualizarChamadas();
    atualizarHora();

    // Atualiza chamadas a cada 2 segundos
    const intervalChamadas = setInterval(atualizarChamadas, 2000);
    // Atualiza hora a cada segundo
    const intervalHora = setInterval(atualizarHora, 1000);

    return () => {
      clearInterval(intervalChamadas);
      clearInterval(intervalHora);
    };
  }, [setorFoco]);

  const getSetorCor = (setor: string) => {
    const setorObj = mockSetores.find(s => 
      s.nome.toLowerCase() === setor.toLowerCase()
    );
    return setorObj?.cor || '#666666';
  };

  const getLineName = (setor: string) => {
    const cor = getSetorCor(setor);
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

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8"
      style={{
        backgroundImage: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Monitor className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl font-black">{titulo}</h1>
              {setorFoco && (
                <p className="text-xl text-blue-200">Setor: {setorFoco}</p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-3xl font-mono font-bold">
              {horaAtual.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
            <p className="text-lg text-blue-200">
              {horaAtual.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Grid de Chamadas */}
        {chamadas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Volume2 className="w-24 h-24 text-blue-300 mb-4" />
            <p className="text-2xl text-blue-200">Aguardando chamadas...</p>
            <p className="text-lg text-blue-300 mt-2">
              {setorFoco ? `Nenhuma chamada para ${setorFoco}` : 'Nenhuma chamada no momento'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {chamadas.map((chamada, index) => (
              <Card 
                key={index}
                className="p-6 bg-white/95 text-gray-900 border-4 shadow-2xl"
                style={{
                  borderColor: getSetorCor(chamada.setor),
                  animation: index === 0 ? 'pulse 2s infinite' : 'none'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">
                      {tiposPrioridade[chamada.prioridade.tipo]?.icone || '👤'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        SENHA: {chamada.senha}
                      </h2>
                      <Badge 
                        className="text-white font-bold"
                        style={{ backgroundColor: getSetorCor(chamada.setor) }}
                      >
                        {chamada.prioridade.descricao}
                      </Badge>
                    </div>
                  </div>
                  
                  {index === 0 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <Volume2 className="w-6 h-6" />
                      <span className="font-bold">CHAMANDO AGORA</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 text-lg">
                  <p>
                    <span className="font-bold">Médico:</span> {chamada.medico}
                  </p>
                  <p>
                    <span className="font-bold">Sala:</span> {chamada.sala}
                  </p>
                  <p>
                    <span className="font-bold">Setor:</span> {chamada.setor}
                  </p>
                </div>
                
                <div 
                  className="mt-4 p-3 rounded-lg text-center font-black text-white text-xl"
                  style={{ backgroundColor: getSetorCor(chamada.setor) }}
                >
                  SIGA A {getLineName(chamada.setor)}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Informações do rodapé */}
        <div className="mt-8 text-center text-blue-200">
          <p className="text-lg">
            🔊 Fique atento às chamadas • 
            Siga as linhas coloridas no chão • 
            Procure o atendente se precisar de ajuda
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterfaceTV;
