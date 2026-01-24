import type { Task, TaskDetail } from '../../types';
import type { TaskDto, TaskDetailDto } from '../dtos/task.dto';

type ApiTaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'OUTDATED';
type UiTaskStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

function mapApiStatusToUiStatus(apiStatus: ApiTaskStatus): UiTaskStatus {
    switch (apiStatus) {
        case 'NOT_STARTED':
            return 'PENDING';
        case 'IN_PROGRESS':
            return 'PENDING';
        case 'COMPLETED':
            return 'COMPLETED';
        case 'FAILED':
            return 'FAILED';
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
        status: mapApiStatusToUiStatus(dto.status),
    }
}

export function mapTaskListItemDtoToTask(dto: TaskDto): Task {
    return {
        id: dto.id,
        title: dto.title,
        description: dto.summary ?? '',
        deadline: dto.deadline,
        type: 'ASSIGNMENT',
        attempts: dto.currentAttempt,
        maxAttempts: dto.maxAttempts,
        minScore: dto.minScoreToPass,
        scenarioId: dto.scenarioId,
    };
}
