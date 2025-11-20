import React from 'react';
import { TotemHeader } from '../components/TotemHeader';
import { PainelAdministrativo } from '../components/PainelAdministrativo';

export const PaginaAdministrativa: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <TotemHeader />
      <div className="container mx-auto px-4 py-6">
        <PainelAdministrativo />
      </div>
    </div>
  );
};
