import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Confirmacao = () => {
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from the API
  const appointmentData = {
    patient: "Nome Completo do Paciente",
    date: "Hoje (13/11/2025)",
    time: "14:30",
    specialty: "Clínico Geral/Cardiologia",
  };

  const handleConfirm = () => {
    navigate("/senha");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-4xl p-12 shadow-xl">
          <h1 className="text-5xl font-bold mb-6 text-center text-foreground">
            SUA CONSULTA HOJE
          </h1>
          
          <p className="text-2xl mb-8 text-center text-muted-foreground">
            Por favor, confirme os dados da sua consulta
          </p>

          <Card className="p-8 mb-12 bg-muted/50 border-2">
            <div className="space-y-4 text-2xl">
              <div>
                <span className="font-bold">PACIENTE:</span> {appointmentData.patient}
              </div>
              <div>
                <span className="font-bold">DATA:</span> {appointmentData.date}
              </div>
              <div>
                <span className="font-bold">HORA:</span> {appointmentData.time}
              </div>
              <div>
                <span className="font-bold">ESPECIALIDADE:</span> {appointmentData.specialty}
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/prioridade")}
              variant="outline"
              size="lg"
              className="flex-1 h-16 text-2xl"
            >
              VOLTAR
            </Button>
            <Button
              onClick={handleConfirm}
              size="lg"
              className="flex-1 h-16 text-2xl"
            >
              CONFIRMAR E IMPRIMIR SENHA
            </Button>
          </div>

          <p className="mt-6 text-center text-lg text-muted-foreground">
            Ao confirmar, aguarde a impressão da sua senha.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Confirmacao;
