import { apiClient } from './apiClient.ts';
import type { GameTokenResponse } from '../api/dtos/gameToken.dto';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const gameTokenService = {
    /**
     * Obtiene un token temporal para el juego Unity.
     * Requiere que el usuario tenga sesion activa (cookie JSESSIONID).
     *
     * @returns Promise<string> - Token JWT temporal
     * @throws Error si no hay sesion o el endpoint falla
     */
    getGameToken: async (): Promise<string> => {
        if (USE_MOCK) return 'mock-game-token-for-development';

        const response = await apiClient.request<GameTokenResponse>(
            '/auth/game-token',
            { method: 'POST' }
        );

        return response.token;
    },
};
