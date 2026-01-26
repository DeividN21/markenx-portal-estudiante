import { NavLink, useLocation } from 'react-router-dom';
import { FileText, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    // { name: 'Inicio', path: '/', icon: LayoutDashboard },
    { name: 'Tareas', path: '/tasks', icon: FileText },
    // { name: 'Evaluaciones', path: '/evaluations', icon: GraduationCap },
    { name: 'Progreso', path: '/progress', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/tasks') {
      // Tareas está activa si estamos en /tasks o en /metrics viniendo desde TaskDetailPage
      return location.pathname.startsWith('/tasks') || 
             (location.pathname.startsWith('/metrics') && location.state?.fromTaskDetail);
    }
    if (path === '/progress') {
      // Progreso está activa si estamos en /progress o en /metrics viniendo desde ProgressPage
      return location.pathname === '/progress' || 
             (location.pathname.startsWith('/metrics') && !location.state?.fromTaskDetail);
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-16 border-r border-gray-200 hidden md:flex flex-col pt-8">
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={() =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                isActive(item.path)
                  ? "bg-brand-light text-brand-primary border-l-4 border-brand-primary shadow-sm"
                  : "text-slate-600 hover:bg-gray-50 hover:text-slate-900"
              )
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-center text-gray-400">
          © 2026 MarkenX System<br />v1.0.0 Student
        </p>
      </div>
    </aside>
  );
};