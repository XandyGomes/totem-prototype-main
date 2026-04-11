'use client';

import { SigsManager } from "@/features/admin/SigsManager";
import { TotemProvider } from "@/contexts/TotemContext";

// Força a página a ser dinâmica, evitando erros de pré-renderização estática no build do Vercel
export const dynamic = 'force-dynamic';

export default function PaginaSigsAdmin() {
    return (
        <div className="min-h-screen bg-slate-50">
            <TotemProvider>
                <SigsManager />
            </TotemProvider>
        </div>
    );
}
