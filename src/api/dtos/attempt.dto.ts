/**
 * DTO para GET /tasks/{taskId}/attempts
 */
export interface AttemptDto {
    attemptId: string;
    taskId: string;
    startedAt?: string;
    finishedAt?: string;
    status?: string;
    outcome?: string;
    score?: number;
}

/**
 * DTO para GET /students/{studentId}/attempts
 */
export interface StudentAttemptDto {
    attemptId: string;
    taskId: string;
    startedAt: string;
    finishedAt: string;
    status: 'UNKNOWN' | 'APPROVED' | 'DISAPPROVED';
    outcome: 'WIN' | 'LOSE' | 'IN_PROGRESS';
    score: number;
}
