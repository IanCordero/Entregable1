# TaskFlow

Aplicación web full-stack para crear, organizar, completar, editar y eliminar tareas personales. El frontend utiliza **React + TypeScript**, la API está construida con **Express** y los datos se guardan en **Supabase/PostgreSQL**.

## Funcionalidades

- Crear tareas con título, descripción y prioridad.
- Ver la lista completa de tareas.
- Filtrar por pendientes o completadas.
- Marcar una tarea como completada o devolverla a pendientes.
- Editar y eliminar tareas.
- Ver el progreso general.
- Estados visibles de carga, error y éxito.
- Diseño adaptable para computadora y celular.
- API REST con endpoints GET, POST, PUT y DELETE.

## Tecnologías

- Frontend: React, TypeScript, Vite y Axios.
- Backend: Node.js y Express.
- Base de datos: Supabase (PostgreSQL).
- Despliegue: Vercel para frontend y API.

## Estructura

```text
TaskFlow-FullStack/
├── frontend/           # Interfaz React + TypeScript
├── backend/            # API REST Express
├── supabase/schema.sql # Tabla y configuración SQL
└── README.md
```

## 1. Preparar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard).
2. Abre **SQL Editor** y selecciona **New query**.
3. Copia todo el contenido de `supabase/schema.sql`.
4. Presiona **Run**. Esto crea la tabla `tasks`.
5. En **Project Settings → API Keys**, copia:
   - `Project URL`.
   - Una `Secret key` (`sb_secret_...`). Si tu proyecto todavía utiliza claves anteriores, puedes usar temporalmente `service_role`.

La clave secreta nunca debe incluirse en el frontend, en GitHub ni en capturas públicas.

## 2. Instalación local

Desde la carpeta principal:

```bash
npm install
```

Crea `backend/.env` a partir de `backend/.env.example`:

```env
PORT=3001
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_TU_CLAVE_SECRETA
FRONTEND_URL=http://localhost:5173
```

Crea `frontend/.env` a partir de `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3001/api
```

En dos terminales ejecuta:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Abre `http://localhost:5173`.

## 3. Endpoints de la API

| Método | Endpoint | Acción |
| --- | --- | --- |
| GET | `/api/health` | Verificar la API |
| GET | `/api/tasks` | Listar tareas |
| POST | `/api/tasks` | Crear una tarea |
| PUT | `/api/tasks/:id` | Editar o completar una tarea |
| DELETE | `/api/tasks/:id` | Eliminar una tarea |

Ejemplo de creación:

```json
{
  "title": "Terminar la presentación",
  "description": "Preparar las diapositivas para la clase",
  "priority": "high"
}
```

## 4. Subir el proyecto a GitHub

1. Crea un repositorio vacío llamado `taskflow-fullstack`.
2. Ejecuta desde la carpeta principal:

```bash
git init
git add .
git commit -m "chore: estructura inicial del proyecto"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

3. En GitHub abre **Settings → Branches → Add branch protection rule**.
4. Escribe `main` y activa **Require a pull request before merging**.
5. Para evidenciar el flujo por funcionalidades, crea ramas como:

```bash
git checkout -b feature/task-interface
git checkout -b feature/supabase-api
git checkout -b feature/vercel-deploy
```

## 5. Desplegar la API en Vercel

1. En Vercel selecciona **Add New → Project** e importa el repositorio.
2. En **Root Directory**, selecciona `backend`.
3. Agrega estas variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `FRONTEND_URL` (por ahora puede quedar vacía y actualizarse después).
4. Presiona **Deploy**.
5. Comprueba `https://TU-BACKEND.vercel.app/api/health`.

## 6. Desplegar el frontend en Vercel

1. Crea un segundo proyecto de Vercel desde el mismo repositorio.
2. En **Root Directory**, selecciona `frontend`.
3. Vercel detectará Vite. Verifica:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Agrega:

```env
VITE_API_URL=https://TU-BACKEND.vercel.app/api
```

5. Despliega el frontend.
6. Copia su URL pública.

## 7. Conectar las dos URL

Regresa al proyecto del backend en Vercel y establece:

```env
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

Después selecciona **Redeploy** en el backend. Si deseas permitir también un dominio de vista previa, separa las URL con comas.

## Verificaciones antes de entregar

```bash
npm run typecheck
npm run build
```

Prueba en la URL pública: crear, completar, editar, eliminar y recargar la página. Las tareas deben mantenerse porque se guardan en Supabase.

## Guion breve para la demostración

1. Presentar TaskFlow y las tecnologías utilizadas.
2. Crear una tarea y mostrar que aparece en la lista.
3. Marcarla como completada y editarla.
4. Eliminar otra tarea.
5. Recargar la página para demostrar la persistencia en Supabase.
6. Mostrar brevemente la tabla `tasks` en Supabase y el repositorio en GitHub.
