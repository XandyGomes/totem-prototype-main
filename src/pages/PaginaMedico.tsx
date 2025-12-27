import { InterfaceMedico } from "@/features/medico/InterfaceMedico";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope } from "lucide-react";
import { Medico } from "@/contexts/TotemContext";

const PaginaMedico = () => {
  const { toast } = useToast();
  const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(null);

  // Médicos disponíveis no sistema (conforme mockConsultas)
  const medicosMock: Medico[] = [
    { id: 'med1', nome: 'Carlos Oliveira', especialidade: 'Cardiologia', crm: '12345-SP' },
    { id: 'med2', nome: 'Ana Santos', especialidade: 'Geriatria', crm: '65432-SP' }
  ];

  if (!medicoSelecionado) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-4 shadow-2xl">
          <CardHeader className="text-center bg-white border-b-4 pb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              Portal do Médico
            </CardTitle>
            <p className="text-slate-500 font-bold uppercase text-xs mt-2">Selecione seu perfil para iniciar</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {medicosMock.map((medico) => (
              <Button
                key={medico.id}
                onClick={() => {
                  setMedicoSelecionado(medico);
                  toast({
                    title: `Acesso Concedido`,
                    description: `Bem-vindo, Dr(a). ${medico.nome}`,
                  });
                }}
                className="w-full h-20 bg-white hover:bg-blue-50 text-slate-800 border-2 border-slate-200 hover:border-blue-400 flex items-center justify-start gap-4 px-6 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
                  <User className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-black uppercase text-sm block leading-none mb-1">Dr(a). {medico.nome}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{medico.especialidade} • CRM {medico.crm}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <InterfaceMedico
      medico={medicoSelecionado}
    />
  );
};

export default PaginaMedico;
