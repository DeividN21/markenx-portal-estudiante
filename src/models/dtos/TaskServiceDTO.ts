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
}

type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'OUTDATED';

export type { TaskServiceDTO }