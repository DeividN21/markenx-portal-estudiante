import { env } from '../config/env';

/**
 * apiClient (BFF Session)
 * ------------------------------------------------------
 * - Centraliza llamadas al BFF usando cookies de sesión (JSESSIONID).
 * - No maneja tokens en frontend.
 * - Maneja 401/403 redirigiendo al login del BFF con redirect seguro.
 *
 * Importante:
 * - VITE_API_URL debe incluir el context-path: http://localhost:8080/api/v1
 * - credentials: 'include' es obligatorio para enviar/recibir cookies.
 */
const API_URL = env.API_BASE_URL;

function buildUrl(endpoint: string) {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

function buildLoginRedirectUrl(currentUrl: string) {
  const login = buildUrl('/auth/login');
  const redirect = encodeURIComponent(currentUrl);
  return `${login}?redirect=${redirect}`;
}

export const apiClient = {
  buildUrl,

  request: async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = buildUrl(endpoint);

    const headers: Record<string, string> = {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Auth handling (BFF session)
    if (response.status === 401 || response.status === 403) {
      // Si se cae en /auth/me o cualquier endpoint privado, re-lanza flujo de login
      window.location.href = buildLoginRedirectUrl(window.location.href);
      throw new Error('No autenticado / No autorizado');
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Error API: ${response.status} ${response.statusText} ${text}`);
    }

    if (response.status === 204) return null as T;
    return (await response.json()) as T;
  },
};
