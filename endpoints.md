# MarkenX API - Documentación de Endpoints

Esta documentación describe todos los endpoints expuestos por la API de MarkenX, organizados por módulo.

---

## Tabla de Contenidos

1. [Módulo Academic Terms](#módulo-academic-terms)
2. [Módulo Courses](#módulo-courses)
3. [Módulo Students](#módulo-students)
4. [Módulo Assignments (Tasks)](#módulo-assignments-tasks)
5. [Módulo Scenarios](#módulo-scenarios)
6. [Módulo Attempts](#módulo-attempts)
7. [Códigos de Estado HTTP](#códigos-de-estado-http)
8. [Formato de Respuesta de Error](#formato-de-respuesta-de-error)
9. [Excepciones de Dominio](#excepciones-de-dominio)
10. [Patrones de Integración](#patrones-de-integración)

---

## Módulo Academic Terms

Base path: `/api/academic-terms`

### Crear Periodo Académico

```
POST /api/academic-terms
```

**Descripción:** Crea un nuevo periodo académico con estado inicial UPCOMING.

**Request Body:**

```json
{
  "name": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

**Response:** `201 Created`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "status": "UPCOMING"
}
```

**Errores posibles:**

- `400 Bad Request` - Datos de entrada inválidos

---

### Obtener Periodo Académico por ID

```
GET /api/academic-terms/{id}
```

**Descripción:** Obtiene los detalles de un periodo académico específico.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------------------|
| id | string | UUID del periodo académico |

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "status": "UPCOMING | ACTIVE | ARCHIVED"
}
```

**Errores posibles:**

- `404 Not Found` - `AcademicTermNotFoundException`: El periodo académico con ID especificado no existe

---

### Cambiar Estado del Periodo Académico

```
PATCH /api/academic-terms/{id}/status
```

**Descripción:** Cambia el estado de un periodo académico. Las transiciones válidas son:

- UPCOMING → ACTIVE
- ACTIVE → ARCHIVED

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------------------|
| id | string | UUID del periodo académico |

**Request Body:**

```json
{
  "status": "UPCOMING | ACTIVE | ARCHIVED"
}
```

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "status": "UPCOMING | ACTIVE | ARCHIVED"
}
```

**Errores posibles:**

- `404 Not Found` - `AcademicTermNotFoundException`: El periodo académico no existe
- `400 Bad Request` - `InvalidStatusTransitionException`: Transición de estado no permitida

---

### Actualizar Periodo Académico

```
PUT /api/academic-terms/{id}
```

**Descripción:** Actualiza los datos de un periodo académico existente. Solo se pueden modificar periodos con estado
UPCOMING.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------------------|
| id | string | UUID del periodo académico |

**Request Body:**

```json
{
  "name": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "status": "UPCOMING"
}
```

**Errores posibles:**

- `404 Not Found` - `AcademicTermNotFoundException`: El periodo académico no existe
- `400 Bad Request` - `AcademicTermNotUpcomingException`: Solo se pueden modificar periodos con estado UPCOMING

---

### Listar Todos los Periodos Académicos

```
GET /api/academic-terms
```

**Descripción:** Obtiene la lista de todos los periodos académicos registrados.

**Response:** `200 OK`

```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "status": "UPCOMING | ACTIVE | ARCHIVED"
  }
]
```

---

## Módulo Courses

Base path: `/api/courses`

### Crear Curso

```
POST /api/courses
```

**Descripción:** Crea un nuevo curso asociado a un periodo académico. El periodo académico debe estar en estado
UPCOMING.

**Request Body:**

```json
{
  "name": "string",
  "academicTermId": "string (UUID)"
}
```

**Response:** `201 Created`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "lifecycleStatus": "ACTIVE",
  "academicTermId": "string (UUID)"
}
```

**Errores posibles:**

- `404 Not Found` - `AcademicTermNotFoundException`: El periodo académico no existe
- `400 Bad Request` - `AcademicTermNotUpcomingException`: El periodo académico debe estar en estado UPCOMING para crear
  cursos

---

### Obtener Curso por ID

```
GET /api/courses/{id}
```

**Descripción:** Obtiene los detalles de un curso específico.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------|
| id | string | UUID del curso |

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "lifecycleStatus": "ACTIVE | ARCHIVED",
  "academicTermId": "string (UUID)"
}
```

**Errores posibles:**

- `404 Not Found` - `CourseNotFoundException`: El curso con ID especificado no existe

---

### Cambiar Estado del Curso

```
PATCH /api/courses/{id}/status
```

**Descripción:** Cambia el estado del ciclo de vida de un curso.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------|
| id | string | UUID del curso |

**Request Body:**

```json
{
  "status": "ACTIVE | ARCHIVED"
}
```

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "lifecycleStatus": "ACTIVE | ARCHIVED",
  "academicTermId": "string (UUID)"
}
```

**Errores posibles:**

- `404 Not Found` - `CourseNotFoundException`: El curso no existe
- `400 Bad Request` - `InvalidCourseStatusTransitionException`: Transición de estado no permitida

---

### Cambiar Periodo Académico del Curso

```
PUT /api/courses/{id}/change-academic-term
```

**Descripción:** Cambia el periodo académico asociado a un curso. El nuevo periodo debe estar en estado UPCOMING.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------|
| id | string | UUID del curso |

**Request Body:**

```json
{
  "academicTermId": "string (UUID)"
}
```

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "lifecycleStatus": "ACTIVE | ARCHIVED",
  "academicTermId": "string (UUID)"
}
```

**Errores posibles:**

- `404 Not Found` - `CourseNotFoundException`: El curso no existe
- `404 Not Found` - `AcademicTermNotFoundException`: El periodo académico no existe
- `400 Bad Request` - `AcademicTermNotUpcomingException`: El nuevo periodo académico debe estar en estado UPCOMING

---

### Actualizar Curso

```
PUT /api/courses/{id}
```

**Descripción:** Actualiza los datos de un curso existente.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------|
| id | string | UUID del curso |

**Request Body:**

```json
{
  "name": "string"
}
```

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "lifecycleStatus": "ACTIVE | ARCHIVED",
  "academicTermId": "string (UUID)"
}
```

**Errores posibles:**

- `404 Not Found` - `CourseNotFoundException`: El curso no existe

---

### Listar Todos los Cursos

```
GET /api/courses
```

**Descripción:** Obtiene la lista de todos los cursos registrados.

**Response:** `200 OK`

```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "lifecycleStatus": "ACTIVE | ARCHIVED",
    "academicTermId": "string (UUID)"
  }
]
```

---

### Obtener Tareas de un Curso

```
GET /api/courses/{courseId}/tasks
```

**Descripción:** Obtiene todas las tareas (assignments) asociadas a un curso específico.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------|
| courseId | string | UUID del curso |

**Response:** `200 OK`

```json
[
  {
    "taskId": "string (UUID)",
    "title": "string",
    "summary": "string",
    "deadline": "YYYY-MM-DDTHH:mm:ss",
    "status": "NOT_STARTED | IN_PROGRESS | FINISHED"
  }
]
```

**Errores posibles:**

- `404 Not Found` - `COURSE_NOT_FOUND`: El curso no existe

---

## Módulo Students

Base path: `/api/students`

### Registrar Estudiante

```
POST /api/students
```

**Descripción:** Registra un nuevo estudiante en un curso. El curso debe pertenecer a un periodo académico con estado
UPCOMING. Adicionalmente, se crea una identidad en Keycloak para el estudiante mediante el patrón Saga.

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string (email)",
  "courseId": "string (UUID)"
}
```

**Response:** `201 Created`

```json
{
  "id": "string (UUID)",
  "firstName": "string",
  "lastName": "string",
  "courseId": "string (UUID)",
  "status": "PENDING_IDENTITY",
  "userId": null
}
```

**Nota:** El campo `userId` se actualiza automáticamente cuando se completa la creación de identidad en Keycloak (
proceso asíncrono via Saga).

**Estados del estudiante:**

- `PENDING_IDENTITY` - Esperando creación de identidad en Keycloak
- `ACTIVE` - Estudiante activo con identidad creada
- `DISABLED` - Estudiante deshabilitado

**Errores posibles:**

- `404 Not Found` - `CourseNotFoundException`: El curso no existe
- `400 Bad Request` - `CourseNotInUpcomingTermException`: El curso no pertenece a un periodo académico con estado
  UPCOMING

---

### Obtener Estudiante Actual (Sesión OIDC)

```
GET /api/students/me
```

**Descripción:** Obtiene los datos del estudiante autenticado basándose en el email de la sesión OIDC. Este endpoint es
utilizado por el BFF para identificar al estudiante actual.

**Autenticación:** Requiere sesión OIDC válida (JSESSIONID)

**Response:** `200 OK`

```json
{
  "studentId": "string (UUID)",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "courseId": "string (UUID)",
  "status": "PENDING_IDENTITY | ACTIVE | DISABLED"
}
```

**Errores posibles:**

- `404 Not Found` - `STUDENT_NOT_FOUND`: No existe un estudiante registrado con el email de la sesión OIDC

---

### Obtener Curso del Estudiante

```
GET /api/students/{studentId}/course
```

**Descripción:** Obtiene la información del curso al que está inscrito un estudiante específico.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|-----------------------|
| studentId | string | UUID del estudiante |

**Response:** `200 OK`

```json
{
  "courseId": "string (UUID)",
  "courseName": "string",
  "term": "string",
  "teacherName": "string"
}
```

**Errores posibles:**

- `404 Not Found` - `STUDENT_NOT_FOUND`: El estudiante no existe
- `404 Not Found` - `COURSE_NOT_FOUND`: El curso asociado al estudiante no existe

---

### Listar Todos los Estudiantes

```
GET /api/students
```

**Descripción:** Obtiene la lista de todos los estudiantes registrados.

**Response:** `200 OK`

```json
[
  {
    "id": "string (UUID)",
    "firstName": "string",
    "lastName": "string",
    "courseId": "string (UUID)",
    "status": "PENDING_IDENTITY | ACTIVE | DISABLED",
    "userId": "string | null"
  }
]
```

---

### Actualizar Estudiante

```
PUT /api/students/{id}
```

**Descripción:** Actualiza los datos de un estudiante existente, incluyendo la posibilidad de cambiar de curso.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|-----------------------|
| id | string | UUID del estudiante |

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "courseId": "string (UUID)"
}
```

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "firstName": "string",
  "lastName": "string",
  "courseId": "string (UUID)",
  "status": "PENDING_IDENTITY | ACTIVE | DISABLED",
  "userId": "string | null"
}
```

**Errores posibles:**

- `404 Not Found` - `StudentNotFoundException`: El estudiante no existe
- `400 Bad Request` - `StudentNotActiveException`: Solo se pueden modificar estudiantes con estado ACTIVE

---

### Deshabilitar Estudiante

```
DELETE /api/students/{id}
```

**Descripción:** Deshabilita un estudiante y su identidad en Keycloak. Este es un proceso asíncrono que utiliza el
patrón Saga para coordinar la deshabilitación local y en el proveedor de identidad.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|-----------------------|
| id | string | UUID del estudiante |

**Response:** `202 Accepted`

**Nota:** La respuesta 202 indica que la solicitud fue aceptada y el proceso de deshabilitación se ejecutará de forma
asíncrona.

**Errores posibles:**

- `404 Not Found` - `StudentNotFoundException`: El estudiante no existe
- `400 Bad Request` - `StudentAlreadyDisabledException`: El estudiante ya está deshabilitado
- `400 Bad Request` - `StudentNotActiveException`: Solo se pueden deshabilitar estudiantes con estado ACTIVE

---

## Módulo Assignments (Tasks)

Base path: `/api/tasks`

### Crear Tarea

```
POST /api/tasks
```

**Descripción:** Crea una nueva tarea (assignment) para un curso. Si no es histórica, el curso debe pertenecer a un
periodo académico con estado UPCOMING.

**Request Body:**

```json
{
  "title": "string",
  "summary": "string",
  "deadline": "YYYY-MM-DDTHH:mm:ss",
  "minScoreToPass": "number (0-100)",
  "courseId": "string (UUID)",
  "maxAttempts": "number (integer, min 1)",
  "historical": "boolean (optional, default false)"
}
```

**Response:** `201 Created`

```json
{
  "id": "string (UUID)",
  "title": "string",
  "summary": "string",
  "deadline": "YYYY-MM-DDTHH:mm:ss",
  "minScoreToPass": "number",
  "maxAttempts": "number",
  "courseId": "string (UUID)",
  "status": "NOT_STARTED | IN_PROGRESS | FINISHED"
}
```

**Estados de la tarea:**

- `NOT_STARTED` - La tarea aún no ha comenzado (deadline en el futuro)
- `IN_PROGRESS` - La tarea está actualmente activa
- `FINISHED` - La tarea ha finalizado (deadline pasado)

**Nota:** El estado se actualiza automáticamente mediante el `TaskStatusScheduler`.

**Errores posibles:**

- `404 Not Found` - `CourseNotFoundException`: El curso no existe
- `400 Bad Request` - `CourseNotInUpcomingTermException`: El curso no pertenece a un periodo académico con estado
  UPCOMING (solo aplica si `historical` es false)

---

### Listar Todas las Tareas

```
GET /api/tasks
```

**Descripción:** Obtiene la lista de todas las tareas registradas con paginación.

**Parámetros de query:**
| Parámetro | Tipo | Default | Descripción |
|-----------|--------|---------|---------------------------|
| page | number | 0 | Número de página (0-indexed) |
| size | number | 10 | Cantidad de elementos por página |

**Response:** `200 OK`

```json
{
  "content": [
    {
      "id": "string (UUID)",
      "title": "string",
      "summary": "string",
      "deadline": "YYYY-MM-DDTHH:mm:ss",
      "minScoreToPass": "number",
      "maxAttempts": "number",
      "courseId": "string (UUID)",
      "status": "NOT_STARTED | IN_PROGRESS | FINISHED"
    }
  ],
  "totalElements": "number",
  "totalPages": "number",
  "size": "number",
  "number": "number"
}
```

---

### Obtener Intentos de una Tarea

```
GET /api/tasks/{taskId}/attempts
```

**Descripción:** Obtiene todos los intentos (attempts) registrados para una tarea específica.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|--------------------|
| taskId | string | UUID de la tarea |

**Response:** `200 OK`

```json
[
  {
    "attemptId": "string (UUID)",
    "taskId": "string (UUID)",
    "startedAt": "YYYY-MM-DDTHH:mm:ss",
    "finishedAt": "YYYY-MM-DDTHH:mm:ss",
    "status": "IN_PROGRESS | FINISHED",
    "outcome": "WIN | IN_PROGRESS",
    "score": "number (0.0-1.0)"
  }
]
```

**Errores posibles:**

- `404 Not Found` - No se encontraron intentos para la tarea (respuesta vacía)

---

## Módulo Scenarios

Base path: `/api/scenarios`

### Crear Escenario

```
POST /api/scenarios
```

**Descripción:** Crea un nuevo escenario de videojuego con toda su configuración (dimensiones, consumidor, acciones,
eventos).

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "dimensions": [
    {
      "name": "string",
      "defaultValue": "number"
    }
  ],
  "consumer": {
    "name": "string",
    "dimensions": [
      {
        "name": "string",
        "defaultValue": "number"
      }
    ]
  },
  "actions": [
    {
      "name": "string",
      "description": "string",
      "cooldownInSeconds": "number",
      "effects": [
        {
          "dimensionName": "string",
          "effectValue": "number",
          "target": "PLAYER | CONSUMER"
        }
      ]
    }
  ],
  "events": [
    {
      "name": "string",
      "description": "string",
      "probability": "number (0.0-1.0)",
      "effects": [
        {
          "dimensionName": "string",
          "effectValue": "number",
          "target": "PLAYER | CONSUMER"
        }
      ]
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "dimensions": [
    ...
  ],
  "consumer": {
    ...
  },
  "actions": [
    ...
  ],
  "events": [
    ...
  ]
}
```

---

### Obtener Escenario por ID

```
GET /api/scenarios/{id}
```

**Descripción:** Obtiene los detalles completos de un escenario específico.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|----------------------|
| id | string | UUID del escenario |

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "dimensions": [
    {
      "id": "string (UUID)",
      "name": "string",
      "defaultValue": "number"
    }
  ],
  "consumer": {
    "id": "string (UUID)",
    "name": "string",
    "dimensions": [
      {
        "id": "string (UUID)",
        "name": "string",
        "defaultValue": "number"
      }
    ]
  },
  "actions": [
    {
      "id": "string (UUID)",
      "name": "string",
      "description": "string",
      "cooldownInSeconds": "number",
      "effects": [
        {
          "id": "string (UUID)",
          "dimensionName": "string",
          "effectValue": "number",
          "target": "PLAYER | CONSUMER"
        }
      ]
    }
  ],
  "events": [
    {
      "id": "string (UUID)",
      "name": "string",
      "description": "string",
      "probability": "number",
      "effects": [
        {
          "id": "string (UUID)",
          "dimensionName": "string",
          "effectValue": "number",
          "target": "PLAYER | CONSUMER"
        }
      ]
    }
  ]
}
```

**Errores posibles:**

- `404 Not Found` - `ScenarioNotFoundException`: El escenario con ID especificado no existe

---

### Listar Todos los Escenarios

```
GET /api/scenarios
```

**Descripción:** Obtiene la lista de todos los escenarios registrados.

**Response:** `200 OK`

```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "description": "string",
    "dimensions": [
      ...
    ],
    "consumer": {
      ...
    },
    "actions": [
      ...
    ],
    "events": [
      ...
    ]
  }
]
```

---

## Módulo Attempts

Base path: `/api/v1/attempts`

### Registrar Resultado de Partida

```
POST /api/v1/attempts
```

**Descripción:** Registra los resultados de una sesión de juego (partida) para un estudiante en una tarea específica. El
campo `finalOutcome` se calcula automáticamente comparando `profileDiscoveryPercentage` con el `minScoreToPass` de la
tarea.

**Request Body:**

```json
{
  "taskId": "string (UUID)",
  "studentId": "string (UUID)",
  "sessionDate": "YYYY-MM-DDTHH:mm:ss",
  "finalAcceptance": 0.83,
  "remainingBudget": 120.00,
  "totalTurnsUsed": 5,
  "profileDiscoveryPercentage": 0.75,
  "history": [
    {
      "turnNumber": 1,
      "acceptanceAtEnd": 0.60,
      "budgetAtEnd": 180.00,
      "eventOccurredTitle": "",
      "actionsTakenIds": [
        "3f8a9bde-1c2f-4a6b-9d2f-0a1b2c3d4e5f",
        "7a4c2d1e-9b8f-4c3a-8d7e-2f1e0d9c8b7a"
      ]
    },
    {
      "turnNumber": 2,
      "acceptanceAtEnd": 0.68,
      "budgetAtEnd": 140.00,
      "eventOccurredTitle": "Protesta ciudadana",
      "actionsTakenIds": [
        "9d7e6f5a-3b2c-4d1e-8f9a-0b1c2d3e4f5a"
      ]
    }
  ]
}
```

**Campos del Request:**

| Campo                      | Tipo             | Requerido | Descripción                                            |
|----------------------------|------------------|-----------|--------------------------------------------------------|
| taskId                     | string (UUID)    | Sí        | ID de la tarea asociada                                |
| studentId                  | string (UUID)    | Sí        | ID del estudiante                                      |
| sessionDate                | datetime         | Sí        | Fecha y hora de la sesión de juego                     |
| finalAcceptance            | number (0.0-1.0) | Sí        | Tasa de aceptación final del consumidor                |
| remainingBudget            | number           | Sí        | Presupuesto restante al final de la partida            |
| totalTurnsUsed             | integer          | Sí        | Número total de turnos utilizados                      |
| profileDiscoveryPercentage | number (0.0-1.0) | Sí        | Porcentaje de descubrimiento del perfil del consumidor |
| history                    | array            | No        | Lista de registros por turno                           |

**Campos de TurnHistory:**

| Campo              | Tipo             | Requerido | Descripción                                               |
|--------------------|------------------|-----------|-----------------------------------------------------------|
| turnNumber         | integer          | Sí        | Número del turno (1, 2, 3...)                             |
| acceptanceAtEnd    | number (0.0-1.0) | Sí        | Tasa de aceptación al final del turno                     |
| budgetAtEnd        | number           | Sí        | Presupuesto restante al final del turno                   |
| eventOccurredTitle | string           | No        | Título del evento ocurrido en el turno (vacío si no hubo) |
| actionsTakenIds    | array[string]    | No        | IDs de las acciones ejecutadas en el turno                |

**Response:** `201 Created`

```json
{
  "id": "string (UUID)",
  "taskId": "string (UUID)",
  "studentId": "string (UUID)",
  "sessionDate": "YYYY-MM-DDTHH:mm:ss",
  "finalAcceptance": 0.83,
  "remainingBudget": 120.00,
  "totalTurnsUsed": 5,
  "profileDiscoveryPercentage": 0.75,
  "finalOutcome": "APPROVED",
  "history": [
    {
      "turnNumber": 1,
      "acceptanceAtEnd": 0.60,
      "budgetAtEnd": 180.00,
      "eventOccurredTitle": "",
      "actionsTakenIds": [
        "..."
      ]
    }
  ]
}
```

**Nota sobre `finalOutcome`:** Este campo es calculado automáticamente por el sistema y no debe enviarse en el request.
Se determina comparando `profileDiscoveryPercentage` con el `minScoreToPass` de la tarea:

- Si `profileDiscoveryPercentage >= minScoreToPass` → `APPROVED`
- Si `profileDiscoveryPercentage < minScoreToPass` → `DISAPPROVED`

**Errores posibles:**

- `400 Bad Request` - Datos de entrada inválidos (valores fuera de rango)
- `404 Not Found` - La tarea especificada no existe

---

### Obtener Resultado de Partida por ID

```
GET /api/v1/attempts/{id}
```

**Descripción:** Obtiene los detalles completos de una sesión de juego registrada, incluyendo el historial de turnos.

**Parámetros de ruta:**

| Parámetro | Tipo   | Descripción                             |
|-----------|--------|-----------------------------------------|
| id        | string | UUID del attempt (resultado de partida) |

**Response:** `200 OK`

```json
{
  "id": "string (UUID)",
  "taskId": "string (UUID)",
  "studentId": "string (UUID)",
  "sessionDate": "YYYY-MM-DDTHH:mm:ss",
  "finalAcceptance": 0.83,
  "remainingBudget": 120.00,
  "totalTurnsUsed": 5,
  "profileDiscoveryPercentage": 0.75,
  "finalOutcome": "APPROVED",
  "history": [
    {
      "turnNumber": 1,
      "acceptanceAtEnd": 0.60,
      "budgetAtEnd": 180.00,
      "eventOccurredTitle": "",
      "actionsTakenIds": [
        "3f8a9bde-1c2f-4a6b-9d2f-0a1b2c3d4e5f"
      ]
    },
    {
      "turnNumber": 2,
      "acceptanceAtEnd": 0.68,
      "budgetAtEnd": 140.00,
      "eventOccurredTitle": "Protesta ciudadana",
      "actionsTakenIds": [
        "9d7e6f5a-3b2c-4d1e-8f9a-0b1c2d3e4f5a"
      ]
    }
  ]
}
```

**Errores posibles:**

- `404 Not Found` - `ATTEMPT_NOT_FOUND`: El resultado de partida con ID especificado no existe

---

### Obtener Métricas de un Intento

```
GET /api/attempts/{attemptId}/metrics
```

**Descripción:** Obtiene las métricas de rendimiento de un intento específico. Este endpoint proporciona un resumen
consolidado del desempeño del estudiante en la sesión de juego.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|------------------------|
| attemptId | string | UUID del intento |

**Response:** `200 OK`

```json
{
  "attemptId": "string (UUID)",
  "taskId": "string (UUID)",
  "profileDiscoveryPercentage": "number (0.0-1.0)",
  "finalAcceptance": "number (0.0-1.0)",
  "remainingBudget": "number (BigDecimal)",
  "totalTurnsUsed": "number (integer)",
  "finalOutcome": "APPROVED | DISAPPROVED",
  "evaluatedAt": "YYYY-MM-DDTHH:mm:ss"
}
```

**Errores posibles:**

- `404 Not Found` - `ATTEMPT_NOT_FOUND`: El intento con ID especificado no existe

---

## Códigos de Estado HTTP

| Código | Descripción                                                |
|--------|------------------------------------------------------------|
| 200    | OK - Solicitud exitosa                                     |
| 201    | Created - Recurso creado exitosamente                      |
| 202    | Accepted - Solicitud aceptada para procesamiento asíncrono |
| 400    | Bad Request - Error de validación o regla de negocio       |
| 404    | Not Found - Recurso no encontrado                          |
| 500    | Internal Server Error - Error interno del servidor         |

---

## Formato de Respuesta de Error

Todos los errores de la API siguen un formato estandarizado con códigos de error por módulo.

### Estructura

```json
{
  "code": "string",
  "message": "string",
  "details": "object | null"
}
```

| Campo   | Tipo           | Descripción                                                     |
|---------|----------------|-----------------------------------------------------------------|
| code    | string         | Código de error específico del módulo (ej: `STUDENT_NOT_FOUND`) |
| message | string         | Mensaje descriptivo del error                                   |
| details | object \| null | Información adicional sobre el error (opcional)                 |

### Códigos de Error por Módulo

| Módulo          | Código de Error       | Código Not Found     | HTTP Status |
|-----------------|-----------------------|----------------------|-------------|
| Entity (shared) | -                     | `ENTITY_NOT_FOUND`   | 404         |
| Student         | `STUDENT_ERROR`       | `STUDENT_NOT_FOUND`  | 400 / 404   |
| Course          | `COURSE_ERROR`        | `COURSE_NOT_FOUND`   | 400 / 404   |
| Task            | `TASK_ERROR`          | -                    | 400         |
| Academic Term   | `ACADEMIC_TERM_ERROR` | -                    | 400         |
| Scenario        | `SCENARIO_ERROR`      | `SCENARIO_NOT_FOUND` | 400 / 404   |
| Attempt         | `ATTEMPT_ERROR`       | `ATTEMPT_NOT_FOUND`  | 400 / 404   |

### Ejemplos de Respuestas de Error

**Error 404 - Recurso no encontrado:**

```json
{
  "code": "STUDENT_NOT_FOUND",
  "message": "Student not found with email: student@example.com",
  "details": null
}
```

**Error 400 - Validación de negocio:**

```json
{
  "code": "COURSE_ERROR",
  "message": "Course must belong to an UPCOMING academic term",
  "details": null
}
```

---

## Excepciones de Dominio

### Módulo Academic Terms

| Excepción                          | Descripción                                                    |
|------------------------------------|----------------------------------------------------------------|
| `AcademicTermNotFoundException`    | El periodo académico solicitado no existe                      |
| `AcademicTermNotUpcomingException` | La operación requiere un periodo académico con estado UPCOMING |
| `InvalidStatusTransitionException` | Transición de estado no permitida                              |

### Módulo Courses

| Excepción                                | Descripción                                |
|------------------------------------------|--------------------------------------------|
| `CourseNotFoundException`                | El curso solicitado no existe              |
| `InvalidCourseStatusTransitionException` | Transición de estado de curso no permitida |

### Módulo Students

| Excepción                                 | Descripción                                                       |
|-------------------------------------------|-------------------------------------------------------------------|
| `StudentNotFoundException`                | El estudiante solicitado no existe                                |
| `StudentAlreadyDisabledException`         | El estudiante ya se encuentra deshabilitado                       |
| `StudentNotActiveException`               | La operación requiere un estudiante con estado ACTIVE             |
| `CourseNotInUpcomingTermException`        | El curso no pertenece a un periodo académico UPCOMING             |
| `UserNotFoundInIdentityProviderException` | No se encontró el usuario en el proveedor de identidad (Keycloak) |

### Módulo Assignments

| Excepción                          | Descripción                                           |
|------------------------------------|-------------------------------------------------------|
| `CourseNotInUpcomingTermException` | El curso no pertenece a un periodo académico UPCOMING |

### Módulo Scenarios

| Excepción                   | Descripción                       |
|-----------------------------|-----------------------------------|
| `ScenarioNotFoundException` | El escenario solicitado no existe |

### Módulo Attempts

| Excepción                                 | Descripción                                            |
|-------------------------------------------|--------------------------------------------------------|
| `AttemptNotFoundException`                | El resultado de partida solicitado no existe           |
| `InvalidTaskIdException`                  | El ID de tarea es inválido (nulo o vacío)              |
| `InvalidStudentIdException`               | El ID de estudiante es inválido (nulo o vacío)         |
| `InvalidSessionDateException`             | La fecha de sesión es inválida (nula)                  |
| `ApprovalRateOutOfRangeException`         | La tasa de aceptación está fuera del rango [0.0, 1.0]  |
| `ProfileScoreOutOfRangeException`         | El puntaje de perfil está fuera del rango [0.0, 1.0]   |
| `BudgetCannotBeNegativeException`         | El presupuesto no puede ser negativo                   |
| `CurrentTurnMustBePositiveException`      | El número de turnos debe ser positivo                  |
| `InvalidTurnNumberException`              | El número de turno debe ser positivo                   |
| `ResultsAlreadyRegisteredException`       | Los resultados ya fueron registrados para este intento |
| `InvalidAttemptStatusTransitionException` | Transición de estado no permitida                      |

---

## Patrones de Integración

### Saga Pattern (Keycloak Integration)

El módulo de estudiantes utiliza el patrón Saga con coreografía basada en eventos para coordinar operaciones con
Keycloak:

**Registro de Estudiante:**

1. Se crea el estudiante localmente con estado `PENDING_IDENTITY`
2. Se publica `StudentRegisteredEvent`
3. El listener crea la identidad en Keycloak
4. Si es exitoso, se publica `UserIdentityCreatedEvent` → estado cambia a `ACTIVE`
5. Si falla, se publica `UserIdentityCreationFailedEvent` → se puede reintentar

**Deshabilitación de Estudiante:**

1. Se valida que el estudiante esté `ACTIVE`
2. Se publica `StudentDisableRequestedEvent`
3. El listener deshabilita localmente y en Keycloak
4. Si es exitoso, se publica `UserDisabledEvent` → estado cambia a `DISABLED`
5. Si falla, se ejecuta rollback y se publica `UserDisableFailedEvent`
