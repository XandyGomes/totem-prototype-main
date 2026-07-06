import { Button } from "@/components/ui/button";
import { Delete, Eraser } from "lucide-react";

interface NumericKeypadProps {
    onNumberClick: (num: string) => void;
    onBackspace: () => void;
    onClear: () => void;
}

export const NumericKeypad = ({ onNumberClick, onBackspace, onClear }: NumericKeypadProps) => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    // Função para feedback sonoro ao tocar
    const playClickSound = () => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            // Silencioso se der erro
        }
    };

    const handlePress = (action: () => void) => {
        playClickSound();
        action();
    };

    return (
        <div className="grid grid-cols-3 gap-[2vw] w-fit mx-auto p-6 bg-slate-100/50 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/50">
            {numbers.map((num) => (
                <Button
                    key={num}
                    onClick={() => handlePress(() => onNumberClick(num))}
                    variant="outline"
                    className="w-[18vw] h-[9vh] text-[6vw] font-black border-b-8 border-slate-300 hover:bg-primary hover:text-white hover:border-primary-foreground transition-all shadow-xl rounded-3xl active:translate-y-1 active:border-b-0 bg-white"
                >
                    {num}
                </Button>
            ))}

            <Button
                onClick={() => handlePress(onClear)}
                variant="outline"
                className="w-[18vw] h-[9vh] text-[2.5vw] font-black border-b-8 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-700 transition-all shadow-xl bg-red-50 text-red-600 rounded-3xl active:translate-y-1 active:border-b-0"
            >
                <Eraser className="w-[3vw] h-[3vw] mr-2" />
                LIMPAR
            </Button>

            <Button
                onClick={() => handlePress(() => onNumberClick("0"))}
                variant="outline"
                className="w-[18vw] h-[9vh] text-[6vw] font-black border-b-8 border-slate-300 hover:bg-primary hover:text-white hover:border-primary-foreground transition-all shadow-xl rounded-3xl active:translate-y-1 active:border-b-0 bg-white"
            >
                0
            </Button>

            <Button
                onClick={() => handlePress(onBackspace)}
                variant="outline"
                className="w-[18vw] h-[9vh] border-b-8 border-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-600 transition-all shadow-xl bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center active:translate-y-1 active:border-b-0"
            >
                <Delete className="w-[4.5vw] h-[4.5vw]" />
            </Button>
        </div>
    );
};
