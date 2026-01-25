import {apiClient} from "./apiClient.ts";
import {studentServiceMock} from "../__mocks__/studentServiceMock.ts";
import type {TaskServiceDTO} from "../models/dtos/TaskServiceDTO.ts";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const taskService = {

    getTaskById: async (taskId: string): Promise<TaskServiceDTO> => {
        if (USE_MOCK) return studentServiceMock.getTaskById();
        return await apiClient.request<TaskServiceDTO>(`/tasks/${taskId}`, { method: 'GET' });
    },

}

export { taskService }