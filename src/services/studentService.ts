import type { Task } from '../types';
import { apiClient } from '../api/apiClient';
import type { TaskDto } from '../api/dtos/task.dto';
import type { AttemptDto } from '../api/dtos/attempt.dto';
import type { AttemptMetricsDto } from '../api/dtos/metrics.dto';
import { mapTaskDtoToTask } from '../api/mappers/task.mapper';

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
   * Lista tareas del curso.
   * Requiere: courseId.
   */
  getTasksByCourse: async (courseId: string): Promise<Task[]> => {
    if (USE_MOCK) {
      // reutiliza tus mocks existentes si quieres; aquí devolvemos vacío por simplicidad
      return [];
    }

    const dtos = await apiClient.request<TaskDto[]>(`/courses/${courseId}/tasks`, { method: 'GET' });
    return dtos.map(mapTaskDtoToTask);
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
};
