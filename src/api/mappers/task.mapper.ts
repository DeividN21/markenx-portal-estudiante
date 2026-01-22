import type { Task } from '../../types';
import type { TaskDto } from '../dtos/task.dto';

type ApiTaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'OUTDATED' | 'FINISHED';
type UiTaskStatus = 'PENDING' | 'COMPLETED' | 'EXPIRED';

/**
 * Mapea estados del API a estados de UI
 * - NOT_STARTED -> PENDING (aún no inicia)
 * - IN_PROGRESS -> PENDING (en curso, aún se puede completar)
 */
function mapApiStatusToUiStatus(apiStatus: ApiTaskStatus): UiTaskStatus {
    switch (apiStatus) {
        case 'NOT_STARTED':
            return 'PENDING';
        case 'IN_PROGRESS':
            return 'PENDING';
        case 'OUTDATED':
            return 'EXPIRED';
        default:
            return 'PENDING';
    }
}

/**
 * Mapper: API DTO (detalle) -> UI Model (Task)
 * Para GET /tasks/{taskId}
 */
export function mapTaskDtoToTask(dto: TaskDto): Task {
    return {
        id: dto.id,
        title: dto.title,
        description: dto.summary ?? '',
        deadline: dto.deadline,
        status: mapApiStatusToUiStatus(dto.status),
        type: 'ASSIGNMENT',
        attempts: dto.currentAttempt,
        maxAttempts: dto.maxAttempts,
        minScore: dto.minScoreToPass,
        scenarioId: dto.scenarioId,
    };
}

/**
 * Mapper: API DTO (lista) -> UI Model (Task)
 * Para GET /courses/{courseId}/tasks
 */
export function mapTaskListItemDtoToTask(dto: TaskDto): Task {
    return {
        id: dto.id,
        title: dto.title,
        description: dto.summary ?? '',
        deadline: dto.deadline,
        status: mapApiStatusToUiStatus(dto.status),
        type: 'ASSIGNMENT',
        attempts: dto.currentAttempt,
        maxAttempts: dto.maxAttempts,
        minScore: dto.minScoreToPass,
        scenarioId: dto.scenarioId,
    };
}
