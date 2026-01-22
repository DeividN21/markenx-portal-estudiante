import type { Attempt } from '../../types';
import type { StudentAttemptDto } from '../dtos/attempt.dto';

type ApiOutcome = 'APPROVED' | 'DISAPPROVED' | 'UNKNOWN';
type UiOutcome = 'GANASTE' | 'PERDISTE' | 'EN PROGRESO';

/**
 * Mapea outcome del API a outcome de UI
 */
function mapApiOutcomeToUiOutcome(apiOutcome: ApiOutcome): UiOutcome {
    switch (apiOutcome) {
        case 'APPROVED':
            return 'GANASTE';
        case 'DISAPPROVED':
            return 'PERDISTE';
        case 'UNKNOWN':
            return 'EN PROGRESO';
        default:
            return 'EN PROGRESO';
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
        outcome: mapApiOutcomeToUiOutcome(dto.status),
        score: dto.score,
        status: dto.status,
    };
}
