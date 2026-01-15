import { Search, Calendar } from 'lucide-react';

export const TaskFilters = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center">
      
      {/* Filtro de Estado */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Estado</label>
        <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5">
          <option value="">Todos los estados</option>
          <option value="PENDING">Habilitadas</option>
          <option value="COMPLETED">Completadas</option>
          <option value="EXPIRED">Vencidas</option>
        </select>
      </div>

      {/* Filtro de Fecha */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Fecha Límite</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar size={16} className="text-gray-400" />
          </div>
          <input 
            type="date" 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full pl-10 p-2.5" 
          />
        </div>
      </div>

      {/* Botón Buscar */}
      <button className="w-full md:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
        <Search size={18} />
        Buscar
      </button>

    </div>
  );
};