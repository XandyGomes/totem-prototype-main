export const TotemHeader = () => {
  return (
    <header className="w-full bg-primary py-[0.5vh] px-[2vw] flex items-center justify-between">
      <div className="flex items-center gap-[1vw]">
        <div className="bg-white/20 rounded-lg p-[0.5vh] backdrop-blur-sm">
          <img 
            src="/sus-digital.png" 
            alt="SUS Digital" 
            className="w-[32vw] h-[13vh] sm:w-[28vw] sm:h-[12vh] md:w-[24vw] md:h-[11vh] lg:w-[20vw] lg:h-[10vh] object-contain"
          />
        </div>
      </div>
      <div className="flex items-center gap-[1vw]">
        <div className="bg-white/20 rounded-lg p-[0.5vh] backdrop-blur-sm">
          <img 
            src="/prefeitura-franca.png" 
            alt="Prefeitura de Franca" 
            className="w-[32vw] h-[13vh] sm:w-[28vw] sm:h-[12vh] md:w-[24vw] md:h-[11vh] lg:w-[20vw] lg:h-[10vh] object-contain"
          />
        </div>
      </div>
    </header>
  );
};
