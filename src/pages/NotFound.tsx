import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center max-w-[50vw] sm:max-w-[45vw] md:max-w-[40vw]">
        <h1 className="mb-[3vw] text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[5vw] xl:text-[4vw] font-black">404</h1>
        <p className="mb-[3vw] text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] xl:text-[1.8vw] font-black text-muted-foreground">
          Oops! Página não encontrada
        </p>
        <a 
          href="/" 
          className="text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] xl:text-[1.5vw] font-black text-primary underline hover:text-primary/90"
        >
          Retornar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
