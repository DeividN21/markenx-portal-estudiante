import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

// Se define la estructura del Usuario en sesión
export interface User {
  email: string;
  name: string;
  course: string;
  token?: string; // Token JWT opcional
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Verificar si hay sesión guardada al iniciar la app
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('markenx_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Error al leer sesión local", e);
          localStorage.removeItem('markenx_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // 2. Función de Login (Conecta con authService)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.user) {
        const userToStore = { 
          ...response.user, 
          token: response.token 
        };
        
        // Guardar en estado y en disco
        setUser(userToStore);
        setIsAuthenticated(true);
        localStorage.setItem('markenx_user', JSON.stringify(userToStore));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // 3. Función de Logout
  const logout = () => {
    localStorage.removeItem('markenx_user');
    setUser(null);
    setIsAuthenticated(false);
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