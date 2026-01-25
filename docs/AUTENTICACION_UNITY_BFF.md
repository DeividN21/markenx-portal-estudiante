# Autenticacion Unity WebGL con BFF (Backend For Frontend)

Este documento explica el problema de autenticacion entre Unity WebGL y el BFF, las opciones de solucion, y como debuggear los requests del videojuego.

---

## Indice

1. [Problema Actual](#1-problema-actual)
2. [Como Funciona la Autenticacion en React](#2-como-funciona-la-autenticacion-en-react)
3. [Por Que Unity No Puede Autenticarse](#3-por-que-unity-no-puede-autenticarse)
4. [Opciones de Solucion](#4-opciones-de-solucion)
5. [Opcion Recomendada: Token Temporal](#5-opcion-recomendada-token-temporal)
6. [Como Debuggear Requests del Videojuego](#6-como-debuggear-requests-del-videojuego)
7. [Implementacion Paso a Paso](#7-implementacion-paso-a-paso)

---

## 1. Problema Actual

```
+------------------+                      +------------------+
|   React App      |  Cookie JSESSIONID   |      BFF         |
|   (Navegador)    | <------------------> |  (Spring Boot)   |
+------------------+                      +------------------+
        |                                          |
        | iframe                                   |
        v                                          |
+------------------+         ???          +--------+
|   Unity WebGL    | -------------------> |
|   (iframe)       |   Sin autenticacion  |
+------------------+                      +------------------+
```

**El problema**: Unity WebGL corre en un iframe y hace requests HTTP usando `UnityWebRequest`. Estos requests **no incluyen automaticamente** la cookie de sesion `JSESSIONID` que el BFF espera.

**Resultado**: Los endpoints protegidos devuelven `401 Unauthorized` o `403 Forbidden`.

---

## 2. Como Funciona la Autenticacion en React

El proyecto usa el patron **BFF (Backend For Frontend)** con sesiones:

```
1. Usuario accede a React App
           |
           v
2. React llama GET /auth/me
           |
           v
3. BFF verifica cookie JSESSIONID
           |
           +-- No existe? --> Redirige a Keycloak login
           |
           +-- Existe? --> Retorna info del usuario
           |
           v
4. React guarda info en SessionContext
```

### Endpoints de Autenticacion

| Endpoint | Metodo | Descripcion | Autenticacion |
|----------|--------|-------------|---------------|
| `/auth/me` | GET | Info del usuario actual | Cookie JSESSIONID |
| `/auth/login` | GET | Inicia flujo OAuth/Keycloak | Redirect |
| `/auth/logout` | POST | Cierra sesion | Cookie + Redirect |
| `/students/me` | GET | Perfil del estudiante | Cookie JSESSIONID |

### Que Envia React al BFF

```typescript
// apiClient.ts
const response = await fetch(url, {
  ...options,
  headers,
  credentials: 'include',  // <-- ENVIA COOKIES AUTOMATICAMENTE
});
```

La clave es `credentials: 'include'` que hace que el navegador envie:
- Cookie `JSESSIONID` (sesion del BFF)
- Otras cookies del dominio

---

## 3. Por Que Unity No Puede Autenticarse

### Razones Tecnicas

1. **UnityWebRequest no envia cookies por defecto**
   - Unity usa `UnityWebRequest` para HTTP
   - En WebGL, esto se traduce a `XMLHttpRequest`
   - Por defecto no incluye `credentials: 'include'`

2. **Same-Origin Policy**
   - El iframe esta en `/game/index.html`
   - Las cookies tienen restricciones de SameSite
   - Navegadores modernos bloquean cookies cross-origin

3. **Cookie SameSite**
   - Si la cookie tiene `SameSite=Strict` o `SameSite=Lax`
   - No se envia en requests desde iframes en algunos casos

### Verificar el Problema

En la consola del navegador (F12):
```javascript
// Ver cookies actuales
document.cookie
// Si ves JSESSIONID, la cookie existe
// Pero Unity puede no enviarla
```

---

## 4. Opciones de Solucion

### Opcion A: Token Temporal via Query Params (RECOMENDADA)

```
React obtiene token temporal del BFF
          |
          v
React pasa token a Unity via Query Params
          |
          v
Unity envia token en header Authorization
```

**Ventajas**:
- No requiere configuracion de cookies complejas
- Funciona en todos los navegadores
- Token tiene expiracion corta (seguro)

**Desventajas**:
- Requiere endpoint nuevo en BFF
- Token visible en URL (mitigable con expiracion corta)

---

### Opcion B: Configurar Cookies para iframe

Modificar el BFF para que las cookies funcionen en iframe:

```java
// Spring Boot - application.yml
server:
  servlet:
    session:
      cookie:
        same-site: none  # Permite cross-origin
        secure: true     # Requiere HTTPS
```

**Ventajas**:
- No requiere cambios en Unity
- Usa el mismo mecanismo que React

**Desventajas**:
- Requiere HTTPS en desarrollo
- Puede no funcionar en todos los navegadores
- Configuracion de seguridad mas compleja

---

### Opcion C: Proxy en el Frontend

Configurar Vite para hacer proxy de los requests de Unity:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/game-api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/game-api/, '/api/v1'),
      },
    },
  },
});
```

Unity llamaria a `/game-api/scenarios/xxx` y Vite lo redirige.

**Ventajas**:
- Mismo origen, cookies funcionan
- No requiere token adicional

**Desventajas**:
- Solo funciona en desarrollo
- Produccion requiere configuracion de nginx/servidor

---

### Opcion D: Comunicacion postMessage React <-> Unity

React escucha requests de Unity y los ejecuta:

```javascript
// React escucha
window.addEventListener('message', async (event) => {
  if (event.data.type === 'API_REQUEST') {
    const response = await apiClient.request(event.data.endpoint);
    iframe.contentWindow.postMessage({ type: 'API_RESPONSE', data: response });
  }
});
```

**Ventajas**:
- Maximo control
- Usa la sesion existente de React

**Desventajas**:
- Requiere modificaciones en Unity
- Comunicacion mas compleja
- Latencia adicional

---

## 5. Opcion Recomendada: Token Temporal

### Flujo Propuesto

```
1. Usuario inicia juego en React
           |
           v
2. React llama POST /auth/game-token
           |
           v
3. BFF genera token JWT temporal (5-10 min)
   - Incluye: studentId, roles, expiracion
   - Firmado con secret del servidor
           |
           v
4. React recibe token y lo pasa a Unity via Query Params
   /game/index.html?...&gameToken=eyJhbG...
           |
           v
5. Unity extrae gameToken de la URL
           |
           v
6. Unity incluye token en cada request:
   Header: Authorization: Bearer eyJhbG...
           |
           v
7. BFF valida token y procesa request
```

### Implementacion en Backend (Spring Boot)

```java
// GameTokenController.java
@RestController
@RequestMapping("/api/v1/auth")
public class GameTokenController {

    @Autowired
    private JwtService jwtService;

    /**
     * Genera un token temporal para el juego Unity.
     * Solo accesible si el usuario ya tiene sesion valida.
     */
    @PostMapping("/game-token")
    public ResponseEntity<GameTokenResponse> generateGameToken(
            @AuthenticationPrincipal UserDetails user) {

        // Token con expiracion corta (10 minutos)
        String token = jwtService.generateToken(
            user.getUsername(),
            Duration.ofMinutes(10)
        );

        return ResponseEntity.ok(new GameTokenResponse(token));
    }
}

// GameTokenResponse.java
public record GameTokenResponse(String token) {}
```

### Implementacion en React

```typescript
// src/services/gameTokenService.ts
export const gameTokenService = {
  /**
   * Obtiene un token temporal para el juego Unity.
   */
  getGameToken: async (): Promise<string> => {
    const response = await apiClient.request<{ token: string }>(
      '/auth/game-token',
      { method: 'POST' }
    );
    return response.token;
  },
};
```

### Modificacion en GamePage.tsx

```typescript
// GamePage.tsx
import { gameTokenService } from '../services/gameTokenService';

// Dentro del componente:
const [gameToken, setGameToken] = useState<string | null>(null);

useEffect(() => {
  const fetchToken = async () => {
    try {
      const token = await gameTokenService.getGameToken();
      setGameToken(token);
    } catch (err) {
      console.error('Error obteniendo game token:', err);
      setError('No se pudo obtener autorizacion para el juego');
    }
  };
  fetchToken();
}, []);

// En la construccion de URL:
const gameUrl = useMemo(() => {
  if (!taskId || !user?.id || !gameToken) return null;

  const params = new URLSearchParams();
  params.set('scenarioId', task?.scenarioId || taskId);
  params.set('studentId', user.id);
  params.set('taskId', taskId);
  params.set('apiUrl', env.API_BASE_URL.replace('/api/v1', ''));
  params.set('gameToken', gameToken);  // <-- NUEVO

  return `${env.GAME_URL}?${params.toString()}`;
}, [taskId, user?.id, task?.scenarioId, gameToken]);
```

### Modificacion en Unity (C#)

```csharp
// ApiConfig.cs - Agregar campo para token
private string _gameToken;
public string GameToken => _gameToken;

// En LoadFromQueryParams()
_gameToken = GetQueryParam(url, "gameToken");

// BaseApiService.cs - Agregar header en cada request
protected IEnumerator SendRequest<T>(string endpoint, ...) {
    using (UnityWebRequest request = ...) {

        // Agregar header de autorizacion si hay token
        if (!string.IsNullOrEmpty(ApiConfig.Instance.GameToken)) {
            request.SetRequestHeader(
                "Authorization",
                $"Bearer {ApiConfig.Instance.GameToken}"
            );
        }

        yield return request.SendWebRequest();
        // ...
    }
}
```

---

## 6. Como Debuggear Requests del Videojuego

### Pregunta: Puedo ver los requests del iframe en Network?

**Respuesta corta**: SI, pero depende del navegador y configuracion.

### Metodo 1: DevTools del Navegador Principal

1. Abre DevTools (F12)
2. Ve a la pestana **Network**
3. Los requests del iframe **SI aparecen** si:
   - El iframe esta en el **mismo origen** (mismo dominio/puerto)
   - El navegador no lo bloquea

**En tu caso**: Como el juego esta en `/game/index.html` (mismo origen), los requests **SI deberan aparecer** en Network.

### Metodo 2: Filtrar Requests del Juego

En la pestana Network, usa el filtro:

```
# Filtrar por dominio de la API
localhost:8082

# O filtrar por tipo
XHR

# O buscar endpoints especificos
scenarios
attempts
```

### Metodo 3: Inspeccionar el iframe Directamente

1. En DevTools, ve a **Elements**
2. Busca el `<iframe>`
3. Click derecho > **Inspect frame** (en algunos navegadores)
4. Esto abre DevTools del iframe

### Metodo 4: Consola del iframe

```javascript
// En la consola del navegador principal:
// Obtener referencia al iframe
const iframe = document.querySelector('iframe');

// Acceder a la consola del iframe (mismo origen)
iframe.contentWindow.console.log('Hola desde React');

// Ver errores del iframe
iframe.contentWindow.onerror = (msg, url, line) => {
  console.error('Error en iframe:', msg, url, line);
};
```

### Metodo 5: Unity Debug Logs

Unity imprime logs a la consola del navegador. Busca:

```
[ApiConfig] Configuracion cargada desde Query Params
[ScenarioApiService] GET /scenarios/xxx - Status: 200
[ScenarioApiService] GET /scenarios/xxx - Status: 401  <-- ERROR!
```

### Que Buscar en Network

| Request | Esperado | Problema |
|---------|----------|----------|
| `GET /scenarios/{id}` | 200 OK | 401 = Sin autenticacion |
| `POST /attempts` | 201 Created | 403 = Sin permisos |

### Headers a Verificar

En cada request del juego, verifica:

```
Request Headers:
  Authorization: Bearer eyJhbG...  <-- Debe existir si usas token
  Cookie: JSESSIONID=xxx           <-- Debe existir si usas cookies
  Origin: http://localhost:5173

Response Headers:
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Credentials: true
```

---

## 7. Implementacion Paso a Paso

### Paso 1: Crear endpoint en BFF (Backend)

```java
// POST /api/v1/auth/game-token
// Retorna: { "token": "eyJhbG..." }
```

### Paso 2: Crear servicio en React

```typescript
// src/services/gameTokenService.ts
export const gameTokenService = {
  getGameToken: async (): Promise<string> => {
    const response = await apiClient.request<{ token: string }>(
      '/auth/game-token',
      { method: 'POST' }
    );
    return response.token;
  },
};
```

### Paso 3: Modificar GamePage.tsx

```typescript
// Agregar estado para token
const [gameToken, setGameToken] = useState<string | null>(null);

// Obtener token al cargar
useEffect(() => {
  gameTokenService.getGameToken()
    .then(setGameToken)
    .catch(console.error);
}, []);

// Agregar a Query Params
params.set('gameToken', gameToken);
```

### Paso 4: Modificar Unity

```csharp
// Leer token de URL
_gameToken = GetQueryParam(url, "gameToken");

// Agregar header en requests
request.SetRequestHeader("Authorization", $"Bearer {_gameToken}");
```

### Paso 5: Validar token en BFF

```java
// Crear filtro que valide JWT en header Authorization
// Permitir tanto Cookie como Bearer token
```

---

## Resumen

| Aspecto | Detalle |
|---------|---------|
| **Problema** | Unity no envia cookie JSESSIONID |
| **Solucion** | Token temporal via Query Params |
| **Debug** | DevTools > Network (requests del iframe aparecen) |
| **Headers** | `Authorization: Bearer <token>` |
| **Expiracion** | Token de 10 minutos |

### Checklist de Implementacion

- [ ] Backend: Crear endpoint `POST /auth/game-token`
- [ ] Backend: Validar JWT en header Authorization (ademas de cookies)
- [x] React: Crear `gameTokenService.ts` - **IMPLEMENTADO**
- [x] React: Crear DTO `gameToken.dto.ts` - **IMPLEMENTADO**
- [x] React: Modificar `GamePage.tsx` para obtener y pasar token - **IMPLEMENTADO**
- [ ] Unity: Leer `gameToken` de Query Params
- [ ] Unity: Agregar header `Authorization` en requests
- [ ] Verificar en Network que requests llevan el header

### Archivos Creados/Modificados en React

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `src/api/dtos/gameToken.dto.ts` | NUEVO | DTO para respuesta del token |
| `src/services/gameTokenService.ts` | NUEVO | Servicio para obtener token |
| `src/pages/GamePage.tsx` | MODIFICADO | Obtiene y pasa token a Unity |

---

*Documento generado: Enero 2026*
*Proyecto: MarkenX Student UI*
