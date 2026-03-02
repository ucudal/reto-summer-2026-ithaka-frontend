# 🚀 Ithaka Backoffice Frontend - Setup

Guía para levantar el proyecto localmente.

## Requisitos

- **Node.js** v18+ (recomendado v20+)
- **pnpm** (gestor de paquetes - más rápido que npm)

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/ucudal/reto-summer-2026-ithaka-frontend
cd reto-summer-2026-ithaka-frontend
```

### 2. Instalar pnpm (si no lo tienes)

```bash
npm install -g pnpm
```

### 3. Instalar dependencias

```bash
pnpm install
```

### 3.1 Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con (añadido: LangGraph URL):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_NUEVA_POSTULACION_URL=localhost:5371
NEXT_PUBLIC_LANGGRAPH_URL=http://localhost:8000/api/v1
```

> Importante: `NEXT_PUBLIC_LANGGRAPH_URL` apunta al endpoint base de LangGraph que usa el flujo REST + WebSocket. Ejemplo: `http://localhost:8000/api/v1`.

### 4. Levantar el servidor de desarrollo

```bash
pnpm dev
```

### 5. Acceder a la aplicación

Abre tu navegador en:

- **Local**: http://localhost:3000
- **Red**: http://192.168.56.1:3000 (o la IP de tu máquina)

---

## 🎯 Características

- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de postulaciones
- ✅ Gestión de proyectos
- ✅ Evaluaciones
- ✅ Asignación de apoyos (mentoria, validalab, eolo, tfg, incubadora)
- ✅ Seguimiento de hitos
- ✅ Auditoría de cambios

---

## 📝 Notas

- Los datos se almacenan en **memoria** (se pierden al reiniciar)
- No hay autenticación implementada (PoC)
- Para producción se debe integrar una BD real

---

## 🛠️ Otros Comandos

```bash
# Build para producción
pnpm build

# Start servidor en producción
pnpm start

# Lint del código
pnpm lint
```

---

## 📞 Soporte

Para dudas, consulta la estructura del proyecto:

- `/app` - Rutas y pages de Next.js
- `/components` - Componentes React reutilizables
- `/lib` - Utilidades y store de datos
- `/app/actions.ts` - Server Actions (API)

---

## LangGraph (nota rápida)

El ChatBot integrado usa LangGraph como backend. Para que la funcionalidad de chat funcione en `/chatbot`:

- Definí `NEXT_PUBLIC_LANGGRAPH_URL` en `.env.local` apuntando al endpoint base del backend (ej. `http://localhost:8000/api/v1`).
- La UI hace `POST ${NEXT_PUBLIC_LANGGRAPH_URL}/conversations/init` y luego abre un WebSocket en `${NEXT_PUBLIC_LANGGRAPH_URL.replace('http','ws')}/ws?token=...`.
- Si no existiera el backend, la UI carga pero las conversaciones no responderán.
