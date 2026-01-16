import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  /**
   * Logout:
   * - Llama al backend para invalidar sesión.
   * - Luego navega a una ruta pública para evitar auto-login inmediato.
   *
   * Nota:
   * - Usamos window.location para asegurar que el Router no dispare rutas privadas.
   */
  const handleLogout = async () => {
    await logout();
    window.location.href = '/logged-out';
  };

  return (
      <header className="bg-brand-primary text-white h-16 flex items-center justify-between px-6 shadow-md fixed w-full top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="font-bold text-2xl tracking-tighter">
            Marken<span className="text-gray-200 font-light">X</span>
          </div>
          <div className="h-6 w-px bg-white/30 mx-2 hidden md:block"></div>
          <div className="hidden md:block font-medium text-sm text-gray-100 uppercase tracking-wide">
            {user?.course || 'Curso No Asignado'}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-300">Bienvenido/a</p>
            <p className="font-semibold text-sm leading-tight">{user?.name || 'Estudiante'}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-secondary rounded-full flex items-center justify-center border border-white/20">
              <UserIcon size={20} />
            </div>
            <button
                onClick={handleLogout}
                className="p-2 hover:bg-brand-secondary rounded-full transition-colors text-white/80 hover:text-white"
                title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
  );
};
