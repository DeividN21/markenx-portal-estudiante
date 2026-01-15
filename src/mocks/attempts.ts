export interface Attempt {
  id: string;
  taskTitle: string;
  date: string;
  outcome: 'GANASTE' | 'PERDISTE';
  score: number;       
  budget: number;      
  turns: number;
}

export const mockAttempts: Attempt[] = [
  {
    id: 'att-1',
    taskTitle: 'Estrategia de Precios: Tecnología',
    date: '2026-01-14',
    outcome: 'GANASTE',
    score: 0.85,
    budget: 450,
    turns: 5
  },
  {
    id: 'att-2',
    taskTitle: 'Estrategia de Precios: Tecnología',
    date: '2026-01-12',
    outcome: 'PERDISTE',
    score: 0.40,
    budget: 0,
    turns: 3
  },
  {
    id: 'att-3',
    taskTitle: 'Análisis de Mercado: Eco-Friendly',
    date: '2026-01-10',
    outcome: 'PERDISTE',
    score: 0.65,
    budget: 100,
    turns: 5
  }
];