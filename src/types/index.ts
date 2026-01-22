export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  type: 'ASSIGNMENT' | 'EVALUATION'; // Asignación (varios intentos) / Evaluación (1 intento)
  attempts: number;
  maxAttempts: number;
  minScore: number;
}

export interface Attempt {
  id: string;
  taskId: string;
  taskTitle?: string;
  date: string;
  outcome: 'GANASTE' | 'PERDISTE' | 'EN_PROGRESO';
  score: number;
  status: 'UNKNOWN' | 'APPROVED' | 'DISAPPROVED';
}