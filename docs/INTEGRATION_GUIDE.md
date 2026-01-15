# Guía de Integración Backend - Portal Estudiante 🔗

Esta guía detalla cómo conectar el frontend React (Estudiante) con la API Spring Boot y Keycloak.

---

## 1. Activación del Modo Real

El frontend tiene una arquitectura de "Servicios". Para dejar de usar los datos simulados (Mocks) y comenzar a consumir la API:

1.  Abrir el archivo `.env` en la raíz del proyecto.
2.  Cambiar la variable `VITE_USE_MOCK` a `false`.
3.  Verificar que las URLs apunten al entorno local:

```ini
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8080/api
VITE_KEYCLOAK_URL=http://localhost:8080/realms/markenx/protocol/openid-connect/token
VITE_KEYCLOAK_CLIENT_ID=markenx-student-client