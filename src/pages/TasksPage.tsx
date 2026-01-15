import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskFilters } from '../components/ui/TaskFilters';
import { TaskCard } from '../components/ui/TaskCard';
import { mockTasks } from '../mocks/tasks';
import type { Task } from '../types';

export const TasksPage = () => {
  // Filtrar solo las que son de tipo "ASSIGNMENT" (Tareas con varios intentos)
  const navigate = useNavigate();
  const assignments = mockTasks.filter(t => t.type === 'ASSIGNMENT');

  const handleTaskClick = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          Tareas
        </h1>
        <p className="text-gray-500">
          Gestiona tus actividades pendientes y revisa tus calificaciones.
        </p>
      </div>

      <TaskFilters />

      <div className="space-y-4">
        {assignments.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={handleTaskClick} 
          />
        ))}
        
        {assignments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No tienes tareas asignadas por el momento.
          </div>
        )}
      </div>
    </div>
  );
};