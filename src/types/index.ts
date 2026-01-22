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
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  type: 'ASSIGNMENT' | 'EVALUATION';
  attempts: number;
  maxAttempts: number;
  minScore: number;
  scenarioId?: string;
}

export interface TaskDetail {
  studentId: string,
  taskId: string,
  currentAttempt: number,
  maxAttempts: number,
  remainingAttempts: number
}

export interface TaskSummary {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  type: 'ASSIGNMENT' | 'EVALUATION';
  minScore: number;
  scenarioId?: string;
  studentId: string,
  currentAttempt: number,
  maxAttempts: number,
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