export interface AttemptDto {
    attemptId: string;
    taskId: string;
    startedAt?: string;
    finishedAt?: string;
    status?: string;
}
