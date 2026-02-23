"use client"

import { useEffect, useState, useCallback } from "react"
import { store } from "@/src/lib/data"
import type { Usuario, Rol, EstadoUsuario, TipoComunidad } from "@/src/lib/data"
import { ROL_LABELS, COMUNIDAD_LABELS } from "@/src/lib/data"
import { StatusBadge } from "@/src/components/status-badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select"
import { Button } from "@/src/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/src/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar"
import { Search, Plus } from "lucide-react"

export function UsuariosList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [search, setSearch] = useState("")
    const [filterRol, setFilterRol] = useState<string>("all")
    const [filterEstado, setFilterEstado] = useState<string>("all")
    const [filterComunidad, setFilterComunidad] = useState<string>("all")
    const [editDialog, setEditDialog] = useState<Usuario | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<Usuario | null>(null)
    const [newUserDialog, setNewUserDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingUser, setEditingUser] = useState<Usuario | null>(null)
    const [newUser, setNewUser] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: "" as unknown as Rol,
        comunidad: "" as unknown as TipoComunidad,
        estado: "activo" as EstadoUsuario,
    })
    const [formErrors, setFormErrors] = useState({
        nombre: "",
        email: "",
        password: "",
    })
    const [touchedFields, setTouchedFields] = useState({
        nombre: false,
        email: false,
        password: false,
    })

    const loadData = useCallback(() => {
        const data = store.getUsuarios()
        setUsuarios(data)
    }, [])

    const resetNewUserForm = useCallback(() => {
        setNewUserDialog(false)
        setFormErrors({ nombre: "", email: "", password: "" })
        setTouchedFields({ nombre: false, email: false, password: false })
        setNewUser({
            nombre: "",
            email: "",
            password: "",
            rol: "" as unknown as Rol,
            comunidad: "" as unknown as TipoComunidad,
            estado: "activo" as EstadoUsuario,
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const filtered = usuarios.filter((u) => {
        const matchSearch =
            u.nombre.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        const matchRol = filterRol === "all" || u.rol === filterRol
        const matchEstado = filterEstado === "all" || u.estado === filterEstado
        const matchComunidad = filterComunidad === "all" || u.comunidad === filterComunidad
        return matchSearch && matchRol && matchEstado && matchComunidad
    })

    const stats = {
        total: usuarios.length,
        activos: usuarios.filter((u) => u.estado === "activo").length,
        admins: usuarios.filter((u) => u.rol === "admin").length,
        nuevos: usuarios.filter((u) => {
            const created = new Date(u.creadoEn)
            const now = new Date()
            const daysOld = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
            return daysOld <= 30
        }).length,
    }

    function deleteUsuario() {
        if (!deleteDialog) return
        setLoading(true)
        store.deleteUsuario(deleteDialog.id)
        const data = store.getUsuarios()
        setUsuarios([...data])
        setDeleteDialog(null)
        setLoading(false)
    }

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    function validateNombreCompleto(nombre: string): string {
        if (!nombre.trim()) {
            return "Nombre completo incorrecto"
        }
        const palabras = nombre.trim().split(/\s+/)
        if (palabras.length < 2) {
            return "Nombre completo incorrecto"
        }
        // Permitir letras, espacios y caracteres comunes en nombres (guiones, apóstrofes)
        const nombreRegex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s\-']+$/
        if (!nombreRegex.test(nombre)) {
            return "Nombre completo incorrecto"
        }
        return ""
    }

    function handleNombreBlur() {
        setTouchedFields({ ...touchedFields, nombre: true })
        const error = validateNombreCompleto(newUser.nombre)
        setFormErrors({ ...formErrors, nombre: error })
    }

    function validateEmail(email: string): string {
        if (!email.trim()) {
            return "El email es requerido"
        }
        if (!isValidEmail(email)) {
            return "El email no es válido"
        }
        return ""
    }

    function handleEmailBlur() {
        setTouchedFields({ ...touchedFields, email: true })
        const error = validateEmail(newUser.email)
        setFormErrors({ ...formErrors, email: error })
    }

    function validatePassword(password: string) {
        if (!password.trim()) {
            return "La contraseña es requerida"
        }
        if (password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres"
        }
        return ""
    }

    function handlePasswordBlur() {
        setTouchedFields({ ...touchedFields, password: true })
        const error = validatePassword(newUser.password)
        setFormErrors({ ...formErrors, password: error })
    }

    function validateAndSetErrors() {
        const errors = { nombre: "", email: "", password: "" }
        if (!newUser.nombre.trim()) {
            errors.nombre = "El nombre es requerido"
        }
        if (!newUser.email.trim()) {
            errors.email = "El email es requerido"
        } else if (!isValidEmail(newUser.email)) {
            errors.email = "El email no es válido"
        }
        if (!newUser.password.trim()) {
            errors.password = "La contraseña es requerida"
        } else if (newUser.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres"
        }
        setFormErrors(errors)
        return Object.values(errors).every((err) => err === "")
    }

    function createNewUsuario() {
        if (!validateAndSetErrors()) {
            return
        }
        setLoading(true)
        const initials = newUser.nombre
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        
        // Actualmente usando mock data. Para usar el backend real:
        // import { usuariosService } from "@/src/services/usuarios.service"
        // Cambiar USE_MOCK a false en usuarios.service.ts
        // Y usar: await usuariosService.create({ ...newUser, fotoPerfil: ... })
        
        store.addUsuario({
            nombre: newUser.nombre,
            email: newUser.email,
            rol: newUser.rol,
            comunidad: newUser.comunidad,
            estado: "activo",
            fotoPerfil: `https://ui-avatars.com/api/?name=${initials}&background=354558&color=fff&bold=true`,
            ultimoAcceso: new Date().toISOString(),
        })
        const data = store.getUsuarios()
        setUsuarios([...data])
        setNewUserDialog(false)
        setNewUser({
            nombre: "",
            email: "",
            password: "",
            rol: "tutor",
            comunidad: "docente_funcionario",
            estado: "activo",
        })
        setLoading(false)
    }

    function saveEditingUser() {
        if (!editingUser) return
        setLoading(true)
        store.updateUsuario(editingUser.id, {
            rol: editingUser.rol,
            comunidad: editingUser.comunidad,
            estado: editingUser.estado,
        })
        const data = store.getUsuarios()
        setUsuarios([...data])
        setEditDialog(null)
        setEditingUser(null)
        setLoading(false)
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("es-UY", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Administra los usuarios y permisos del sistema
                    </p>
                </div>
                <Button onClick={() => setNewUserDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo usuario
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Total Usuarios</p>
                                <p className="text-2xl font-bold mt-1">{stats.total}</p>
                            </div>
                            <div className="rounded-lg bg-muted p-2 text-primary flex items-center justify-center w-8 h-8">
                                <span className="text-xs leading-none">👥</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Usuarios Activos</p>
                                <p className="text-2xl font-bold mt-1">{stats.activos}</p>
                            </div>
                            <div className="rounded-lg bg-muted p-2 text-success flex items-center justify-center w-8 h-8">
                                <span className="text-xs leading-none">✓</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Administradores</p>
                                <p className="text-2xl font-bold mt-1">{stats.admins}</p>
                            </div>
                            <div className="rounded-lg bg-muted p-2 text-warning flex items-center justify-center w-8 h-8">
                                <span className="text-xs leading-none">⚙️</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Nuevos (este mes)</p>
                                <p className="text-2xl font-bold mt-1">{stats.nuevos}</p>
                            </div>
                            <div className="rounded-lg bg-muted p-2 text-chart-4 flex items-center justify-center w-8 h-8">
                                <span className="text-xs leading-none">📅</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterRol} onValueChange={setFilterRol}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los roles</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="coordinador">Coordinador</SelectItem>
                                <SelectItem value="tutor">Tutor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterComunidad} onValueChange={setFilterComunidad}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Comunidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las comunidades</SelectItem>
                                <SelectItem value="docente_funcionario">Docente/Funcionario UCU</SelectItem>
                                <SelectItem value="alumni">Alumni</SelectItem>
                                <SelectItem value="estudiante">Estudiante</SelectItem>
                                <SelectItem value="externo">Externo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterEstado} onValueChange={setFilterEstado}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>USUARIO</TableHead>
                                <TableHead>EMAIL</TableHead>
                                <TableHead>ROL</TableHead>
                                <TableHead>COMUNIDAD</TableHead>
                                <TableHead>ESTADO</TableHead>
                                <TableHead>ÚLTIMO ACCESO</TableHead>
                                <TableHead className="text-left">ACCIONES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            No se encontraron usuarios
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={u.fotoPerfil} alt={u.nombre} />
                                                    <AvatarFallback>
                                                        {u.nombre
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{u.nombre}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {u.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                                                {ROL_LABELS[u.rol as Rol]}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {COMUNIDAD_LABELS[u.comunidad as TipoComunidad]}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={u.estado} />
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(u.ultimoAcceso)}
                                        </TableCell>
                                        <TableCell className="text-left pl-4">
                                            <div className="flex items-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditDialog(u)
                                                        setEditingUser(u)
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar usuario</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar a {deleteDialog?.nombre}? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={deleteUsuario}
                            disabled={loading}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New User Dialog */}
            <Dialog
                open={newUserDialog}
                onOpenChange={(open) => {
                    if (!open) {
                        setNewUserDialog(false)
                        setFormErrors({ nombre: "", email: "", password: "" })
                        setTouchedFields({ nombre: false, email: false, password: false })
                        setNewUser({
                            nombre: "",
                            email: "",
                            password: "",
                            rol: "" as unknown as Rol,
                            comunidad: "" as unknown as TipoComunidad,
                            estado: "activo",
                        })
                    } else {
                        setNewUserDialog(open)
                    }
                }}
            >
                <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] p-0 flex flex-col">
                    <DialogHeader className="border-b px-6 py-4 flex-shrink-0">
                        <DialogTitle>Nuevo Usuario</DialogTitle>
                        <DialogDescription>
                            Completa los datos para crear un nuevo usuario
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 px-6 py-6">
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <div>
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <span>👤</span> Información Personal
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        {touchedFields.nombre && formErrors.nombre && (
                                            <p className="text-xs text-red-500 font-medium mb-1">{formErrors.nombre}</p>
                                        )}
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Nombre</label>
                                        <Input
                                            placeholder="Nombre completo"
                                            value={newUser.nombre}
                                            onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                                            onBlur={handleNombreBlur}
                                            className={formErrors.nombre && touchedFields.nombre ? "border-red-500" : ""}
                                        />
                                    </div>
                                    <div>
                                        {touchedFields.email && formErrors.email && (
                                            <p className="text-xs text-red-500 font-medium mb-1">{formErrors.email}</p>
                                        )}
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Email</label>
                                        <Input
                                            placeholder="correo@ejemplo.com"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            onBlur={handleEmailBlur}
                                            className={formErrors.email && touchedFields.email ? "border-red-500" : ""}
                                        />
                                    </div>
                                    <div>
                                        {touchedFields.password && formErrors.password && (
                                            <p className="text-xs text-red-500 font-medium mb-1">{formErrors.password}</p>
                                        )}
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Contraseña</label>
                                        <Input
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            onBlur={handlePasswordBlur}
                                            className={formErrors.password && touchedFields.password ? "border-red-500" : ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Rol</label>
                                        <Select value={newUser.rol} onValueChange={(value) => setNewUser({ ...newUser, rol: value as Rol })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="coordinador">Coordinador</SelectItem>
                                                <SelectItem value="tutor">Tutor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Comunidad</label>
                                        <Select value={newUser.comunidad} onValueChange={(value) => setNewUser({ ...newUser, comunidad: value as TipoComunidad })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una comunidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="docente_funcionario">Docente/Funcionario UCU</SelectItem>
                                                <SelectItem value="alumni">Alumni</SelectItem>
                                                <SelectItem value="estudiante">Estudiante</SelectItem>
                                                <SelectItem value="externo">Externo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t px-6 py-4 flex-shrink-0">
                        <Button variant="outline" onClick={resetNewUserForm}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={createNewUsuario}
                            disabled={loading || !newUser.nombre.trim() || !newUser.email.trim() || !isValidEmail(newUser.email) || !newUser.password.trim() || newUser.password.length < 8}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Crear Usuario
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog
                open={!!editDialog}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditDialog(null)
                        setEditingUser(null)
                    }
                }}
            >
                <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] p-0 flex flex-col">
                    <DialogHeader className="border-b px-6 py-4 flex-shrink-0">
                        <DialogTitle>Configuración de Usuario</DialogTitle>
                        <DialogDescription>
                            Gestiona el perfil y permisos del usuario
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 px-6 py-6">
                        {editDialog && editingUser && (
                            <div className="space-y-6">
                                {/* Información Personal */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <span>👤</span> Información Personal
                                    </h3>
                                    <div className="flex gap-4 items-start mb-6">
                                        <div>
                                            <Avatar className="h-24 w-24">
                                                <AvatarImage src={editingUser.fotoPerfil} alt={editingUser.nombre} />
                                                <AvatarFallback>
                                                    {editingUser.nombre
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Nombre</label>
                                                <p className="text-sm font-medium">{editingUser.nombre}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Email</label>
                                                <p className="text-sm">{editingUser.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Último Acceso</label>
                                                <p className="text-sm">{formatDate(editingUser.ultimoAcceso)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Configuración */}
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="text-sm font-semibold">Configuración</h3>

                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Rol</label>
                                        <Select
                                            value={editingUser.rol || "tutor"}
                                            onValueChange={(value) => {
                                                setEditingUser({ ...editingUser, rol: value as Rol })
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="coordinador">Coordinador</SelectItem>
                                                <SelectItem value="tutor">Tutor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Comunidad</label>
                                        <Select
                                            value={editingUser.comunidad || "docente_funcionario"}
                                            onValueChange={(value) => {
                                                setEditingUser({ ...editingUser, comunidad: value as TipoComunidad })
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="docente_funcionario">Docente/Funcionario UCU</SelectItem>
                                                <SelectItem value="alumni">Alumni</SelectItem>
                                                <SelectItem value="estudiante">Estudiante</SelectItem>
                                                <SelectItem value="externo">Externo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Estado</label>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={editingUser.estado} />
                                            <span className="text-xs text-muted-foreground">
                                                {editingUser.estado === "activo" ? "Usuario activo" : "Usuario inactivo"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="space-y-2 border-t pt-4">
                                    <h3 className="text-sm font-semibold mb-3">Acciones</h3>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                const newEstado = editingUser.estado === "activo" ? "inactivo" : "activo"
                                                setEditingUser({ ...editingUser, estado: newEstado as EstadoUsuario })
                                            }}
                                            className={editingUser.estado === "activo" ? "hover:bg-red-50 hover:text-red-600 hover:border-red-600 text-xs" : "hover:bg-green-50 hover:text-green-600 hover:border-green-600 text-xs"}
                                        >
                                            {editingUser.estado === "activo" ? "Desactivar Usuario" : "Activar Usuario"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                setEditDialog(null)
                                                setEditingUser(null)
                                                setDeleteDialog(editingUser)
                                            }}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="border-t px-6 py-4 flex-shrink-0">
                        <Button variant="outline" onClick={() => {
                            setEditDialog(null)
                            setEditingUser(null)
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={saveEditingUser} className="bg-blue-600 hover:bg-blue-700">
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
