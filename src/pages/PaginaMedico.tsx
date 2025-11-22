import { InterfaceMedico } from "@/components/InterfaceMedico";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const PaginaMedico = () => {
  const { toast } = useToast();

  // Simula dados do médico logado - em produção viria do sistema de autenticação
  const medicoLogado = {
    id: 'med1',
    nome: 'Dr. Carlos Oliveira',
    especialidade: 'Cardiologia',
    crm: '12345-SP',
    sala: '11'
  };

  useEffect(() => {
    // Simula detecção automática de sala por computador
    const detectarSala = () => {
      // Em produção, isso seria feito pelo ID único do computador
      const computerId = 'COMP_SALA_11';
      console.log(`Médico logado no computador: ${computerId}`);
      
      toast({
        title: `Bem-vindo, ${medicoLogado.nome}!`,
        description: `Você está na ${medicoLogado.sala}`,
        duration: 3000,
      });
    };

    detectarSala();
  }, []);

  return (
    <InterfaceMedico 
      medico={medicoLogado}
    />
  );
};

export default PaginaMedico;
