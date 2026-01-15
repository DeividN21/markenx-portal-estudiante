import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskFilters } from '../components/ui/TaskFilters';
import { TaskCard } from '../components/ui/TaskCard';
import { mockTasks } from '../mocks/tasks';
import type { Task } from '../types';

export const EvaluationsPage = () => {
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Filtro solo EVALUATIONS
  const allEvaluations = mockTasks.filter(t => t.type === 'EVALUATION');

  const filteredEvaluations = useMemo(() => {
    return allEvaluations.filter(task => {
      if (statusFilter && task.status !== statusFilter) return false;
      if (dateFilter) {
        const taskDate = new Date(task.deadline).setHours(0,0,0,0);
        const filterDate = new Date(dateFilter).setHours(0,0,0,0);
        if (taskDate !== filterDate) return false;
      }
      return true;
    });
  }, [statusFilter, dateFilter, allEvaluations]);

  const handleTaskClick = (task: Task) => {
    // NAVEGACIÓN FUNCIONAL
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          Evaluaciones
        </h1>
        <p className="text-gray-500">
          Exámenes de intento único.
        </p>
      </div>

      <TaskFilters 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onSearch={() => {}}
      />

      <div className="space-y-4">
        {filteredEvaluations.length > 0 ? (
          filteredEvaluations.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={handleTaskClick} 
            />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400">No hay evaluaciones disponibles.</p>
            {(statusFilter || dateFilter) && (
              <button 
                onClick={() => { setStatusFilter(''); setDateFilter(''); }}
                className="mt-4 text-brand-primary hover:underline text-sm"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};