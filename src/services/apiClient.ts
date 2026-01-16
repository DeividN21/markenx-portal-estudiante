/**
 * apiClient (BFF Session)
 * -----------------------------------------
 * Responsabilidad:
 * - Centralizar llamadas al BFF usando cookies de sesión (JSESSIONID).
 * - NO manejar tokens en frontend.
 * - Manejar 401/403 de forma consistente (redirigir al login del BFF),
 *   PERO con excepción en /auth/logout para evitar re-login inmediato.
 *
 * Nota:
 * - VITE_API_URL debe incluir el context-path:
 *   Ej: http://localhost:8080/api/v1
 */
const API_URL = import.meta.env.VITE_API_URL;

function buildUrl(endpoint: string) {
  // Acepta endpoints con "/" inicial o sin él
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

export const apiClient = {
  request: async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = buildUrl(endpoint);

    // Headers base: solo agregamos Content-Type cuando enviamos body
    const headers: Record<string, string> = {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };

    const response = await fetch(url, {
      ...options,
      headers,
      /**
       * CRÍTICO:
       * credentials: 'include' permite que el browser envíe/reciba cookies (JSESSIONID).
       */
      credentials: 'include',
    });

    /**
     * Manejo centralizado de auth:
     * - 401/403 => no autenticado o sin permisos.
     * - En una SPA, lo común es redirigir al flujo de login del backend.
     *
     * EXCEPCIÓN:
     * - Si la llamada es /auth/logout, NO dispares loginRedirect automático.
     *   Caso típico: el logout invalida la sesión y la siguiente acción redirige al login,
     *   creando la sensación de "refresh" infinito.
     */
    const isLogoutCall =
        endpoint === '/auth/logout' ||
        endpoint.endsWith('/auth/logout');

    if (response.status === 401 || response.status === 403) {
      if (!isLogoutCall) {
        window.location.href = buildUrl('/auth/login');
      }
      throw new Error('No autenticado / No autorizado');
    }

    // Errores no-auth
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Error API: ${response.status} ${response.statusText} ${text}`);
    }

    // 204: sin contenido
    if (response.status === 204) return null as T;

    return (await response.json()) as T;
  },
};
