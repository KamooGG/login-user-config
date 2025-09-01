# Prueba Técnica – Frontend JWT (Next.js + Sass)

Aplicación **Next.js (App Router) + React + TypeScript** que consume APIs REST autenticadas con **JWT** para:

- **Login**
- **Ver perfil (solo lectura)**
- **Editar perfil (formulario precargado)**
- **Subir/actualizar foto de perfil**

Incluye **Sass** para estilos estandarizados, **sonner** para toasts y **lucide-react** para iconos.

---

## Tabla de contenidos
- [Características](#características)
- [Stack](#stack)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Flujo de autenticación](#flujo-de-autenticación)
- [Endpoints usados](#endpoints-usados)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Seguridad](#seguridad)
- [Licencia](#licencia)

---

## Características

- **Autenticación JWT**
  - `POST /login/` guarda `access_token` y `refresh_token` en `localStorage`.
  - Interceptor de Axios añade `Authorization: Bearer <token>` a las peticiones protegidas.
  - Si la API responde **401**, se limpian tokens y se redirige a **/login**.

- **Rutas**
  - `/login`: formulario minimalista; el botón **Entrar** solo aparece si usuario y contraseña tienen contenido. En esta ruta **no** se muestra el navbar.
  - `/` (**Perfil**): consume `GET /perfil/` y muestra un resumen (foto, nombre, correo, biografía, redes con iconos, etc.).
  - `/editar`: formulario **precargado** con datos de `GET /perfil/` y **uploader** de foto.

- **UI/UX**
  - Tipografía, listas y controles estandarizados en `globals.scss`.
  - Toasts de éxito/error con **sonner**.
  - Iconos de redes con **lucide-react**.

---

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Axios** (interceptores de auth)
- **Sass** (estilos globales)
- **sonner** (toasts)
- **lucide-react** (iconos)

---

## Requisitos

- **Node.js 18+** (recomendado 20/22)
- **npm** (o pnpm/yarn)

---

## Instalación y ejecución

### 1) Instalar dependencias
```bash
npm install
```

### 2) Variables de entorno
Crea **`.env.local`** en la raíz con la URL base de la API:
```bash
NEXT_PUBLIC_API_BASE=http://46.202.88.87:8010/usuarios/api
```
> Ajusta host/puerto si apuntas a otra instancia.

### 3) Desarrollo
```bash
npm run dev
```
- Si el `package.json` usa `next dev -p 5173`, abre: **http://localhost:5173**
- Si no, Next usará **http://localhost:3000**

### 4) Producción
```bash
npm run build
npm start           # por defecto puerto 3000
# o
npm start -- -p 5173
```

---

## Flujo de autenticación

1. **Login** (`/login`):
   - `POST /login/` → `{ status, message, data: { access, refresh, ... } }`
   - Guarda `access_token` y `refresh_token` en `localStorage`.

2. **Solicitudes protegidas**:
   - Interceptor de Axios añade `Authorization: Bearer <access>`.

3. **Sesión inválida (401)**:
   - Limpia tokens y redirige a `/login`.

---

## Endpoints usados

> La base viene de `NEXT_PUBLIC_API_BASE`. Los paths finales quedan así:

- **POST** `${API_BASE}/login/`  
  **Body**:
  ```json
  { "username": "…", "password": "…" }
  ```
  **Success**:
  ```json
  {
    "status": "success",
    "message": "Inicio de sesión exitoso",
    "data": {
      "access": "…",
      "refresh": "…",
      "requires_2fa": false,
      "rol": "instructor",
      "user_id": 8
    }
  }
  ```
  **Error**:
  ```json
  { "status": "error", "message": "Credenciales inválidas", "data": null }
  ```

- **GET** `${API_BASE}/perfil/`  
  Devuelve el JSON para renderizar Perfil y **precargar** el formulario de Edición.

- **PUT** `${API_BASE}/usuario/perfil/`  
  **Body (ejemplo)**:
  ```json
  {
    "user": { "first_name": "Carlos", "last_name": "Moreno" },
    "telefono": "12345",
    "tipo_usuario": "instructor",
    "biografia": "Prueba de carga en bio",
    "documento": "123456789",
    "linkedin": "https://...",
    "twitter": "https://...",
    "github": "https://...",
    "sitio_web": "https://...",
    "esta_verificado": "false"
  }
  ```
  > **Nota:** **no** se envía `tipo_naturaleza`.

- **PATCH** `${API_BASE}/perfil/foto/`  
  **FormData** (`multipart/form-data`):
  - `foto: File`

---

## Estructura del proyecto

```
src/
  app/
    page.tsx            # Perfil (solo lectura)
    editar/page.tsx     # Editar (form precargado + uploader)
    login/page.tsx      # Login (sin navbar ni botones extra)
    globals.scss        # Estilos globales (Sass)
  components/
    Navbar.tsx
    ProfileCard.tsx
    PhotoUploader.tsx
  lib/
    api.ts              # Axios + interceptores + helpers
  store/
    auth.ts             # (si aplica) estado simple de auth
```

---

## Decisiones de diseño

- **Simplicidad**: componentes funcionales + App Router, sin sobre-ingeniería.
- **Sass global**: escala tipográfica, listas y controles unificados.
- **Login claro**: botón **Entrar** sólo aparece con campos llenos; sin navbar en `/login`.
- **Errores útiles**: se muestran `message` y, si vienen, errores de campo del backend (`data`).

---

## Scripts

```bash
npm run dev     # desarrollo
npm run build   # build producción
npm start       # servir build (por defecto 3000; usa -p para otro puerto)
```

---

## Troubleshooting

- **CORS/timeout**: verifica `NEXT_PUBLIC_API_BASE` y disponibilidad del backend.
- **No se ven cambios**:
  ```bash
  # Windows
  Ctrl + C
  rd /s /q .next
  npm run dev
  ```
- **Tokens “atascados”**: limpia `localStorage` o usa el botón **Salir**.

---

## Seguridad

Para la prueba se usan `localStorage` y JWT por simplicidad.  
En producción, preferir **cookies httpOnly**, **CSRF** y rotación de tokens.

---

## Licencia

Uso interno para la evaluación de la prueba técnica.
