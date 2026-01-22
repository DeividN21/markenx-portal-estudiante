import type { Task, TaskDetail } from '../../types';
import type { TaskDto, TaskDetailDto } from '../dtos/task.dto';

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

export function mapTaskDetailDtoToTaskDetail(dto: TaskDetailDto): TaskDetail {
    return {
        studentId: dto.studentId,
        taskId: dto.taskId,
        currentAttempt: dto.currentAttempt,
        maxAttempts: dto.maxAttempts,
        remainingAttempts: dto.remainingAttempts,
    }
}

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
