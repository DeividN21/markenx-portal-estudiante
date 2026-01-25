import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { TasksPage } from './pages/TasksPage';
import { ProgressPage } from './pages/ProgressPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { GamePage } from './pages/GamePage';
import { LoggedOutPage } from './pages/LoggedOutPage';
import { MetricsPage } from './pages/MetricsPage';
import {useSession} from "./sessions/useSession.ts";
import {SessionProvider} from "./sessions/SessionProvider.tsx";

/**
 * RequireSession
 * ------------------------------------------------------
 * - Protege rutas privadas basándose en la sesión del BFF.
 * - Si no hay sesión, sessionService/apiClient redirigirá al login.
 */
const RequireSession = () => {
  const { loading, isAuthenticated } = useSession();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
    );
  }

  // Si no está autenticado, no navegamos a /login (ya no existe).
  // La redirección al login real la hace apiClient cuando llama /auth/me.
  return isAuthenticated ? <Outlet /> : <div className="p-10 text-center">Redirigiendo a login...</div>;
};

function App() {
  return (
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            {/* Logout landing */}
            <Route path="/logged-out" element={<LoggedOutPage />} />

            {/* Rutas privadas */}
            <Route element={<RequireSession />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
                <Route path="/game/:taskId" element={<GamePage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/metrics/:attemptId" element={<MetricsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
  );
}

export default App;
