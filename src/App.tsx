import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';

// Páginas
import { LoginPage } from './pages/LoginPage';
import { TasksPage } from './pages/TasksPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { ProgressPage } from './pages/ProgressPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { GamePage } from './pages/GamePage';

// Componente para proteger rutas privadas
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Privadas (Protegidas) */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              
              {/* Redirección raíz a tareas */}
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              
              {/* TAREAS */}
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
              
              {/* JUEGO */}
              <Route path="/game/:taskId" element={<GamePage />} />
              
              {/* EVALUACIONES */}
              <Route path="/evaluations" element={<EvaluationsPage />} />
              
              {/* PROGRESO */}
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