import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { sessionService } from '../services/sessionService';

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
    courseId?: string;
    courseName?: string;
}

interface SessionContextType {
    loading: boolean;
    isAuthenticated: boolean;
    user: SessionUser | null;
    refresh: () => Promise<void>;
    logout: () => void;
}

const SessionProvider = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SessionUser | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const auth = await sessionService.getAuthMe();
            const student = await sessionService.getStudentProfile();
            const fullName = student.fullName || auth.fullName || 'Estudiante';

            setUser({
                id: student.id,
                email: student.email,
                name: fullName,
                roles: auth.roles ?? [],
                courseId: student.enrolledCourse.id,
                courseName: student.enrolledCourse.label,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const logout = () => {
        const redirect = `${window.location.origin}/logged-out`;
        sessionService.logoutFederated(redirect);
    };

    const value = useMemo<SessionContextType>(() => {
        return {
            loading,
            isAuthenticated: !!user,
            user,
            refresh,
            logout,
        };
    }, [loading, user]);

    return <SessionProvider.Provider value={value}>{children}</SessionProvider.Provider>;
}

export function useSession() {
    const ctx = useContext(SessionProvider);
    if (!ctx) throw new Error('useSession must be used within SessionProvider');
    return ctx;
}
