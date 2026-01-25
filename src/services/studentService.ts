import { apiClient } from './apiClient.ts';
import type {TaskServiceDTO} from "../models/dtos/TaskServiceDTO.ts";
import type {AttemptServiceDTO} from "../models/dtos/AttemptServiceDTO.ts";
import {studentServiceMock} from "../__mocks__/studentServiceMock.ts";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const studentService = {

  getStudentTask: async (studentId: string | null, taskId: string | null): Promise<TaskServiceDTO> => {
    if (USE_MOCK || !studentId || !taskId) return studentServiceMock.getStudentTask(taskId || '-');
    return await apiClient.request<TaskServiceDTO>(
        `/students/${studentId}/tasks/${taskId}/progress`, { method: 'GET' }
    );
  },

  getStudentTasks: async (studentId: string | null): Promise<TaskServiceDTO[]> => {
    if (USE_MOCK || !studentId) return studentServiceMock.getStudentTasks();
    return await apiClient.request<TaskServiceDTO[]>(
        `/students/${studentId}/tasks`, { method: 'GET' }
    );
  },

  getStudentAttempts: async (studentId: string | null): Promise<AttemptServiceDTO[]> => {
    if (USE_MOCK || !studentId) return studentServiceMock.getStudentAttempts();
    return await apiClient.request<AttemptServiceDTO[]>(
        `/students/${studentId}/attempts`, { method: 'GET' }
    );
  },
};
