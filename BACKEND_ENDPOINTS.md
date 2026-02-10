# 📋 Especificación de Endpoints Backend - Ithaka Backoffice

Documento con todos los endpoints que el equipo de backend debe implementar para integrar con el frontend.

---

## 🔐 Autenticación

Todos los endpoints requieren un header:
```
Authorization: Bearer {TOKEN}
```

**Roles soportados:** `admin`, `coordinador`, `operador`

---

## 📦 POSTULACIONES

### GET `/api/postulaciones`
Obtiene lista de todas las postulaciones.

**Response (200):**
```json
[
  {
    "id": "POST-0001",
    "nombreProyecto": "EcoTrack",
    "nombrePostulante": "Sofia Mendez",
    "email": "sofia.mendez@ucu.edu.uy",
    "tipoPostulante": "estudiante_ucu",
    "descripcion": "App de seguimiento de huella de carbono...",
    "estado": "recibida",
    "creadoEn": "2026-02-07T10:30:00Z",
    "actualizadoEn": "2026-02-07T10:30:00Z"
  }
]
```

---

### GET `/api/postulaciones/{id}`
Obtiene una postulación específica.

**Response (200):**
```json
{
  "id": "POST-0001",
  "nombreProyecto": "EcoTrack",
  "nombrePostulante": "Sofia Mendez",
  "email": "sofia.mendez@ucu.edu.uy",
  "tipoPostulante": "estudiante_ucu",
  "descripcion": "...",
  "estado": "recibida",
  "creadoEn": "2026-02-07T10:30:00Z",
  "actualizadoEn": "2026-02-07T10:30:00Z"
}
```

---

### POST `/api/postulaciones`
Crea una nueva postulación.

**Body:**
```json
{
  "nombreProyecto": "NuevoProyecto",
  "nombrePostulante": "Juan Perez",
  "email": "juan@example.com",
  "tipoPostulante": "estudiante_ucu",
  "descripcion": "Descripción del proyecto",
  "estado": "recibida"
}
```

**Response (201):**
```json
{
  "id": "POST-0005",
  "nombreProyecto": "NuevoProyecto",
  ...
}
```

---

### PATCH `/api/postulaciones/{id}/estado`
Actualiza el estado de una postulación.

**Body:**
```json
{
  "estado": "recibida"
}
```

**Estados válidos:** `"borrador"`, `"recibida"`

**Response (200):**
```json
{
  "id": "POST-0001",
  "estado": "recibida",
  ...
}
```

---

## 🎯 PROYECTOS

### GET `/api/proyectos`
Obtiene lista de todos los proyectos.

**Response (200):**
```json
[
  {
    "id": "ITH-0101",
    "postulacionId": "POST-0001",
    "nombreProyecto": "EcoTrack",
    "nombrePostulante": "Sofia Mendez",
    "email": "sofia.mendez@ucu.edu.uy",
    "tipoPostulante": "estudiante_ucu",
    "descripcion": "...",
    "estado": "proyecto_activo",
    "responsableIthaka": "Ana Garcia",
    "apoyos": [...],
    "hitos": [...],
    "evaluacion": {...},
    "creadoEn": "2026-02-07T10:30:00Z",
    "actualizadoEn": "2026-02-07T10:30:00Z"
  }
]
```

---

### GET `/api/proyectos/{id}`
Obtiene un proyecto específico con todos sus detalles.

**Response (200):**
```json
{
  "id": "ITH-0101",
  "postulacionId": "POST-0001",
  "nombreProyecto": "EcoTrack",
  "nombrePostulante": "Sofia Mendez",
  "email": "sofia.mendez@ucu.edu.uy",
  "tipoPostulante": "estudiante_ucu",
  "descripcion": "...",
  "estado": "proyecto_activo",
  "responsableIthaka": "Ana Garcia",
  "apoyos": [
    {
      "id": "APO-001",
      "proyectoId": "ITH-0101",
      "tipo": "mentoria",
      "estado": "activo",
      "fechaInicio": "2026-02-01T00:00:00Z",
      "fechaFin": null
    }
  ],
  "hitos": [
    {
      "id": "HIT-001",
      "proyectoId": "ITH-0101",
      "titulo": "MVP completado",
      "completado": true
    }
  ],
  "evaluacion": {
    "id": "EVA-001",
    "proyectoId": "ITH-0101",
    "etapaEmprendimiento": "idea",
    "potencialIncubacion": "alto",
    "pertenenciaUCU": true,
    "notas": "Proyecto con gran potencial",
    "creadoEn": "2026-02-05T00:00:00Z",
    "actualizadoEn": "2026-02-05T00:00:00Z"
  },
  "creadoEn": "2026-02-07T10:30:00Z",
  "actualizadoEn": "2026-02-07T10:30:00Z"
}
```

---

### POST `/api/postulaciones/{postulacionId}/convertir-a-proyecto`
Convierte una postulación en un proyecto.

**Body:**
```json
{
  "responsableIthaka": "Ana Garcia"
}
```

**Response (201):**
```json
{
  "id": "ITH-0101",
  "postulacionId": "POST-0001",
  "nombreProyecto": "EcoTrack",
  "nombrePostulante": "Sofia Mendez",
  "estado": "recibida",
  "responsableIthaka": "Ana Garcia",
  "apoyos": [],
  "hitos": [],
  ...
}
```

---

### PATCH `/api/proyectos/{id}/estado`
Actualiza el estado de un proyecto.

**Body:**
```json
{
  "estado": "proyecto_activo"
}
```

**Estados válidos:** `"recibida"`, `"en_evaluacion"`, `"proyecto_activo"`, `"incubado"`, `"cerrado"`

**Response (200):**
```json
{
  "id": "ITH-0101",
  "estado": "proyecto_activo",
  ...
}
```

---

### PATCH `/api/proyectos/{id}/responsable`
Asigna un responsable Ithaka al proyecto.

**Body:**
```json
{
  "responsableIthaka": "Ana Garcia"
}
```

**Response (200):**
```json
{
  "id": "ITH-0101",
  "responsableIthaka": "Ana Garcia",
  ...
}
```

---

## 🤝 APOYOS

### POST `/api/proyectos/{proyectoId}/apoyos`
Agrega un apoyo a un proyecto.

**Body:**
```json
{
  "tipo": "mentoria"
}
```

**Tipos válidos:** `"validalab"`, `"eolo"`, `"mentoria"`, `"tfg"`, `"incubadora_ulises"`

**Response (201):**
```json
{
  "id": "APO-001",
  "proyectoId": "ITH-0101",
  "tipo": "mentoria",
  "estado": "activo",
  "fechaInicio": "2026-02-09T10:00:00Z",
  "fechaFin": null
}
```

---

### PATCH `/api/proyectos/{proyectoId}/apoyos/{apoyoId}/estado`
Cambia el estado de un apoyo (activo → finalizado).

**Body:**
```json
{
  "estado": "finalizado"
}
```

**Response (200):**
```json
{
  "id": "APO-001",
  "proyectoId": "ITH-0101",
  "tipo": "mentoria",
  "estado": "finalizado",
  "fechaInicio": "2026-02-01T00:00:00Z",
  "fechaFin": "2026-02-09T10:00:00Z"
}
```

---

## ✅ HITOS

### POST `/api/proyectos/{proyectoId}/hitos`
Crea un nuevo hito en un proyecto.

**Body:**
```json
{
  "titulo": "MVP completado"
}
```

**Response (201):**
```json
{
  "id": "HIT-001",
  "proyectoId": "ITH-0101",
  "titulo": "MVP completado",
  "completado": false
}
```

---

### PATCH `/api/proyectos/{proyectoId}/hitos/{hitoId}/completado`
Marca un hito como completado o no completado.

**Body:**
```json
{
  "completado": true
}
```

**Response (200):**
```json
{
  "id": "HIT-001",
  "proyectoId": "ITH-0101",
  "titulo": "MVP completado",
  "completado": true
}
```

---

## 📊 EVALUACIONES

### POST `/api/proyectos/{proyectoId}/evaluaciones`
Crea o actualiza una evaluación de un proyecto.

**Body:**
```json
{
  "etapaEmprendimiento": "idea",
  "potencialIncubacion": "alto",
  "pertenenciaUCU": true,
  "notas": "Proyecto con gran potencial"
}
```

**Valores válidos:**
- `etapaEmprendimiento`: cualquier string (ej: "idea", "prototipo", "MVP")
- `potencialIncubacion`: `"alto"`, `"medio"`, `"bajo"`
- `pertenenciaUCU`: `true` o `false`

**Response (201/200):**
```json
{
  "id": "EVA-001",
  "proyectoId": "ITH-0101",
  "etapaEmprendimiento": "idea",
  "potencialIncubacion": "alto",
  "pertenenciaUCU": true,
  "notas": "Proyecto con gran potencial",
  "creadoEn": "2026-02-09T10:00:00Z",
  "actualizadoEn": "2026-02-09T10:00:00Z"
}
```

---

## 📈 MÉTRICAS

### GET `/api/metricas`
Obtiene las métricas del dashboard.

**Response (200):**
```json
{
  "totalPostulaciones": 25,
  "totalProyectos": 18,
  "proyectosActivos": 12,
  "proyectosIncubados": 3,
  "postulacionesPorEstado": {
    "borrador": 5,
    "recibida": 20
  },
  "proyectosPorEstado": {
    "recibida": 2,
    "en_evaluacion": 3,
    "proyecto_activo": 10,
    "incubado": 3,
    "cerrado": 0
  },
  "apoyosPorTipo": {
    "mentoria": 8,
    "validalab": 5,
    "eolo": 3,
    "tfg": 2,
    "incubadora_ulises": 1
  },
  "potencialIncubacion": {
    "alto": 10,
    "medio": 6,
    "bajo": 2
  }
}
```

---

## 🔍 AUDITORÍA

### GET `/api/auditoria/{entidadId}`
Obtiene el historial de cambios de una entidad.

**Response (200):**
```json
[
  {
    "id": "AUD-001",
    "entidadTipo": "proyecto",
    "entidadId": "ITH-0101",
    "accion": "actualizar_estado",
    "detalle": "Estado actualizado de 'recibida' a 'proyecto_activo'",
    "usuario": "Ana Garcia",
    "fecha": "2026-02-09T10:00:00Z"
  },
  {
    "id": "AUD-002",
    "entidadTipo": "proyecto",
    "entidadId": "ITH-0101",
    "accion": "agregar_apoyo",
    "detalle": "Apoyo de tipo 'mentoria' agregado",
    "usuario": "Carlos Rodriguez",
    "fecha": "2026-02-08T15:30:00Z"
  }
]
```

---

## ⚠️ CÓDIGOS DE ERROR ESTÁNDAR

Todos los endpoints deben retornar:

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - Rol sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error |

**Formato de error:**
```json
{
  "error": "Mensaje descriptivo del error",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 🔐 PERMISOS POR ROLES

| Acción | Admin | Coordinador | Operador |
|--------|-------|-------------|----------|
| Ver postulaciones | ✅ | ✅ | ✅ |
| Crear postulación | ✅ | ✅ | ❌ |
| Cambiar estado postulación | ✅ | ❌ | ❌ |
| Ver proyectos | ✅ | ✅ | ✅ |
| Convertir a proyecto | ✅ | ✅ | ❌ |
| Cambiar estado proyecto | ✅ | ❌ | ✅ |
| Asignar responsable | ✅ | ✅ | ❌ |
| Agregar apoyo | ✅ | ✅ | ❌ |
| Cambiar estado apoyo | ✅ | ✅ | ❌ |
| Crear hito | ✅ | ✅ | ✅ |
| Marcar hito completado | ✅ | ✅ | ✅ |
| Crear evaluación | ✅ | ✅ | ✅ |
| Ver auditoría | ✅ | ✅ | ❌ |
| Ver métricas | ✅ | ✅ | ✅ |

---

## 📝 CATÁLOGOS

### Tipos de postulante:
- `estudiante_ucu`
- `alumni`
- `docente_funcionario`
- `externo`

### Estados de postulación:
- `borrador`
- `recibida`

### Estados de proyecto:
- `recibida`
- `en_evaluacion`
- `proyecto_activo`
- `incubado`
- `cerrado`

### Tipos de apoyo:
- `validalab`
- `eolo`
- `mentoria`
- `tfg`
- `incubadora_ulises`

### Estados de apoyo:
- `activo`
- `finalizado`

### Potencial de incubación:
- `alto`
- `medio`
- `bajo`

---

## 🧪 EJEMPLO DE FLUJO COMPLETO

1. **Crear postulación**
   ```
   POST /api/postulaciones
   ```

2. **Obtener postulación**
   ```
   GET /api/postulaciones/{id}
   ```

3. **Convertir a proyecto**
   ```
   POST /api/postulaciones/{id}/convertir-a-proyecto
   ```

4. **Obtener proyecto**
   ```
   GET /api/proyectos/{id}
   ```

5. **Agregar apoyo**
   ```
   POST /api/proyectos/{id}/apoyos
   ```

6. **Crear hito**
   ```
   POST /api/proyectos/{id}/hitos
   ```

7. **Crear evaluación**
   ```
   POST /api/proyectos/{id}/evaluaciones
   ```

8. **Cambiar estado**
   ```
   PATCH /api/proyectos/{id}/estado
   ```

9. **Ver auditoría**
   ```
   GET /api/auditoria/{id}
   ```

10. **Ver métricas**
    ```
    GET /api/metricas
    ```

---

## 📌 NOTAS IMPORTANTES

- Todos los IDs deben ser únicos y generados en el backend
- Los timestamps deben estar en ISO 8601 format (UTC)
- Implementar paginación para listados grandes
- Validar roles en cada endpoint
- Registrar todas las acciones en auditoría
- Usar transacciones para operaciones críticas (ej: convertir a proyecto)
