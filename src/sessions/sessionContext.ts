import { createContext } from 'react';
import type { SessionContextType } from './session.types';

export const SessionContext =
    createContext<SessionContextType | null>(null);
