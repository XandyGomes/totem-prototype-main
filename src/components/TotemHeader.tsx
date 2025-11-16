export const TotemHeader = () => {
  return (
    <header className="w-full bg-primary py-[2vh] px-[2vw] flex items-center justify-between">
      <div className="flex items-center gap-[1vw]">
        <div className="w-[18vw] h-[6vh] sm:w-[15vw] sm:h-[5vh] md:w-[12vw] md:h-[4vh] lg:w-[10vw] lg:h-[3.5vh] bg-primary-foreground/20 rounded flex items-center justify-center border-2 border-dashed border-primary-foreground/70">
          <span className="text-[2vw] sm:text-[1.6vw] md:text-[1.3vw] lg:text-[1vw] xl:text-[0.9vw] text-primary-foreground/80 font-black">LOGO SUS</span>
        </div>
      </div>
      <div className="flex items-center gap-[1vw]">
        <div className="w-[18vw] h-[6vh] sm:w-[15vw] sm:h-[5vh] md:w-[12vw] md:h-[4vh] lg:w-[10vw] lg:h-[3.5vh] bg-primary-foreground/20 rounded flex items-center justify-center border-2 border-dashed border-primary-foreground/70">
          <span className="text-[2vw] sm:text-[1.6vw] md:text-[1.3vw] lg:text-[1vw] xl:text-[0.9vw] text-primary-foreground/80 font-black">LOGO PREFEITURA</span>
        </div>
      </div>
    </header>
  );
};
