import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskFilters } from '../components/ui/TaskFilters';
import { TaskCard } from '../components/ui/TaskCard';
import { studentService } from '../services/studentService';
import type { Task } from '../types';

export const EvaluationsPage = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // 1. Cargar datos del servicio
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const allTasks = await studentService.getTasks();
        // Filtrar solo las que son EVALUACIONES
        const exams = allTasks.filter(t => t.type === 'EVALUATION');
        setEvaluations(exams);
      } catch (error) {
        console.error("Error cargando evaluaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  // 2. Lógica de filtrado
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(task => {
      if (statusFilter && task.status !== statusFilter) return false;
      
      if (dateFilter) {
        const taskDate = new Date(task.deadline).toISOString().split('T')[0];
        if (taskDate !== dateFilter) return false;
      }
      
      return true;
    });
  }, [evaluations, statusFilter, dateFilter]);

  const handleTaskClick = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          Evaluaciones
        </h1>
        <p className="text-gray-500">
          Exámenes y pruebas de intento único. ¡Prepárate bien!
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
            <p className="text-gray-400 font-medium">No tienes evaluaciones pendientes.</p>
            {(statusFilter || dateFilter) && (
              <button 
                onClick={() => { setStatusFilter(''); setDateFilter(''); }}
                className="mt-4 text-brand-primary hover:underline text-sm font-bold"
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