'use client';

import { PainelAdministrativo } from "@/features/admin/PainelAdministrativo";
import { TotemProvider } from "@/contexts/TotemContext";

// Força a página a ser dinâmica, evitando erros de pré-renderização estática no build do Vercel
export const dynamic = 'force-dynamic';

export default function PaginaAdmin() {
    return (
        <div className="min-h-screen bg-slate-50">
            <TotemProvider>
                <PainelAdministrativo />
            </TotemProvider>
        </div>
    );
}
