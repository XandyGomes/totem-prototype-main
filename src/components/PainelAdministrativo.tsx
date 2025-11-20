import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, Plus, Save, AlertCircle } from 'lucide-react';

// Interface para definir a alocação de médico
interface MedicoAlocacao {
  id: string;
  medicoId: string;
  nomeMedico: string;
  especialidade: string;
  sala: string;
  setor: string;
  data: string;
  turno: 'manhã' | 'tarde' | 'noite';
  computadorId?: string;
}

// Interface para médicos disponíveis
interface Medico {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
}

// Mock data para médicos
const medicosDisponiveis: Medico[] = [
  { id: '1', nome: 'Dr. João Silva', especialidade: 'Clínica Geral', crm: '12345' },
  { id: '2', nome: 'Dra. Maria Santos', especialidade: 'Cardiologia', crm: '54321' },
  { id: '3', nome: 'Dr. Pedro Oliveira', especialidade: 'Neurologia', crm: '67890' },
  { id: '4', nome: 'Dra. Ana Costa', especialidade: 'Pediatria', crm: '09876' },
  { id: '5', nome: 'Dr. Carlos Lima', especialidade: 'Ortopedia', crm: '13579' },
];

// Mock data para salas por setor
const salasDisponiveis = {
  'verde': ['Verde-01', 'Verde-02', 'Verde-03', 'Verde-04'],
  'amarelo': ['Amarelo-01', 'Amarelo-02', 'Amarelo-03'],
  'azul': ['Azul-01', 'Azul-02', 'Azul-03', 'Azul-04', 'Azul-05'],
  'roxo': ['Roxo-01', 'Roxo-02', 'Roxo-03'],
};

export const PainelAdministrativo: React.FC = () => {
  const [alocacoes, setAlocacoes] = useState<MedicoAlocacao[]>([]);
  const [novaAlocacao, setNovaAlocacao] = useState<Partial<MedicoAlocacao>>({
    data: new Date().toISOString().split('T')[0],
    turno: 'manhã'
  });
  const [computadoresDetectados, setComputadoresDetectados] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // Simular detecção de computadores na rede
  useEffect(() => {
    // Mock da detecção automática de computadores
    const detectarComputadores = () => {
      const computadores = [
        'NGA-PC-01', 'NGA-PC-02', 'NGA-PC-03', 'NGA-PC-04',
        'NGA-PC-05', 'NGA-PC-06', 'NGA-PC-07', 'NGA-PC-08'
      ];
      setComputadoresDetectados(computadores);
    };

    detectarComputadores();
    // Atualizar a cada 30 segundos para simular detecção em tempo real
    const interval = setInterval(detectarComputadores, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Carregar alocações salvas
  useEffect(() => {
    const alocacoesSalvas = localStorage.getItem('medicosAlocacoes');
    if (alocacoesSalvas) {
      setAlocacoes(JSON.parse(alocacoesSalvas));
    }
  }, []);

  // Salvar alocações
  const salvarAlocacoes = (novasAlocacoes: MedicoAlocacao[]) => {
    setAlocacoes(novasAlocacoes);
    localStorage.setItem('medicosAlocacoes', JSON.stringify(novasAlocacoes));
  };

  // Adicionar nova alocação
  const adicionarAlocacao = () => {
    if (!novaAlocacao.medicoId || !novaAlocacao.sala || !novaAlocacao.data) {
      setAlertMessage('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se já existe alocação para esta sala/data/turno
    const conflito = alocacoes.find(a => 
      a.sala === novaAlocacao.sala && 
      a.data === novaAlocacao.data && 
      a.turno === novaAlocacao.turno
    );

    if (conflito) {
      setAlertMessage(`Já existe uma alocação para ${novaAlocacao.sala} no turno da ${novaAlocacao.turno} em ${novaAlocacao.data}`);
      return;
    }

    const medico = medicosDisponiveis.find(m => m.id === novaAlocacao.medicoId);
    const setor = Object.keys(salasDisponiveis).find(s => 
      salasDisponiveis[s as keyof typeof salasDisponiveis].includes(novaAlocacao.sala!)
    ) || '';

    const alocacao: MedicoAlocacao = {
      id: Date.now().toString(),
      medicoId: novaAlocacao.medicoId!,
      nomeMedico: medico?.nome || '',
      especialidade: medico?.especialidade || '',
      sala: novaAlocacao.sala!,
      setor,
      data: novaAlocacao.data!,
      turno: novaAlocacao.turno!,
      computadorId: novaAlocacao.computadorId
    };

    const novasAlocacoes = [...alocacoes, alocacao];
    salvarAlocacoes(novasAlocacoes);
    
    setNovaAlocacao({
      data: new Date().toISOString().split('T')[0],
      turno: 'manhã'
    });
    setAlertMessage('');
  };

  // Remover alocação
  const removerAlocacao = (id: string) => {
    const novasAlocacoes = alocacoes.filter(a => a.id !== id);
    salvarAlocacoes(novasAlocacoes);
  };

  // Detectar sala automaticamente baseado no computador
  const detectarSalaPorComputador = (computadorId: string) => {
    // Mock da lógica de detecção
    const mapeamento: Record<string, string> = {
      'NGA-PC-01': 'Verde-01',
      'NGA-PC-02': 'Verde-02', 
      'NGA-PC-03': 'Amarelo-01',
      'NGA-PC-04': 'Amarelo-02',
      'NGA-PC-05': 'Azul-01',
      'NGA-PC-06': 'Azul-02',
      'NGA-PC-07': 'Roxo-01',
      'NGA-PC-08': 'Roxo-02'
    };
    
    return mapeamento[computadorId] || '';
  };

  const alocacaoHoje = alocacoes.filter(a => a.data === new Date().toISOString().split('T')[0]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo NGA</h1>
      
      {alertMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Computadores Detectados */}
      <Card>
        <CardHeader>
          <CardTitle>Computadores Detectados na Rede</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {computadoresDetectados.map(pc => (
              <Badge key={pc} variant="outline" className="justify-center p-2">
                {pc}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Nova Alocação */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Alocação de Médico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Médico</label>
              <Select
                value={novaAlocacao.medicoId || ''}
                onValueChange={(value) => setNovaAlocacao(prev => ({ ...prev, medicoId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicosDisponiveis.map(medico => (
                    <SelectItem key={medico.id} value={medico.id}>
                      {medico.nome} - {medico.especialidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Data</label>
              <Input
                type="date"
                value={novaAlocacao.data || ''}
                onChange={(e) => setNovaAlocacao(prev => ({ ...prev, data: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Turno</label>
              <Select
                value={novaAlocacao.turno || ''}
                onValueChange={(value: 'manhã' | 'tarde' | 'noite') => 
                  setNovaAlocacao(prev => ({ ...prev, turno: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manhã">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                  <SelectItem value="noite">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Sala</label>
              <Select
                value={novaAlocacao.sala || ''}
                onValueChange={(value) => setNovaAlocacao(prev => ({ ...prev, sala: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sala" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(salasDisponiveis).map(([setor, salas]) => (
                    <div key={setor}>
                      <div className="px-2 py-1 text-sm font-semibold text-gray-600 bg-gray-100">
                        Setor {setor.charAt(0).toUpperCase() + setor.slice(1)}
                      </div>
                      {salas.map(sala => (
                        <SelectItem key={sala} value={sala}>
                          {sala}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Computador (Opcional)</label>
              <Select
                value={novaAlocacao.computadorId || ''}
                onValueChange={(value) => {
                  const salaDetectada = detectarSalaPorComputador(value);
                  setNovaAlocacao(prev => ({ 
                    ...prev, 
                    computadorId: value,
                    sala: salaDetectada || prev.sala 
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detectar sala" />
                </SelectTrigger>
                <SelectContent>
                  {computadoresDetectados.map(pc => (
                    <SelectItem key={pc} value={pc}>
                      {pc} → {detectarSalaPorComputador(pc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={adicionarAlocacao} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Alocação
          </Button>
        </CardContent>
      </Card>

      {/* Alocações de Hoje */}
      <Card>
        <CardHeader>
          <CardTitle>Alocações de Hoje ({alocacaoHoje.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {alocacaoHoje.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma alocação para hoje</p>
          ) : (
            <div className="space-y-2">
              {alocacaoHoje.map(alocacao => (
                <div key={alocacao.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{alocacao.nomeMedico}</div>
                    <div className="text-sm text-gray-500">
                      {alocacao.especialidade} • Sala {alocacao.sala} • Turno da {alocacao.turno}
                      {alocacao.computadorId && ` • PC: ${alocacao.computadorId}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      alocacao.setor === 'verde' ? 'default' :
                      alocacao.setor === 'amarelo' ? 'secondary' :
                      alocacao.setor === 'azul' ? 'outline' : 'destructive'
                    }>
                      {alocacao.setor}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removerAlocacao(alocacao.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Todas as Alocações */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Alocações ({alocacoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {alocacoes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma alocação cadastrada</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alocacoes
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map(alocacao => (
                <div key={alocacao.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{alocacao.nomeMedico}</div>
                    <div className="text-sm text-gray-500">
                      {alocacao.especialidade} • Sala {alocacao.sala} • {alocacao.data} • {alocacao.turno}
                      {alocacao.computadorId && ` • PC: ${alocacao.computadorId}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      alocacao.setor === 'verde' ? 'default' :
                      alocacao.setor === 'amarelo' ? 'secondary' :
                      alocacao.setor === 'azul' ? 'outline' : 'destructive'
                    }>
                      {alocacao.setor}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removerAlocacao(alocacao.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
