'use client';

import { useSearchParams } from 'next/navigation';
import InterfaceTV from "@/features/tv/InterfaceTV";
import { Suspense } from 'react';

function TVContent() {
    const searchParams = useSearchParams();
    const isSetorEspecifico = searchParams.get('setor');

    return (
        <InterfaceTV
            setorFoco={isSetorEspecifico || undefined}
            titulo={isSetorEspecifico ? `CHAMADAS - ${isSetorEspecifico.toUpperCase()}` : "CHAMADAS GERAIS - NGA"}
        />
    );
}

export default function PaginaTV() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-4xl font-black uppercase tracking-widest animate-pulse">Carregando Painel...</div>}>
            <TVContent />
        </Suspense>
    );
}
