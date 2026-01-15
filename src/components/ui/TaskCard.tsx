import { Calendar, RefreshCw } from 'lucide-react';
import type { Task } from '../../types';
import { Badge } from './Badge';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  return (
    <div 
      onClick={() => onClick(task)}
      className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* IZQUIERDA: Información Principal */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">
            {task.title}
          </h3>
          <Badge status={task.status} />
        </div>
        <p className="text-gray-500 text-sm line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* DERECHA: Intentos y Fecha */}
      <div className="flex items-center gap-6 md:border-l md:border-gray-100 md:pl-6 shrink-0">
        
        {/* Contador de Intentos */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <RefreshCw size={14} />
            <span className="text-xs font-medium uppercase">Intentos</span>
          </div>
          <p className="font-bold text-slate-700">
            {task.attempts} <span className="text-gray-400 font-normal">/ {task.maxAttempts}</span>
          </p>
        </div>

        {/* Fecha Límite */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Calendar size={14} />
            <span className="text-xs font-medium uppercase">Vence el</span>
          </div>
          <p className="font-bold text-slate-700">
            {new Date(task.deadline).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>

      </div>
    </div>
  );
};