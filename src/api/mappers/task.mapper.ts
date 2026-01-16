import type { Task } from '../../types';
import type { TaskDto } from '../dtos/task.dto';

/**
 * Mapper: API DTO -> UI Model (Task)
 * ------------------------------------------------------
 * Responsabilidad:
 * - Mantener estable el contrato interno de la UI aunque el backend cambie.
 * - Centralizar reglas de compatibilidad (ej: summary -> description).
 * - Evitar "parches" en páginas.
 */
export function mapTaskDtoToTask(dto: TaskDto): Task {
    const maxAttempts = dto.maxAttempts ?? 1;
    const attempts = dto.currentAttempt ?? 0;

    return {
        id: dto.taskId,
        title: dto.title,
        description: dto.summary ?? '',
        deadline: dto.deadline,
        status: dto.status,
        type: maxAttempts > 1 ? 'ASSIGNMENT' : 'EVALUATION',
        attempts,
        maxAttempts,
        minScore: dto.minScoreToPass ?? 0.7,
    };
}
