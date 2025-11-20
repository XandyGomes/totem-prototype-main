import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Clock, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Activity,
  MapPin,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  obterFilaMedico, 
  chamarPaciente, 
  iniciarAtendimento, 
  finalizarAtendimento,
  obterEstatisticasFila,
  detectarSalaMedico,
  type PacienteFila 
} from '../services/filaService';
import { Medico } from '../contexts/TotemContext';

interface InterfaceMedicoProps {
  medico: Medico;
}

export const InterfaceMedico: React.FC<InterfaceMedicoProps> = ({ medico }) => {
  const [fila, setFila] = useState<PacienteFila[]>([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [salaDetectada, setSalaDetectada] = useState<{ sala: string; setor: string } | null>(null);
  const [alertaSala, setAlertaSala] = useState<string>('');

  // Atualiza dados a cada 5 segundos
  useEffect(() => {
    const atualizarDados = () => {
      const filaMedico = obterFilaMedico(medico.id);
      if (filaMedico) {
        setFila([...filaMedico.pacientes]);
      }
      
      const stats = obterEstatisticasFila(medico.id);
      setEstatisticas(stats);
      
      // Detecta sala atual do médico
      const localizacao = detectarSalaMedico(medico.id);
      setSalaDetectada(localizacao);
      
      if (!localizacao) {
        setAlertaSala('Sua sala não foi detectada automaticamente. Verifique sua alocação no painel administrativo.');
      } else {
        setAlertaSala('');
      }
    };

    atualizarDados();
    const interval = setInterval(atualizarDados, 5000);
    
    return () => clearInterval(interval);
  }, [medico.id]);

  const handleChamarPaciente = (pacienteId: string) => {
    if (chamarPaciente(pacienteId)) {
      // Atualiza a lista imediatamente
      const filaMedico = obterFilaMedico(medico.id);
      if (filaMedico) {
        setFila([...filaMedico.pacientes]);
      }
    }
  };

  const handleIniciarAtendimento = (pacienteId: string) => {
    if (iniciarAtendimento(pacienteId)) {
      const filaMedico = obterFilaMedico(medico.id);
      if (filaMedico) {
        setFila([...filaMedico.pacientes]);
      }
    }
  };

  const handleFinalizarAtendimento = (pacienteId: string) => {
    if (finalizarAtendimento(pacienteId)) {
      const filaMedico = obterFilaMedico(medico.id);
      if (filaMedico) {
        setFila([...filaMedico.pacientes]);
      }
    }
  };

  const getStatusColor = (status: PacienteFila['status']) => {
    switch (status) {
      case 'aguardando': return 'bg-yellow-100 text-yellow-800';
      case 'chamando': return 'bg-blue-100 text-blue-800';
      case 'em_atendimento': return 'bg-green-100 text-green-800';
      case 'atendido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (nivel: number) => {
    switch (nivel) {
      case 1: return 'bg-red-500 text-white';
      case 2: return 'bg-orange-500 text-white';
      case 3: return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com informações do médico */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dr(a). {medico.nome}</h1>
          <p className="text-gray-600">{medico.especialidade}</p>
        </div>
        <div className="flex items-center gap-4">
          {salaDetectada ? (
            <div className="flex items-center gap-2 text-green-600">
              <Wifi className="w-5 h-5" />
              <span className="font-medium">
                {salaDetectada.sala} • Setor {salaDetectada.setor}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">Sala não detectada</span>
            </div>
          )}
          <Badge variant="outline" className="text-sm">
            CRM: {medico.crm}
          </Badge>
        </div>
      </div>

      {/* Alerta de sala */}
      {alertaSala && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alertaSala}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{estatisticas.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aguardando</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticas.aguardando}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Atendimento</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.emAtendimento}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Atendidos</p>
                  <p className="text-2xl font-bold text-gray-600">{estatisticas.atendidos}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Fila de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          {fila.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum paciente na fila</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fila.map((paciente, index) => (
                <div 
                  key={paciente.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">Senha: {paciente.senha.numero}</div>
                      <div className="text-sm text-gray-600">
                        {paciente.consulta.paciente.nome} • Chegada: {paciente.horarioChegada}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${getPrioridadeColor(paciente.prioridade.nivel)} px-2 py-1 text-xs font-medium`}
                    >
                      {paciente.prioridade.descricao}
                    </Badge>
                    
                    <Badge className={getStatusColor(paciente.status)}>
                      {paciente.status === 'aguardando' && 'Aguardando'}
                      {paciente.status === 'chamando' && 'Chamando'}
                      {paciente.status === 'em_atendimento' && 'Em Atendimento'}
                      {paciente.status === 'atendido' && 'Atendido'}
                    </Badge>

                    {paciente.status === 'aguardando' && (
                      <Button
                        size="sm"
                        onClick={() => handleChamarPaciente(paciente.id)}
                        className="ml-2"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Chamar
                      </Button>
                    )}

                    {paciente.status === 'chamando' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIniciarAtendimento(paciente.id)}
                        className="ml-2"
                      >
                        <Activity className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    )}

                    {paciente.status === 'em_atendimento' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleFinalizarAtendimento(paciente.id)}
                        className="ml-2"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Finalizar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
