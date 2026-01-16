export interface TaskDto {
    taskId: string;
    title: string;
    summary?: string;
    deadline: string;
    status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
    maxAttempts?: number;
    minScoreToPass?: number;
    currentAttempt?: number;
}
