// =============================================================================
// Ithaka Backoffice PoC — In-memory data store
// =============================================================================

export type TipoPostulante =
  | "estudiante_ucu"
  | "alumni"
  | "docente_funcionario"
  | "externo"

export type EstadoPostulacion = "borrador" | "recibida"

export type EstadoProyecto =
  | "recibida"
  | "en_evaluacion"
  | "proyecto_activo"
  | "incubado"
  | "cerrado"

export type TipoApoyo =
  | "validalab"
  | "eolo"
  | "mentoria"
  | "tfg"
  | "incubadora_ulises"

export type EstadoApoyo = "activo" | "finalizado"

export type Rol = "admin" | "tutor" | "coordinador" | "operador"

export type EstadoUsuario = "activo" | "inactivo"

export type TipoComunidad = "docente_funcionario" | "alumni" | "estudiante" | "externo"

// --------------- Entities ---------------

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  comunidad: TipoComunidad
  estado: EstadoUsuario
  fotoPerfil: string
  ultimoAcceso: string
  creadoEn: string
  actualizadoEn: string
}

export interface Postulacion {
  id: string
  nombreProyecto: string
  nombrePostulante: string
  email: string
  tipoPostulante: TipoPostulante
  descripcion: string
  notas: string
  estado: EstadoPostulacion
  convocatoria?: string
  completitud?: "completa" | "incompleta"
  creadoEn: string
  actualizadoEn: string
}

export interface Evaluacion {
  id: string
  proyectoId: string
  etapaEmprendimiento: string
  potencialIncubacion: "alto" | "medio" | "bajo"
  pertenenciaUCU: boolean
  notas: string
  creadoEn: string
  actualizadoEn: string
}

export interface Apoyo {
  id: string
  proyectoId: string
  tipo: TipoApoyo
  estado: EstadoApoyo
  fechaInicio: string
  fechaFin?: string
}

export interface Hito {
  id: string
  proyectoId: string
  titulo: string
  completado: boolean
}

export interface Proyecto {
  id: string
  postulacionId: string
  nombreProyecto: string
  nombrePostulante: string
  email: string
  tipoPostulante: TipoPostulante
  descripcion: string
  estado: EstadoProyecto
  responsableIthaka: string
  apoyos: Apoyo[]
  hitos: Hito[]
  evaluacion?: Evaluacion
  creadoEn: string
  actualizadoEn: string
}

export interface AuditEntry {
  id: string
  entidadTipo: "postulacion" | "proyecto"
  entidadId: string
  accion: string
  detalle: string
  usuario: string
  fecha: string
}

// --------------- Labels & catalogs ---------------

export const TIPO_POSTULANTE_LABELS: Record<TipoPostulante, string> = {
  estudiante_ucu: "Estudiante UCU",
  alumni: "Alumni",
  docente_funcionario: "Docente/Funcionario UCU",
  externo: "Externo",
}

export const ESTADO_POSTULACION_LABELS: Record<EstadoPostulacion, string> = {
  borrador: "Borrador",
  recibida: "Recibida",
}

export const ESTADO_PROYECTO_LABELS: Record<EstadoProyecto, string> = {
  recibida: "Recibida",
  en_evaluacion: "En evaluacion",
  proyecto_activo: "Proyecto activo",
  incubado: "Incubado",
  cerrado: "Cerrado",
}

export const TIPO_APOYO_LABELS: Record<TipoApoyo, string> = {
  validalab: "ValidaLab",
  eolo: "Eolo",
  mentoria: "Mentoria",
  tfg: "TFG",
  incubadora_ulises: "Incubadora Ulises",
}

export const ESTADO_APOYO_LABELS: Record<EstadoApoyo, string> = {
  activo: "Activo",
  finalizado: "Finalizado",
}

export const ROL_LABELS: Record<Rol, string> = {
  admin: "Administrador",
  tutor: "Tutor",
  coordinador: "Coordinador",
  operador: "Operador",
}

export const ESTADO_USUARIO_LABELS: Record<EstadoUsuario, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
}

export const COMUNIDAD_LABELS: Record<TipoComunidad, string> = {
  docente_funcionario: "Docente/Funcionario UCU",
  alumni: "Alumni",
  estudiante: "Estudiante",
  externo: "Externo",
}

export const RESPONSABLES_ITHAKA = [
  "Ana Garcia",
  "Carlos Rodriguez",
  "Maria Lopez",
  "Juan Martinez",
  "Laura Fernandez",
]

// --------------- Seed data ---------------

let nextId = 100

function genId() {
  nextId++
  return `ITH-${String(nextId).padStart(4, "0")}`
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const seedUsuarios: Usuario[] = [
  {
    id: "USR-0001",
    nombre: "Ana García",
    email: "ana.garcia@ucu.edu.uy",
    rol: "admin",
    comunidad: "docente_funcionario",
    estado: "activo",
    fotoPerfil: "https://ui-avatars.com/api/?name=Ana+García&background=354558&color=fff&bold=true",
    ultimoAcceso: daysAgo(0),
    creadoEn: daysAgo(60),
    actualizadoEn: daysAgo(5),
  },
  {
    id: "USR-0002",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@ucu.edu.uy",
    rol: "coordinador",
    comunidad: "docente_funcionario",
    estado: "activo",
    fotoPerfil: "https://ui-avatars.com/api/?name=Carlos+Rodríguez&background=354558&color=fff&bold=true",
    ultimoAcceso: daysAgo(1),
    creadoEn: daysAgo(50),
    actualizadoEn: daysAgo(2),
  },
  {
    id: "USR-0003",
    nombre: "María López",
    email: "maria.lopez@ucu.edu.uy",
    rol: "coordinador",
    comunidad: "docente_funcionario",
    estado: "activo",
    fotoPerfil: "https://ui-avatars.com/api/?name=María+López&background=354558&color=fff&bold=true",
    ultimoAcceso: daysAgo(2),
    creadoEn: daysAgo(45),
    actualizadoEn: daysAgo(3),
  },
  {
    id: "USR-0004",
    nombre: "Juan Martínez",
    email: "juan.martinez@ucu.edu.uy",
    rol: "tutor",
    comunidad: "alumni",
    estado: "activo",
    fotoPerfil: "https://ui-avatars.com/api/?name=Juan+Martínez&background=354558&color=fff&bold=true",
    ultimoAcceso: daysAgo(3),
    creadoEn: daysAgo(30),
    actualizadoEn: daysAgo(1),
  },
  {
    id: "USR-0005",
    nombre: "Laura Fernández",
    email: "laura.fernandez@ucu.edu.uy",
    rol: "tutor",
    comunidad: "docente_funcionario",
    estado: "activo",
    fotoPerfil: "https://ui-avatars.com/api/?name=Laura+Fernández&background=354558&color=fff&bold=true",
    ultimoAcceso: daysAgo(4),
    creadoEn: daysAgo(25),
    actualizadoEn: daysAgo(8),
  },
  {
    id: "USR-0006",
    nombre: "Roberto Silva",
    email: "roberto.silva@ucu.edu.uy",
    rol: "tutor",
    comunidad: "alumni",
    estado: "activo",
    fotoPerfil: "https://ui-avatars.com/api/?name=Roberto+Silva&background=354558&color=fff&bold=true",
    ultimoAcceso: daysAgo(5),
    creadoEn: daysAgo(15),
    actualizadoEn: daysAgo(10),
  },
  {
    id: "USR-0007",
    nombre: "Patricia Gómez",
    email: "patricia.gomez@ucu.edu.uy",
    rol: "coordinador",
    comunidad: "docente_funcionario",
    estado: "inactivo",
    fotoPerfil: "https://ui-avatars.com/api/?name=Patricia+Gómez&background=354558&color=fff&bold=true",
    ultimoAcceso: daysAgo(30),
    creadoEn: daysAgo(20),
    actualizadoEn: daysAgo(7),
  },
]

const seedPostulaciones: Postulacion[] = [
  {
    id: "POST-0001",
    nombreProyecto: "EcoTrack",
    nombrePostulante: "Sofia Mendez",
    email: "sofia.mendez@ucu.edu.uy",
    tipoPostulante: "estudiante_ucu",
    descripcion:
      "App de seguimiento de huella de carbono para estudiantes universitarios, con gamificacion y desafios comunitarios.",
    notas: "Primer contacto realizado. Pendiente reunion de presentacion.",
    estado: "recibida",
    creadoEn: daysAgo(2),
    actualizadoEn: daysAgo(2),
  },
  {
    id: "POST-0002",
    nombreProyecto: "AgriSmart",
    nombrePostulante: "Fernando Ruiz",
    email: "fernando.ruiz@gmail.com",
    tipoPostulante: "externo",
    descripcion:
      "Plataforma IoT para monitoreo de cultivos en pequenas parcelas, con alertas y recomendaciones basadas en datos.",
    notas: "",
    estado: "recibida",
    creadoEn: daysAgo(5),
    actualizadoEn: daysAgo(5),
  },
  {
    id: "POST-0003",
    nombreProyecto: "MindfulU",
    nombrePostulante: "Valentina Torres",
    email: "v.torres@ucu.edu.uy",
    tipoPostulante: "estudiante_ucu",
    descripcion:
      "Plataforma de bienestar mental para estudiantes con meditaciones guiadas, seguimiento emocional y comunidad de apoyo.",
    notas: "",
    estado: "borrador",
    creadoEn: daysAgo(1),
    actualizadoEn: daysAgo(1),
  },
  {
    id: "POST-0004",
    nombreProyecto: "FinLit",
    nombrePostulante: "Diego Alvarez",
    email: "diego.alvarez@alumni.ucu.edu.uy",
    tipoPostulante: "alumni",
    descripcion:
      "App de educacion financiera para jovenes adultos con simulaciones de inversion y presupuesto personal.",
    notas: "",
    estado: "recibida",
    creadoEn: daysAgo(8),
    actualizadoEn: daysAgo(7),
  },
]

const seedProyectos: Proyecto[] = [
  {
    id: "PROY-0001",
    postulacionId: "POST-0010",
    nombreProyecto: "ReciclaYa",
    nombrePostulante: "Camila Vega",
    email: "camila.vega@ucu.edu.uy",
    tipoPostulante: "estudiante_ucu",
    descripcion:
      "Marketplace de materiales reciclables con puntos de recoleccion y sistema de recompensas para usuarios activos.",
    estado: "proyecto_activo",
    responsableIthaka: "Ana Garcia",
    apoyos: [
      {
        id: "AP-001",
        proyectoId: "PROY-0001",
        tipo: "validalab",
        estado: "finalizado",
        fechaInicio: daysAgo(60),
        fechaFin: daysAgo(30),
      },
      {
        id: "AP-002",
        proyectoId: "PROY-0001",
        tipo: "mentoria",
        estado: "activo",
        fechaInicio: daysAgo(20),
      },
    ],
    hitos: [
      {
        id: "H-001",
        proyectoId: "PROY-0001",
        titulo: "Validacion de problema",
        completado: true,
      },
      {
        id: "H-002",
        proyectoId: "PROY-0001",
        titulo: "Prototipo MVP",
        completado: true,
      },
      {
        id: "H-003",
        proyectoId: "PROY-0001",
        titulo: "Primeros 50 usuarios",
        completado: false,
      },
      {
        id: "H-004",
        proyectoId: "PROY-0001",
        titulo: "Modelo de negocio validado",
        completado: false,
      },
    ],
    evaluacion: {
      id: "EV-001",
      proyectoId: "PROY-0001",
      etapaEmprendimiento: "Validacion",
      potencialIncubacion: "alto",
      pertenenciaUCU: true,
      notas: "Proyecto con gran potencial de impacto social y ambiental.",
      creadoEn: daysAgo(55),
      actualizadoEn: daysAgo(30),
    },
    creadoEn: daysAgo(60),
    actualizadoEn: daysAgo(2),
  },
  {
    id: "PROY-0002",
    postulacionId: "POST-0011",
    nombreProyecto: "EduConnect",
    nombrePostulante: "Martin Pereira",
    email: "martin.pereira@alumni.ucu.edu.uy",
    tipoPostulante: "alumni",
    descripcion:
      "Plataforma que conecta estudiantes con tutores pares para refuerzo academico.",
    estado: "incubado",
    responsableIthaka: "Carlos Rodriguez",
    apoyos: [
      {
        id: "AP-003",
        proyectoId: "PROY-0002",
        tipo: "validalab",
        estado: "finalizado",
        fechaInicio: daysAgo(120),
        fechaFin: daysAgo(90),
      },
      {
        id: "AP-004",
        proyectoId: "PROY-0002",
        tipo: "incubadora_ulises",
        estado: "activo",
        fechaInicio: daysAgo(45),
      },
    ],
    hitos: [
      {
        id: "H-005",
        proyectoId: "PROY-0002",
        titulo: "Validacion de problema",
        completado: true,
      },
      {
        id: "H-006",
        proyectoId: "PROY-0002",
        titulo: "Product-market fit",
        completado: true,
      },
      {
        id: "H-007",
        proyectoId: "PROY-0002",
        titulo: "Plan de financiamiento",
        completado: false,
      },
    ],
    evaluacion: {
      id: "EV-002",
      proyectoId: "PROY-0002",
      etapaEmprendimiento: "Escalamiento",
      potencialIncubacion: "alto",
      pertenenciaUCU: true,
      notas:
        "El proyecto ya tiene traccion con 200+ usuarios activos en la plataforma.",
      creadoEn: daysAgo(110),
      actualizadoEn: daysAgo(45),
    },
    creadoEn: daysAgo(120),
    actualizadoEn: daysAgo(5),
  },
  {
    id: "PROY-0003",
    postulacionId: "POST-0012",
    nombreProyecto: "AgroBot",
    nombrePostulante: "Lucia Salgado",
    email: "lucia.salgado@ucu.edu.uy",
    tipoPostulante: "docente_funcionario",
    descripcion:
      "Chatbot de asistencia tecnica para productores rurales, basado en inteligencia artificial.",
    estado: "en_evaluacion",
    responsableIthaka: "Maria Lopez",
    apoyos: [
      {
        id: "AP-005",
        proyectoId: "PROY-0003",
        tipo: "eolo",
        estado: "activo",
        fechaInicio: daysAgo(15),
      },
    ],
    hitos: [
      {
        id: "H-008",
        proyectoId: "PROY-0003",
        titulo: "Investigacion de mercado",
        completado: true,
      },
      {
        id: "H-009",
        proyectoId: "PROY-0003",
        titulo: "Prototipo funcional",
        completado: false,
      },
    ],
    creadoEn: daysAgo(15),
    actualizadoEn: daysAgo(3),
  },
  {
    id: "PROY-0004",
    postulacionId: "POST-0013",
    nombreProyecto: "UrbanFarm",
    nombrePostulante: "Nicolas Perez",
    email: "nico.perez@gmail.com",
    tipoPostulante: "externo",
    descripcion:
      "Kit de huerta urbana inteligente con sensores y app companion para mantenimiento guiado.",
    estado: "cerrado",
    responsableIthaka: "Juan Martinez",
    apoyos: [
      {
        id: "AP-006",
        proyectoId: "PROY-0004",
        tipo: "tfg",
        estado: "finalizado",
        fechaInicio: daysAgo(200),
        fechaFin: daysAgo(140),
      },
    ],
    hitos: [
      {
        id: "H-010",
        proyectoId: "PROY-0004",
        titulo: "Entrega TFG",
        completado: true,
      },
    ],
    evaluacion: {
      id: "EV-003",
      proyectoId: "PROY-0004",
      etapaEmprendimiento: "Ideacion",
      potencialIncubacion: "bajo",
      pertenenciaUCU: false,
      notas: "El equipo decidio no continuar con el proyecto tras la entrega del TFG.",
      creadoEn: daysAgo(190),
      actualizadoEn: daysAgo(140),
    },
    creadoEn: daysAgo(200),
    actualizadoEn: daysAgo(140),
  },
  {
    id: "PROY-0005",
    postulacionId: "POST-0014",
    nombreProyecto: "HealthTrack",
    nombrePostulante: "Andrea Morales",
    email: "andrea.morales@ucu.edu.uy",
    tipoPostulante: "estudiante_ucu",
    descripcion:
      "Wearable y app para monitoreo de habitos saludables en poblacion universitaria.",
    estado: "recibida",
    responsableIthaka: "",
    apoyos: [],
    hitos: [],
    creadoEn: daysAgo(3),
    actualizadoEn: daysAgo(3),
  },
]

const seedAuditLog: AuditEntry[] = [
  {
    id: "AUD-000",
    entidadTipo: "postulacion",
    entidadId: "POST-0001",
    accion: "Postulacion recibida",
    detalle: "Registrada desde el chatbot",
    usuario: "Sistema",
    fecha: daysAgo(2),
  },
  {
    id: "AUD-001",
    entidadTipo: "proyecto",
    entidadId: "PROY-0001",
    accion: "Cambio de estado",
    detalle: "en_evaluacion -> proyecto_activo",
    usuario: "Ana Garcia",
    fecha: daysAgo(30),
  },
  {
    id: "AUD-002",
    entidadTipo: "proyecto",
    entidadId: "PROY-0002",
    accion: "Cambio de estado",
    detalle: "proyecto_activo -> incubado",
    usuario: "Carlos Rodriguez",
    fecha: daysAgo(45),
  },
  {
    id: "AUD-003",
    entidadTipo: "proyecto",
    entidadId: "PROY-0002",
    accion: "Apoyo asignado",
    detalle: "Incubadora Ulises - activo",
    usuario: "Carlos Rodriguez",
    fecha: daysAgo(45),
  },
]

// --------------- Store singleton ---------------

class IthakaStore {
  postulaciones: Postulacion[] = [...seedPostulaciones]
  proyectos: Proyecto[] = [...seedProyectos]
  auditLog: AuditEntry[] = [...seedAuditLog]
  usuarios: Usuario[] = [...seedUsuarios]

  // --- Usuarios ---
  getUsuarios() {
    return this.usuarios
  }
  getUsuario(id: string) {
    return this.usuarios.find((u) => u.id === id)
  }
  addUsuario(data: Omit<Usuario, "id" | "creadoEn" | "actualizadoEn">) {
    const now = new Date().toISOString()
    const u: Usuario = { ...data, id: genId(), creadoEn: now, actualizadoEn: now }
    this.usuarios.unshift(u)
    return u
  }
  updateUsuario(id: string, data: Partial<Omit<Usuario, "id" | "creadoEn">>) {
    const u = this.getUsuario(id)
    if (u) {
      Object.assign(u, data, { actualizadoEn: new Date().toISOString() })
    }
    return u
  }
  toggleUsuarioEstado(id: string) {
    const u = this.getUsuario(id)
    if (u) {
      u.estado = u.estado === "activo" ? "inactivo" : "activo"
      u.actualizadoEn = new Date().toISOString()
    }
    return u
  }
  deleteUsuario(id: string) {
    const index = this.usuarios.findIndex((u) => u.id === id)
    if (index > -1) {
      this.usuarios.splice(index, 1)
      return true
    }
    return false
  }

  // --- Postulaciones ---
  getPostulaciones() {
    return this.postulaciones
  }
  getPostulacion(id: string) {
    return this.postulaciones.find((p) => p.id === id)
  }
  addPostulacion(data: Omit<Postulacion, "id" | "creadoEn" | "actualizadoEn">) {
    const now = new Date().toISOString()
    const p: Postulacion = { ...data, id: genId(), creadoEn: now, actualizadoEn: now }
    this.postulaciones.unshift(p)
    return p
  }
  updatePostulacionEstado(id: string, estado: EstadoPostulacion) {
    const p = this.getPostulacion(id)
    if (p) {
      const oldEstado = p.estado
      p.estado = estado
      p.actualizadoEn = new Date().toISOString()
      this.addAudit("postulacion", id, "Cambio de estado", `${oldEstado} -> ${estado}`, "Sistema")
    }
    return p
  }
  updatePostulacionNotas(id: string, notas: string) {
    const p = this.getPostulacion(id)
    if (p) {
      p.notas = notas
      p.actualizadoEn = new Date().toISOString()
      this.addAudit("postulacion", id, "Notas actualizadas", "Se actualizaron las notas internas", "Operador")
    }
    return p
  }

  // --- Proyectos ---
  getProyectos() {
    return this.proyectos
  }
  getProyecto(id: string) {
    return this.proyectos.find((p) => p.id === id)
  }
  convertirAProyecto(postulacionId: string): Proyecto | null {
    const post = this.getPostulacion(postulacionId)
    if (!post) return null
    const now = new Date().toISOString()
    const proy: Proyecto = {
      id: genId(),
      postulacionId: post.id,
      nombreProyecto: post.nombreProyecto,
      nombrePostulante: post.nombrePostulante,
      email: post.email,
      tipoPostulante: post.tipoPostulante,
      descripcion: post.descripcion,
      estado: "recibida",
      responsableIthaka: "",
      apoyos: [],
      hitos: [],
      creadoEn: now,
      actualizadoEn: now,
    }
    this.proyectos.unshift(proy)
    post.estado = "recibida"
    post.actualizadoEn = now
    this.addAudit("proyecto", proy.id, "Proyecto creado", `Desde postulacion ${post.id}`, "Sistema")
    this.addAudit("postulacion", post.id, "Convertida a proyecto", `Proyecto ${proy.id} creado`, "Sistema")
    return proy
  }
  updateProyectoEstado(id: string, estado: EstadoProyecto, usuario: string) {
    const p = this.getProyecto(id)
    if (p) {
      const oldEstado = p.estado
      p.estado = estado
      p.actualizadoEn = new Date().toISOString()
      this.addAudit("proyecto", id, "Cambio de estado", `${oldEstado} -> ${estado}`, usuario)
    }
    return p
  }
  updateProyectoResponsable(id: string, responsable: string, usuario: string) {
    const p = this.getProyecto(id)
    if (p) {
      p.responsableIthaka = responsable
      p.actualizadoEn = new Date().toISOString()
      this.addAudit("proyecto", id, "Responsable asignado", responsable, usuario)
    }
    return p
  }

  // --- Apoyos ---
  addApoyo(proyectoId: string, tipo: TipoApoyo, usuario: string) {
    const p = this.getProyecto(proyectoId)
    if (!p) return null
    const apoyo: Apoyo = {
      id: genId(),
      proyectoId,
      tipo,
      estado: "activo",
      fechaInicio: new Date().toISOString(),
    }
    p.apoyos.push(apoyo)
    p.actualizadoEn = new Date().toISOString()
    this.addAudit("proyecto", proyectoId, "Apoyo asignado", `${TIPO_APOYO_LABELS[tipo]} - activo`, usuario)
    return apoyo
  }
  toggleApoyoEstado(proyectoId: string, apoyoId: string, usuario: string) {
    const p = this.getProyecto(proyectoId)
    if (!p) return null
    const a = p.apoyos.find((ap) => ap.id === apoyoId)
    if (!a) return null
    a.estado = a.estado === "activo" ? "finalizado" : "activo"
    if (a.estado === "finalizado") a.fechaFin = new Date().toISOString()
    else a.fechaFin = undefined
    p.actualizadoEn = new Date().toISOString()
    this.addAudit("proyecto", proyectoId, "Apoyo actualizado", `${TIPO_APOYO_LABELS[a.tipo]} - ${a.estado}`, usuario)
    return a
  }

  // --- Hitos ---
  addHito(proyectoId: string, titulo: string) {
    const p = this.getProyecto(proyectoId)
    if (!p) return null
    const h: Hito = { id: genId(), proyectoId, titulo, completado: false }
    p.hitos.push(h)
    p.actualizadoEn = new Date().toISOString()
    return h
  }
  toggleHito(proyectoId: string, hitoId: string) {
    const p = this.getProyecto(proyectoId)
    if (!p) return null
    const h = p.hitos.find((hi) => hi.id === hitoId)
    if (!h) return null
    h.completado = !h.completado
    p.actualizadoEn = new Date().toISOString()
    return h
  }

  // --- Evaluaciones ---
  setEvaluacion(
    proyectoId: string,
    data: Omit<Evaluacion, "id" | "proyectoId" | "creadoEn" | "actualizadoEn">
  ) {
    const p = this.getProyecto(proyectoId)
    if (!p) return null
    const now = new Date().toISOString()
    if (p.evaluacion) {
      p.evaluacion = { ...p.evaluacion, ...data, actualizadoEn: now }
    } else {
      p.evaluacion = { ...data, id: genId(), proyectoId, creadoEn: now, actualizadoEn: now }
    }
    p.actualizadoEn = now
    return p.evaluacion
  }

  // --- Audit ---
  addAudit(entidadTipo: AuditEntry["entidadTipo"], entidadId: string, accion: string, detalle: string, usuario: string) {
    const entry: AuditEntry = {
      id: genId(),
      entidadTipo,
      entidadId,
      accion,
      detalle,
      usuario,
      fecha: new Date().toISOString(),
    }
    this.auditLog.unshift(entry)
    return entry
  }
  getAuditForEntity(entidadId: string) {
    return this.auditLog.filter((a) => a.entidadId === entidadId)
  }

  // --- Metrics ---
  getMetrics() {
    const totalPostulaciones = this.postulaciones.length + this.proyectos.length
    const proyectosActivos = this.proyectos.filter(
      (p) => p.estado === "proyecto_activo" || p.estado === "en_evaluacion"
    ).length
    const incubados = this.proyectos.filter((p) => p.estado === "incubado").length

    const allEntities = [
      ...this.postulaciones.map((p) => ({
        tipoPostulante: p.tipoPostulante,
        pertenenciaUCU:
          p.tipoPostulante === "estudiante_ucu" ||
          p.tipoPostulante === "alumni" ||
          p.tipoPostulante === "docente_funcionario",
      })),
      ...this.proyectos.map((p) => ({
        tipoPostulante: p.tipoPostulante,
        pertenenciaUCU:
          p.tipoPostulante === "estudiante_ucu" ||
          p.tipoPostulante === "alumni" ||
          p.tipoPostulante === "docente_funcionario",
      })),
    ]

    const comunidadUCU = allEntities.filter((e) => e.pertenenciaUCU).length
    const estudiantesUCU = allEntities.filter(
      (e) => e.tipoPostulante === "estudiante_ucu"
    ).length
    const alumniCount = allEntities.filter(
      (e) => e.tipoPostulante === "alumni"
    ).length

    const conversionPostulacionProyecto =
      totalPostulaciones > 0
        ? Math.round((this.proyectos.length / totalPostulaciones) * 100)
        : 0
    const conversionProyectoIncubacion =
      this.proyectos.length > 0
        ? Math.round((incubados / this.proyectos.length) * 100)
        : 0

    // Distribution by estado
    const distribucionEstado: Record<string, number> = {}
    for (const p of this.proyectos) {
      distribucionEstado[p.estado] = (distribucionEstado[p.estado] || 0) + 1
    }

    // Distribution by apoyo
    const distribucionApoyo: Record<string, number> = {}
    for (const p of this.proyectos) {
      for (const a of p.apoyos) {
        distribucionApoyo[a.tipo] = (distribucionApoyo[a.tipo] || 0) + 1
      }
    }

    return {
      totalPostulaciones,
      proyectosActivos,
      incubados,
      comunidadUCU,
      porcentajeUCU:
        totalPostulaciones > 0
          ? Math.round((comunidadUCU / totalPostulaciones) * 100)
          : 0,
      estudiantesUCU,
      alumni: alumniCount,
      conversionPostulacionProyecto,
      conversionProyectoIncubacion,
      distribucionEstado,
      distribucionApoyo,
      totalProyectos: this.proyectos.length,
    }
  }
}

// Singleton
export const store = new IthakaStore()
