import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, RefreshCw, Trophy, Play, AlertCircle } from 'lucide-react';
import { useSession } from '../sessions/sessionProvider.tsx';
import { studentService } from '../services/studentService';
import { Badge } from '../components/ui/Badge';
import type { Task, TaskDetail, TaskSummary } from '../types';

function createTaskSummary(task: Task, detail: TaskDetail): TaskSummary {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    status: task.status,
    type: task.type,
    minScore: task.minScore,
    scenarioId: task.scenarioId,
    studentId: detail.studentId,
    currentAttempt: detail.currentAttempt,
    maxAttempts: detail.maxAttempts,
  };
}

export const TaskDetailPage = () => {
  const { taskId } = useParams();
  const { user } = useSession();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar tarea individual
  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) return;
      try {
        setLoading(true);
        const foundTask = await studentService.getStudentTask(taskId);
        const detail = await studentService.getTaskDetailById(user.id, taskId);
        setTask(createTaskSummary(foundTask, detail) || null);
      } catch (error) {
        console.error('Error cargando detalle:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId]);

  const handleStartGame = () => {
    if (task && task.status !== 'EXPIRED' && task.currentAttempt < task.maxAttempts) {
      navigate(`/game/${task.id}`);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando información de la misión...</div>;

  if (!task)
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-700">Misión no encontrada</h2>
        <button onClick={() => navigate(-1)} className="text-brand-primary mt-4 underline">
          Volver
        </button>
      </div>
    );

  const isAttemptsLimitReached = task.currentAttempt >= task.maxAttempts;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-brand-primary mb-6 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Volver a la lista
      </button>

      {/* Tarjeta Principal */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Cabecera */}
        <div className="bg-slate-50 p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {task.title}
              </h1>
              <Badge status={task.status} />
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              {task.type === 'ASSIGNMENT' ? 'Práctica Académica' : 'Evaluación Oficial'}
              {task.type === 'EVALUATION' && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                  ¡INTENTO ÚNICO!
                </span>
              )}
            </p>
          </div>

          {/* Botón de Acción Principal */}
          <button
            onClick={handleStartGame}
            disabled={task.status === 'EXPIRED' || isAttemptsLimitReached}
            className={`
              group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 rounded-full shadow-lg focus:outline-none ring-offset-2 focus:ring-2
              ${task.status === 'EXPIRED' || isAttemptsLimitReached
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-brand-primary hover:bg-brand-secondary hover:shadow-brand-primary/40 hover:-translate-y-1'
              }
            `}
          >
            {task.status === 'EXPIRED' ? (
              <span className="flex items-center gap-2">
                <AlertCircle size={20} /> Misión Cerrada
              </span>
            ) : isAttemptsLimitReached ? (
              <span className="flex items-center gap-2">
                <AlertCircle size={20} /> Intentos agotados
              </span>
            ) : (
              <>
                <span className="mr-2 text-lg">Iniciar Misión</span>
                <Play size={20} className="fill-current group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Cuerpo de Detalles */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Descripción */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Briefing de la Misión
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">{task.description}</p>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 className="font-bold text-blue-800 text-sm mb-1">Instrucciones Adicionales:</h4>
                <p className="text-sm text-blue-700">
                  Recuerda revisar el presupuesto inicial y las expectativas del consumidor antes de tomar
                  decisiones en la simulación. Los resultados se guardarán automáticamente al finalizar.
                </p>
              </div>
            </div>
          </div>

          {/* Métricas */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100 h-fit">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-gray-200 text-blue-600 rounded-lg shadow-sm">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Fecha Límite</p>
                <p className="font-bold text-slate-800 text-lg">
                  {new Date(task.deadline).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-gray-200 text-purple-600 rounded-lg shadow-sm">
                <RefreshCw size={24} />
              </div>
              <div className="w-full">
                <p className="text-xs font-bold text-gray-400 uppercase">Intentos Realizados</p>
                <div className="flex justify-between items-end mb-1">
                  <p className="font-bold text-slate-800 text-lg">
                    {task.currentAttempt} / {task.maxAttempts}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isAttemptsLimitReached ? 'bg-red-500' : 'bg-purple-500'
                    }`}
                    style={{
                      width: `${Math.min((task.currentAttempt / task.maxAttempts) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-gray-200 text-amber-600 rounded-lg shadow-sm">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Nota Mínima</p>
                <p className="font-bold text-slate-800 text-lg">{(task.minScore * 100).toFixed(0)}/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
