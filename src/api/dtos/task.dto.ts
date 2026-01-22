/**
 * DTO para GET /tasks/{taskId} y GET /courses/{courseId}/tasks
 * Coincide con TaskResponseDTO del backend
 */
export interface TaskDto {
    id: string;
    label?: string;
    title: string;
    summary?: string;
    deadline: string;
    minScoreToPass: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'OUTDATED';
    currentAttempt: number;
    maxAttempts: number;
    remainingAttemtps: number;
}

/**
 * DTO para GET /courses/{courseId}/tasks (lista resumida)
 * Algunos endpoints devuelven taskId en lugar de id
 */
export interface TaskListItemDto {
    taskId: string;
    title: string;
    summary?: string;
    deadline: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'OUTDATED';
}
