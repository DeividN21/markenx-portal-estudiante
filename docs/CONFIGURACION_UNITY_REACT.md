# Configuracion React para Cargar Parametros en Unity WebGL

Este documento explica como configurar el proyecto React para pasar parametros dinamicos al videojuego Unity WebGL durante runtime.

---

## Indice

1. [Arquitectura de la Integracion](#1-arquitectura-de-la-integracion)
2. [Archivos Modificados](#2-archivos-modificados)
3. [Configuracion de Variables de Entorno](#3-configuracion-de-variables-de-entorno)
4. [Flujo de Datos React -> Unity](#4-flujo-de-datos-react---unity)
5. [Estructura de Carpetas](#5-estructura-de-carpetas)
6. [Parametros Enviados al Juego](#6-parametros-enviados-al-juego)
7. [Configuracion del Backend](#7-configuracion-del-backend)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Arquitectura de la Integracion

Se implemento la **Opcion A (iframe)** recomendada en la documentacion de integracion:

```
+------------------+     Query Params     +------------------+
|                  |  ------------------>  |                  |
|   React App      |                       |   Unity WebGL    |
|   (GamePage)     |                       |   (iframe)       |
|                  |                       |                  |
+------------------+                       +------------------+
        |                                          |
        | API Calls                                | API Calls
        v                                          v
+----------------------------------------------------------+
|                        Backend API                        |
|                    (Spring Boot)                          |
+----------------------------------------------------------+
```

### Ventajas de esta arquitectura:
- Aislamiento total de contextos (React y Unity no interfieren)
- Facil implementacion sin dependencias adicionales
- No hay conflictos de CSS/JS entre React y Unity
- Unity lee los parametros automaticamente de la URL
- No requiere modificaciones en el codigo de Unity

---

## 2. Archivos Modificados

### 2.1 Archivos de Configuracion

| Archivo | Descripcion |
|---------|-------------|
| `src/config/env.ts` | Agregada variable `GAME_URL` |
| `src/types/index.ts` | Agregado campo `scenarioId` a interface `Task` |
| `src/api/dtos/task.dto.ts` | Agregado campo `scenarioId` al DTO |
| `src/api/mappers/task.mapper.ts` | Mapeo de `scenarioId` |

### 2.2 Componentes

| Archivo | Descripcion |
|---------|-------------|
| `src/pages/GamePage.tsx` | Reescrito para cargar Unity via iframe con Query Params |

### 2.3 Assets Estaticos

| Carpeta | Descripcion |
|---------|-------------|
| `public/game/` | Build completo de Unity WebGL |

---

## 3. Configuracion de Variables de Entorno

### 3.1 Variables Disponibles

```env
# .env.development
VITE_API_URL=http://localhost:8082/api/v1
VITE_GAME_URL=/game/index.html

# .env.production
VITE_API_URL=https://api.markenx.com/api/v1
VITE_GAME_URL=/game/index.html
```

### 3.2 Archivo env.ts

```typescript
// src/config/env.ts
export const env = {
    API_BASE_URL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1",
    APP_NAME: import.meta.env.VITE_APP_NAME ?? "markenx-student-ui",
    GAME_URL: import.meta.env.VITE_GAME_URL ?? "/game/index.html",
};
```

### 3.3 Opciones de GAME_URL

| Escenario | Valor de GAME_URL |
|-----------|-------------------|
| Desarrollo local | `/game/index.html` |
| Juego en mismo servidor | `/game/index.html` |
| Juego en CDN externo | `https://cdn.markenx.com/game/index.html` |
| Juego en subdominio | `https://game.markenx.com/index.html` |

---

## 4. Flujo de Datos React -> Unity

### 4.1 Diagrama de Flujo

```
1. Usuario navega a /game/:taskId
           |
           v
2. GamePage obtiene taskId de useParams()
           |
           v
3. GamePage obtiene studentId de useSession()
           |
           v
4. GamePage llama GET /tasks/{taskId} para obtener scenarioId
           |
           v
5. GamePage construye URL con Query Params:
   /game/index.html?scenarioId=X&studentId=Y&taskId=Z&apiUrl=...
           |
           v
6. iframe carga Unity WebGL con la URL
           |
           v
7. Unity lee Application.absoluteURL y extrae los parametros
           |
           v
8. Unity usa los parametros para:
   - GET /scenarios/{scenarioId} (cargar escenario)
   - POST /attempts (enviar resultados)
```

### 4.2 Codigo de Construccion de URL

```typescript
// GamePage.tsx
const gameUrl = useMemo(() => {
  if (!taskId || !user?.id) return null;

  const params = new URLSearchParams();

  // scenarioId: del backend o taskId como fallback
  const scenarioId = task?.scenarioId || taskId;
  params.set('scenarioId', scenarioId);

  // studentId: del contexto de sesion
  params.set('studentId', user.id);

  // taskId: de la URL de React
  params.set('taskId', taskId);

  // apiUrl: URL base del backend
  const apiBaseUrl = env.API_BASE_URL.replace('/api/v1', '');
  params.set('apiUrl', apiBaseUrl);

  return `${env.GAME_URL}?${params.toString()}`;
}, [taskId, user?.id, task?.scenarioId]);
```

### 4.3 URL Resultante

```
/game/index.html?scenarioId=a74394ee-7360-4943-b19f-84be9f106e45&studentId=fc711ce9-cc33-4168-8110-bd4a710d278f&taskId=0925f141-fc36-4ef4-a661-b35820079585&apiUrl=http%3A%2F%2Flocalhost%3A8082
```

---

## 5. Estructura de Carpetas

```
markenx-student-ui/
├── public/
│   └── game/                          # Build de Unity WebGL
│       ├── Build/
│       │   ├── build.data.br          # Datos del juego (comprimido)
│       │   ├── build.framework.js.br  # Framework Unity
│       │   ├── build.wasm.br          # WebAssembly
│       │   └── build.loader.js        # Loader de Unity
│       ├── StreamingAssets/
│       │   └── config.json            # Config fallback (desarrollo)
│       ├── TemplateData/              # Assets del template
│       └── index.html                 # Entry point del juego
├── src/
│   ├── config/
│   │   └── env.ts                     # Variables de entorno
│   ├── pages/
│   │   └── GamePage.tsx               # Pagina que embebe el juego
│   └── types/
│       └── index.ts                   # Tipos con scenarioId
└── docs/
    ├── INTEGRACION_REACT_UNITY.md     # Doc tecnica completa
    └── CONFIGURACION_UNITY_REACT.md   # Este documento
```

---

## 6. Parametros Enviados al Juego

### 6.1 Tabla de Parametros

| Parametro | Obligatorio | Origen en React | Uso en Unity |
|-----------|-------------|-----------------|--------------|
| `scenarioId` | Si | `task.scenarioId` o `taskId` | GET /scenarios/{id} |
| `studentId` | Si | `user.id` (SessionContext) | POST /attempts |
| `taskId` | Si | `useParams().taskId` | POST /attempts |
| `apiUrl` | Si | `env.API_BASE_URL` | URL base para requests |

### 6.2 Jerarquia de Prioridad en Unity

Unity lee la configuracion en este orden (de mayor a menor prioridad):

1. **Query Parameters** (WebGL) - Lo que React envia
2. **Argumentos de linea de comando** (Desktop)
3. **Archivo config.json** (StreamingAssets)
4. **Valores del Inspector** (Unity Editor)

En produccion WebGL, **siempre se usaran los Query Parameters**.

### 6.3 Fallbacks

```typescript
// Si el backend no devuelve scenarioId, usar taskId
const scenarioId = task?.scenarioId || taskId;
```

---

## 7. Configuracion del Backend

### 7.1 TaskDto debe incluir scenarioId

El backend debe devolver `scenarioId` en el endpoint `GET /tasks/{taskId}`:

```json
{
  "id": "0925f141-fc36-4ef4-a661-b35820079585",
  "title": "Mision de Marketing Digital",
  "summary": "Lanza un producto...",
  "scenarioId": "a74394ee-7360-4943-b19f-84be9f106e45",
  "deadline": "2026-02-15T23:59:59Z",
  "status": "NOT_STARTED",
  "currentAttempt": 0,
  "maxAttempts": 3,
  "minScoreToPass": 0.7
}
```

### 7.2 CORS Configuration

El backend debe permitir requests desde el dominio del juego:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:3000",     // React dev
                "http://localhost:5173",     // Vite dev
                "https://app.markenx.com",   // React prod
                "https://game.markenx.com"   // Unity si esta en otro dominio
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

---

## 8. Troubleshooting

### 8.1 Problemas Comunes

| Problema | Causa | Solucion |
|----------|-------|----------|
| Juego no carga | Ruta incorrecta a public/game | Verificar que `GAME_URL` apunta a `/game/index.html` |
| scenarioId es null | Backend no devuelve scenarioId | Actualizar endpoint o usar taskId como fallback |
| Error CORS | Backend no permite origen | Agregar origen en CorsConfig |
| Pantalla negra | Build corrupto o incompleto | Regenerar build de Unity |
| Parametros no llegan | URL mal codificada | Usar `URLSearchParams` (ya implementado) |

### 8.2 Depuracion

En modo desarrollo, GamePage muestra la URL generada:

```
Game URL: /game/index.html?scenarioId=xxx&studentId=yyy&taskId=zzz&apiUrl=...
```

Verificar en la consola del navegador (F12) los logs de Unity:
```
[ApiConfig] Configuracion cargada desde Query Params
[ApiConfig] ScenarioId: a74394ee-...
[ApiConfig] StudentId: fc711ce9-...
```

### 8.3 Verificar Build de Unity

```bash
# Verificar que todos los archivos existen
ls -la public/game/Build/
# Debe mostrar:
# - build.data.br
# - build.framework.js.br
# - build.wasm.br
# - build.loader.js
```

### 8.4 Probar URL Manualmente

Abrir directamente en el navegador:
```
http://localhost:5173/game/index.html?scenarioId=test&studentId=test&taskId=test&apiUrl=http://localhost:8082
```

---

## Resumen

La integracion React-Unity esta configurada de la siguiente manera:

1. **Build de Unity** se encuentra en `public/game/`
2. **GamePage** construye la URL con Query Parameters
3. **iframe** carga el juego pasando los parametros
4. **Unity** lee los parametros de `Application.absoluteURL`
5. **Backend** debe devolver `scenarioId` y configurar CORS

**No se requieren cambios adicionales en Unity** - el juego ya esta preparado para leer Query Parameters.

---

*Documento generado: Enero 2026*
*Proyecto: MarkenX Student UI*
