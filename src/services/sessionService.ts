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

    logoutFederated: (postLogoutRedirectUrl: string) => {
        const logoutUrl = apiClient.buildUrl('/auth/logout');

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = logoutUrl;

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
