export const TotemHeader = () => {
  return (
    <header className="w-full py-[0.5vh] px-[2vw] flex items-center justify-between bg-slate-50 relative shadow-[0_8px_30px_-6px_hsl(var(--primary)/0.25)] z-20">
      <div className="flex items-center gap-[1vw]">
        <div className="rounded-lg p-[0.5vh]">
          <img
            src="/sus-digital.png"
            alt="SUS Digital"
            className="w-[36vw] h-[15vh] sm:w-[32vw] sm:h-[14vh] md:w-[28vw] md:h-[13vh] lg:w-[24vw] lg:h-[12vh] object-contain"
          />
        </div>
      </div>
      <div className="flex items-center gap-[1vw]">
        <div className="rounded-lg p-[0.5vh]">
          <img
            src="/prefeitura-franca.png"
            alt="Prefeitura de Franca"
            className="w-[36vw] h-[15vh] sm:w-[32vw] sm:h-[14vh] md:w-[28vw] md:h-[13vh] lg:w-[24vw] lg:h-[12vh] object-contain"
          />
        </div>
      </div>

      {/* Gradient Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary/5 via-primary to-primary/5"></div>
    </header>
  );
};
