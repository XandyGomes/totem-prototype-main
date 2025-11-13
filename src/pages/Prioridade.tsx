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
    { id: "idoso", label: "IDOSO(A) (60+)" },
    { id: "gestante", label: "GESTANTE" },
    { id: "pcd", label: "PESSOA COM DEFICIÊNCIA (PCD)" },
    { id: "outros", label: "OUTROS (URGÊNCIA/EMERGÊNCIA)" },
    { id: "geral", label: "ATENDIMENTO GERAL" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TotemHeader />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-8 shadow-xl">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            ATENDIMENTO PRIORITÁRIO?
          </h1>
          
          <p className="text-2xl mb-8 text-muted-foreground">
            Você se encaixa em algum destes grupos?
          </p>

          <RadioGroup value={selectedGroup} onValueChange={setSelectedGroup} className="space-y-4 mb-12">
            {priorityGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className="flex items-center gap-4 p-6 border-2 border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={group.id} className="w-8 h-8" />
                <span className="text-2xl font-medium">{group.label}</span>
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/identificacao")}
              variant="outline"
              size="lg"
              className="flex-1 h-16 text-2xl"
            >
              VOLTAR
            </Button>
            <Button
              onClick={() => navigate("/confirmacao")}
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

export default Prioridade;
