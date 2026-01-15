import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Logueo
      const success = await login(email, password);
      
      if (success) {
        navigate('/tasks');
      } else {
        setError('Credenciales inválidas. Usa un correo @udla.edu.ec y contraseña > 5 chars.');
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-secondary p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            MarkenX Student
          </h1>
          <p className="text-gray-500 text-sm">
            Sistema de Gestión de Tareas
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 animate-pulse">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="estudiante@udla.edu.ec"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 ml-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-secondary transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Validando...' : 'Iniciar Sesión'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">© 2026 MarkenX Simulation System</p>
        </div>
      </div>
    </div>
  );
};