import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { obterChamadasRecentes } from "@/services/filaService";
import { tiposPrioridade, mockSetores } from "@/contexts/TotemContext";
import { Monitor, Volume2, Clock, MapPin } from "lucide-react";

interface InterfaceTVProps {
  setorFoco?: string;
  titulo?: string;
}

const InterfaceTV = ({ setorFoco, titulo = "PAINEL DE CHAMADAS" }: InterfaceTVProps) => {
  const [chamadas, setChamadas] = useState<any[]>([]);
  const [horaAtual, setHoraAtual] = useState(new Date());
  const [ultimaSenhaFalada, setUltimaSenhaFalada] = useState<string>("");

  const tocarChime = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Duplo bip harmônico (Chime clássico de hospital)
    playNote(880, audioCtx.currentTime, 0.5); // A5
    playNote(1046.50, audioCtx.currentTime + 0.3, 0.8); // C6
  };

  const falarChamada = (chamada: any) => {
    if (!window.speechSynthesis) return;

    // Toca o alerta sonoro antes
    tocarChime();

    // Pequeno delay para a voz não atropelar o chime
    setTimeout(() => {
      // window.speechSynthesis.cancel(); // Removido: cancel() pode bugar em alguns dispositivos mobile

      const texto = `Senha ${chamada.senha.split('').join(' ')}. Paciente ${chamada.paciente_nome || 'Paciente'}. Dirija-se à sala ${chamada.sala}. ${chamada.setor}.`;
      console.log('🗣️ Falando:', texto);

      const mensagem = new SpeechSynthesisUtterance(texto);
      mensagem.lang = 'pt-BR';
      mensagem.rate = 0.9;
      mensagem.pitch = 1;

      // Garante que a voz seja a correta em dispositivos mobile
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt-BR'));
      if (ptVoice) mensagem.voice = ptVoice;

      window.speechSynthesis.speak(mensagem);
    }, 1200);
  };

  useEffect(() => {
    const atualizarChamadas = async () => {
      const chamadasRecentes = await obterChamadasRecentes();

      // FILTRO: Mostrar apenas chamadas feitas nos últimos 5 MINUTOS
      // Isso garante que ao abrir a TV após um tempo, ela esteja limpa,
      // mas permite que o som toque se você acabou de chamar alguém.
      const agora = new Date().getTime();
      const cincoMinutosEmMs = 5 * 60 * 1000;

      const chamadasDoMomento = chamadasRecentes.filter((c: any) => {
        if (!c.created_at) return true;
        const horaChamada = new Date(c.created_at).getTime();
        return (agora - horaChamada) < cincoMinutosEmMs;
      });

      const chamadasFiltradas = setorFoco
        ? chamadasDoMomento.filter((c: any) => c.setor.toLowerCase() === setorFoco.toLowerCase())
        : chamadasDoMomento;

      const novaLista = chamadasFiltradas.slice(0, 6);

      // Lógica de Voz: Anuncia sempre que houver uma mudança de senha no topo
      if (novaLista.length > 0 && novaLista[0].senha !== ultimaSenhaFalada) {
        console.log('📢 Anunciando chamada:', novaLista[0].senha, 'Paciente:', novaLista[0].paciente_nome);
        setUltimaSenhaFalada(novaLista[0].senha);
        falarChamada(novaLista[0]);
      }

      setChamadas(novaLista);
    };

    const atualizarHora = () => setHoraAtual(new Date());

    atualizarChamadas();
    atualizarHora();

    const intervalChamadas = setInterval(atualizarChamadas, 4000); // Polling moderado para DB
    const intervalHora = setInterval(atualizarHora, 1000);

    return () => {
      clearInterval(intervalChamadas);
      clearInterval(intervalHora);
      window.speechSynthesis.cancel();
    };
  }, [setorFoco, ultimaSenhaFalada]);

  const getSetorData = (setorNome: string) => {
    return mockSetores.find(s =>
      s.nome.toLowerCase() === setorNome.toLowerCase()
    ) || mockSetores[0];
  };

  const getLineName = (corNome: string) => {
    const lineNames: { [key: string]: string } = {
      'verde': 'LINHA VERDE',
      'amarelo': 'LINHA AMARELA',
      'azul': 'LINHA AZUL',
      'violeta': 'LINHA VIOLETA',
      'laranja': 'LINHA LARANJA'
    };
    return lineNames[corNome] || 'LINHA CINZA';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10 overflow-hidden font-sans">
      <div className="max-w-[1800px] mx-auto h-full flex flex-col">

        {/* Top Header */}
        <div className="flex items-center justify-between mb-12 bg-[#1e293b] p-8 rounded-3xl border-b-8 border-blue-600 shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg animate-pulse">
              <Monitor className="w-16 h-16 text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-black tracking-tighter uppercase">{titulo}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-emerald-500 text-white font-black px-4 py-1 text-xl uppercase">SISTEMA ATIVO</Badge>
                {setorFoco && <span className="text-2xl text-blue-300 font-bold uppercase tracking-widest">• FOCO: {setorFoco}</span>}
              </div>
            </div>
          </div>

          <div className="text-right flex items-center gap-10">
            <div className="flex flex-col items-end">
              <span className="text-7xl font-mono font-black text-blue-400">
                {horaAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-2xl text-slate-400 font-bold uppercase tracking-widest">
                {horaAtual.toLocaleDateString('pt-BR', { weekday: 'long' })}
              </span>
            </div>
            <img src="/sus-digital.png" alt="NGA" className="h-24 opacity-80" />
          </div>
        </div>

        {/* Main Content Area */}
        {chamadas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-[#1e293b]/50 rounded-[3rem] border-4 border-dashed border-slate-700">
            <Volume2 className="w-48 h-48 text-slate-700 mb-8" />
            <h2 className="text-5xl font-black text-slate-500 uppercase tracking-tighter">Aguardando Chamadas</h2>
            <p className="text-2xl text-slate-600 font-bold mt-4 uppercase tracking-widest">Fique atento aos alertas sonoros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Chamada em Destaque */}
            <div className="col-span-1 xl:col-span-2">
              <Card
                className="relative p-12 bg-white text-slate-900 border-[16px] shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[4rem] flex flex-col items-center animate-in fade-in zoom-in duration-500"
                style={{ borderColor: getSetorData(chamadas[0].setor).cor }}
              >
                <div className="absolute -top-10 bg-red-600 text-white font-black px-12 py-4 rounded-full text-3xl shadow-xl flex items-center gap-4 animate-bounce">
                  <Volume2 className="w-10 h-10" />
                  CHAMANDO AGORA
                </div>

                <div className="w-full flex justify-between items-center mb-10">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-slate-400 uppercase leading-none">Senha / Paciente</span>
                    <h2 className="text-[12rem] font-black leading-none tracking-tighter text-slate-900">
                      {chamadas[0].senha}
                    </h2>
                    <span className="text-5xl font-black text-blue-600 uppercase tracking-tight truncate max-w-[900px] mt-2">
                      {chamadas[0].paciente_nome || "Paciente"}
                    </span>
                  </div>
                  <div className="bg-slate-100 p-8 rounded-[3rem] text-center min-w-[350px] border-4 border-slate-200">
                    <span className="text-4xl font-black text-slate-400 uppercase block mb-2">Dirija-se à</span>
                    <span className="text-[8rem] font-black text-blue-700 leading-none">SALA {chamadas[0].sala}</span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-3 gap-8 border-t-4 border-slate-100 pt-10">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-400 uppercase">Médico(a)</span>
                    <span className="text-4xl font-black text-slate-800 uppercase">{chamadas[0].medico}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-400 uppercase">Setor</span>
                    <Badge className="text-3xl font-black px-6 py-2 rounded-2xl text-white uppercase" style={{ backgroundColor: getSetorData(chamadas[0].setor).cor }}>
                      {chamadas[0].setor}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-slate-400 uppercase">Orientação</span>
                    <span className="text-3xl font-black text-slate-800 uppercase text-right">
                      Siga a {getLineName(getSetorData(chamadas[0].setor).corNome)} no chão
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Chamadas Anteriores */}
            {chamadas.slice(1).map((chamada, idx) => (
              <Card
                key={idx}
                className="bg-[#1e293b] border-l-[20px] p-6 flex items-center justify-between rounded-3xl"
                style={{ borderLeftColor: getSetorData(chamada.setor).cor }}
              >
                <div className="flex items-center gap-6 overflow-hidden">
                  <span className="text-5xl font-black text-white shrink-0">{chamada.senha}</span>
                  <div className="h-12 w-1 bg-slate-700 shrink-0"></div>
                  <div className="overflow-hidden">
                    <span className="text-xl font-black text-blue-400 block uppercase">SALA {chamada.sala}</span>
                    <span className="text-lg font-bold text-white uppercase block truncate">{chamada.paciente_nome}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase block truncate">{chamada.medico}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xl font-black border-2 px-4 py-1 uppercase" style={{ borderColor: getSetorData(chamada.setor).cor, color: getSetorData(chamada.setor).cor }}>
                  {chamada.setor}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        {/* Scrolling Footer News Ticker style */}
        <div className="mt-auto pt-10">
          <div className="bg-blue-900/30 border-t-2 border-blue-500/30 p-4 rounded-t-3xl overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee group shadow-inner">
              <span className="mx-10 text-2xl font-bold text-blue-200">🔊 Fique atento ao seu nome e senha no painel</span>
              <span className="mx-10 text-2xl font-bold text-blue-200">📍 Siga as linhas coloridas no chão para chegar ao consultório</span>
              <span className="mx-10 text-2xl font-bold text-blue-200">📑 Mantenha seus documentos em mãos para facilitar o atendimento</span>
              <span className="mx-10 text-2xl font-bold text-blue-200">♿ Prioridade absoluta para maiores de 80 anos</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default InterfaceTV;
