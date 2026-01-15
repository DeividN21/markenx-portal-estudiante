import { Search, Calendar, Filter } from 'lucide-react';

interface TaskFiltersProps {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  onSearch: () => void; // Función que dispara el filtrado final (opcional si es en tiempo real)
}

export const TaskFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  dateFilter, 
  setDateFilter,
  onSearch 
}: TaskFiltersProps) => {
  
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center">
      
      {/* Filtro de Estado */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1 flex items-center gap-1">
          <Filter size={12} /> Estado
        </label>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 transition-colors"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Habilitadas</option>
          <option value="COMPLETED">Completadas</option>
          <option value="EXPIRED">Vencidas</option>
        </select>
      </div>

      {/* Filtro de Fecha */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1 flex items-center gap-1">
          <Calendar size={12} /> Fecha Límite
        </label>
        <div className="relative">
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5" 
          />
        </div>
      </div>

      {/* Botón Buscar */}
      <button 
        onClick={onSearch}
        className="w-full md:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
      >
        <Search size={18} />
        Buscar
      </button>

    </div>
  );
};