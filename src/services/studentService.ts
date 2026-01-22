import type { Task, Attempt } from '../types';
import { apiClient } from '../api/apiClient';
import type { TaskDto, TaskListItemDto } from '../api/dtos/task.dto';
import type { AttemptDto, StudentAttemptDto } from '../api/dtos/attempt.dto';
import type { AttemptMetricsDto } from '../api/dtos/metrics.dto';
import { mapTaskDtoToTask, mapTaskListItemDtoToTask } from '../api/mappers/task.mapper';
import { mapStudentAttemptDtoToAttempt } from '../api/mappers/attempt.mapper';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * studentService (UI-level)
 * ------------------------------------------------------
 * Responsabilidad:
 * - Consumir endpoints del BFF/API y mapear a modelos UI.
 * - NO conocer auth tokens.
 * - Mantener firmas simples para páginas.
 *
 * NOTA:
 * Este servicio asume que el backend ya sabe "quién soy" por la sesión,
 * o que el front ya tiene studentId/courseId vía SessionContext.
 */
export const studentService = {
  /**
   * Obtiene una tarea por ID.
   * GET /tasks/{taskId}
   */
  getTaskById: async (taskId: string): Promise<Task> => {
    if (USE_MOCK) {
      return {
        id: taskId,
        title: 'Tarea Mock',
        description: 'Descripción de tarea mock',
        deadline: new Date().toISOString(),
        status: 'PENDING',
        type: 'ASSIGNMENT',
        attempts: 0,
        maxAttempts: 3,
        minScore: 0.7,
      };
    }
    const dto = await apiClient.request<TaskDto>(`/tasks/${taskId}`, { method: 'GET' });
    return mapTaskDtoToTask(dto);
  },

  /**
   * Lista tareas del curso.
   * GET /courses/{courseId}/tasks
   */
  getTasksByStudent: async (studentId: string): Promise<Task[]> => {
    if (USE_MOCK) {
      return [];
    }
    const dtos = await apiClient.request<TaskListItemDto[]>(`/students/${studentId}/tasks`, { method: 'GET' });
    return dtos.map(mapTaskListItemDtoToTask);
  },

  /**
   * Intentos por tarea (para detalle e historial).
   */
  getAttemptsByTask: async (taskId: string): Promise<AttemptDto[]> => {
    if (USE_MOCK) return [];
    return apiClient.request<AttemptDto[]>(`/tasks/${taskId}/attempts`, { method: 'GET' });
  },

  /**
   * Métricas por intento (para ProgressPage).
   */
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

  /**
   * Intentos del estudiante (historial).
   * GET /students/{studentId}/attempts
   */
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
