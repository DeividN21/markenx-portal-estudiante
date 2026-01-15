// Imports de configuración
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL;
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

// Tipos
export interface AuthResponse {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

// 1. LÓGICA MOCK (Local)
const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  // Simular un delay de red
  await new Promise(resolve => setTimeout(resolve, 800));

  if (email.includes('@udla.edu.ec') && password.length >= 6) {
    return {
      success: true,
      user: {
        email,
        name: 'Christian Jácome',
        course: 'ISWZ3104 - MARKETING I'
      },
      token: 'mock-jwt-token-12345'
    };
  }
  return { success: false, error: 'Credenciales inválidas (Mock)' };
};

// 2. LÓGICA REAL (Keycloak)
const realLogin = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('grant_type', 'password');
    params.append('username', email);
    params.append('password', password);

    const response = await fetch(KEYCLOAK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (!response.ok) throw new Error('Credenciales incorrectas en Keycloak');

    const data = await response.json();
    
    // Aquí se podría decodificar el JWT para sacar el nombre real
    return {
      success: true,
      user: {
        email,
        name: 'Estudiante MarkenX', // Idealmente decodificar data.access_token
        course: 'Curso Activo' // Esto debería venir de otro endpoint de la API
      },
      token: data.access_token // El token real de Keycloak
    };

  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error de conexión con el servidor' };
  }
};

// 3. EXPORTAR SERVICIO (Switch Automático)
export const authService = {
  login: USE_MOCK ? mockLogin : realLogin
};