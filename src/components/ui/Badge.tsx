import clsx from 'clsx';
import type {TaskStatus} from "../../models/dtos/TaskServiceDTO.ts";

interface BadgeProps {
  status: TaskStatus;
  className?: string;
}

export const Badge = ({ status, className }: BadgeProps) => {
  const styles = {
    NOT_STARTED: 'bg-gray-100 text-gray-700 border-gray-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    FAILED: 'bg-red-100 text-red-700 border-red-200',
    OUTDATED: 'bg-red-100 text-red-700 border-red-200',
  };

  const labels = {
    NOT_STARTED: 'SIN EMPEZAR',
    IN_PROGRESS: 'EN CURSO',
    COMPLETED: 'COMPLETADA',
    FAILED: 'FALLIDA',
    OUTDATED: 'VENCIDA',
  };

  return (
    <span className={clsx(
      "px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase",
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  );
};