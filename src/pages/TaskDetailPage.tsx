import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, RefreshCw, Trophy, Play } from 'lucide-react';
import { mockTasks } from '../mocks/tasks';
import { Badge } from '../components/ui/Badge';

export const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  // Buscar la tarea en datos por default
  const task = mockTasks.find(t => t.id === taskId);

  if (!task) {
    return <div className="text-center py-20">Tarea no encontrada</div>;
  }

  const handleStartGame = () => {
    // Navegar a la pantalla de juego (que crearemos en el siguiente paso)
    navigate(`/game/${taskId}`);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-brand-primary mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver a la lista
      </button>

      {/* Tarjeta Principal */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Cabecera de la Tarjeta */}
        <div className="bg-slate-50 p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {task.title}
              </h1>
              <Badge status={task.status} />
            </div>
            <p className="text-gray-500 font-medium">Asignación Académica</p>
          </div>

          {/* Botón de Acción Principal (Gamificado) */}
          <button
            onClick={handleStartGame}
            disabled={task.status === 'EXPIRED'} // Deshabilitar si venció
            className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-brand-primary rounded-full hover:bg-brand-secondary focus:outline-none ring-offset-2 focus:ring-2 shadow-lg hover:shadow-brand-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2 text-lg">Iniciar Misión</span>
            <Play size={20} className="fill-current" />
          </button>
        </div>

        {/* Cuerpo de Detalles */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Descripción */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                Descripción de la Misión
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {task.description}
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Métricas Clave */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100 h-fit">
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Fecha Límite</p>
                <p className="font-bold text-slate-800 text-lg">
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Intentos</p>
                <p className="font-bold text-slate-800 text-lg">
                  {task.attempts} <span className="text-gray-400 text-sm">de {task.maxAttempts}</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full" 
                    style={{ width: `${(task.attempts / task.maxAttempts) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Nota Mínima</p>
                <p className="font-bold text-slate-800 text-lg">
                  {(task.minScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};