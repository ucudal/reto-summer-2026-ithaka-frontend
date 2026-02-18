# Feature: Role-Based Views (Vistas por Rol)

## Descripción General

Se ha implementado un sistema de roles para restringir el acceso a diferentes vistas de la aplicación. Se soportan tres roles:

- **Tutor**: acceso limitado a Dashboard y Proyectos.
- **Coordinador**: acceso a todas las vistas excepto Gestión de Usuarios.
- **Operador**: acceso a todas las vistas excepto Gestión de Usuarios.
- **Admin**: acceso completo, incluyendo Gestión de Usuarios.

## Cambios Realizados

### 1. Nuevos Archivos Creados

#### `components/role-context.tsx`
Proveedor de contexto de React que gestiona el estado del rol del usuario.

**Funcionalidades:**
- `RoleProvider`: componente que envuelve la aplicación y proporciona el contexto de rol.
- `useRole()`: hook personalizado para acceder al rol actual y la función para cambiarlo.
- Persistencia en `localStorage`: el rol seleccionado se guarda automáticamente en el navegador.

**Tipos:**
```typescript
type Role = "admin" | "coordinador" | "tutor" | "operador" | null
type RoleContextValue = {
  role: Role
  setRole: (r: Role) => void
}
```

#### `components/role-selector.tsx`
Componente que renderiza una pantalla modal de selección de rol.

**Funcionalidades:**
- Modal full-screen que aparece cuando no hay rol seleccionado.
- Botones para elegir entre "Soy Tutor" y "Soy Admin".
- Se cierra automáticamente después de la selección.
- Estilos tailwindcss integrados.

**UI:**
```
┌─────────────────────────────────────────────┐
│    Seleccioná tu rol                        │
│ Elige tu rol para acceder a la plataforma.  │
│                                             │
│ [Tutor] Dashboard y Proyectos               │
│ [Coordinador] Acceso completo excepto...   │
│ [Admin (Acceso Total)]                      │
└─────────────────────────────────────────────┘
```

#### `components/role-wrapper.tsx`
Componente wrapper que combina `RoleProvider` y `RoleSelector`.

**Funcionalidades:**
- Envuelve toda la aplicación con el proveedor de rol.
- Renderiza la pantalla de selección en overlay.

### 2. Archivos Modificados

#### `app/layout.tsx`
Se añadió el wrapper de roles en el `RootLayout`.

**Cambio:**
```tsx
import { RoleWrapper } from "@/components/role-wrapper"

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <RoleWrapper>{children}</RoleWrapper>
      </body>
    </html>
  )
}
```

**Impacto:** Todos los componentes hijos tienen acceso al contexto de rol a través del hook `useRole()`.

#### `components/app-sidebar.tsx`
Se filtran los ítems de navegación según el rol del usuario.

**Cambio Principal:**
```tsx
// Items de navegación
const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/postulaciones", label: "Postulaciones", icon: Inbox },
  { href: "/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/evaluaciones", label: "Evaluaciones", icon: ClipboardCheck },
  { href: "/gestion-usuarios", label: "Gestion de Usuarios", icon: Users, adminOnly: true },
]

// Filtrado por rol
const { role } = useRole()
let items = navItems
if (role === "tutor") {
  items = navItems.filter(i => i.href === "/" || i.href === "/proyectos")
} else if (role === "coordinador") {
  items = navItems.filter(i => !i.adminOnly)
}
// Admin: todos los items
```

**Impacto:**
- **Tutor**: solo ve Dashboard (`/`) y Proyectos (`/proyectos`).
- **Coordinador**: ve Dashboard, Postulaciones, Proyectos, Evaluaciones (todo menos Gestión de Usuarios).
- **Admin**: ve todas las opciones incluyendo Gestión de Usuarios (`/gestion-usuarios`).

#### `app/gestion-usuarios/page.tsx`
Nueva ruta solo disponible para administradores.

**Descripción:**
- Página placeholder para el panel de gestión de usuarios.
- Solo accesible con rol "admin".

## Flujo de Usuario

### 1. Entrada a la Aplicación
```
App cargada
↓
RoleWrapper renderiza RoleSelector
↓
Usuario ve modal: "Seleccioná tu rol"
```

### 2. Selección de Rol
```
Usuario clickea "Soy Tutor" o "Soy Admin"
↓
setRole(rol) actualiza el contexto
↓
localStorage guarda el rol
↓
RoleSelector desaparece (condición: if (role) return null)
↓
Navegación se filtra según el rol
```

### 3. Recarga de Página
```
Usuario recarga la página
↓
useEffect en RoleProvider lee localStorage
↓
Rol restaurado automáticamente
↓
Modal NO aparece (localStorage tiene valor)
↓
User accede directamente a la app
```

## Rutas Accesibles por Rol

### Tutor
- `/` (Dashboard)
- `/proyectos` (Proyectos)
- `/proyectos/[id]` (Detalle de Proyecto)

### Coordinador
- `/` (Dashboard)
- `/postulaciones` (Postulaciones)
- `/proyectos` (Proyectos)
- `/proyectos/[id]` (Detalle de Proyecto)
- `/evaluaciones` (Evaluaciones)

### Admin
- `/` (Dashboard)
- `/postulaciones` (Postulaciones)
- `/proyectos` (Proyectos)
- `/proyectos/[id]` (Detalle de Proyecto)
- `/evaluaciones` (Evaluaciones)
- `/gestion-usuarios` (Gestión de Usuarios)

## Estructura del Código

```
components/
├── role-context.tsx      (provider + hook)
├── role-selector.tsx     (modal de selección)
├── role-wrapper.tsx      (wrapper)
├── app-sidebar.tsx       (filtrado de nav items)
└── ...

app/
├── layout.tsx            (RoleWrapper integrado)
└── ...
```

## Tecnologías Usadas

- **React Context API**: gestión centralizada de estado del rol.
- **localStorage**: persistencia entre sesiones.
- **Next.js**: rutas dinámicas y server/client components.
- **Tailwind CSS**: estilos del modal y componentes.
- **Lucide React**: iconos en la navegación.

## Próximos Pasos (Recomendaciones)

1. **Protección de Rutas en Server:**
   - Implementar middleware en Next.js para validar acceso por rol.
   - Redirigir a `/` si un tutor intenta acceder a rutas no permitidas.

2. **Logout / Switch de Rol:**
   - Botón para cambiar de rol sin recargar.
   - Botón de logout que limpie localStorage.

3. **Integración con Backend:**
   - Reemplazar selector modal con autenticación real.
   - Guardar rol en base de datos o JWT.
   - Validar rol en el servidor antes de procesar requests.

4. **Tests:**
   - Tests de contexto de rol.
   - Tests de filtrado de navegación.
   - Tests E2E de flujo de selección.

## Cómo Usar

### Para Desarrolladores

1. **Acceder al rol actual:**
   ```tsx
   import { useRole } from "@/components/role-context"
   
   export function MyComponent() {
     const { role, setRole } = useRole()
     return <div>Rol: {role}</div>
   }
   ```

2. **Condicionales por Rol:**
   ```tsx
   const { role } = useRole()
   
   if (role === "tutor") {
     // mostrar solo para tutores
   } else if (role === "admin") {
     // mostrar solo para admins
   }
   ```

3. **Cambiar Rol (debug):**
   ```tsx
   const { setRole } = useRole()
   <button onClick={() => setRole("tutor")}>Cambiar a Tutor</button>
   ```

## Testing Manual

### Paso 1: Iniciar App
```bash
cd reto-summer-2026-ithaka-frontend
pnpm dev
```

### Paso 2: Abrir en Navegador
```
http://localhost:3000
```

### Paso 3: Ver Modal de Selección
- Debe aparecer un modal con tres botones.

### Paso 4: Seleccionar Rol Tutor
- Clickear "Tutor".
- Verificar que la sidebar muestre solo Dashboard y Proyectos.
- Verificar que localStorage tiene `role: "tutor"`.

### Paso 5: Cambiar a Coordinador
- Abrir DevTools → Console.
- Ejecutar: `localStorage.removeItem('role')`.
- Recargar la página.
- Clickear "Coordinador".
- Verificar que la sidebar muestra Dashboard, Postulaciones, Proyectos, Evaluaciones (pero NO Gestión de Usuarios).

### Paso 6: Cambiar a Admin
- Abrir DevTools → Console.
- Ejecutar: `localStorage.removeItem('role')`.
- Recargar la página.
- Clickear "Admin".
- Verificar que la sidebar muestra todos los ítems incluyendo Gestión de Usuarios.
- Navegar a `/gestion-usuarios` para verificar que la ruta funciona.

## Rama Git

- **Rama Feature:** `feature/role-views`
- **Rama Dev:** `dev` (recibe pushes de feature/role-views)
- **Rama Main:** `main` (producción)

**Commit:**
```
feat(role): add role selector and restrict tutor navigation

- Create RoleProvider and useRole hook
- Add RoleSelector modal component
- Filter sidebar navigation by role
- Persist role in localStorage
- Wrap app with RoleWrapper in layout
```

## Notas Importantes

- ✅ El rol se persiste en localStorage automáticamente.
- ✅ El modal desaparece después de seleccionar rol.
- ✅ La navegación se filtra dinámicamente.
- ⚠️ Los tutores pueden acceder a rutas no permitidas escribiendo en la URL (sin guardia en el servidor).
- ⚠️ No hay logout/switch de rol fácil (requiere limpiar localStorage manualmente).

## Contacto / Dudas

Para preguntas sobre esta implementación, referirse a:
- Rama: `feature/role-views` / `dev`
- Archivos: `components/role-context.tsx`, `components/role-selector.tsx`, `components/role-wrapper.tsx`
