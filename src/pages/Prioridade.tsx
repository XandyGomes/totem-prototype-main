import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotemHeader } from "@/components/TotemHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Prioridade = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const priorityGroups = [
    { id: "geral", label: "ATENDIMENTO NÃO PREFERENCIAL" },
    { id: "idoso", label: "IDOSO(A) (60+)" },
    { id: "gestante", label: "GESTANTE" },
    { id: "pcd", label: "PESSOA COM DEFICIÊNCIA (PCD)" },
    // { id: "outros", label: "OUTROS (URGÊNCIA/EMERGÊNCIA)" },
  ];

  return (
        <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-[0.5vw] overflow-auto">
        <Card className="w-[96vw] h-[83vh] flex flex-col justify-between p-[1.5vw] shadow-xl">
          <h1 className="text-[4.5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] xl:text-[2.5vw] font-black mb-[1vh] text-center text-foreground">
            TIPO DE ATENDIMENTO
          </h1>
          
          <div className="flex-1 flex flex-col justify-center">
            <RadioGroup value={selectedGroup} onValueChange={setSelectedGroup} className="space-y-[1vh] mb-[2vh]">
              {priorityGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className="flex items-center gap-[1.5vw] p-[1.5vw] border-4 border-border rounded-lg cursor-pointer hover:bg-accent transition-colors shadow-lg"
                >
                  <RadioGroupItem value={group.id} className="w-[3.5vw] h-[3.5vw] sm:w-[2.8vw] sm:h-[2.8vw] md:w-[2.2vw] md:h-[2.2vw] lg:w-[1.8vw] lg:h-[1.8vw] flex-shrink-0" />
                  <span className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black break-words">{group.label}</span>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col sm:flex-row gap-[1vw]">
            <Button
              onClick={() => navigate("/identificacao")}
              variant="outline"
              size="lg"
              className="flex-1 h-[7vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 shadow-lg order-2 sm:order-1"
            >
              VOLTAR
            </Button>
            <Button
              onClick={() => navigate("/confirmacao")}
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

export default Prioridade;
