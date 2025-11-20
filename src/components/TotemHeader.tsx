export const TotemHeader = () => {
  return (
    <header className="w-full py-[0.5vh] px-[2vw] flex items-center justify-between" style={{ backgroundColor: 'hsl(205, 85%, 50%)' }}>
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
    </header>
  );
};
