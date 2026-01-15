import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { TasksPage } from './pages/TasksPage';

// Páginas temporales (Placeholders) para probar la navegación
const Dashboard = () => <h1 className="text-3xl font-bold text-slate-800">Bienvenido al Portal</h1>;
const Tasks = () => <h1 className="text-3xl font-bold text-slate-800">Mis Tareas</h1>;
const Evaluations = () => <h1 className="text-3xl font-bold text-slate-800">Evaluaciones</h1>;
const Progress = () => <h1 className="text-3xl font-bold text-slate-800">Mi Progreso</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Login irá aquí luego) */}
        
        {/* Rutas Privadas (Dentro del Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/progress" element={<Progress />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;