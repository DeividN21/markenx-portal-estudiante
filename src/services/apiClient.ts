// Este archivo maneja la comunicación base con la API Real
const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  // Método genérico para peticiones GET, POST, etc.
  request: async (endpoint: string, options: RequestInit = {}) => {
    // 1. Recuperar el token guardado en el Login
    const storedUser = localStorage.getItem('markenx_user');
    let token = '';
    
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      token = parsed.token;
    }

    // 2. Configurar Headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Inyectar Token
      ...options.headers,
    };

    // 3. Ejecutar Petición Real
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 4. Manejo de Errores Base
    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado: Se podría redirigir al login aquí
        console.error("Sesión expirada");
        localStorage.removeItem('markenx_user');
        window.location.href = '/login';
      }
      throw new Error(`Error API: ${response.statusText}`);
    }

    // 5. Devolver JSON limpio
    // Si la respuesta no tiene contenido (204), devuelve null
    if (response.status === 204) return null;
    return response.json();
  }
};