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
    sector: "SETOR B - SALA 105",
    guideLine: "LINHA VERMELHA",
  };

  // Function to get the correct colors based on the guide line
  const getLineColors = (guideLine: string) => {
    const line = guideLine.toUpperCase();
    
    if (line.includes("VERMELHA")) {
      return {
        bg: "bg-red-100",
        border: "border-red-300",
        text: "text-red-800"
      };
    } else if (line.includes("AZUL")) {
      return {
        bg: "bg-blue-100",
        border: "border-blue-300",
        text: "text-blue-800"
      };
    } else if (line.includes("VERDE")) {
      return {
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-800"
      };
    } else if (line.includes("AMARELA")) {
      return {
        bg: "bg-yellow-100",
        border: "border-yellow-300",
        text: "text-yellow-800"
      };
    } else if (line.includes("ROSA") || line.includes("PINK")) {
      return {
        bg: "bg-pink-100",
        border: "border-pink-300",
        text: "text-pink-800"
      };
    } else if (line.includes("ROXA") || line.includes("PURPLE")) {
      return {
        bg: "bg-purple-100",
        border: "border-purple-300",
        text: "text-purple-800"
      };
    } else if (line.includes("LARANJA") || line.includes("ORANGE")) {
      return {
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-800"
      };
    } else {
      // Default gray for unknown lines
      return {
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-800"
      };
    }
  };

  const lineColors = getLineColors(appointmentData.guideLine);

  const handleConfirm = () => {
    navigate("/senha");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[2vw]">
        <Card className="w-[90vw] max-w-[800px] h-[78vh] flex flex-col justify-between p-[3vw] sm:p-[2.5vw] md:p-[2vw] shadow-xl">
          <div className="text-center">
            <h1 className="text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-black mb-[1vh] text-foreground">
              SUA CONSULTA HOJE
            </h1>
            
            <p className="text-[1.8vw] sm:text-[1.5vw] md:text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] font-black mb-[2vh] text-muted-foreground">
              Por favor, confirme os dados da sua consulta
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full p-[2.5vw] sm:p-[2vw] md:p-[1.5vw] bg-muted/50 border-4">
              <div className="space-y-[1.8vh] text-[2.8vw] sm:text-[2.4vw] md:text-[2vw] lg:text-[1.6vw] xl:text-[1.2vw]">
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
                <div className="break-words">
                  <span className="font-black">SETOR:</span> <span className="font-black">{appointmentData.sector}</span>
                </div>
                <div className={`text-center p-[1.2vh] rounded-lg border-2 ${lineColors.bg} ${lineColors.border}`}>
                  <span className={`font-black ${lineColors.text} text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.6vw] xl:text-[1.3vw]`}>
                    SIGA A: {appointmentData.guideLine}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row gap-[1.5vw] mb-[1vh]">
              <Button
                onClick={() => navigate("/prioridade")}
                variant="outline"
                size="lg"
                className="flex-1 h-[6vh] text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-black border-4 shadow-lg order-2 sm:order-1"
              >
                VOLTAR
              </Button>
              <Button
                onClick={handleConfirm}
                size="lg"
                className="flex-1 h-[6vh] text-[1.8vw] sm:text-[1.5vw] md:text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] font-black border-4 shadow-lg order-1 sm:order-2"
              >
                CONFIRMAR E IMPRIMIR SENHA
              </Button>
            </div>

            <p className="text-center text-[1.5vw] sm:text-[1.2vw] md:text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw] font-black text-muted-foreground">
              Ao confirmar, aguarde a impressão da sua senha.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Confirmacao;
