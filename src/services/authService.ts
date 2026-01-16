/**
 * authService (BFF Session)
 * -----------------------------------------
 * En el enfoque BFF:
 * - El frontend NO autentica contra Keycloak (no password grant).
 * - El frontend SOLO redirige al BFF (/auth/login).
 * - El BFF maneja oauth2Login y crea la sesión (JSESSIONID).
 */
import { apiClient } from '../api/apiClient.ts';

const API_URL = import.meta.env.VITE_API_URL;

function buildUrl(path: string) {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export type MeResponse = {
  username: string | null;
  email: string | null;
  fullName: string | null;
  roles: string[];
};

export const authService = {
  /**
   * Inicia el flujo OAuth2 (redirige al BFF).
   * Incluye "redirect" para que al volver de Keycloak regreses a la ruta actual.
   */
  loginRedirect: () => {
    const returnTo = window.location.href; // SPA route actual
    const url = new URL(buildUrl('/auth/login'));
    url.searchParams.set('redirect', returnTo);
    window.location.href = url.toString();
  },

  /**
   * Obtiene la identidad actual desde el BFF.
   * - 200 => usuario autenticado
   * - 401 => no autenticado (apiClient puede redirigir si se usa ahí)
   */
  me: async (): Promise<MeResponse | null> => {
    try {
      return await apiClient.request<MeResponse>('/auth/me', { method: 'GET' });
    } catch {
      return null;
    }
  },

  /**
   * Cierra sesión del BFF.
   * - Invalida HttpSession (JSESSIONID).
   * - NO cierra sesión SSO de Keycloak (eso es logout federado).
   */
  logout: async (): Promise<void> => {
    await apiClient.request('/auth/logout', { method: 'POST' });
  },
};
