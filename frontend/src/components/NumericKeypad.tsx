import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

interface NumericKeypadProps {
    onNumberClick: (num: string) => void;
    onBackspace: () => void;
    onClear: () => void;
}

export const NumericKeypad = ({ onNumberClick, onBackspace, onClear }: NumericKeypadProps) => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div className="grid grid-cols-3 gap-[1.5vw] w-fit mx-auto">
            {numbers.map((num) => (
                <Button
                    key={num}
                    onClick={() => onNumberClick(num)}
                    variant="outline"
                    className="w-[18vw] h-[8vh] text-[5vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-all shadow-lg rounded-2xl active:scale-95"
                >
                    {num}
                </Button>
            ))}

            <Button
                onClick={onClear}
                variant="outline"
                className="w-[18vw] h-[8vh] text-[2vw] font-black border-4 hover:bg-destructive hover:text-destructive-foreground transition-all shadow-lg bg-destructive/10 rounded-2xl active:scale-95"
            >
                LIMPAR
            </Button>

            <Button
                onClick={() => onNumberClick("0")}
                variant="outline"
                className="w-[18vw] h-[8vh] text-[5vw] font-black border-4 hover:bg-primary hover:text-primary-foreground transition-all shadow-lg rounded-2xl active:scale-95"
            >
                0
            </Button>

            <Button
                onClick={onBackspace}
                variant="outline"
                className="w-[18vw] h-[8vh] border-4 hover:bg-orange-500 hover:text-white transition-all shadow-lg bg-orange-100 rounded-2xl flex items-center justify-center active:scale-95"
            >
                <Delete className="w-[3.5vw] h-[3.5vw]" />
            </Button>
        </div>
    );
};
