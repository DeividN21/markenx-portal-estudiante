import { apiClient } from '../api/apiClient';
import type { GameTokenResponse } from '../api/dtos/gameToken.dto';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * gameTokenService
 * ------------------------------------------------------
 * Responsabilidad:
 * - Obtener un token temporal JWT para el juego Unity WebGL.
 * - El token permite que Unity se autentique con el BFF
 *   sin necesidad de cookies de sesion.
 *
 * Flujo:
 * 1. React llama POST /auth/game-token (con cookie de sesion)
 * 2. BFF genera JWT temporal (10 min expiracion)
 * 3. React pasa el token a Unity via Query Params
 * 4. Unity usa el token en header Authorization: Bearer <token>
 */
export const gameTokenService = {
    /**
     * Obtiene un token temporal para el juego Unity.
     * Requiere que el usuario tenga sesion activa (cookie JSESSIONID).
     *
     * @returns Promise<string> - Token JWT temporal
     * @throws Error si no hay sesion o el endpoint falla
     */
    getGameToken: async (): Promise<string> => {
        if (USE_MOCK) {
            // Token mock para desarrollo sin backend
            return 'mock-game-token-for-development';
        }

        const response = await apiClient.request<GameTokenResponse>(
            '/auth/game-token',
            { method: 'POST' }
        );

        return response.token;
    },
};
