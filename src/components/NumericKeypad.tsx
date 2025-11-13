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
    <div className="flex flex-col gap-3">
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-3 justify-center">
          {row.map((num) => (
            <Button
              key={num}
              onClick={() => onNumberClick(num)}
              variant="outline"
              size="lg"
              className="w-20 h-20 text-3xl font-bold border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {num}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={() => onNumberClick("0")}
          variant="outline"
          size="lg"
          className="w-20 h-20 text-3xl font-bold border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          0
        </Button>
      </div>
    </div>
  );
};
