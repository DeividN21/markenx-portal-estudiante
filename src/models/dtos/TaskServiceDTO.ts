interface TaskServiceDTO {
    id: string;
    title: string;
    summary: string;
    deadline: string;
    minScoreToPass: number;
    status: TaskStatus;
    currentAttempt: number;
    maxAttempts: number;
    remainingAttempts: number;
    scenarioId: string;
}

type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'OUTDATED';

export type { TaskServiceDTO, TaskStatus }