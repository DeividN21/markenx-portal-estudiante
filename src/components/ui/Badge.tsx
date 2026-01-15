import clsx from 'clsx';

interface BadgeProps {
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  className?: string;
}

export const Badge = ({ status, className }: BadgeProps) => {
  const styles = {
    PENDING: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',    
    EXPIRED: 'bg-red-100 text-red-700 border-red-200',          
  };

  const labels = {
    PENDING: 'HABILITADA',
    COMPLETED: 'COMPLETADA',
    EXPIRED: 'VENCIDA',
  };

  return (
    <span className={clsx(
      "px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase",
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  );
};