import { Search, Filter, X } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';

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
    <div className="mb-6">
      {/* Contenedor de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4 flex flex-col md:flex-row gap-4">
        
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
            Fecha Límite
          </label>
          <DateRangePicker
            dateFrom={dateFromFilter}
            dateTo={dateToFilter}
            onDateChange={(from, to) => {
              setDateFromFilter(from);
              setDateToFilter(to);
            }}
          />
        </div>
      </div>

      {/* Contenedor de Botones */}
      <div className="flex gap-3 justify-end">
        {/* Botón Limpiar Filtros */}
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <X size={18} />
            Limpiar
          </button>
        )}

        {/* Botón Buscar */}
        <button 
          onClick={onSearch}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <Search size={18} />
          Buscar
        </button>
      </div>

    </div>
  );
};