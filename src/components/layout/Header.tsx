import { LogOut, User as UserIcon } from 'lucide-react';
import {useSession} from "../../sessions/useSession.ts";

export const Header = () => {
  const { student, logout } = useSession();

  const handleLogout = () => {
    // Logout real: navegación POST a /auth/logout para permitir 302 a Keycloak logout y retorno al frontend.
    logout();
  };

  return (
      <header className="bg-brand-primary text-white h-[75px] flex items-center justify-between px-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] fixed w-full top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="font-bold text-2xl tracking-tighter">
            Marken<span className="text-gray-200 font-light">X</span>
          </div>
          <div className="h-6 w-px bg-white/30 mx-2 hidden md:block"></div>
          <div className="hidden md:block font-medium text-sm text-gray-100 uppercase tracking-wide">
            {student?.courseName || 'Curso No Asignado'}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-300">Bienvenido/a</p>
            <p className="font-semibold text-sm leading-tight">{student?.name || 'Estudiante'}</p>
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
