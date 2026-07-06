'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { obterChamadasTV } from "@/services/filaService";
import { typesPriority, mockSetores } from "@/contexts/TotemContext";
import { Monitor, Volume2 } from "lucide-react";

interface InterfaceTVProps {
    setorFoco?: string;
    titulo?: string;
}

const InterfaceTV = ({ setorFoco, titulo = "PAINEL DE CHAMADAS" }: InterfaceTVProps) => {
    const [chamadas, setChamadas] = useState<any[]>([]);
    const [horaAtual, setHoraAtual] = useState(new Date());
    const [ultimoIdChamado, setUltimoIdChamado] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    const tocarChime = () => {
        try {
            // Tenta tocar um arquivo MP3 real. Se não existir, ele ignora e a voz fala.
            const audio = new Audio('/chime.mp3');
            audio.play().catch(() => {
                console.log('Arquivo chime.mp3 não encontrado, usando beep sintético.');
                // Fallback para o beep sintético se o arquivo não existir
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
                playNote(880, audioCtx.currentTime, 0.5);
                playNote(1046.50, audioCtx.currentTime + 0.3, 0.8);
            });
        } catch (e) {
            console.error('Erro ao tocar chime:', e);
        }
    };

    const falarChamada = (chamada: any) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        tocarChime();

        setTimeout(() => {
            const texto = `Senha ${chamada.senha.split('').join(' ')}. Paciente ${chamada.paciente_nome || 'Paciente'}. Dirija-se à sala ${chamada.sala}. ${chamada.setor}.`;
            const mensagem = new SpeechSynthesisUtterance(texto);
            mensagem.lang = 'pt-BR';
            mensagem.rate = 0.9;

            const voices = window.speechSynthesis.getVoices();
            const ptVoice = voices.find(v => v.lang.includes('pt-BR'));
            if (ptVoice) mensagem.voice = ptVoice;

            window.speechSynthesis.speak(mensagem);
        }, 1200);
    };

    useEffect(() => {
        const atualizarChamadas = async () => {
            try {
                const chamadasRecentes = await obterChamadasTV();

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

                if (novaLista.length > 0 && novaLista[0].id !== ultimoIdChamado) {
                    setUltimoIdChamado(novaLista[0].id);
                    falarChamada(novaLista[0]);
                }

                setChamadas(novaLista);
            } catch (error) {
                console.error('Erro ao atualizar chamadas:', error);
            }
        };

        const atualizarHora = () => setHoraAtual(new Date());

        atualizarChamadas();
        atualizarHora();

        const intervalChamadas = setInterval(atualizarChamadas, 4000);
        const intervalHora = setInterval(atualizarHora, 1000);

        setIsMounted(true);

        return () => {
            clearInterval(intervalChamadas);
            clearInterval(intervalHora);
            if (typeof window !== 'undefined') window.speechSynthesis.cancel();
        };
    }, [setorFoco, ultimoIdChamado]);

    const getSetorData = (setorNome: string) => {
        return mockSetores.find(s =>
            s.nome.toLowerCase() === setorNome.toLowerCase()
        ) || mockSetores[0];
    };

    const getLineName = (corNome: string) => {
        const lineNames: { [key: string]: string } = {
            'verde': 'FAIXA VERDE',
            'amarelo': 'FAIXA AMARELA',
            'azul': 'FAIXA AZUL',
            'violeta': 'FAIXA VIOLETA',
            'laranja': 'FAIXA LARANJA'
        };
        return lineNames[corNome] || 'FAIXA CINZA';
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-10 overflow-hidden font-sans">
            <div className="max-w-[1800px] mx-auto h-full flex flex-col">
                <div className="flex items-center justify-between mb-12 bg-[#1e293b] p-8 rounded-3xl border-b-8 border-blue-600 shadow-2xl gap-8">
                    {/* Logo SUS - Esquerda */}
                    <div className="flex-shrink-0">
                        <img src="/sus-digital.png" alt="SUS" className="h-28 opacity-90" />
                    </div>

                    {/* Conteúdo Central */}
                    <div className="flex-1 flex items-center justify-between gap-8 px-8">
                        {/* Título e Status */}
                        <div className="flex items-center gap-6">
                            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg animate-pulse">
                                <Monitor className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight uppercase leading-tight">{titulo}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <Badge className="bg-emerald-500 text-white font-black px-3 py-0.5 text-sm uppercase">SISTEMA ATIVO</Badge>
                                    {setorFoco && <span className="text-lg text-blue-300 font-bold uppercase">• {setorFoco}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Hora e Data */}
                        <div className="flex flex-col items-end min-w-[200px]">
                            {isMounted ? (
                                <>
                                    <span className="text-6xl font-mono font-black text-blue-400 leading-none">
                                        {horaAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="text-lg text-slate-400 font-bold uppercase tracking-wide mt-1">
                                        {horaAtual.toLocaleDateString('pt-BR', { weekday: 'long' })}
                                    </span>
                                </>
                            ) : (
                                <div className="h-16 w-32 bg-slate-700 animate-pulse rounded-xl"></div>
                            )}
                        </div>
                    </div>

                    {/* Logo Prefeitura - Direita */}
                    <div className="flex-shrink-0">
                        <img src="/prefeitura-franca.png" alt="Prefeitura de Franca" className="h-28 opacity-90" />
                    </div>
                </div>

                {chamadas.length === 0 ? (
                    <div className="flex-1 min-h-[420px] flex flex-col items-center justify-center text-center bg-[#1e293b]/50 rounded-[3rem] border-4 border-dashed border-slate-700">
                        <Volume2 className="w-48 h-48 text-slate-700 mb-8" />
                        <h2 className="text-5xl font-black text-slate-500 uppercase tracking-tighter">Aguardando Chamadas</h2>
                        <p className="text-2xl text-slate-600 font-bold mt-4 uppercase tracking-widest">Fique atento aos alertas sonoros</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-10">
                        {/* Lado Esquerdo: Chamada Principal e Lista */}
                        <div className="col-span-8 space-y-8">
                            <Card
                                className="relative p-10 bg-white text-slate-900 border-[16px] shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3.5rem] flex flex-col items-center animate-in fade-in zoom-in duration-500"
                                style={{ borderColor: getSetorData(chamadas[0].setor).cor }}
                            >
                                <div className="absolute -top-8 bg-red-600 text-white font-black px-10 py-3 rounded-full text-2xl shadow-xl flex items-center gap-4 animate-bounce">
                                    <Volume2 className="w-8 h-8" />
                                    CHAMANDO AGORA
                                </div>

                                <div className="w-full flex justify-between items-center mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-slate-400 uppercase leading-none">Senha / Paciente</span>
                                        <h2 className="text-[10rem] font-black leading-none tracking-tighter text-slate-900">
                                            {chamadas[0].senha}
                                        </h2>
                                        <span className="text-4xl font-black text-blue-600 uppercase tracking-tight truncate max-w-[600px] mt-2">
                                            {chamadas[0].paciente_nome || "Paciente"}
                                        </span>
                                    </div>
                                    <div className="bg-slate-100 p-6 rounded-[2.5rem] text-center min-w-[300px] border-4 border-slate-200">
                                        <span className="text-3xl font-black text-slate-400 uppercase block mb-1">Dirija-se à</span>
                                        <span className="text-[6rem] font-black text-blue-700 leading-none uppercase">Sala {chamadas[0].sala}</span>
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-3 gap-6 border-t-4 border-slate-100 pt-8">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-slate-400 uppercase">Médico(a)</span>
                                        <span className="text-2xl font-black text-slate-800 uppercase truncate">{chamadas[0].medico_nome || chamadas[0].medico}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-black text-slate-400 uppercase">Setor</span>
                                        <Badge className="text-2xl font-black px-5 py-1 rounded-xl text-white uppercase" style={{ backgroundColor: getSetorData(chamadas[0].setor).cor }}>
                                            {chamadas[0].setor}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xl font-black text-slate-400 uppercase text-right">Orientações</span>
                                        <span className="text-2xl font-black text-slate-800 uppercase text-right">
                                            Siga a {getLineName(getSetorData(chamadas[0].setor).corNome)}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-2 gap-6">
                                {chamadas.slice(1, 5).map((chamada, idx) => (
                                    <Card
                                        key={idx}
                                        className="bg-[#1e293b] border-l-[15px] p-5 flex items-center justify-between rounded-2xl"
                                        style={{ borderLeftColor: getSetorData(chamada.setor).cor }}
                                    >
                                        <div className="flex items-center gap-5 overflow-hidden">
                                            <span className="text-4xl font-black text-white shrink-0">{chamada.senha}</span>
                                            <div className="h-10 w-1 bg-slate-700 shrink-0"></div>
                                            <div className="overflow-hidden">
                                                <span className="text-lg font-black text-blue-400 block uppercase leading-tight">SALA {chamada.sala}</span>
                                                <span className="text-base font-bold text-white uppercase block truncate">{chamada.paciente_nome}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-lg font-black border-2 px-3 py-0.5 uppercase" style={{ borderColor: getSetorData(chamada.setor).cor, color: getSetorData(chamada.setor).cor }}>
                                            {chamada.setor}
                                        </Badge>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Lado Direito: Vídeo e Informativos */}
                        <div className="col-span-4 flex flex-col gap-8">
                            <div className="flex-1 bg-black rounded-[3rem] overflow-hidden border-4 border-slate-700 shadow-2xl relative">
                                {/* Placeholder para Vídeo ou Slides */}
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/videoseries?list=PL_XvB6B_qVw3vX6X-Ww2-W0oE3-6jP9Y1&autoplay=1&mute=1&loop=1"
                                    title="Prefeitura de Franca"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <div className="absolute top-6 left-6 bg-blue-600/90 text-white font-black px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                    PREFEITURA INFORMA
                                </div>
                            </div>
                            
                            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] border-none text-white shadow-xl">
                                <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-3">
                                    <span className="bg-white/20 p-2 rounded-lg text-white">📌</span>
                                    Dica de Saúde
                                </h3>
                                <p className="text-lg font-bold leading-snug">
                                    Mantenha sua vacinação em dia! Procure a unidade de saúde mais próxima com seu documento e carteirinha.
                                </p>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Botões de Simulação (Painel Flutuante Discreto) */}
                <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 group">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                        <button 
                            onClick={async () => {
                                try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/integracao-direta/simular`, { method: 'POST' });
                                    if (res.ok) alert('Chamada Simulada! Aguarde alguns segundos para aparecer no painel.');
                                    else alert('Erro no servidor ao simular.');
                                } catch (e) {
                                    alert('Erro de conexão: Verifique se o backend está rodando na porta 3001.');
                                    console.error('Erro ao simular:', e);
                                }
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-2xl uppercase tracking-tighter"
                        >
                            Simular Chamada
                        </button>
                        <button 
                            onClick={async () => {
                                try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/integracao-direta/limpar`, { method: 'POST' });
                                    if (res.ok) {
                                        alert('Dados limpos!');
                                        window.location.reload();
                                    } else alert('Erro ao limpar dados.');
                                } catch (e) {
                                    alert('Erro de conexão com o backend.');
                                    console.error('Erro ao limpar:', e);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-2xl uppercase tracking-tighter"
                        >
                            Limpar Tudo
                        </button>
                    </div>
                    
                    {/* Ícone de Ativação (Discreto) */}
                    <div className="bg-slate-800/50 hover:bg-slate-700 p-3 rounded-full cursor-pointer backdrop-blur-md border border-slate-600/50 shadow-xl">
                        <Monitor className="w-5 h-5 text-slate-400" />
                    </div>
                </div>

                <div className="mt-auto pt-10">
                    <div className="bg-blue-900/30 border-t-2 border-blue-500/30 p-4 rounded-t-3xl overflow-hidden whitespace-nowrap">
                        <div className="inline-block animate-marquee whitespace-nowrap">
                            <span className="mx-10 text-2xl font-bold text-blue-200 uppercase">🔊 Fique atento ao seu nome e senha no painel</span>
                            <span className="mx-10 text-2xl font-bold text-blue-200 uppercase">📍 Siga as faixas coloridas no chão para chegar ao consultório</span>
                            <span className="mx-10 text-2xl font-bold text-blue-200 uppercase">📑 Mantenha seus documentos em mãos para facilitar o atendimento</span>
                            <span className="mx-10 text-2xl font-bold text-blue-200 uppercase">♿ Prioridade absoluta para maiores de 80 anos</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default InterfaceTV;
