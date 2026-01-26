import { apiClient } from './apiClient.ts';
import type {GameTokenServiceDTO} from "../models/dtos/GameTokenServiceDTO.ts";

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

        const response = await apiClient.request<GameTokenServiceDTO>(
            '/auth/game-token',
            { method: 'POST' }
        );

        return response.token;
    },
};
