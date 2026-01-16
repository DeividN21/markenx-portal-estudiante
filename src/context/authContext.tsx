import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authService, type MeResponse } from '../services/authService';

/**
 * User (modelo para UI)
 * -----------------------------------------
 * En BFF Session, el frontend NO almacena token.
 * La identidad se obtiene desde /auth/me.
 *
 * "course" no es parte de autenticación; provendrá de un endpoint de dominio más adelante.
 */
export interface User {
  email: string | null;
  name: string | null;
  course: string | null;
  roles: string[];
  username?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  /**
   * Se mantiene la firma para compatibilidad con el código existente,
   * pero no se usan email/password: el login real es redirect.
   */
  login: (email?: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapMeToUser(me: MeResponse): User {
  return {
    email: me.email ?? null,
    username: me.username ?? null,
    name: me.fullName ?? me.username ?? me.email ?? 'Usuario',
    roles: me.roles ?? [],
    course: null, // se llenará cuando exista endpoint de perfil/curso
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);

  /**
   * Init de sesión:
   * - Al montar la app consultamos /auth/me.
   * - Evita depender de localStorage.
   */
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        setLoading(true);
        const meResponse = await authService.me();
        if (!cancelled) setMe(meResponse);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAuthenticated = !!me;

  const user: User | null = useMemo(() => {
    return me ? mapMeToUser(me) : null;
  }, [me]);

  /**
   * Login:
   * - En BFF no se envían credenciales desde el frontend.
   * - Redirige al flujo oauth2Login en el backend.
   */
  const login = async (): Promise<boolean> => {
    authService.loginRedirect();
    return true;
  };

  /**
   * Logout:
   * - Invalida sesión del BFF (JSESSIONID).
   * - Limpia estado local para evitar mostrar datos stale.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setMe(null);
    }
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
        {!loading && children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
