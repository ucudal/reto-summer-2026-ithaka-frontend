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
