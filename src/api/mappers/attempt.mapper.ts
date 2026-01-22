import type { Attempt } from '../../types';
import type { StudentAttemptDto } from '../dtos/attempt.dto';

type ApiOutcome = 'WIN' | 'LOSE' | 'IN_PROGRESS';
type UiOutcome = 'GANASTE' | 'PERDISTE' | 'EN_PROGRESO';

/**
 * Mapea outcome del API a outcome de UI
 */
function mapApiOutcomeToUiOutcome(apiOutcome: ApiOutcome): UiOutcome {
    switch (apiOutcome) {
        case 'WIN':
            return 'GANASTE';
        case 'LOSE':
            return 'PERDISTE';
        case 'IN_PROGRESS':
            return 'EN_PROGRESO';
        default:
            return 'EN_PROGRESO';
    }
}

/**
 * Mapper: StudentAttemptDto -> UI Model (Attempt)
 * Para GET /students/{studentId}/attempts
 */
export function mapStudentAttemptDtoToAttempt(dto: StudentAttemptDto): Attempt {
    return {
        id: dto.attemptId,
        taskId: dto.taskId,
        date: dto.finishedAt || dto.startedAt,
        outcome: mapApiOutcomeToUiOutcome(dto.outcome),
        score: dto.score,
        status: dto.status,
    };
}
