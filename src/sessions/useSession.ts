import { useContext } from 'react';
import {SessionContext} from "./sessionContext.ts";

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) {
        throw new Error('useSession must be used within SessionProvider');
    }
    return ctx;
}
