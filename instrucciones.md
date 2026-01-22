# Contexto / objetivo:
# - Debes integrar endpoints reales de la API para que la app funcione SIN mocks.
# - Actualmente el proyecto React funciona con MOCKS.
# - La app obtiene el correo del estudiante; con ese correo debe poder obtener el studentId.
# - Con el studentId se obtiene todo lo demás (tareas, intentos, detalle, etc.).
#
# Reglas de trabajo:
# 1) Primero LEE el archivo "endpoints.md" completo.
# 2) Luego REVISA la estructura completa del proyecto React (carpetas, servicios, auth, providers, pages, routes).
# 3) Identifica exactamente dónde se usan mocks (flags, servicios, data local, fixtures, interceptors, etc.).
# 4) Propón un PLAN de migración por etapas (mínimo riesgo): mantener compatibilidad temporal si es necesario,
#    pero el objetivo final es eliminar mocks o dejarlos solo para desarrollo controlado.
# 5) Sigue buenas prácticas:
#    - Separación por capas (api client, services/repositories, mapping DTO->Domain, UI)
#    - Manejo consistente de errores (HTTP vs dominio), logs controlados, y estados de carga.
#    - No duplicar lógica: single source of truth para usuario/studentId.
#    - Configuración por ambiente (dev/qa/prod) vía variables de entorno.
#    - Evitar “magic strings” y crear tipos/interfaces para DTOs.
# 6) Entrega resultados accionables: cambios de archivos concretos, nuevos archivos, y pasos de prueba.
# 7) Si falta información crítica, haz preguntas puntuales (no genéricas) ANTES de implementar.
#
# ------------------------------------------------------------
# Entregables esperados:
#
# A) Diagnóstico
# - Lista de módulos/páginas que hoy dependen de mocks.
# - Qué capa decide “mock vs real” (flag USE_MOCK, env var, etc.).
# - Cómo se obtiene el usuario (correo) hoy y dónde se guarda (context/localStorage/etc.).
#
# B) Plan de integración (por fases)
# Incluye un plan sugerido como:
# Fase 0: Preparación
# - Asegurar .env por ambiente y documentación de variables necesarias.
# - Definir API baseURL, timeout, headers, y estrategia de credenciales (token/bff cookie, etc.).
#
# Fase 1: Identidad del estudiante (email -> studentId)
# - Implementar studentIdentityService:
#   - input: email
#   - output: studentId + datos base del estudiante
# - Definir dónde se cachea/almacena studentId (React Query cache / context / state).
#
# Fase 2: Sustituir mocks por endpoints reales (lectura)
# - Reemplazar getTasks, getTaskById, getAttempts, etc. para que llamen API real.
# - Mantener mapeos DTO->UI y tipos fuertes.
#
# Fase 3: Acciones / mutaciones
# - Crear intentos, finalizar evaluación, enviar respuestas, etc. (según endpoints.md).
# - Manejo de reintentos, idempotencia si aplica, estados de UI y errores.
#
# Fase 4: Remoción de mocks
# - Eliminar datasets mock, flags y código muerto.
# - Dejar mocks opcionales SOLO si el equipo lo quiere para desarrollo aislado (y documentarlo).
#
# C) Diseño técnico propuesto
# - Estructura de carpetas recomendada para la integración (ejemplo):
#   src/
#     api/               # apiClient (axios/fetch), interceptors, config
#     services/          # studentService, taskService, attemptService
#     auth/              # (si aplica) provider, guards, hooks
#     types/             # DTOs, domain models, enums
#     mappers/           # DTO -> domain/UI
#     pages/             # UI
# - Explicar brevemente por qué (mantenibilidad, testabilidad, separación de concerns).
#
# D) Implementación detallada (cambios concretos)
# - Para cada endpoint que se integre:
#   - Nombre del método en el service
#   - request/response shape (según endpoints.md)
#   - mapping a tipos internos
#   - manejo de errores
# - Listado de archivos a modificar/crear con ruta exacta.
#
# E) Preguntas necesarias (solo si bloquean o cambian la solución)
# Antes de cerrar, valida si necesitas aclarar:
# 1) Auth:
#    - ¿La API requiere Bearer token en frontend o usa BFF con cookie de sesión?
#    - ¿Cómo obtengo el email del estudiante: viene del token, del endpoint /me, o de otro?
# 2) Endpoints:
#    - ¿Existe endpoint específico para resolver studentId por email? (ej: GET /students?email=)
#    - ¿Los endpoints requieren headers especiales (tenant, correlation-id, etc.)?
# 3) CORS/Infra:
#    - ¿Cuál es el baseURL por ambiente? ¿hay gateway?
# 4) Paginación / filtros:
#    - ¿Tasks/Attempts vienen paginados? ¿Cómo se filtra por status/type?
# 5) Contrato de errores:
#    - ¿El backend devuelve una estructura estándar para errores (code, message, details)?
#
# ------------------------------------------------------------
# Procedimiento exacto que debes seguir (paso a paso):
#
# 1) Abrir y leer endpoints.md completo.
# 2) Recorrer el repositorio React y documentar:
#    - entrypoint (main.tsx/index.tsx)
#    - router
#    - providers (auth, query, theme)
#    - services actuales y flags de mocks
#    - modelos/types
#    - páginas que consumen datos
# 3) Construir un mapa: “pantalla -> servicio -> función -> mock/real -> endpoint”.
# 4) Diseñar la estrategia de identidad (email -> studentId) y decidir dónde se mantiene.
# 5) Implementar primero la resolución de studentId y un endpoint simple (ej lista de tasks),
#    validar que UI renderice con datos reales.
# 6) Migrar el resto de endpoints iterativamente.
# 7) Eliminar mocks/flags al final (o dejarlos como fallback documentado si se decide).
# 8) Proveer guía de pruebas:
#    - pruebas manuales por pantalla
#    - validación de estados (loading/error/empty)
#    - validación de mapeos (status/type/attempts)
#
# Nota:
# - No inventes endpoints: usa únicamente lo que diga endpoints.md.
# - Si hay conflicto entre tipos actuales y DTOs reales, define DTOs y mappers claros.
# - Si hace falta contexto para una decisión correcta, pregunta con precisión.
