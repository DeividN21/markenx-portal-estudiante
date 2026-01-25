interface SessionUser {
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

export type { SessionUser, SessionContextType }