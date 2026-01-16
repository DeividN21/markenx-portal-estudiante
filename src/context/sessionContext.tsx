import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { sessionService } from '../services/sessionService';

export interface SessionUser {
    id: string;              // studentId
    name: string;            // fullName
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

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SessionUser | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            // 1) Auth (roles + identidad)
            const auth = await sessionService.getAuthMe();

            // 2) Dominio: studentId + courseId (recomendado que venga aquí)
            const student = await sessionService.getStudentMe();

            // 3) Curso (nombre visible en Header)
            const course = await sessionService.getCourseByStudentId(student.studentId);

            const fullName =
                auth.fullName ||
                `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim() ||
                'Estudiante';

            setUser({
                id: student.studentId,
                email: student.email,
                name: fullName,
                roles: auth.roles ?? [],
                courseId: student.courseId,
                courseName: course.courseName,
            });
        } finally {
            // Si no hay sesión, apiClient ya redirige al login (no llegas aquí usualmente),
            // pero dejamos robustez para escenarios edge.
            setLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const logout = () => {
        // Debe ser navegación real para permitir 302 hacia Keycloak y regreso a frontend
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

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error('useSession must be used within SessionProvider');
    return ctx;
}
