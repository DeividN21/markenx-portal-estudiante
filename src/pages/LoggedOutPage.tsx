import { Link } from 'react-router-dom';

export const LoggedOutPage = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-lg w-full">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Sesión cerrada</h1>
                <p className="text-gray-600 mb-6">
                    Has salido correctamente de MarkenX. Para volver a ingresar, usa el botón de inicio.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold px-5 py-2.5 rounded-lg"
                >
                    Ir al inicio
                </Link>
            </div>
        </div>
    );
};
