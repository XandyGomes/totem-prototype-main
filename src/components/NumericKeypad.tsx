import { Button } from "@/components/ui/button";

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onBackspace: () => void;
}

export const NumericKeypad = ({ onNumberClick, onBackspace }: NumericKeypadProps) => {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  return (
    <div className="flex flex-col gap-[1vh]">
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[1vw] justify-center">
          {row.map((num) => (
            <Button
              key={num}
              onClick={() => onNumberClick(num)}
              variant="outline"
              size="lg"
              className="w-[10vw] h-[8vh] sm:w-[8.5vw] sm:h-[7vh] md:w-[7vw] md:h-[6vh] lg:w-[6vw] lg:h-[5.5vh] xl:w-[5vw] xl:h-[5vh] text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] xl:text-[1.8vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
            >
              {num}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex gap-[1vw] justify-center">
        <Button
          onClick={() => onNumberClick("0")}
          variant="outline"
          size="lg"
          className="w-[10vw] h-[8vh] sm:w-[8.5vw] sm:h-[7vh] md:w-[7vw] md:h-[6vh] lg:w-[6vw] lg:h-[5.5vh] xl:w-[5vw] xl:h-[5vh] text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] xl:text-[1.8vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
        >
          0
        </Button>
      </div>
    </div>
  );
};
