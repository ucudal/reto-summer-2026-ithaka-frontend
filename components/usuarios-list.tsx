"use client"

import { useEffect, useState, useCallback } from "react"
import { store } from "@/lib/data"
import type { Usuario, Rol, EstadoUsuario, TipoComunidad } from "@/lib/data"
import { ROL_LABELS, ESTADO_USUARIO_LABELS, COMUNIDAD_LABELS } from "@/lib/data"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus } from "lucide-react"

export function UsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [search, setSearch] = useState("")
  const [filterRol, setFilterRol] = useState<string>("all")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [filterComunidad, setFilterComunidad] = useState<string>("all")
  const [editDialog, setEditDialog] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(() => {
    const data = store.getUsuarios()
    setUsuarios(data)
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

  function toggleEstado(usuario: Usuario) {
    setLoading(true)
    store.toggleUsuarioEstado(usuario.id)
    loadData()
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
        <Button>
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
                <TableHead className="text-right">ACCIONES</TableHead>
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleEstado(u)}
                          disabled={loading}
                          className={u.estado === "activo" ? "hover:bg-red-50 hover:text-red-600 hover:border-red-600" : "hover:bg-green-50 hover:text-green-600 hover:border-green-600"}
                        >
                          {u.estado === "activo" ? "Desactivar" : "Activar"}
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
    </div>
  )
}
