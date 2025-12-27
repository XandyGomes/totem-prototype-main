import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TotemProvider } from "@/contexts/TotemContext";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Identificacao from "./pages/Identificacao";
import Prioridade from "./pages/Prioridade";
import SelecionarPrioridade from "./pages/SelecionarPrioridade";
import Confirmacao from "./pages/Confirmacao";
import Senha from "./pages/Senha";
import FalhaImpressao from "./pages/FalhaImpressao";
import ConsultaNaoEncontrada from "./pages/ConsultaNaoEncontrada";
import SetorIncorreto from "./pages/SetorIncorreto";
import ImpressaoConcluida from "./pages/ImpressaoConcluida";
import PaginaMedico from "./pages/PaginaMedico";
import PaginaTV from "./pages/PaginaTV";
import PaginaAdministrativa from "./pages/PaginaAdministrativa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TotemProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Launcher principal do protótipo */}
            <Route path="/" element={<Home />} />

            {/* Rotas que usam o Layout de Totem (Vertical 9:16) */}
            <Route
              path="/welcome/*"
              element={
                <div className="min-h-screen bg-slate-950 p-4 flex items-center justify-center">
                  <div className="h-[95vh] aspect-[9/16] bg-background rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_0_12px_#1a1a1a,inset_0_0_0_16px_#2a2a2a] overflow-hidden flex flex-col relative border-8 border-gray-900">
                    <Routes>
                      <Route index element={<Welcome />} />
                      <Route path="identificacao" element={<Identificacao />} />
                      <Route path="prioridade" element={<Prioridade />} />
                      <Route path="selecionar-prioridade" element={<SelecionarPrioridade />} />
                      <Route path="confirmacao" element={<Confirmacao />} />
                      <Route path="senha" element={<Senha />} />
                      <Route path="consulta-nao-encontrada" element={<ConsultaNaoEncontrada />} />
                      <Route path="setor-incorreto" element={<SetorIncorreto />} />
                      <Route path="falha-impressao" element={<FalhaImpressao />} />
                      <Route path="impressao-concluida" element={<ImpressaoConcluida />} />
                    </Routes>
                  </div>
                </div>
              }
            />

            {/* Rotas Full-Screen (16:9 ou Desktop) */}
            <Route path="/medico" element={<PaginaMedico />} />
            <Route path="/tv" element={<PaginaTV />} />
            <Route path="/admin" element={<PaginaAdministrativa />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TotemProvider>
  </QueryClientProvider>
);

export default App;
