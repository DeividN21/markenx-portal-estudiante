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