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
      
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-3xl p-12 shadow-xl">

          <h1 className="text-5xl font-bold mb-4 text-foreground">
            IDENTIFIQUE-SE
          </h1>
          
          <p className="text-2xl mb-8 text-muted-foreground">
            Informe seu CPF ou número do Cartão SUS (CNS)
          </p>

          <div className="mb-8 p-6 border-2 border-border rounded-lg bg-card">
            <input
              type="text"
              value={formatCPF(cpf)}
              readOnly
              placeholder="XXX.XXX.XXX-XX"
              className="w-full text-4xl text-center font-mono bg-transparent border-none outline-none"
            />
          </div>

          <div className="mb-12">
            <NumericKeypad 
              onNumberClick={handleNumberClick} 
              onBackspace={handleBackspace}
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="flex-1 h-16 text-2xl"
            >
              VOLTAR
            </Button>
            <Button
              onClick={handleNext}
              disabled={cpf.length !== 11}
              size="lg"
              className="flex-1 h-16 text-2xl"
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
