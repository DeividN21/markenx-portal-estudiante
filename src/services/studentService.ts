import type { Attempt } from '../types';
import { apiClient } from './apiClient.ts';
import type { StudentAttemptDto } from '../api/dtos/attempt.dto';
import type { AttemptMetricsDto } from '../api/dtos/metrics.dto';
import { mapStudentAttemptDtoToAttempt } from '../api/mappers/attempt.mapper';
import type {TaskServiceDTO} from "../models/dtos/TaskServiceDTO.ts";
import {studentServiceMock} from "../__mocks__/studentServiceMock.ts";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const studentService = {

  getStudentTask: async (studentId: string, taskId: string): Promise<TaskServiceDTO> => {
    if (USE_MOCK) return studentServiceMock.getStudentTask(taskId);
    return await apiClient.request<TaskServiceDTO>(
        `/students/${studentId}/tasks/${taskId}/progress`, { method: 'GET' }
    );
  },

  getStudentTasks: async (studentId: string): Promise<TaskServiceDTO[]> => {
    if (USE_MOCK) return studentServiceMock.getStudentTasks();
    return await apiClient.request<TaskServiceDTO[]>(
        `/students/${studentId}/tasks`, { method: 'GET' }
    );
  },

  getMetricsByAttempt: async (attemptId: string): Promise<AttemptMetricsDto> => {
    if (USE_MOCK) {
      return {
        attemptId,
        profileDiscoveryPercentage: 0.8,
        finalAcceptance: 0.8,
        remainingBudget: 200,
        totalTurnsUsed: 5,
        finalOutcome: 'APPROVED',
        sessionDate: new Date().toISOString(),
      };
    }
    return apiClient.request<AttemptMetricsDto>(`/attempts/${attemptId}/metrics`, { method: 'GET' });
  },

  getAttemptsByStudent: async (studentId: string): Promise<Attempt[]> => {
    if (USE_MOCK) {
      return [
        {
          id: 'att-mock-1',
          taskId: 'task-1',
          taskTitle: 'Tarea Mock',
          date: new Date().toISOString(),
          outcome: 'GANASTE',
          score: 0.85,
          status: 'APPROVED',
        },
      ];
    }
    const dtos = await apiClient.request<StudentAttemptDto[]>(`/students/${studentId}/attempts`, { method: 'GET' });
    return dtos.map(mapStudentAttemptDtoToAttempt);
  },
};
