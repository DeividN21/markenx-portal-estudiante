function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-brand-primary mb-4">
          MarkenX Student
        </h1>
        <p className="text-gray-600 mb-6">
          Portal de Simulación Gamificada
        </p>
        <button className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Iniciar Aventura
        </button>
      </div>
    </div>
  )
}

export default App