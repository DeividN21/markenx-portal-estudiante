interface MetricServiceDTO {
    id: string,
    attemptId: string,
    profileDiscoveryPercentage: number;
    finalAcceptance: number;
    remainingBudget: number;
    totalTurnsUsed: number;
    finalOutcome: MetricOutcome;
    sessionDate: string;
}

type MetricOutcome = 'WIN' | 'LOSE';

export type { MetricServiceDTO }