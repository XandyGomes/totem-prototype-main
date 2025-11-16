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
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw]">
        <Card className="w-[96vw] h-[83vh] flex flex-col justify-between p-[1.5vw] shadow-xl">
          <div className="text-center">
            <h1 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[1vh] text-foreground">
              SUA CONSULTA HOJE
            </h1>
            
            <p className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-black mb-[2vh] text-muted-foreground">
              Por favor, confirme os dados da sua consulta
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full p-[2vw] bg-muted/50 border-4">
              <div className="space-y-[1.5vh] text-[2.5vw] sm:text-[2vw] md:text-[1.6vw] lg:text-[1.3vw] xl:text-[1vw]">
                <div className="break-words">
                  <span className="font-black">PACIENTE:</span> <span className="font-black">{appointmentData.patient}</span>
                </div>
                <div>
                  <span className="font-black">DATA:</span> <span className="font-black">{appointmentData.date}</span>
                </div>
                <div>
                  <span className="font-black">HORA:</span> <span className="font-black">{appointmentData.time}</span>
                </div>
                <div className="break-words">
                  <span className="font-black">ESPECIALIDADE:</span> <span className="font-black">{appointmentData.specialty}</span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row gap-[1vw] mb-[1vh]">
              <Button
                onClick={() => navigate("/prioridade")}
                variant="outline"
                size="lg"
                className="flex-1 h-[7vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg order-2 sm:order-1"
              >
                VOLTAR
              </Button>
              <Button
                onClick={handleConfirm}
                size="lg"
                className="flex-1 h-[7vh] text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-black border-4 shadow-lg order-1 sm:order-2"
              >
                CONFIRMAR E IMPRIMIR SENHA
              </Button>
            </div>

            <p className="text-center text-[1.8vw] sm:text-[1.5vw] md:text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] font-black text-muted-foreground">
              Ao confirmar, aguarde a impressão da sua senha.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Confirmacao;
