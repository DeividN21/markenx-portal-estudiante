import { Trophy, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { mockAttempts } from '../mocks/attempts';
import clsx from 'clsx';

export const ProgressPage = () => {
  // Cálculos rápidos para las tarjetas de resumen
  const totalGames = mockAttempts.length;
  const wins = mockAttempts.filter(a => a.outcome === 'GANASTE').length;
  const avgScore = (mockAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalGames) * 100;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          Mi Progreso
        </h1>
        <p className="text-gray-500">
          Historial de partidas y métricas de desempeño.
        </p>
      </div>

      {/* TARJETAS DE RESUMEN (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Partidas Jugadas</p>
            <p className="text-3xl font-bold text-slate-800">{totalGames}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Victorias</p>
            <p className="text-3xl font-bold text-slate-800">{wins}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Promedio Aceptación</p>
            <p className="text-3xl font-bold text-slate-800">{avgScore.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* TABLA DE HISTORIAL */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-slate-700">Historial de Intentos</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
              <tr>
                <th className="px-6 py-3">Misión</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3 text-center">Resultado</th>
                <th className="px-6 py-3 text-center">Aceptación</th>
                <th className="px-6 py-3 text-center">Presupuesto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {attempt.taskTitle}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(attempt.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx(
                      "px-2 py-1 rounded text-xs font-bold border",
                      attempt.outcome === 'GANASTE' 
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    )}>
                      {attempt.outcome}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-bold text-slate-700">
                      {(attempt.score * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono">
                    ${attempt.budget}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};