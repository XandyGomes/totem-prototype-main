import { Button } from "@/components/ui/button";
import { X, Delete } from "lucide-react";

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const NumericKeypad = ({ onNumberClick, onBackspace, onClear }: NumericKeypadProps) => {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  return (
    <div className="flex flex-col gap-[1.5vh]">
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[2vw] justify-center">
          {row.map((num) => (
            <Button
              key={num}
              onClick={() => onNumberClick(num)}
              variant="outline"
              size="lg"
              className="w-[20vw] h-[8vh] text-[6vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg rounded-2xl"
            >
              {num}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex gap-[2vw] justify-center">
        <Button
          onClick={onClear}
          variant="outline"
          size="lg"
          className="w-[20vw] h-[8vh] text-[2.5vw] font-black border-4 hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg bg-destructive/10 rounded-2xl"
        >
          LIMPAR
        </Button>
        <Button
          onClick={() => onNumberClick("0")}
          variant="outline"
          size="lg"
          className="w-[20vw] h-[8vh] text-[6vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg rounded-2xl"
        >
          0
        </Button>
        <Button
          onClick={onBackspace}
          variant="outline"
          size="lg"
          className="w-[20vw] h-[8vh] text-[4vw] font-black border-4 hover:bg-orange-500 hover:text-white transition-colors shadow-lg bg-orange-100 rounded-2xl"
        >
          ⌫
        </Button>
      </div>
    </div>
  );
};
