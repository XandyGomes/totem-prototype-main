import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tv, 
  Settings, 
  Stethoscope, 
  Users,
  ExternalLink 
} from 'lucide-react';

export const TesteStakeholders = () => {
  const navigate = useNavigate();

  const telas = [
    {
      id: 'totem',
      titulo: 'TOTEM',
      subtitulo: 'Interface do Paciente',
      descricao: 'Fluxo completo: identificação, prioridade e confirmação',
      rota: '/',
      icone: Monitor,
      cor: 'bg-blue-600 hover:bg-blue-700',
      badge: 'Principal'
    },
    {
      id: 'medico',
      titulo: 'MÉDICO',
      subtitulo: 'Interface Profissional',
      descricao: 'Gestão de filas, chamada de pacientes e atendimentos',
      rota: '/medico',
      icone: Stethoscope,
      cor: 'bg-green-600 hover:bg-green-700',
      badge: 'Operacional'
    },
    {
      id: 'tv',
      titulo: 'TV',
      subtitulo: 'Painel de Chamadas',
      descricao: 'Exibição pública de chamadas com senhas e salas',
      rota: '/tv',
      icone: Tv,
      cor: 'bg-purple-600 hover:bg-purple-700',
      badge: 'Público'
    },
    {
      id: 'admin',
      titulo: 'ADMIN',
      subtitulo: 'Painel Administrativo',
      descricao: 'Alocação de médicos, gestão de salas e configurações',
      rota: '/admin',
      icone: Settings,
      cor: 'bg-red-600 hover:bg-red-700',
      badge: 'Gestão'
    }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex-none p-2">
        <div className="text-center">
          <h1 className="text-xl font-black text-gray-800 mb-1">
            NGA - TESTES STAKEHOLDERS
          </h1>
          <p className="text-sm text-gray-600">
            Ambiente de testes - <strong>Núcleo de Gestão Ambulatorial</strong>
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden px-2 pb-2">
        <div className="h-full flex flex-col gap-2 max-w-7xl mx-auto">
          
          {/* Cards das Interfaces */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {telas.map(({ id, titulo, subtitulo, descricao, rota, icone: Icone, cor, badge }) => (
              <Card key={id} className="flex flex-col shadow-md hover:shadow-lg transition-all duration-300 border hover:border-blue-200 bg-white">
                <CardHeader className="pb-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-gray-800 leading-tight">
                        {titulo}
                      </CardTitle>
                      <p className="text-xs text-gray-500 font-medium">{subtitulo}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-2 py-2">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-gray-100 rounded shrink-0">
                      <Icone className="w-3 h-3 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600 leading-tight">
                      {descricao}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Button 
                      onClick={() => navigate(rota)}
                      className={`w-full text-xs font-bold py-1.5 ${cor} text-white transition-all duration-200`}
                      size="sm"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      ABRIR {titulo}
                    </Button>
                    
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs py-0">
                        {rota}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instruções Ultra Compactas */}
          <div className="flex-none">
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-bold text-gray-800 text-center flex items-center justify-center gap-2">
                  📋 Instruções
                  <Badge variant="outline" className="text-xs py-0">
                    <Users className="w-2 h-2 mr-1" />
                    Testes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-1">
                      🎯 Fluxo:
                    </h3>
                    <ol className="list-decimal list-inside space-y-0 text-xs text-gray-600 leading-tight">
                      <li><strong>TOTEM</strong> → <strong>MÉDICO</strong> → <strong>TV</strong> → <strong>ADMIN</strong></li>
                      <li>Use dados fictícios nos testes</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-1">
                      ⚠️ Atenção:
                    </h3>
                    <ul className="list-disc list-inside space-y-0 text-xs text-gray-600 leading-tight">
                      <li>Teste responsividade</li>
                      <li>Anote feedback para melhorias</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-1 text-center">
                  <div className="inline-flex items-center gap-1 text-gray-500 text-xs">
                    <Monitor className="w-2 h-2" />
                    <span>Página temporária para testes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
