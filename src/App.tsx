import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TotemProvider } from "@/contexts/TotemContext";
import Welcome from "./pages/Welcome";
import Identificacao from "./pages/Identificacao";
import Prioridade from "./pages/Prioridade";
import SelecionarPrioridade from "./pages/SelecionarPrioridade";
import Confirmacao from "./pages/Confirmacao";
import Senha from "./pages/Senha";
import CpfInvalido from "./pages/CpfInvalido";
import FalhaImpressao from "./pages/FalhaImpressao";
import ConsultaNaoEncontrada from "./pages/ConsultaNaoEncontrada";
import SetorIncorreto from "./pages/SetorIncorreto";
import PaginaMedico from "./pages/PaginaMedico";
import PaginaTV from "./pages/PaginaTV";
import { PaginaAdministrativa } from "./pages/PaginaAdministrativa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TotemProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
          <div className="w-full max-w-7xl h-[95vh] bg-background rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_0_12px_#1a1a1a,inset_0_0_0_16px_#2a2a2a] overflow-hidden flex flex-col">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/identificacao" element={<Identificacao />} />
                <Route path="/prioridade" element={<Prioridade />} />
                <Route path="/selecionar-prioridade" element={<SelecionarPrioridade />} />
                <Route path="/confirmacao" element={<Confirmacao />} />
                <Route path="/senha" element={<Senha />} />
                <Route path="/cpf-invalido" element={<CpfInvalido />} />
                <Route path="/consulta-nao-encontrada" element={<ConsultaNaoEncontrada />} />
                <Route path="/setor-incorreto" element={<SetorIncorreto />} />
                <Route path="/falha-impressao" element={<FalhaImpressao />} />
                <Route path="/medico" element={<PaginaMedico />} />
                <Route path="/tv" element={<PaginaTV />} />
                <Route path="/admin" element={<PaginaAdministrativa />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </TooltipProvider>
    </TotemProvider>
  </QueryClientProvider>
);

export default App;
