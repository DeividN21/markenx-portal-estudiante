import type { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Análisis de Mercado: Eco-Friendly',
    description: 'Identifica las oportunidades para lanzar un producto sostenible en un mercado saturado.',
    deadline: '2026-02-15',
    status: 'PENDING',
    type: 'ASSIGNMENT',
    attempts: 0,
    maxAttempts: 3,
    minScore: 0.7
  },
  {
    id: '2',
    title: 'Estrategia de Precios: Tecnología',
    description: 'Define el precio óptimo para un nuevo gadget tecnológico considerando la competencia.',
    deadline: '2026-01-20',
    status: 'COMPLETED',
    type: 'ASSIGNMENT',
    attempts: 2,
    maxAttempts: 3,
    minScore: 0.8
  },
  {
    id: '3',
    title: 'Evaluación Parcial: Segmentación',
    description: 'Pon a prueba tus conocimientos sobre segmentación demográfica y psicográfica. Un solo intento.',
    deadline: '2025-12-31',
    status: 'EXPIRED',
    type: 'EVALUATION',
    attempts: 0,
    maxAttempts: 1,
    minScore: 0.6
  }
];