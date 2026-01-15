import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Header Fijo */}
      <Header />

      {/* 2. Sidebar Fijo a la Izquierda */}
      <Sidebar />

      {/* 3. Área de Contenido Principal */}
      <main className="md:ml-64 pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Aquí se renderizarán las páginas (Dashboard, Tareas, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};