import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {SessionContextType, SessionUser} from './session.types';
import { sessionService } from '../services/sessionService';
import { SessionContext } from "./sessionContext";

export function SessionProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<SessionUser | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const auth = await sessionService.getAuthMe();
            const student = await sessionService.getStudentProfile();

            setStudent({
                id: student.id,
                email: student.email,
                name: student.fullName || auth.fullName || 'Estudiante',
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

    const value: SessionContextType = useMemo(() => ({
        loading,
        isAuthenticated: !!student,
        student,
        refresh,
        logout,
    }), [loading, student]);

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}
