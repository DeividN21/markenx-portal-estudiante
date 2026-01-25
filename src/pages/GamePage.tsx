import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { XCircle, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useSession } from '../context/sessionContext';
import { studentService } from '../services/studentService';
import { gameTokenService } from '../services/gameTokenService';
import { env } from '../config/env';
import type { Task } from '../types';

/**
 * GamePage - Pagina que embebe el juego Unity WebGL
 *
 * Implementa la Opcion A (iframe) de la documentacion de integracion.
 *
 * Flujo:
 * 1. Obtiene taskId de la URL (React Router)
 * 2. Obtiene studentId del contexto de sesion
 * 3. Obtiene scenarioId de la API (GET /tasks/{taskId})
 * 4. Obtiene gameToken del BFF (POST /auth/game-token)
 * 5. Construye URL del juego con Query Parameters (incluyendo token)
 * 6. Carga el juego en un iframe
 *
 * El gameToken permite que Unity se autentique con el BFF
 * sin depender de cookies de sesion (que no funcionan en iframes).
 */
export const GamePage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useSession();

  const [task, setTask] = useState<Task | null>(null);
  const [gameToken, setGameToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameLoaded, setGameLoaded] = useState(false);

  // Cargar datos de la tarea para obtener scenarioId
  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) {
        setError('No se proporciono ID de tarea');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const foundTask = await studentService.getStudentTask(taskId);
        setTask(foundTask);
      } catch (err) {
        console.error('Error cargando tarea:', err);
        setError('Error al cargar la informacion de la tarea');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  // Obtener token de autenticacion para Unity
  useEffect(() => {
    const fetchGameToken = async () => {
      try {
        setTokenLoading(true);
        const token = await gameTokenService.getGameToken();
        setGameToken(token);
        console.log('[GamePage] Game token obtenido correctamente');
      } catch (err) {
        console.error('[GamePage] Error obteniendo game token:', err);
        setError('No se pudo obtener autorizacion para el juego. Por favor, recarga la pagina.');
      } finally {
        setTokenLoading(false);
      }
    };

    // Solo obtener token si hay usuario autenticado
    if (user?.id) {
      fetchGameToken();
    }
  }, [user?.id]);

  // Construir URL del juego con Query Parameters
  const gameUrl = useMemo(() => {
    // Requiere: taskId, userId, y gameToken
    if (!taskId || !user?.id || !gameToken) return null;

    const params = new URLSearchParams();

    // scenarioId: usar el de la tarea, o taskId como fallback
    const scenarioId = task?.scenarioId || taskId;
    params.set('scenarioId', scenarioId);

    // studentId: del contexto de sesion
    params.set('studentId', user.id);

    // taskId: de la URL
    params.set('taskId', taskId);

    // apiUrl: URL del backend (sin /api/v1, Unity lo agrega)
    const apiBaseUrl = env.API_BASE_URL.replace('/api/v1', '');
    params.set('apiUrl', apiBaseUrl);

    // gameToken: token JWT temporal para autenticacion
    params.set('gameToken', gameToken);

    // Construir URL final
    const baseGameUrl = env.GAME_URL;
    return `${baseGameUrl}?${params.toString()}`;
  }, [taskId, user?.id, task?.scenarioId, gameToken]);

  // Manejar cuando el iframe carga
  const handleIframeLoad = () => {
    setGameLoaded(true);
  };

  // Determinar estado de carga general
  const isInitializing = loading || tokenLoading;

  // Mensaje de estado de carga
  const getLoadingMessage = () => {
    if (loading) return 'Obteniendo datos de la mision';
    if (tokenLoading) return 'Obteniendo autorizacion';
    return 'Inicializando entorno 3D';
  };

  // Estados de error
  if (!taskId) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-gray-500">
        <AlertTriangle size={48} className="text-amber-500 mb-4" />
        <h2 className="text-xl font-bold">ID de tarea no valido</h2>
        <button
          onClick={() => navigate('/tasks')}
          className="mt-4 text-brand-primary underline"
        >
          Volver a tareas
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-gray-500">
        <Loader2 size={48} className="animate-spin text-brand-primary mb-4" />
        <p>Cargando sesion...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-gray-500">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-600">{error}</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md text-center">
          Esto puede ocurrir si tu sesion expiro o hay un problema de conexion.
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={() => navigate('/tasks')}
            className="text-brand-primary underline"
          >
            Volver a tareas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Encabezado del Modo Juego */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${gameLoaded ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
            {gameLoaded ? 'Simulacion en Curso' : 'Cargando Simulacion...'}
          </h2>
          <p className="text-sm text-gray-500">
            {task?.title || `Mision ID: ${taskId}`}
          </p>
        </div>

        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <XCircle size={18} />
          Abandonar Partida
        </button>
      </div>

      {/* Contenedor del juego Unity */}
      <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-2xl relative">

        {/* Overlay de carga */}
        {(isInitializing || !gameLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/90 z-10">
            <Loader2 size={64} className="animate-spin text-brand-primary mb-4" />
            <h3 className="text-xl font-bold tracking-widest">CARGANDO MARKENX...</h3>
            <p className="text-gray-400 mt-2 text-sm">
              {getLoadingMessage()}
            </p>

            {/* Indicadores de progreso */}
            <div className="flex gap-2 mt-4">
              <div className={`w-2 h-2 rounded-full ${!loading ? 'bg-green-500' : 'bg-gray-600 animate-pulse'}`} title="Datos de mision" />
              <div className={`w-2 h-2 rounded-full ${!tokenLoading ? 'bg-green-500' : 'bg-gray-600 animate-pulse'}`} title="Autorizacion" />
              <div className={`w-2 h-2 rounded-full ${gameLoaded ? 'bg-green-500' : 'bg-gray-600 animate-pulse'}`} title="Juego" />
            </div>
          </div>
        )}

        {/* iframe del juego Unity WebGL */}
        {gameUrl && (
          <iframe
            src={gameUrl}
            title="MarkenX Game"
            className="w-full h-full border-0"
            allow="fullscreen; autoplay"
            onLoad={handleIframeLoad}
          />
        )}
      </div>

      {/* Debug info (solo en desarrollo) */}
      {import.meta.env.DEV && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 font-mono overflow-x-auto space-y-1">
          <div><strong>Game URL:</strong> {gameUrl || 'Generando...'}</div>
          <div><strong>Token:</strong> {gameToken ? `${gameToken.substring(0, 20)}...` : 'Obteniendo...'}</div>
          <div><strong>Estado:</strong> Task={!loading ? 'OK' : 'Loading'} | Token={!tokenLoading ? 'OK' : 'Loading'} | Game={gameLoaded ? 'OK' : 'Loading'}</div>
        </div>
      )}
    </div>
  );
};
