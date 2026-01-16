export interface AttemptMetricsDto {
    attemptId: string;
    profileDiscoveryPercentage: number;
    finalAcceptance: number;
    remainingBudget: number;
    totalTurnsUsed: number;
    finalOutcome: 'APPROVED' | 'DISAPPROVED' | 'WIN' | 'LOSE' | string;
    sessionDate?: string;
}
