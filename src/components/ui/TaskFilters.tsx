import { Search, Calendar, Filter, X } from 'lucide-react';

interface TaskFiltersProps {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  dateFromFilter: string;
  setDateFromFilter: (val: string) => void;
  dateToFilter: string;
  setDateToFilter: (val: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

export const TaskFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  dateFromFilter, 
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
  onSearch,
  onClearFilters
}: TaskFiltersProps) => {
  
  const hasActiveFilters = statusFilter || dateFromFilter || dateToFilter;
  
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
          <option value="NOT_STARTED">Sin empezar</option>
          <option value="IN_PROGRESS">En curso</option>
          <option value="COMPLETED">Completadas</option>
          <option value="FAILED">Fallidas</option>
          <option value="OUTDATED">Vencidas</option>
        </select>
      </div>

      {/* Filtro de Fecha - Rango */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1 flex items-center gap-1">
          <Calendar size={12} /> Rango de Fecha Límite
        </label>
        <div className="flex gap-2 items-center">
          <input 
            type="date"
            value={dateFromFilter}
            onChange={(e) => setDateFromFilter(e.target.value)}
            placeholder="Desde"
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5" 
          />
          <span className="text-gray-400 text-sm font-medium">-</span>
          <input 
            type="date"
            value={dateToFilter}
            onChange={(e) => setDateToFilter(e.target.value)}
            placeholder="Hasta"
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

      {/* Botón Limpiar Filtros */}
      {hasActiveFilters && (
        <button 
          onClick={onClearFilters}
          className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <X size={18} />
          Limpiar
        </button>
      )}

    </div>
  );
};