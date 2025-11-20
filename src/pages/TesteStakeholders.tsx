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
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex-none p-3 sm:p-4">
        <div className="text-center mb-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-800 mb-2">
            NGA - TESTES STAKEHOLDERS
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-4xl mx-auto px-2">
            Ambiente de testes para validação das interfaces do sistema de totem do 
            <strong> Núcleo de Gestão Ambulatorial</strong>
          </p>
          <div className="mt-3 flex justify-center">
            <Badge variant="outline" className="text-xs px-2 py-1">
              <Users className="w-3 h-3 mr-1" />
              Versão para Stakeholders
            </Badge>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-3">
        {/* Cards das Interfaces */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 max-w-7xl mx-auto mb-4">
          {telas.map(({ id, titulo, subtitulo, descricao, rota, icone: Icone, cor, badge }) => (
            <Card key={id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white h-fit">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 leading-tight mb-1">
                      {titulo}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">{subtitulo}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs w-fit shrink-0">
                    {badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                    <Icone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {descricao}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate(rota)}
                    className={`w-full text-sm font-bold py-2 ${cor} text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    ABRIR {titulo}
                  </Button>
                  
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {rota}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instruções Compactas */}
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-bold text-gray-800 text-center">
                📋 Instruções para Testes
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    🎯 <span className="ml-2">Fluxo Recomendado:</span>
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
                    <li>Comece pelo <strong>TOTEM</strong> (experiência do paciente)</li>
                    <li>Teste o <strong>MÉDICO</strong> (gestão de filas)</li>
                    <li>Verifique a <strong>TV</strong> (exibição pública)</li>
                    <li>Explore o <strong>ADMIN</strong> (configurações)</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    ⚠️ <span className="ml-2">Pontos de Atenção:</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Use dados fictícios nos testes</li>
                    <li>Teste em diferentes tamanhos de tela</li>
                    <li>Verifique a responsividade</li>
                    <li>Anote feedback para melhorias</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-1 text-gray-500 text-xs">
                  <Monitor className="w-3 h-3" />
                  <span>Esta é uma página temporária apenas para testes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
