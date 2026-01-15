import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definimos el tipo de usuario
interface User {
  email: string;
  name: string;
  course: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Efecto para verificar si ya había sesión (persistencia básica)
  useEffect(() => {
    const storedUser = localStorage.getItem('markenx_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // SIMULACIÓN DE VALIDACIÓN (Aquí se conectaría con Keycloak luego)
    // Credenciales hardcodeadas para prueba:
    if (email.includes('@udla.edu.ec') && password.length >= 6) {
      const mockUser: User = {
        email,
        name: 'Christian Jácome', // Se simula el nombre que viene del token
        course: 'ISWZ3104 - INTRODUCCIÓN A MARKETING I'
      };
      
      localStorage.setItem('markenx_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('markenx_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};