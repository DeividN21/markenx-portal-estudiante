import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskFilters } from '../components/ui/TaskFilters';
import { TaskCard } from '../components/ui/TaskCard';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { studentService } from '../services/studentService';
import {useSession} from "../sessions/useSession.ts";
import type {TaskServiceDTO} from "../models/dtos/TaskServiceDTO.ts";

export const TasksPage = () => {
  const navigate = useNavigate();
  const { student } = useSession();

  const [tasks, setTasks] = useState<TaskServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados temporales para los filtros (lo que el usuario edita)
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Estados aplicados (se actualizan al pulsar Buscar)
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
  const [appliedDateFromFilter, setAppliedDateFromFilter] = useState('');
  const [appliedDateToFilter, setAppliedDateToFilter] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const tasks = await studentService.getStudentTasks(student?.id);
        setTasks(tasks);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [student?.id]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (appliedStatusFilter && task.status !== appliedStatusFilter) {
        return false;
      }

      // Filtro por rango de fechas
      if (appliedDateFromFilter || appliedDateToFilter) {
        const taskDate = new Date(task.deadline).toISOString().split('T')[0];
        
        if (appliedDateFromFilter && taskDate < appliedDateFromFilter) {
          return false;
        }
        
        if (appliedDateToFilter && taskDate > appliedDateToFilter) {
          return false;
        }
      }
      
      return true;
    });
  }, [tasks, appliedStatusFilter, appliedDateFromFilter, appliedDateToFilter]);

  const handleTaskClick = (task: TaskServiceDTO) => navigate(
      `/tasks/${task.id}`
  );

  const handleSearch = () => {
    setAppliedStatusFilter(statusFilter);
    setAppliedDateFromFilter(dateFromFilter);
    setAppliedDateToFilter(dateToFilter);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setAppliedStatusFilter('');
    setAppliedDateFromFilter('');
    setAppliedDateToFilter('');
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
        <Breadcrumb items={[{ label: 'Tareas' }]} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
            Tareas
          </h1>
          <p className="text-gray-500">Gestiona tus actividades pendientes y prácticas.</p>
        </div>

        <TaskFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFromFilter={dateFromFilter}
            setDateFromFilter={setDateFromFilter}
            dateToFilter={dateToFilter}
            setDateToFilter={setDateToFilter}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
        />

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
              filteredTasks.map(task => <TaskCard key={task.id} task={task} onClick={handleTaskClick} />)
          ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium">No se encontraron tareas con estos criterios.</p>
                {(appliedStatusFilter || appliedDateFromFilter || appliedDateToFilter) && (
                    <button
                        onClick={handleClearFilters}
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
