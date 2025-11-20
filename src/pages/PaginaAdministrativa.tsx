import React from 'react';
import { TotemHeader } from '../components/TotemHeader';
import { PainelAdministrativo } from '../components/PainelAdministrativo';

export const PaginaAdministrativa: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col overflow-hidden">
      <TotemHeader />
      <div className="flex-1 overflow-hidden">
        <PainelAdministrativo />
      </div>
    </div>
  );
};
