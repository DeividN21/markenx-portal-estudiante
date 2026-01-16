import { apiClient } from '../api/apiClient';
import type { AuthMeResponse } from '../api/dtos/auth.dto';
import type { StudentMeResponse } from '../api/dtos/student.dto';
import type { CourseResponse } from '../api/dtos/course.dto';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * sessionService
 * ------------------------------------------------------
 * Responsabilidad:
 * - Resolver el “contexto mínimo” del usuario autenticado:
 *   - auth: /auth/me (roles, identidad)
 *   - dominio: /students/me (studentId, courseId)
 *   - curso: /students/{id}/course (courseName, etc.)
 *
 * Este servicio NO guarda en localStorage.
 */
export const sessionService = {
    /**
     * Devuelve info de autenticación (roles) desde el BFF.
     * Si no hay sesión, apiClient redirige al login automáticamente.
     */
    getAuthMe: async (): Promise<AuthMeResponse> => {
        if (USE_MOCK) {
            return {
                username: 'mock.user',
                email: 'mock@udla.edu.ec',
                fullName: 'Mock User',
                roles: ['ROLE_STUDENT'],
            };
        }
        return apiClient.request<AuthMeResponse>('/auth/me', { method: 'GET' });
    },

    /**
     * Devuelve el perfil del estudiante actual (dominio).
     * Recomendado que el backend derive el studentId desde la sesión.
     */
    getStudentMe: async (): Promise<StudentMeResponse> => {
        if (USE_MOCK) {
            return {
                studentId: 'student-1',
                email: 'mock@udla.edu.ec',
                firstName: 'Mock',
                lastName: 'User',
                courseId: 'course-1',
            };
        }
        return apiClient.request<StudentMeResponse>('/students/me', { method: 'GET' });
    },

    getCourseByStudentId: async (studentId: string): Promise<CourseResponse> => {
        if (USE_MOCK) {
            return {
                courseId: 'course-1',
                courseName: 'ISWZ3104 - MARKETING I',
                term: '2026-1',
                teacherName: 'Docente Mock',
            };
        }
        return apiClient.request<CourseResponse>(`/students/${studentId}/course`, { method: 'GET' });
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
