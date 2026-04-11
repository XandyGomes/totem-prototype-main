import { PainelAdministrativo } from "@/features/admin/PainelAdministrativo";
import { TotemProvider } from "@/contexts/TotemContext";

// Como esta página é um Server Component, o Next.js respeita a regra force-dynamic
// e não tentará fazer a pré-renderização estática que causava o erro de contexto.
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
