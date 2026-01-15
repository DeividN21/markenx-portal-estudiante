import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailPage } from './pages/TaskDetailPage'; 
import { GamePage } from './pages/GamePage';            

// Placeholders simples para las otras secciones
const Evaluations = () => <h1 className="text-3xl font-bold text-slate-800">Evaluaciones</h1>;
const Progress = () => <h1 className="text-3xl font-bold text-slate-800">Mi Progreso</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/game/:taskId" element={<GamePage />} />
          
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;