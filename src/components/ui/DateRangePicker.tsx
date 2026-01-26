import { useState, useRef, useEffect } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import * as React from "react";

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
}

export const DateRangePicker = ({ dateFrom, dateTo, onDateChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DateRange | undefined>(() => {
    if (dateFrom && dateTo) {
      return {
        from: new Date(dateFrom),
        to: new Date(dateTo)
      };
    }
    if (dateFrom) {
      return {
        from: new Date(dateFrom),
        to: undefined
      };
    }
    return undefined;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    
    if (range?.from) {
      const fromStr = format(range.from, 'yyyy-MM-dd');
      const toStr = range.to ? format(range.to, 'yyyy-MM-dd') : fromStr;
      onDateChange(fromStr, toStr);
    } else {
      onDateChange('', '');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(undefined);
    onDateChange('', '');
  };

  const getDisplayText = () => {
    if (!dateFrom && !dateTo) {
      return 'Seleccionar rango de fechas';
    }
    
    if (dateFrom && dateTo && dateFrom !== dateTo) {
      return `${format(new Date(dateFrom), 'dd/MM/yyyy', { locale: es })} - ${format(new Date(dateTo), 'dd/MM/yyyy', { locale: es })}`;
    }
    
    if (dateFrom) {
      return format(new Date(dateFrom), 'dd/MM/yyyy', { locale: es });
    }
    
    return 'Seleccionar rango de fechas';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className={dateFrom || dateTo ? 'text-gray-900' : 'text-gray-500'}>
            {getDisplayText()}
          </span>
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={handleClear}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            locale={es}
            className="rdp-custom"
          />
        </div>
      )}
    </div>
  );
};
