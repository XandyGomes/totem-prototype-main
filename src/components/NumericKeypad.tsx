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
    <div className="flex flex-col gap-[1.2vh]">
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[1.2vw] justify-center">
          {row.map((num) => (
            <Button
              key={num}
              onClick={() => onNumberClick(num)}
              variant="outline"
              size="lg"
              className="w-[12vw] h-[13vh] sm:w-[10vw] sm:h-[12vh] md:w-[8.5vw] md:h-[11vh] lg:w-[7vw] lg:h-[10vh] xl:w-[6vw] xl:h-[8vh] text-[5vw] sm:text-[4.5vw] md:text-[4vw] lg:text-[3.2vw] xl:text-[2.8vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
            >
              {num}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex gap-[1.2vw] justify-center">
        <Button
          onClick={onClear}
          variant="outline"
          size="lg"
          className="w-[12vw] h-[13vh] sm:w-[10vw] sm:h-[12vh] md:w-[8.5vw] md:h-[11vh] lg:w-[7vw] lg:h-[10vh] xl:w-[6vw] xl:h-[8vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg bg-destructive/10"
        >
          LIMPAR
        </Button>
        <Button
          onClick={() => onNumberClick("0")}
          variant="outline"
          size="lg"
          className="w-[12vw] h-[13vh] sm:w-[10vw] sm:h-[12vh] md:w-[8.5vw] md:h-[11vh] lg:w-[7vw] lg:h-[10vh] xl:w-[6vw] xl:h-[8vh] text-[5vw] sm:text-[4.5vw] md:text-[4vw] lg:text-[3.2vw] xl:text-[2.8vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
        >
          0
        </Button>
        <Button
          onClick={onBackspace}
          variant="outline"
          size="lg"
          className="w-[12vw] h-[13vh] sm:w-[10vw] sm:h-[12vh] md:w-[8.5vw] md:h-[11vh] lg:w-[7vw] lg:h-[10vh] xl:w-[6vw] xl:h-[8vh] text-[2.5vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-black border-4 hover:bg-orange-500 hover:text-white transition-colors shadow-lg bg-orange-100"
        >
          ⌫
        </Button>
      </div>
    </div>
  );
};
