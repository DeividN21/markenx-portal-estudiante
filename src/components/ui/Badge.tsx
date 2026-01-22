import clsx from 'clsx';

interface BadgeProps {
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  className?: string;
}

export const Badge = ({ status, className }: BadgeProps) => {
  const styles = {
    COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PENDING: 'bg-blue-100 text-blue-700 border-blue-200',    
    EXPIRED: 'bg-red-100 text-red-700 border-red-200',
    FAILED: 'bg-red-100 text-red-700 border-red-200',
  };

  const labels = {
    PENDING: 'HABILITADA',
    COMPLETED: 'COMPLETADA',
    EXPIRED: 'VENCIDA',
    FAILED: 'FALLIDA',
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