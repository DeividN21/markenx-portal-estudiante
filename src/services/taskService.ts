import {apiClient} from "./apiClient.ts";
import type {AttemptServiceDTO} from "../models/dtos/AttemptServiceDTO.ts";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const taskService = {

    getTaskAttempts: async (taskId: string): Promise<AttemptServiceDTO[]> => {
        if (USE_MOCK) return [];
        return apiClient.request<AttemptServiceDTO[]>(`/tasks/${taskId}/attempts`, { method: 'GET' });
    },

}

export { taskService }