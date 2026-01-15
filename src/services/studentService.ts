import { mockTasks } from '../mocks/tasks';
import { mockAttempts } from '../mocks/attempts';
import { apiClient } from './apiClient';
import type { Task } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const studentService = {
  
  // OBTENER TAREAS
  getTasks: async (): Promise<Task[]> => {
    if (USE_MOCK) {
      // Simular tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTasks;
    } else {
      // Conexión Real: GET /api/tasks
      // (El backend debería filtrar las tareas del estudiante basado en el token)
      const data = await apiClient.request('/tasks');
      
      // Mapear respuesta del backend al formato de nuestro frontend si es necesario
      return data.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.summary || '',
        deadline: t.deadline,
        status: t.status, // Asegurarse que coincida PENDING/COMPLETED/EXPIRED
        type: t.maxAttempts > 1 ? 'ASSIGNMENT' : 'EVALUATION',
        attempts: t.currentAttempt || 0,
        maxAttempts: t.maxAttempts,
        minScore: t.minScoreToPass
      }));
    }
  },

  // OBTENER DETALLE DE TAREA
  getTaskById: async (id: string): Promise<Task | undefined> => {
    if (USE_MOCK) {
      return mockTasks.find(t => t.id === id);
    } else {
      // Conexión Real: GET /api/tasks/{id}
      // Si no existe endpoint individual, se pide todas y se busca
      const tasks = await studentService.getTasks();
      return tasks.find(t => t.id === id);
    }
  },

  // OBTENER HISTORIAL (PROGRESO)
  getAttempts: async (): Promise<any[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAttempts;
    } else {
      // Conexión Real: GET /api/v1/attempts
      const data = await apiClient.request('/v1/attempts');
      
      // Mapear DTO del backend a la interfaz
      return data.map((a: any) => ({
        id: a.id,
        taskTitle: 'Misión Realizada',
        date: a.sessionDate,
        outcome: a.finalOutcome, // 'APPROVED' / 'DISAPPROVED' -> Mapear a GANASTE/PERDISTE
        score: a.profileDiscoveryPercentage, // O finalAcceptance, según lógica de UI
        budget: a.remainingBudget,
        turns: a.totalTurnsUsed
      }));
    }
  }
};