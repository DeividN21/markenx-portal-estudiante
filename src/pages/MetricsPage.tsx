import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Clock, Target, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { attemptService } from '../services/attemptService';
import type { MetricServiceDTO } from '../models/dtos/MetricServiceDTO';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const MetricsPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<MetricServiceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!attemptId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await attemptService.getAttemptMetrics(attemptId);
        setMetrics(data);
      } catch (err) {
        console.error('Error cargando métricas:', err);
        setError('No se pudieron cargar las métricas del intento.');
      } finally {
        setLoading(false);
      }
    };

    void loadMetrics();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="ml-2 text-gray-600">Cargando métricas...</span>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">{error || 'Métricas no encontradas'}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-brand-primary mb-6 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Volver al historial
      </button>

      {/* Cabecera */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
              Detalle del Intento
            </h1>
            <p className="text-gray-500">
              Fecha: {format(new Date(metrics.sessionDate), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
            </p>
          </div>
          
          {/* Badge de Resultado */}
          <div className={`px-6 py-3 rounded-full text-lg font-bold border-2 ${
            metrics.finalOutcome === 'WIN' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-red-50 text-red-700 border-red-300'
          }`}>
            {metrics.finalOutcome === 'WIN' ? '🎉 GANASTE' : '😔 PERDISTE'}
          </div>
        </div>
      </div>

      {/* Dashboard de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Descubrimiento de Perfil */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Target size={28} />
            </div>
            <span className={`text-3xl font-black ${
              metrics.profileDiscoveryPercentage >= 0.7 ? 'text-emerald-600' : 
              metrics.profileDiscoveryPercentage >= 0.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {(metrics.profileDiscoveryPercentage * 100).toFixed(0)}%
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Descubrimiento de Perfil</h3>
          <p className="text-xs text-gray-400">Porcentaje del perfil del consumidor descubierto</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                metrics.profileDiscoveryPercentage >= 0.7 ? 'bg-emerald-500' : 
                metrics.profileDiscoveryPercentage >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.profileDiscoveryPercentage * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Aceptación Final */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <TrendingUp size={28} />
            </div>
            <span className={`text-3xl font-black ${
              metrics.finalAcceptance >= 0.7 ? 'text-emerald-600' : 
              metrics.finalAcceptance >= 0.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {(metrics.finalAcceptance * 100).toFixed(0)}%
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Aceptación Final</h3>
          <p className="text-xs text-gray-400">Nivel de aceptación del producto por el consumidor</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                metrics.finalAcceptance >= 0.7 ? 'bg-emerald-500' : 
                metrics.finalAcceptance >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.finalAcceptance * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Presupuesto Restante */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <DollarSign size={28} />
            </div>
            <span className="text-3xl font-black text-purple-600">
              ${metrics.remainingBudget.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Presupuesto Restante</h3>
          <p className="text-xs text-gray-400">Dinero que quedó al finalizar la simulación</p>
        </div>

        {/* Turnos Utilizados */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Clock size={28} />
            </div>
            <span className="text-3xl font-black text-orange-600">
              {metrics.totalTurnsUsed}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Turnos Utilizados</h3>
          <p className="text-xs text-gray-400">Total de acciones realizadas durante la simulación</p>
        </div>

        {/* Resultado Global */}
        <div className={`p-6 rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow md:col-span-2 ${
          metrics.finalOutcome === 'WIN' 
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${
              metrics.finalOutcome === 'WIN' ? 'bg-emerald-200' : 'bg-red-200'
            }`}>
              <Trophy size={32} className={
                metrics.finalOutcome === 'WIN' ? 'text-emerald-700' : 'text-red-700'
              } />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Resultado de la Simulación</h3>
              <p className={`text-2xl font-black ${
                metrics.finalOutcome === 'WIN' ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {metrics.finalOutcome === 'WIN' 
                  ? '¡Felicitaciones! Completaste exitosamente la simulación' 
                  : 'No alcanzaste el objetivo mínimo requerido'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Tarjeta de Resumen */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Resumen del Desempeño</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">ID del Intento:</span>
            <span className="font-mono text-gray-800">{metrics.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Fecha de Ejecución:</span>
            <span className="font-semibold text-gray-800">
              {format(new Date(metrics.sessionDate), 'dd/MM/yyyy HH:mm', { locale: es })}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Perfil Descubierto:</span>
            <span className="font-semibold text-gray-800">
              {(metrics.profileDiscoveryPercentage * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Aceptación Lograda:</span>
            <span className="font-semibold text-gray-800">
              {(metrics.finalAcceptance * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
