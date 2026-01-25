# MarkenX - Portal del Estudiante 🎮

Este repositorio contiene el **Frontend Gamificado** para los estudiantes de **MarkenX**. A diferencia del portal administrativo, este proyecto utiliza **React + Tailwind CSS** para ofrecer una experiencia visual inmersiva, moderna y ágil, similar a una plataforma de videojuegos.

## 🚀 Tecnologías

- **Core:** React (v18) + TypeScript
- **Build Tool:** Vite (Ultra rápido)
- **Estilos:** Tailwind CSS (Diseño Utility-first)
- **Navegación:** React Router DOM v6
- **Iconos:** Lucide React
- **Arquitectura:** Service Layer Pattern (Mock vs Real API)

## ✨ Características Implementadas

1.  **Experiencia Gamificada:**
    - Login con diseño inmersivo.
    - Interfaz basada en Tarjetas (Cards) y Badges visuales.
    - Feedback visual de estados (Vencida, Completada, Habilitada).

2.  **Gestión de Misiones (Tareas):**
    - Filtrado dinámico por estado y fecha.
    - Diferenciación visual entre **Asignaciones** (prácticas) y **Evaluaciones** (intento único).
    - Detalle de misión con métricas claras antes de iniciar.

3.  **Lanzador de Juego:**
    - Integración preparada para incrustar el videojuego (Unity WebGL).
    - Modo "Pantalla Completa" dentro del layout persistente.

4.  **Monitor de Progreso:**
    - Dashboard personal con KPIs (Victorias, Promedio, Partidas).
    - Historial detallado de intentos y resultados.

## 🛠️ Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/markenx-portal-estudiante.git](https://github.com/TU_USUARIO/markenx-portal-estudiante.git)
    cd markenx-portal-estudiante
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```
    El portal estará disponible en `http://localhost:5173`.

## ⚙️ Configuración de Entorno (Mock vs Real)

El proyecto cuenta con una capa de servicios inteligente que permite trabajar sin backend o conectarse a la API real cambiando una sola línea.

- Revisa el archivo `.env` en la raíz:
  - `VITE_USE_MOCK=true`: Usa datos falsos (Ideal para diseño/frontend).
  - `VITE_USE_MOCK=false`: Conecta con Spring Boot y Keycloak.

> 📘 **Para Backend:**
> Consultar la carpeta `/docs` para ver la guía de integración detallada y los contratos de datos esperados.
