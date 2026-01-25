import type { Task, TaskDetail, Attempt } from '../types';
import { apiClient } from './apiClient.ts';
import type { TaskDetailDto, TaskListItemDto } from '../api/dtos/task.dto';
import type { AttemptDto, StudentAttemptDto } from '../api/dtos/attempt.dto';
import type { AttemptMetricsDto } from '../api/dtos/metrics.dto';
import { mapTaskDetailDtoToTaskDetail, mapTaskListItemDtoToTask } from '../api/mappers/task.mapper';
import { mapStudentAttemptDtoToAttempt } from '../api/mappers/attempt.mapper';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const studentService = {

  getTaskDetailById: async (studentId: string, taskId: string): Promise<TaskDetail> => {
    if (USE_MOCK) {
      return {
        studentId: studentId,
        taskId: taskId,
        currentAttempt: 1,
        maxAttempts: 3,
        remainingAttempts: 2,
      };
    }
    const dto = await apiClient.request<TaskDetailDto>(`/students/${studentId}/tasks/${taskId}/progress`, { method: 'GET' });
    return mapTaskDetailDtoToTaskDetail(dto);
  },

  getTasksByStudent: async (studentId: string): Promise<Task[]> => {
    if (USE_MOCK) {
      return [];
    }
    const dtos = await apiClient.request<TaskListItemDto[]>(`/students/${studentId}/tasks`, { method: 'GET' });
    return dtos.map(mapTaskListItemDtoToTask);
  },

  getAttemptsByTask: async (taskId: string): Promise<AttemptDto[]> => {
    if (USE_MOCK) return [];
    return apiClient.request<AttemptDto[]>(`/tasks/${taskId}/attempts`, { method: 'GET' });
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
