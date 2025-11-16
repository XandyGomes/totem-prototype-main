import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { NumericKeypad } from "@/components/NumericKeypad";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Identificacao = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");

  const handleNumberClick = (num: string) => {
    if (cpf.length < 11) {
      setCpf(cpf + num);
    }
  };

  const handleBackspace = () => {
    setCpf(cpf.slice(0, -1));
  };

  const handleClear = () => {
    setCpf("");
  };

  const formatCPF = (value: string) => {
    if (value.length <= 3) return value;
    if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`;
    if (value.length <= 9) return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
  };

  const handleNext = () => {
    if (cpf === "11111111111") {
      navigate("/prioridade");
    }
    else {
      navigate("/cpf-invalido");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-auto">
        <Card className="w-[96vw] h-[81vh] flex flex-col justify-between p-[1.5vw] shadow-xl">

          <div className="text-center">
            <h1 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[0.5vh] text-foreground">
              IDENTIFIQUE-SE
            </h1>
            
            <p className="text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] mb-[0.8vh] text-muted-foreground font-black">
              Informe seu CPF ou número do Cartão SUS (CNS)
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[70vw] mb-[1.2vh] p-[1vw] border-4 border-border rounded-lg bg-card shadow-lg">
              <input
                type="text"
                value={formatCPF(cpf)}
                readOnly
                placeholder="XXX.XXX.XXX-XX"
                className="w-full text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] xl:text-[1.8vw] text-center font-mono font-black bg-transparent border-none outline-none"
              />
            </div>

            <div className="mb-[1vh]">
              <NumericKeypad 
                onNumberClick={handleNumberClick} 
                onBackspace={handleBackspace}
                onClear={handleClear}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-[1vw]">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="flex-1 h-[7vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg order-2 sm:order-1"
            >
              VOLTAR
            </Button>
            <Button
              onClick={handleNext}
              disabled={cpf.length !== 11}
              size="lg"
              className="flex-1 h-[7vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg order-1 sm:order-2"
            >
              AVANÇAR
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Identificacao;
