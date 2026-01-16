import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';

// Páginas privadas
import { TasksPage } from './pages/TasksPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { ProgressPage } from './pages/ProgressPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { GamePage } from './pages/GamePage';

// Páginas públicas
import { LoggedOutPage } from './pages/LoggedOutPage';

// Servicio auth (redirigir a Keycloak via BFF)
import { authService } from './services/authService';

/**
 * PrivateRoute (BFF Session)
 * -----------------------------------------
 * - No redirige a /login del frontend.
 * - Si no hay sesión, redirige al backend (/auth/login) para iniciar oauth2Login.
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
    );
  }

  if (!isAuthenticated) {
    authService.loginRedirect();
    return null;
  }

  return <Outlet />;
};

/**
 * Mantener /login como compatibilidad:
 * - No es una página real.
 * - Solo redirige al login del BFF.
 */
const LoginRedirect = () => {
  authService.loginRedirect();
  return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium">Redirigiendo a inicio de sesión...</div>
      </div>
  );
};

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/logged-out" element={<LoggedOutPage />} />

            {/* Rutas privadas */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
                <Route path="/game/:taskId" element={<GamePage />} />
                <Route path="/evaluations" element={<EvaluationsPage />} />
                <Route path="/progress" element={<ProgressPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
