import { apiClient } from './apiClient.ts';
import type {SessionServiceDTO} from "../models/dtos/SessionServiceDTO.ts";
import type {StudentServiceDTO} from "../models/dtos/StudentServiceDTO.ts";
import {sessionServiceMock} from "../__mocks__/sessionServiceMock.ts";
import {studentServiceMock} from "../__mocks__/studentServiceMock.ts";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const sessionService = {

    getAuthMe: async (): Promise<SessionServiceDTO> => {
        if (USE_MOCK) return sessionServiceMock.getAuthMe();
        return apiClient.request<SessionServiceDTO>('/auth/me', { method: 'GET' });
    },

    getStudentMe: async (): Promise<StudentServiceDTO> => {
        if (USE_MOCK) return studentServiceMock.getStudentMe();
        return apiClient.request<StudentServiceDTO>('/students/me', { method: 'GET' });
    },

    /**
     * Logout federado (Keycloak) debe ser navegación TOP-LEVEL, no fetch,
     * para que los redirects 302 del IdP funcionen correctamente.
     *
     * Implementación:
     * - Enviamos un POST real a /auth/logout mediante un form oculto.
     * - El backend redirige a Keycloak logout + post_logout_redirect_uri (frontend).
     */
    logoutFederated: (postLogoutRedirectUrl: string) => {
        const logoutUrl = apiClient.buildUrl('/auth/logout');

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = logoutUrl;

        // Redirigir al frontend tras logout (tu success handler ya lo hace;
        // esto sirve si más adelante decides leerlo en backend)
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'redirect';
        input.value = postLogoutRedirectUrl;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    },
};

export { sessionService }
