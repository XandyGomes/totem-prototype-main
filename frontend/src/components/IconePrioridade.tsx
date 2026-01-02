import React from 'react';
import {
    Star,
    Users,
    Accessibility,
    Heart,
    Baby,
    User,
    Puzzle,
    Scale
} from 'lucide-react';
import { TipoPrioridade } from '@/contexts/TotemContext';

interface IconePrioridadeProps {
    tipo: TipoPrioridade;
    className?: string;
}

export const IconePrioridade: React.FC<IconePrioridadeProps> = ({ tipo, className }) => {
    const iconProps = { className, strokeWidth: 2.5 };

    switch (tipo) {
        case 'superprioridade':
            return <Star {...iconProps} fill="currentColor" className={`${className} text-yellow-300`} />;
        case 'idoso_60_79':
            return <Users {...iconProps} />;
        case 'pcd':
            return <Accessibility {...iconProps} />;
        case 'gestante':
            return <Heart {...iconProps} fill="currentColor" />;
        case 'lactante':
            return <Baby {...iconProps} />;
        case 'crianca_colo':
            return <Baby {...iconProps} />;
        case 'autista':
            return <Puzzle {...iconProps} fill="currentColor" />;
        case 'mobilidade_reduzida':
            return <Accessibility {...iconProps} />;
        case 'obeso':
            return <Scale {...iconProps} />;
        case 'comum':
            return <User {...iconProps} />;
        default:
            return <User {...iconProps} />;
    }
};
