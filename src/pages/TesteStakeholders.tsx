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
  ExternalLink,
  Info
} from 'lucide-react';
import { TotemHeader } from '@/components/TotemHeader';

export const TesteStakeholders = () => {
  const navigate = useNavigate();

  const telas = [
    {
      id: 'totem',
      titulo: 'TOTEM',
      subtitulo: 'Paciente',
      descricao: 'Fluxo completo: identificação, prioridade e confirmação',
      rota: '/',
      icone: Monitor,
      cor: 'bg-blue-600 hover:bg-blue-700',
      badge: 'Principal'
    },
    {
      id: 'medico',
      titulo: 'MÉDICO',
      subtitulo: 'Profissional',
      descricao: 'Gestão de filas, chamada de pacientes e atendimentos',
      rota: '/medico',
      icone: Stethoscope,
      cor: 'bg-green-600 hover:bg-green-700',
      badge: 'Operacional'
    },
    {
      id: 'tv',
      titulo: 'TV',
      subtitulo: 'Painel',
      descricao: 'Exibição pública de chamadas com senhas e salas',
      rota: '/tv',
      icone: Tv,
      cor: 'bg-purple-600 hover:bg-purple-700',
      badge: 'Público'
    },
    {
      id: 'admin',
      titulo: 'ADMIN',
      subtitulo: 'Gestão',
      descricao: 'Alocação de médicos, gestão de salas e configurações',
      rota: '/admin',
      icone: Settings,
      cor: 'bg-red-600 hover:bg-red-700',
      badge: 'Gestão'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />

      <main className="flex-1 flex flex-col p-[2vw] overflow-hidden">
        <div className="text-center mb-[2vh]">
          <h1 className="text-[5vw] font-black text-foreground mb-[1vh]">
            NGA - TESTES
          </h1>
          <p className="text-[2.5vw] text-muted-foreground font-medium">
            Selecione a interface para testar
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-[2vh]">
          {telas.map(({ id, titulo, subtitulo, descricao, rota, icone: Icone, cor, badge }) => (
            <Card key={id} className="flex flex-row items-center p-[2vw] shadow-md hover:shadow-xl transition-all duration-300 border-4 hover:border-primary/50 bg-card cursor-pointer" onClick={() => navigate(rota)}>
              <div className={`p-[3vw] rounded-2xl ${cor.split(' ')[0]} mr-[3vw]`}>
                <Icone className="w-[8vw] h-[8vw] text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-[2vw] mb-[0.5vh]">
                  <h2 className="text-[4vw] font-black text-foreground leading-none">
                    {titulo}
                  </h2>
                  <Badge variant="secondary" className="text-[2vw] px-[2vw] py-[0.5vh]">
                    {badge}
                  </Badge>
                </div>
                <p className="text-[2.5vw] text-muted-foreground font-medium leading-tight">
                  {subtitulo}
                </p>
              </div>

              <ExternalLink className="w-[6vw] h-[6vw] text-muted-foreground/50 ml-[2vw]" />
            </Card>
          ))}
        </div>

        <div className="mt-[2vh] p-[2vw] bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/30">
          <div className="flex items-start gap-[2vw]">
            <Info className="w-[5vw] h-[5vw] text-blue-500 mt-[0.5vh]" />
            <div className="text-[2.2vw] text-muted-foreground">
              <p className="font-bold mb-[0.5vh]">Instruções Rápidas:</p>
              <p>1. O fluxo ideal é: <strong>TOTEM</strong> → <strong>MÉDICO</strong> → <strong>TV</strong>.</p>
              <p>2. Use o <strong>TOTEM</strong> para gerar senhas.</p>
              <p>3. Use o <strong>MÉDICO</strong> para chamar as senhas.</p>
              <p>4. Veja o resultado na <strong>TV</strong>.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
