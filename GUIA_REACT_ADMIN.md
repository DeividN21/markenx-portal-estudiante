# Guía de Integración: React a React Admin

> Esta guía explica cómo crear un proyecto en React Admin inspirado en la arquitectura de este proyecto React. Incluye traducciones de patrones, ejemplos de código y mejores prácticas.

## Índice

1. [Conceptos Fundamentales](#1-conceptos-fundamentales)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Configuración Inicial](#3-configuración-inicial)
4. [AuthProvider - Autenticación](#4-authprovider---autenticación)
5. [DataProvider - Conexión con API](#5-dataprovider---conexión-con-api)
6. [Recursos y CRUD](#6-recursos-y-crud)
7. [Componentes Personalizados](#7-componentes-personalizados)
8. [Traducción de Páginas](#8-traducción-de-páginas)
9. [Layout y Navegación](#9-layout-y-navegación)
10. [Hooks y Estado](#10-hooks-y-estado)
11. [Ejemplos Completos](#11-ejemplos-completos)

---

## 1. Conceptos Fundamentales

### Diferencias Clave: React vs React Admin

| Concepto | React Tradicional | React Admin |
|----------|-------------------|-------------|
| Routing | React Router manual | Declarativo via `<Resource>` |
| Estado global | Context/Redux | Built-in con react-query |
| Fetch de datos | useEffect + fetch | DataProvider + hooks (useGetList, useGetOne) |
| Autenticación | Context manual | AuthProvider |
| Forms | Estado manual o libs | Built-in con react-hook-form |
| UI Components | Custom o libs | Material-UI integrado |

### Arquitectura de React Admin

```
┌─────────────────────────────────────────────────────────┐
│                      <Admin>                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ authProvider│  │ dataProvider │  │   Resources   │  │
│  │  (auth)     │  │   (API)      │  │ (CRUD views)  │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │                    Layout                        │    │
│  │  ┌──────────┐  ┌──────────────────────────┐    │    │
│  │  │ Sidebar  │  │       Main Content       │    │    │
│  │  │  (Menu)  │  │  List/Create/Edit/Show   │    │    │
│  │  └──────────┘  └──────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Estructura del Proyecto

### React Tradicional (Este proyecto)

```
src/
├── api/
│   ├── apiClient.ts          # Cliente HTTP
│   ├── dtos/                  # Esquemas del backend
│   └── mappers/               # Transformadores
├── components/
│   ├── layout/                # MainLayout, Header, Sidebar
│   └── ui/                    # Badge, TaskCard, etc.
├── context/                   # sessionContext, authContext
├── services/                  # authService, studentService
├── pages/                     # TasksPage, GamePage, etc.
├── types/                     # Interfaces TypeScript
└── App.tsx                    # Router config
```

### React Admin (Proyecto nuevo)

```
src/
├── providers/
│   ├── authProvider.ts       # Reemplaza context/authContext
│   └── dataProvider.ts       # Reemplaza api/ + services/
├── resources/
│   ├── tasks/
│   │   ├── TaskList.tsx      # Reemplaza TasksPage
│   │   ├── TaskShow.tsx      # Reemplaza TaskDetailPage
│   │   └── index.ts
│   ├── attempts/
│   │   └── AttemptList.tsx   # Reemplaza ProgressPage
│   └── evaluations/
│       └── EvaluationList.tsx
├── components/
│   ├── layout/
│   │   ├── CustomLayout.tsx  # Reemplaza MainLayout
│   │   ├── CustomAppBar.tsx  # Reemplaza Header
│   │   └── CustomMenu.tsx    # Reemplaza Sidebar
│   └── fields/               # Campos personalizados
│       └── StatusBadgeField.tsx  # Reemplaza Badge
├── pages/
│   └── GamePage.tsx          # Páginas custom sin CRUD
├── types/
│   └── index.ts
└── App.tsx                   # <Admin> config
```

---

## 3. Configuración Inicial

### Instalación

```bash
npm create vite@latest mi-proyecto-admin -- --template react-ts
cd mi-proyecto-admin
npm install react-admin ra-data-simple-rest
```

### App.tsx Básico

**React Tradicional:**
```tsx
// App.tsx original
function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RequireSession><MainLayout /></RequireSession>}>
              <Route path="/" element={<Navigate to="/tasks" />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </AuthProvider>
  );
}
```

**React Admin:**
```tsx
// App.tsx en React Admin
import { Admin, Resource } from 'react-admin';
import { authProvider } from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { CustomLayout } from './components/layout/CustomLayout';
import { TaskList, TaskShow } from './resources/tasks';
import { AttemptList } from './resources/attempts';
import { GamePage } from './pages/GamePage';

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      layout={CustomLayout}
      loginPage={false} // Usamos OAuth redirect
    >
      <Resource
        name="tasks"
        list={TaskList}
        show={TaskShow}
        options={{ label: 'Tareas' }}
      />
      <Resource
        name="attempts"
        list={AttemptList}
        options={{ label: 'Progreso' }}
      />
      {/* Ruta custom sin CRUD */}
      <CustomRoutes>
        <Route path="/game/:taskId" element={<GamePage />} />
      </CustomRoutes>
    </Admin>
  );
}
```

---

## 4. AuthProvider - Autenticación

### Traducción del Contexto de Sesión

**React Tradicional (sessionContext.tsx):**
```tsx
// Lógica actual de autenticación
const refresh = async () => {
  const authMe = await sessionService.getAuthMe();
  const studentMe = await sessionService.getStudentMe();
  const course = await sessionService.getCourseByStudentId(studentMe.studentId);

  setUser({
    id: studentMe.studentId,
    email: authMe.email,
    name: authMe.fullName,
    roles: authMe.roles,
    courseId: course.id,
    courseName: course.name
  });
};

const logout = () => {
  sessionService.logoutFederated(redirectUrl);
};
```

**React Admin (authProvider.ts):**
```tsx
// providers/authProvider.ts
import { AuthProvider } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL;

export const authProvider: AuthProvider = {
  // Llamado al iniciar sesión (no usado con OAuth redirect)
  login: async () => {
    // Con BFF + OAuth, redirigimos al backend
    window.location.href = `${API_URL}/auth/login`;
    return Promise.resolve();
  },

  // Llamado para cerrar sesión
  logout: async () => {
    // Crear form POST para logout federado
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${API_URL}/auth/logout`;

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'redirect_uri';
    input.value = `${window.location.origin}/logged-out`;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();

    return Promise.resolve();
  },

  // Verificar si el usuario está autenticado
  checkAuth: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include', // Enviar cookies JSESSIONID
      });

      if (!response.ok) {
        throw new Error('No autenticado');
      }

      return Promise.resolve();
    } catch {
      // Redirigir a login si no está autenticado
      window.location.href = `${API_URL}/auth/login`;
      return Promise.reject();
    }
  },

  // Verificar errores de autorización
  checkError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      window.location.href = `${API_URL}/auth/login`;
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Obtener identidad del usuario (para mostrar en UI)
  getIdentity: async () => {
    try {
      // Obtener datos de auth
      const authResponse = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });
      const authData = await authResponse.json();

      // Obtener datos de estudiante
      const studentResponse = await fetch(`${API_URL}/students/me`, {
        credentials: 'include',
      });
      const studentData = await studentResponse.json();

      // Obtener curso
      const courseResponse = await fetch(
        `${API_URL}/students/${studentData.studentId}/course`,
        { credentials: 'include' }
      );
      const courseData = await courseResponse.json();

      return {
        id: studentData.studentId,
        fullName: authData.fullName,
        email: authData.email,
        avatar: undefined,
        // Campos adicionales personalizados
        roles: authData.roles,
        courseId: courseData.id,
        courseName: courseData.name,
      };
    } catch {
      throw new Error('Error obteniendo identidad');
    }
  },

  // Obtener permisos (roles)
  getPermissions: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });
      const data = await response.json();
      return data.roles || [];
    } catch {
      return [];
    }
  },
};
```

### Acceder a la Identidad en Componentes

**React Tradicional:**
```tsx
const { user } = useSession();
console.log(user.name, user.courseId);
```

**React Admin:**
```tsx
import { useGetIdentity } from 'react-admin';

const MyComponent = () => {
  const { data: identity, isLoading } = useGetIdentity();

  if (isLoading) return null;

  return <span>{identity?.fullName} - {identity?.courseName}</span>;
};
```

---

## 5. DataProvider - Conexión con API

### Traducción del Cliente API y Servicios

El DataProvider centraliza TODAS las operaciones de datos. Reemplaza:
- `apiClient.ts`
- Todos los archivos en `services/`
- Los `mappers/`

**React Admin (dataProvider.ts):**
```tsx
// providers/dataProvider.ts
import { DataProvider, fetchUtils } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL;

// Cliente HTTP personalizado (equivalente a apiClient.ts)
const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  return fetchUtils.fetchJson(url, {
    ...options,
    credentials: 'include', // Enviar cookies JSESSIONID
  });
};

// Mappers (equivalente a mappers/)
const mapApiStatusToUiStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'NOT_STARTED': 'PENDING',
    'IN_PROGRESS': 'PENDING',
    'COMPLETED': 'COMPLETED',
    'FAILED': 'FAILED',
    'OUTDATED': 'EXPIRED',
  };
  return statusMap[status] || 'PENDING';
};

const mapApiOutcomeToUiOutcome = (outcome: string) => {
  const outcomeMap: Record<string, string> = {
    'APPROVED': 'GANASTE',
    'DISAPPROVED': 'PERDISTE',
    'UNKNOWN': 'EN PROGRESO',
  };
  return outcomeMap[outcome] || 'EN PROGRESO';
};

export const dataProvider: DataProvider = {
  // GET lista de recursos
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
    const { field, order } = params.sort || { field: 'id', order: 'ASC' };

    // Obtener studentId del usuario actual
    const identityResponse = await httpClient(`${API_URL}/students/me`);
    const studentId = identityResponse.json.studentId;

    let url = '';
    let data: any[] = [];

    switch (resource) {
      case 'tasks':
        url = `${API_URL}/students/${studentId}/tasks`;
        const tasksResponse = await httpClient(url);
        data = tasksResponse.json
          .filter((item: any) => item.type === 'ASSIGNMENT')
          .map((item: any) => ({
            id: item.taskId,
            title: item.title,
            description: item.description,
            deadline: item.deadline,
            status: mapApiStatusToUiStatus(item.status),
            type: item.type,
            attempts: item.currentAttempt,
            maxAttempts: item.maxAttempts,
            minScore: item.minScore,
            scenarioId: item.scenarioId,
          }));
        break;

      case 'evaluations':
        url = `${API_URL}/students/${studentId}/tasks`;
        const evalsResponse = await httpClient(url);
        data = evalsResponse.json
          .filter((item: any) => item.type === 'EVALUATION')
          .map((item: any) => ({
            id: item.taskId,
            title: item.title,
            description: item.description,
            deadline: item.deadline,
            status: mapApiStatusToUiStatus(item.status),
            type: item.type,
            attempts: item.currentAttempt,
            maxAttempts: item.maxAttempts,
          }));
        break;

      case 'attempts':
        url = `${API_URL}/students/${studentId}/attempts`;
        const attemptsResponse = await httpClient(url);
        data = attemptsResponse.json.map((item: any) => ({
          id: item.attemptId,
          taskId: item.taskId,
          taskTitle: item.taskTitle,
          date: item.startedAt,
          outcome: mapApiOutcomeToUiOutcome(item.outcome),
          score: item.score,
          status: item.outcome,
        }));
        break;

      default:
        throw new Error(`Recurso desconocido: ${resource}`);
    }

    // Aplicar filtros
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value) {
          data = data.filter((item) => {
            if (key === 'status' && value !== '') {
              return item.status === value;
            }
            if (key === 'deadline' && value !== '') {
              return item.deadline?.startsWith(value);
            }
            return true;
          });
        }
      });
    }

    // Ordenar
    data.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      return order === 'ASC'
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });

    // Paginar
    const start = (page - 1) * perPage;
    const paginatedData = data.slice(start, start + perPage);

    return {
      data: paginatedData,
      total: data.length,
    };
  },

  // GET un solo recurso
  getOne: async (resource, params) => {
    const { id } = params;

    if (resource === 'tasks') {
      // Obtener datos básicos de la tarea
      const taskResponse = await httpClient(`${API_URL}/tasks/${id}`);
      const task = taskResponse.json;

      // Obtener detalles de progreso del estudiante
      const identityResponse = await httpClient(`${API_URL}/students/me`);
      const studentId = identityResponse.json.studentId;

      const detailResponse = await httpClient(
        `${API_URL}/students/${studentId}/tasks/${id}/progress`
      );
      const detail = detailResponse.json;

      return {
        data: {
          id: task.taskId,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          status: mapApiStatusToUiStatus(task.status),
          type: task.type,
          minScore: task.minScore,
          scenarioId: task.scenarioId,
          // Datos adicionales del progreso
          currentAttempt: detail.currentAttempt,
          maxAttempts: detail.maxAttempts,
          remainingAttempts: detail.remainingAttempts,
          studentId: detail.studentId,
        },
      };
    }

    throw new Error(`getOne no implementado para: ${resource}`);
  },

  // Los siguientes son requeridos pero pueden no usarse
  getMany: async (resource, params) => {
    // Implementar si se necesita
    const results = await Promise.all(
      params.ids.map(id => dataProvider.getOne(resource, { id }))
    );
    return { data: results.map(r => r.data) };
  },

  getManyReference: async (resource, params) => {
    // Útil para relaciones (ej: intentos de una tarea)
    if (resource === 'attempts' && params.target === 'taskId') {
      const url = `${API_URL}/tasks/${params.id}/attempts`;
      const response = await httpClient(url);
      const data = response.json.map((item: any) => ({
        id: item.attemptId,
        taskId: item.taskId,
        date: item.startedAt,
        outcome: mapApiOutcomeToUiOutcome(item.outcome),
        score: item.score,
      }));
      return { data, total: data.length };
    }
    throw new Error(`getManyReference no implementado para: ${resource}`);
  },

  // Operaciones de escritura (no usadas en este proyecto de solo lectura)
  create: async () => { throw new Error('No implementado'); },
  update: async () => { throw new Error('No implementado'); },
  updateMany: async () => { throw new Error('No implementado'); },
  delete: async () => { throw new Error('No implementado'); },
  deleteMany: async () => { throw new Error('No implementado'); },
};
```

### Custom Actions (Ej: Game Token)

Para operaciones que no son CRUD estándar:

```tsx
// providers/customActions.ts
const API_URL = import.meta.env.VITE_API_URL;

export const getGameToken = async (): Promise<string> => {
  const response = await fetch(`${API_URL}/auth/game-token`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error obteniendo game token');
  }

  const data = await response.json();
  return data.token;
};
```

---

## 6. Recursos y CRUD

### Traducción de Páginas a Recursos

Un `<Resource>` en React Admin agrupa las vistas CRUD de una entidad:

| React Tradicional | React Admin |
|-------------------|-------------|
| TasksPage.tsx | TaskList.tsx |
| TaskDetailPage.tsx | TaskShow.tsx |
| (no existe) | TaskEdit.tsx |
| (no existe) | TaskCreate.tsx |

### TaskList (Reemplaza TasksPage)

**React Tradicional (TasksPage.tsx):**
```tsx
const TasksPage = () => {
  const { user } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await studentService.getTasksByStudent(user.id);
      setTasks(data.filter(t => t.type === 'ASSIGNMENT'));
      setLoading(false);
    };
    fetchTasks();
  }, [user.id]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => !statusFilter || t.status === statusFilter);
  }, [tasks, statusFilter]);

  return (
    <div>
      <h1>Mis Tareas</h1>
      <TaskFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      {filteredTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => navigate(`/tasks/${task.id}`)}
        />
      ))}
    </div>
  );
};
```

**React Admin (TaskList.tsx):**
```tsx
// resources/tasks/TaskList.tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  FilterForm,
  SelectInput,
  TextInput,
  useRedirect,
} from 'react-admin';
import { StatusBadgeField } from '../../components/fields/StatusBadgeField';

// Filtros (reemplaza TaskFilters)
const taskFilters = [
  <SelectInput
    source="status"
    label="Estado"
    choices={[
      { id: '', name: 'Todos' },
      { id: 'PENDING', name: 'Habilitadas' },
      { id: 'COMPLETED', name: 'Completadas' },
      { id: 'EXPIRED', name: 'Vencidas' },
      { id: 'FAILED', name: 'Fallidas' },
    ]}
    alwaysOn
  />,
  <TextInput
    source="deadline"
    label="Fecha límite"
    type="date"
  />,
];

export const TaskList = () => {
  const redirect = useRedirect();

  return (
    <List
      title="Mis Tareas"
      filters={taskFilters}
      sort={{ field: 'deadline', order: 'ASC' }}
      perPage={25}
    >
      <Datagrid
        rowClick={(id) => {
          redirect('show', 'tasks', id);
          return false; // Prevenir comportamiento default
        }}
        bulkActionButtons={false}
      >
        <TextField source="title" label="Título" />
        <TextField source="description" label="Descripción" />
        <DateField source="deadline" label="Fecha límite" />
        <StatusBadgeField source="status" label="Estado" />
        <FunctionField
          label="Intentos"
          render={(record: any) =>
            `${record.attempts}/${record.maxAttempts}`
          }
        />
      </Datagrid>
    </List>
  );
};
```

### TaskShow (Reemplaza TaskDetailPage)

**React Admin (TaskShow.tsx):**
```tsx
// resources/tasks/TaskShow.tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  FunctionField,
  useRecordContext,
  Button,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { StatusBadgeField } from '../../components/fields/StatusBadgeField';

const StartMissionButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();

  if (!record) return null;

  const canStart = record.status === 'PENDING' && record.remainingAttempts > 0;

  return (
    <Button
      label="Iniciar Misión"
      onClick={() => navigate(`/game/${record.id}`)}
      disabled={!canStart}
    />
  );
};

export const TaskShow = () => (
  <Show title="Detalle de Tarea">
    <SimpleShowLayout>
      <TextField source="title" label="Título" />
      <TextField source="description" label="Descripción" />
      <DateField source="deadline" label="Fecha límite" />
      <StatusBadgeField source="status" label="Estado" />
      <FunctionField
        label="Progreso"
        render={(record: any) =>
          `Intento ${record.currentAttempt} de ${record.maxAttempts} (quedan ${record.remainingAttempts})`
        }
      />
      <NumberField
        source="minScore"
        label="Puntaje mínimo"
        options={{ style: 'percent' }}
      />
      <StartMissionButton />
    </SimpleShowLayout>
  </Show>
);
```

### Index de Recurso

```tsx
// resources/tasks/index.ts
export { TaskList } from './TaskList';
export { TaskShow } from './TaskShow';
```

---

## 7. Componentes Personalizados

### StatusBadgeField (Reemplaza Badge)

**React Tradicional (Badge.tsx):**
```tsx
interface BadgeProps {
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
}

const Badge = ({ status }: BadgeProps) => {
  const styles = {
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    PENDING: 'bg-blue-100 text-blue-800',
    EXPIRED: 'bg-red-100 text-red-800',
    FAILED: 'bg-red-100 text-red-800',
  };

  const labels = {
    COMPLETED: 'COMPLETADA',
    PENDING: 'HABILITADA',
    EXPIRED: 'VENCIDA',
    FAILED: 'FALLIDA',
  };

  return (
    <span className={clsx('px-2 py-1 rounded', styles[status])}>
      {labels[status]}
    </span>
  );
};
```

**React Admin (StatusBadgeField.tsx):**
```tsx
// components/fields/StatusBadgeField.tsx
import { useRecordContext } from 'react-admin';
import { Chip } from '@mui/material';

interface StatusBadgeFieldProps {
  source: string;
  label?: string;
}

export const StatusBadgeField = ({ source }: StatusBadgeFieldProps) => {
  const record = useRecordContext();
  if (!record) return null;

  const status = record[source];

  const config: Record<string, { color: any; label: string }> = {
    COMPLETED: { color: 'success', label: 'COMPLETADA' },
    PENDING: { color: 'info', label: 'HABILITADA' },
    EXPIRED: { color: 'error', label: 'VENCIDA' },
    FAILED: { color: 'error', label: 'FALLIDA' },
  };

  const { color, label } = config[status] || { color: 'default', label: status };

  return <Chip label={label} color={color} size="small" />;
};

// Importante para que React Admin lo reconozca como campo
StatusBadgeField.defaultProps = { label: 'Estado' };
```

### OutcomeBadgeField (Para Attempts)

```tsx
// components/fields/OutcomeBadgeField.tsx
import { useRecordContext } from 'react-admin';
import { Chip } from '@mui/material';

export const OutcomeBadgeField = ({ source }: { source: string }) => {
  const record = useRecordContext();
  if (!record) return null;

  const outcome = record[source];

  const config: Record<string, { color: any; label: string }> = {
    'GANASTE': { color: 'success', label: 'GANASTE' },
    'PERDISTE': { color: 'error', label: 'PERDISTE' },
    'EN PROGRESO': { color: 'warning', label: 'EN PROGRESO' },
  };

  const { color, label } = config[outcome] || { color: 'default', label: outcome };

  return <Chip label={label} color={color} size="small" />;
};
```

---

## 8. Traducción de Páginas

### ProgressPage -> AttemptList

**React Admin (AttemptList.tsx):**
```tsx
// resources/attempts/AttemptList.tsx
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  useListContext,
} from 'react-admin';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { OutcomeBadgeField } from '../../components/fields/OutcomeBadgeField';

// KPI Cards (equivalente a las tarjetas de resumen)
const KPICards = () => {
  const { data, isLoading } = useListContext();

  if (isLoading || !data) return null;

  const total = data.length;
  const victorias = data.filter((a: any) => a.outcome === 'GANASTE').length;
  const promedio = total > 0
    ? data.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / total
    : 0;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Total Intentos</Typography>
            <Typography variant="h4">{total}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Victorias</Typography>
            <Typography variant="h4">{victorias}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Promedio</Typography>
            <Typography variant="h4">{(promedio * 100).toFixed(0)}%</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export const AttemptList = () => (
  <List
    title="Mi Progreso"
    sort={{ field: 'date', order: 'DESC' }}
    pagination={false}
  >
    <>
      <KPICards />
      <Datagrid bulkActionButtons={false}>
        <TextField source="taskTitle" label="Tarea" />
        <DateField source="date" label="Fecha" showTime />
        <OutcomeBadgeField source="outcome" label="Resultado" />
        <NumberField
          source="score"
          label="Puntaje"
          options={{ style: 'percent' }}
        />
      </Datagrid>
    </>
  </List>
);
```

### GamePage (Página Custom)

Las páginas que no siguen el patrón CRUD se mantienen similares:

```tsx
// pages/GamePage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDataProvider, useGetIdentity, Title } from 'react-admin';
import { getGameToken } from '../providers/customActions';

export const GamePage = () => {
  const { taskId } = useParams();
  const dataProvider = useDataProvider();
  const { data: identity } = useGetIdentity();

  const [task, setTask] = useState<any>(null);
  const [gameToken, setGameToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await dataProvider.getOne('tasks', { id: taskId });
        setTask(data);

        const token = await getGameToken();
        setGameToken(token);
      } catch (error) {
        console.error('Error cargando juego:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId, dataProvider]);

  const gameUrl = useMemo(() => {
    if (!task || !gameToken || !identity) return null;

    const params = new URLSearchParams({
      taskId: task.id,
      studentId: identity.id,
      scenarioId: task.scenarioId,
      apiUrl: import.meta.env.VITE_API_URL,
      token: gameToken,
    });

    return `${import.meta.env.VITE_GAME_URL}?${params.toString()}`;
  }, [task, gameToken, identity]);

  if (loading) {
    return <div>Cargando juego...</div>;
  }

  return (
    <div style={{ height: '100vh' }}>
      <Title title={`Misión: ${task?.title}`} />
      {gameUrl && (
        <iframe
          src={gameUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Unity Game"
        />
      )}
    </div>
  );
};
```

---

## 9. Layout y Navegación

### CustomLayout (Reemplaza MainLayout)

```tsx
// components/layout/CustomLayout.tsx
import { Layout, LayoutProps } from 'react-admin';
import { CustomAppBar } from './CustomAppBar';
import { CustomMenu } from './CustomMenu';

export const CustomLayout = (props: LayoutProps) => (
  <Layout
    {...props}
    appBar={CustomAppBar}
    menu={CustomMenu}
  />
);
```

### CustomAppBar (Reemplaza Header)

```tsx
// components/layout/CustomAppBar.tsx
import { AppBar, TitlePortal, useGetIdentity } from 'react-admin';
import { Typography, Box } from '@mui/material';

export const CustomAppBar = () => {
  const { data: identity } = useGetIdentity();

  return (
    <AppBar
      color="primary"
      sx={{ backgroundColor: '#9e1c22' }} // brand-primary
    >
      <TitlePortal />
      <Box sx={{ flex: 1 }} />
      {identity && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {identity.courseName}
          </Typography>
          <Typography variant="body1">
            {identity.fullName}
          </Typography>
        </Box>
      )}
    </AppBar>
  );
};
```

### CustomMenu (Reemplaza Sidebar)

```tsx
// components/layout/CustomMenu.tsx
import { Menu, MenuItemLink } from 'react-admin';
import { Assignment, TrendingUp, Quiz } from '@mui/icons-material';

export const CustomMenu = () => (
  <Menu>
    <MenuItemLink
      to="/tasks"
      primaryText="Tareas"
      leftIcon={<Assignment />}
    />
    <MenuItemLink
      to="/attempts"
      primaryText="Progreso"
      leftIcon={<TrendingUp />}
    />
    <MenuItemLink
      to="/evaluations"
      primaryText="Evaluaciones"
      leftIcon={<Quiz />}
    />
  </Menu>
);
```

---

## 10. Hooks y Estado

### Traducción de Hooks Comunes

| React Tradicional | React Admin | Propósito |
|-------------------|-------------|-----------|
| `useState` + `useEffect` para fetch | `useGetList` | Obtener lista de recursos |
| `useState` + `useEffect` para getOne | `useGetOne` | Obtener un recurso |
| `useSession().user` | `useGetIdentity()` | Datos del usuario |
| `useNavigate()` | `useRedirect()` | Navegación programática |
| `useParams()` | `useParams()` (mismo) | Parámetros de URL |
| Context personalizado | `useDataProvider()` | Acceso directo al dataProvider |

### Ejemplos de Uso

```tsx
// React Tradicional
const { user } = useSession();
const [tasks, setTasks] = useState([]);
useEffect(() => {
  studentService.getTasksByStudent(user.id).then(setTasks);
}, [user.id]);

// React Admin
import { useGetList, useGetIdentity } from 'react-admin';

const { data: identity } = useGetIdentity();
const { data: tasks, isLoading } = useGetList('tasks', {
  pagination: { page: 1, perPage: 100 },
  sort: { field: 'deadline', order: 'ASC' },
  filter: { status: 'PENDING' },
});
```

### useDataProvider para Operaciones Custom

```tsx
import { useDataProvider } from 'react-admin';

const MyComponent = () => {
  const dataProvider = useDataProvider();

  const handleCustomAction = async () => {
    // Acceso directo al dataProvider
    const { data } = await dataProvider.getOne('tasks', { id: '123' });
    console.log(data);
  };

  return <button onClick={handleCustomAction}>Acción</button>;
};
```

---

## 11. Ejemplos Completos

### App.tsx Final

```tsx
// App.tsx
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';

import { authProvider } from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { CustomLayout } from './components/layout/CustomLayout';

import { TaskList, TaskShow } from './resources/tasks';
import { AttemptList } from './resources/attempts';
import { EvaluationList } from './resources/evaluations';
import { GamePage } from './pages/GamePage';
import { LoggedOutPage } from './pages/LoggedOutPage';

// Tema personalizado (colores de marca)
const theme = {
  palette: {
    primary: {
      main: '#9e1c22', // brand-primary
    },
    secondary: {
      main: '#2563eb', // brand-accent
    },
  },
};

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      layout={CustomLayout}
      theme={theme}
      loginPage={false}
      requireAuth
    >
      <Resource
        name="tasks"
        list={TaskList}
        show={TaskShow}
        options={{ label: 'Tareas' }}
      />
      <Resource
        name="attempts"
        list={AttemptList}
        options={{ label: 'Progreso' }}
      />
      <Resource
        name="evaluations"
        list={EvaluationList}
        options={{ label: 'Evaluaciones' }}
      />

      <CustomRoutes>
        <Route path="/game/:taskId" element={<GamePage />} />
      </CustomRoutes>

      <CustomRoutes noLayout>
        <Route path="/logged-out" element={<LoggedOutPage />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
```

### Estructura de Archivos Final

```
src/
├── providers/
│   ├── authProvider.ts
│   ├── dataProvider.ts
│   └── customActions.ts
├── resources/
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskShow.tsx
│   │   └── index.ts
│   ├── attempts/
│   │   ├── AttemptList.tsx
│   │   └── index.ts
│   └── evaluations/
│       ├── EvaluationList.tsx
│       └── index.ts
├── components/
│   ├── layout/
│   │   ├── CustomLayout.tsx
│   │   ├── CustomAppBar.tsx
│   │   └── CustomMenu.tsx
│   └── fields/
│       ├── StatusBadgeField.tsx
│       └── OutcomeBadgeField.tsx
├── pages/
│   ├── GamePage.tsx
│   └── LoggedOutPage.tsx
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Resumen de Traducciones

| Archivo Original | Archivo React Admin | Función |
|------------------|---------------------|---------|
| `context/sessionContext.tsx` | `providers/authProvider.ts` | Autenticación |
| `api/apiClient.ts` | `providers/dataProvider.ts` | Cliente HTTP |
| `services/*.ts` | `providers/dataProvider.ts` | Lógica de negocio |
| `api/mappers/*.ts` | `providers/dataProvider.ts` | Transformaciones |
| `pages/TasksPage.tsx` | `resources/tasks/TaskList.tsx` | Lista de tareas |
| `pages/TaskDetailPage.tsx` | `resources/tasks/TaskShow.tsx` | Detalle de tarea |
| `pages/ProgressPage.tsx` | `resources/attempts/AttemptList.tsx` | Historial |
| `components/layout/MainLayout.tsx` | `components/layout/CustomLayout.tsx` | Layout |
| `components/layout/Header.tsx` | `components/layout/CustomAppBar.tsx` | Barra superior |
| `components/layout/Sidebar.tsx` | `components/layout/CustomMenu.tsx` | Menú lateral |
| `components/ui/Badge.tsx` | `components/fields/StatusBadgeField.tsx` | Badge de estado |
| `pages/GamePage.tsx` | `pages/GamePage.tsx` | Página custom (similar) |

---

## Notas Importantes

1. **BFF Session Cookies**: React Admin soporta autenticación basada en cookies. Asegúrate de configurar `credentials: 'include'` en todas las peticiones.

2. **Sin Tokens en Frontend**: Este patrón no expone tokens JWT al frontend. La sesión se maneja con cookies HTTP-only.

3. **DataProvider Centralizado**: Todo el acceso a datos pasa por el DataProvider. Esto facilita testing y mantenimiento.

4. **Componentes de Campo**: Los campos personalizados (como StatusBadgeField) deben usar `useRecordContext()` para acceder a los datos del registro actual.

5. **Rutas Custom**: Usa `<CustomRoutes>` para páginas que no siguen el patrón CRUD estándar.

6. **Material-UI**: React Admin usa Material-UI por defecto. Puedes personalizar el tema pero los componentes base son de MUI.
