# 💊 Farma Santi — Frontend

> **Aplicación web pública de Farmacia Santi** — Plataforma de consulta de productos farmacéuticos, catálogo en línea y gestión de compras para clientes, desplegada en [farmaciasanti.net](https://farmaciasanti.net).

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Modelos de Datos](#-modelos-de-datos)
- [Servicios (API)](#-servicios-api)
- [Hooks Personalizados](#-hooks-personalizados)
- [Páginas y Componentes](#-páginas-y-componentes)
- [Enrutamiento](#-enrutamiento)
- [Autenticación](#-autenticación)
- [Variables de Entorno](#-variables-de-entorno)
- [Despliegue con Docker](#-despliegue-con-docker)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing](#-testing)

---

## 🏥 Descripción General

**Farma Santi Frontend** es una Single Page Application (SPA) desarrollada para **Farmacia Santi**, ubicada en **Tarija, Bolivia**. Permite a los clientes:

- 🔍 **Buscar productos** farmacéuticos por nombre con búsqueda en tiempo real (debounce).
- 📂 **Filtrar** por categoría, laboratorio y forma farmacéutica.
- 📄 **Ver detalle** completo de cada producto (fotos, principios activos, precios, stock).
- 🛒 **Consultar historial** de compras realizadas (Mis Compras).
- 🔐 **Autenticarse** via Google o Email/Contraseña (Firebase Authentication).

La aplicación consume la API REST del backend (`farma-santi_backend`) a través de un cliente Axios centralizado con autenticación JWT.

---

## 🛠 Stack Tecnológico

| Categoría          | Tecnología                        | Versión    |
| :----------------- | :-------------------------------- | :--------- |
| **Framework**      | React                             | 19.2       |
| **Lenguaje**       | TypeScript                        | 5.7        |
| **Bundler**        | Vite (SWC)                        | 6.2        |
| **Estilos**        | TailwindCSS                       | 4.1        |
| **UI Components**  | Radix UI (Dialog, Select, etc.)   | Varias     |
| **Iconos**         | Lucide React                      | 0.487      |
| **Routing**        | React Router                      | 7.9        |
| **HTTP Client**    | Axios                             | 1.9        |
| **Autenticación**  | Firebase Auth (Google + Email)    | 12.4       |
| **Validación**     | Zod                               | 3.24       |
| **Formularios**    | React Hook Form + Resolvers       | 5.0        |
| **SEO**            | React Helmet Async                | 2.0        |
| **Notificaciones** | Sonner                            | 2.0        |
| **PDF**            | jsPDF + jsPDF-AutoTable            | 3.0 / 5.0  |
| **Temas**          | next-themes                       | 0.4        |
| **Testing**        | Vitest                            | 3.2        |

---

## 🏗 Arquitectura del Proyecto

La aplicación sigue una arquitectura en **capas** bien definida:

```
┌─────────────────────────────────────────────────┐
│                  Páginas (UI)                    │
│     Main · Catálogo · Producto · Login · Compras │
├─────────────────────────────────────────────────┤
│              Hooks Personalizados                │
│       useQuery · useMutation · useDebounce       │
│                  useLogin                        │
├─────────────────────────────────────────────────┤
│               Capa de Servicios                  │
│  productoService · loginService · categoriaServ  │
│  laboratorioServ · misComprasServ · firebaseSrv  │
├─────────────────────────────────────────────────┤
│              Cliente HTTP (Axios)                 │
│   Interceptores JWT · Manejo de errores 401      │
├─────────────────────────────────────────────────┤
│                Modelos (TypeScript)               │
│   Producto · Venta · Categoria · Laboratorio     │
└─────────────────────────────────────────────────┘
```

### Flujo de datos

1. Las **páginas** invocan hooks (`useQuery`, `useMutation`) para obtener/mutar datos.
2. Los **hooks** delegan la llamada a funciones de los **servicios**.
3. Los **servicios** usan `apiClient` (Axios) configurado con `baseURL`, interceptores JWT y redirección automática en caso de `401 Unauthorized`.
4. Los **modelos** tipan las respuestas y requests con interfaces TypeScript.

---

## 📁 Estructura de Carpetas

```
farma-santi_frontend/
├── public/                     # Archivos estáticos (Logo.svg)
├── src/
│   ├── assets/                 # Imágenes y SVGs (logos, placeholder)
│   │   ├── Logo1.png
│   │   ├── Logo2.png
│   │   └── MedicamentoGenerico.svg
│   ├── hooks/                  # Hooks personalizados reutilizables
│   │   ├── generic.ts          # useQuery, useMutation
│   │   ├── useDebounce.tsx     # Hook de debounce genérico
│   │   └── useLogin.tsx        # useLoginWithGoogle, useLoginWithEmail
│   ├── models/                 # Interfaces TypeScript (contratos API)
│   │   ├── index.ts            # Barrel export
│   │   ├── categoria.ts        # Categoria
│   │   ├── laboratorio.ts      # LaboratorioInfo
│   │   ├── login.ts            # LoginRequest, FirebaseLogin, TokenResponse
│   │   ├── producto.ts         # ProductoDetail, ProductoInfo, y subtipos
│   │   └── venta.ts            # VentaInfo, VentaDetail, DetalleVentaDetail
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── Main/page.tsx       # Página principal (home)
│   │   ├── Catalogo/
│   │   │   ├── page.tsx        # Catálogo con filtros avanzados
│   │   │   └── components/
│   │   │       └── ProductoCard.tsx  # Tarjeta de producto reutilizable
│   │   ├── Producto/page.tsx   # Detalle de producto con galería
│   │   ├── Login/page.tsx      # Login/Registro (Google + Email)
│   │   ├── MisCompras/page.tsx # Historial de compras del cliente
│   │   └── components/         # Componentes compartidos de layout
│   │       ├── NavBar.tsx      # Barra de navegación con búsqueda
│   │       └── Footer.tsx      # Pie de página
│   ├── services/               # Capa de comunicación con la API
│   │   ├── axiosClient.ts      # Instancia Axios + interceptores
│   │   ├── productoService.ts  # CRUD de productos
│   │   ├── loginService.ts     # Autenticación (Google/Email)
│   │   ├── firebaseService.ts  # Configuración de Firebase
│   │   ├── categoriaService.ts # Listado de categorías
│   │   ├── laboratorioService.ts # Listado de laboratorios
│   │   ├── misComprasService.ts  # Historial de compras
│   │   ├── index.ts            # Barrel export
│   │   └── __tests__/          # Tests unitarios e integración
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Punto de entrada (HelmetProvider)
│   ├── routers.tsx             # Definición de rutas
│   ├── index.css               # Estilos globales TailwindCSS
│   └── style.css               # Estilos adicionales
├── Dockerfile                  # Imagen Docker (Nginx Alpine)
├── nginx.conf                  # Configuración Nginx (SPA fallback)
├── entrypoint.sh               # Inyección de variables de entorno en runtime
├── vite.config.ts              # Configuración de Vite
├── vitest.config.ts            # Configuración de Vitest
├── tsconfig.json               # TypeScript config (raíz)
├── tsconfig.app.json           # TypeScript config (aplicación)
├── tsconfig.node.json          # TypeScript config (Node/scripts)
├── eslint.config.js            # Configuración de ESLint
├── .env                        # Variables de entorno (producción)
├── .env.development            # Variables de entorno (desarrollo)
└── package.json
```

---

## 📦 Modelos de Datos

### `ProductoDetail` / `ProductoInfo`
Representan los datos completos y resumidos de un producto farmacéutico.

| Campo                | Tipo                        | Descripción                          |
| :------------------- | :-------------------------- | :----------------------------------- |
| `id`                 | `string`                    | UUID del producto                    |
| `nombreComercial`    | `string`                    | Nombre comercial del medicamento     |
| `formaFarmaceutica`  | `FormaFarmacetica \| string` | Forma farmacéutica (tableta, jarabe) |
| `laboratorio`        | `LaboratorioSimple \| string` | Laboratorio fabricante             |
| `precioCompra`       | `number`                    | Precio de compra (Bs)                |
| `precioVenta`        | `number`                    | Precio de venta al público (Bs)      |
| `stock`              | `number`                    | Unidades disponibles                 |
| `stockMin`           | `number`                    | Stock mínimo (alerta)                |
| `urlFotos`           | `string[]`                  | URLs de las imágenes del producto    |
| `estado`             | `string`                    | Estado (activo/inactivo)             |
| `categorias`         | `CategoriaSimple[]`         | Categorías asignadas                 |
| `principiosActivos`  | `ProductoPrincipioActivo[]` | Principios activos y concentraciones |

### `VentaInfo` / `VentaDetail`
Representan ventas realizadas con sus detalles y lotes.

| Campo      | Tipo                   | Descripción                      |
| :--------- | :--------------------- | :------------------------------- |
| `id`       | `number`               | ID de la venta                   |
| `codigo`   | `string`               | Código de referencia             |
| `usuario`  | `UsuarioSimple`        | Usuario que realizó la venta     |
| `cliente`  | `ClienteSimple`        | Datos del cliente (NIT/CI, etc.) |
| `fecha`    | `Date`                 | Fecha de la venta                |
| `total`    | `number`               | Monto total en Bs                |
| `detalles` | `DetalleVentaDetail[]` | Productos vendidos con lotes     |

### Otros modelos
- **`Categoria`** — `id`, `nombre`, `estado`, `createdAt`, `deletedAt`
- **`LaboratorioInfo`** — `id`, `nombre`, `estado`, `direccion`, `createdAt`, `deletedAt`
- **`LoginRequest`** — `email`, `password`
- **`FirebaseLogin`** — `token` (token de Firebase)
- **`TokenReponse`** — `token` (JWT del backend)

---

## 🌐 Servicios (API)

Todos los servicios utilizan `apiClient` (`src/services/axiosClient.ts`), un cliente Axios configurado con:

- **Base URL**: `{VITE_API_URL}/api/shared`
- **Interceptor de Request**: Adjunta automáticamente el token JWT desde `localStorage`.
- **Interceptor de Response**: Redirige a `/login` cuando recibe un `401 Unauthorized`.
- **Utilidad `parseAxiosError`**: Extrae mensajes de error legibles del backend.

### Endpoints consumidos

| Servicio                | Función                            | Método | Endpoint                          |
| :---------------------- | :--------------------------------- | :----- | :-------------------------------- |
| **productoService**     | `obtenerListaProductos(filtro?)`   | GET    | `/productos?{filtro}`             |
|                         | `obtenerProductoById(id)`          | GET    | `/productos/{id}`                 |
|                         | `obtenerListaFormasFarmaceuticas()`| GET    | `/productos/formas-farmaceuticas` |
|                         | `obtenerListaUnidadesMedidas()`    | GET    | `/productos/unidades-medida`      |
| **categoriaService**    | `obtenerListaCategorias()`         | GET    | `/categorias`                     |
| **laboratorioService**  | `obtenerListaLaboratorios()`       | GET    | `/laboratorios`                   |
| **loginService**        | `loginWithGoogle(credential)`      | POST   | `/auth/google/login`              |
|                         | `loginWithEmail(credential)`       | POST   | `/auth/email/login`               |
|                         | `registerWithEmail(credential)`    | POST   | `/auth/email/register`            |
| **misComprasService**   | `obtenerListaMisCompras()`         | GET    | `/mis-compras`                    |
|                         | `obtenerCompraById(id)`            | GET    | `/mis-compras/{id}`               |

---

## 🪝 Hooks Personalizados

### `useQuery<TData, TParams>`
Hook genérico para **consultas de lectura**. Encapsula el ciclo de loading/data/error.

```typescript
const { fetch, data, loading, error } = useQuery(obtenerListaProductos);
```

**Retorna**: `{ fetch, data, loading, error }`

### `useMutation<TData, TParams>`
Hook genérico para **operaciones de escritura** (login, registro, etc.).

```typescript
const { mutate, data, loading, error } = useMutation(loginWithGoogle);
```

**Retorna**: `{ mutate, data, loading, error }`

### `useDebounce<T>(value, delay)`
Retrasa la actualización de un valor hasta que el usuario deje de escribir, evitando llamadas excesivas a la API.

```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
```

### `useLoginWithGoogle()` / `useLoginWithEmail()`
Wrappers que combinan `useMutation` con los servicios de autenticación.

---

## 📄 Páginas y Componentes

### Páginas

| Página             | Ruta                    | Descripción                                                                                     |
| :----------------- | :---------------------- | :---------------------------------------------------------------------------------------------- |
| **Main**           | `/`                     | Página principal con búsqueda, categorías destacadas y grid de productos. SEO dinámico.          |
| **Catálogo**       | `/catalogo`             | Catálogo completo con filtros por categoría, laboratorio y forma farmacéutica. Schema.org JSON-LD. |
| **Producto**       | `/productos/:productoId`| Detalle de producto con galería de imágenes (modal, navegación por teclado), principios activos.  |
| **Login**          | `/login`                | Inicio de sesión / Registro con Google, Email/Contraseña, y acceso como invitado.                |
| **Mis Compras**    | `/mis-compras`          | Historial de compras del cliente autenticado con estados visuales.                               |

### Componentes Compartidos

| Componente        | Descripción                                                                          |
| :---------------- | :----------------------------------------------------------------------------------- |
| **NavBar**        | Barra de navegación responsiva con logo, búsqueda integrada, menú hamburguesa y botón de logout/login. |
| **Footer**        | Pie de página con copyright dinámico `© {año} Farmacia Santi - Tarija, Bolivia`.    |
| **ProductoCard**  | Tarjeta de producto reutilizable con imagen, badge de stock, precio y animaciones hover.             |

---

## 🗺 Enrutamiento

Definido en `src/routers.tsx` usando **React Router v7** con `BrowserRouter`:

```
/                          → Main (Página principal)
/login                     → Login (Autenticación)
/catalogo                  → Catálogo (Lista de productos)
/productos/:productoId     → ProductoDetalle (Detalle del producto)
/mis-compras               → MisCompras (Historial de compras)
*                          → Ruta por defecto (catch-all)
```

---

## 🔐 Autenticación

El sistema de autenticación combina **Firebase Authentication** (frontend) con un **backend JWT**:

```
┌──────────┐    Firebase Auth     ┌──────────────┐
│  Cliente  │ ──────────────────→ │   Firebase    │
│  (SPA)   │ ←── token Firebase ──│   (Google/    │
│          │                      │    Email)     │
│          │    POST /auth/...    └──────────────┘
│          │ ──── { token } ────→ ┌──────────────┐
│          │ ←── { jwt } ────────│   Backend     │
│          │                      │   API         │
└──────────┘                      └──────────────┘
```

1. El usuario se autentica con Firebase (Google OAuth o Email/Contraseña).
2. Se envía el token de Firebase al backend (`/auth/google/login` o `/auth/email/login`).
3. El backend valida el token y devuelve un **JWT propio**.
4. El JWT se almacena en `localStorage` y se adjunta automáticamente en cada request via interceptor Axios.
5. Si el backend responde `401`, se redirige al usuario a `/login`.

**Funcionalidades disponibles:**
- Inicio de sesión con Google
- Inicio de sesión con Email/Contraseña
- Registro con Email/Contraseña
- Recuperación de contraseña (vía Firebase `sendPasswordResetEmail`)
- Verificación de email (vía Firebase `sendEmailVerification`)
- Acceso como invitado (sin autenticación)

---

## ⚙️ Variables de Entorno

El proyecto utiliza dos archivos de configuración de entorno:

| Archivo             | Propósito                                  |
| :------------------ | :----------------------------------------- |
| `.env.development`  | Desarrollo local (`http://localhost:8890`)  |
| `.env`              | Producción (`https://backend.example.com`) |

### Variables requeridas

| Variable                            | Descripción                        |
| :---------------------------------- | :--------------------------------- |
| `VITE_API_URL`                      | URL base de la API backend         |
| `VITE_FIREBASE_API_KEY`             | API Key de Firebase                |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Dominio de autenticación Firebase  |
| `VITE_FIREBASE_PROJECT_ID`          | ID del proyecto Firebase           |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Bucket de almacenamiento Firebase  |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID para Cloud Messaging    |
| `VITE_FIREBASE_APP_ID`              | ID de la aplicación Firebase       |
| `VITE_FIREBASE_MEASUREMENT_ID`      | ID de Google Analytics             |

> **Nota**: En producción (Docker), las variables se inyectan en runtime vía `entrypoint.sh` generando el archivo `window.ENV` en `env-config.js`. Esto permite cambiar la configuración sin necesidad de reconstruir la imagen.

---

## 🐳 Despliegue con Docker

### Arquitectura de despliegue

```
┌────────────────────────────────────────────┐
│          Contenedor Docker                  │
│                                             │
│  entrypoint.sh                              │
│  ├── Genera env-config.js (window.ENV)      │
│  └── Inicia Nginx                           │
│                                             │
│  Nginx Alpine (puerto 80)                   │
│  ├── Sirve /usr/share/nginx/html (dist/)    │
│  └── SPA fallback: try_files → index.html   │
│                                             │
└────────────────────────────────────────────┘
```

### Construcción y ejecución

```bash
# 1. Compilar la aplicación
npm run build

# 2. Construir la imagen Docker
docker build -t farma-santi-frontend .

# 3. Ejecutar con variables de entorno
docker run -d \
  -p 80:80 \
  -e VITE_API_URL=https://backend.farmaciasanti.net \
  -e VITE_FIREBASE_API_KEY=tu-api-key \
  -e VITE_FIREBASE_AUTH_DOMAIN=tu-dominio.firebaseapp.com \
  -e VITE_FIREBASE_PROJECT_ID=tu-proyecto \
  -e VITE_FIREBASE_STORAGE_BUCKET=tu-bucket \
  -e VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id \
  -e VITE_FIREBASE_APP_ID=tu-app-id \
  -e VITE_FIREBASE_MEASUREMENT_ID=tu-measurement-id \
  farma-santi-frontend
```

### Nginx

La configuración (`nginx.conf`) implementa el patrón **SPA fallback**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
Esto asegura que todas las rutas del frontend (ej. `/catalogo`, `/productos/123`) sean manejadas por React Router.

---

## 📜 Scripts Disponibles

| Comando          | Descripción                                           |
| :--------------- | :---------------------------------------------------- |
| `npm run dev`    | Inicia el servidor de desarrollo (puerto **5178**)    |
| `npm run build`  | Compila TypeScript y genera build de producción       |
| `npm run preview`| Previsualiza el build de producción                   |
| `npm run lint`   | Ejecuta ESLint sobre todo el proyecto                 |
| `npm run test`   | Ejecuta los tests con Vitest                          |

### Inicio rápido (desarrollo)

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd farma-santi_frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5178`.

---

## 🧪 Testing

El proyecto usa **Vitest** como framework de testing. Los tests se encuentran en:

```
src/services/__tests__/
├── productosService.test.ts       # Test de integración (API real)
└── productosService.unit.test.ts  # Tests unitarios (mock de Axios)
```

### Ejecución

```bash
npm run test
```

### Ejemplo de test de integración

```typescript
describe('obtenerListaProductos - prueba de integración', () => {
  it('debe devolver un array real desde la API con productos válidos', async () => {
    const result = await obtenerListaProductos();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('nombreComercial');
  });
});
```

