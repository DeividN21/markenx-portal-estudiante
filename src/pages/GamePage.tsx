import { useParams, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export const GamePage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]"> 
      {/* Encabezado del Modo Juego */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Simulación en Curso
          </h2>
          <p className="text-sm text-gray-500">Misión ID: {taskId}</p>
        </div>

        <button 
          onClick={() => navigate('/tasks')} // Botón de Salida de Emergencia
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <XCircle size={18} />
          Abandonar Partida
        </button>
      </div>

      {/* CONTENEDOR DE UNITY (Aquí va el juego) */}
      <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-2xl relative group">
        
        {/* Placeholder visual para simular el juego cargando */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-bold tracking-widest">CARGANDO MARKENX...</h3>
          <p className="text-gray-400 mt-2 text-sm">Inicializando entorno 3D</p>
        </div>

        {/* NOTA PARA INTEGRACIÓN:
            Aquí se deberá poner el componente <Unity /> 
            o el <iframe> que carga el build WebGL.
            Ejemplo:
            <iframe src="/game-build/index.html" className="w-full h-full border-0" />
        */}
      
      </div>
    </div>
  );
};