"use client";

import { useEffect, useState } from "react";
import { type Apoyo } from "@/src/services/apoyos.service";
import { casosService } from "@/src/services/casos.service";
import {
  programasService,
  type ProgramaResponse,
} from "@/src/services/programas.service";
import { useApoyosStore } from "@/src/hooks/useApoyosStore";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Search, Plus, Trash2 } from "lucide-react";

interface CasoSimple {
  id_caso: number;
  nombre_caso: string;
}

export function ApoyosList() {
  const { status, apoyos, catalogo, fetchApoyos, createApoyo, deleteApoyo } =
    useApoyosStore();

  const [casos, setCasos] = useState<CasoSimple[]>([]);
  const [programas, setProgramas] = useState<ProgramaResponse[]>([]);
  const [search, setSearch] = useState("");
  const [filterTipoApoyo, setFilterTipoApoyo] = useState<string>("all");
  const [newApoyoDialog, setNewApoyoDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Apoyo | null>(null);
  const [newApoyo, setNewApoyo] = useState({
    id_catalogo_apoyo: 0,
    fecha_inicio: "",
    fecha_fin: "",
    id_caso: 0,
    id_programa: 0,
  });
  const [formErrors, setFormErrors] = useState({
    id_catalogo_apoyo: "",
    id_caso: "",
    id_programa: "",
  });

  const loading = status === "loading";

  useEffect(() => {
    fetchApoyos();
    casosService.getAll().then((data) => setCasos(data as CasoSimple[]));
    programasService
      .getAll()
      .then((data) => setProgramas(data.filter((p) => p.activo)));
  }, [fetchApoyos]);

  const resetNewApoyoForm = () => {
    setNewApoyoDialog(false);
    setFormErrors({ id_catalogo_apoyo: "", id_caso: "", id_programa: "" });
    setNewApoyo({
      id_catalogo_apoyo: 0,
      fecha_inicio: "",
      fecha_fin: "",
      id_caso: 0,
      id_programa: 0,
    });
  };

  const filtered = apoyos.filter((a) => {
    const casoNombre =
      casos.find((c) => c.id_caso === a.idCaso)?.nombre_caso || "";
    const programaNombre =
      programas.find((p) => p.id_programa === a.idPrograma)?.nombre || "";
    const tipoApoyo = a.tipoApoyo ?? "";
    const matchSearch =
      tipoApoyo.toLowerCase().includes(search.toLowerCase()) ||
      casoNombre.toLowerCase().includes(search.toLowerCase()) ||
      programaNombre.toLowerCase().includes(search.toLowerCase());
    const matchTipo =
      filterTipoApoyo === "all" || tipoApoyo === filterTipoApoyo;
    return matchSearch && matchTipo;
  });

  const stats = {
    total: apoyos.length,
    activos: apoyos.filter(
      (a) => !a.fechaFin || new Date(a.fechaFin) > new Date(),
    ).length,
    programas: new Set(apoyos.map((a) => a.idPrograma)).size,
  };

  async function handleDeleteApoyo() {
    if (!deleteDialog) return;
    try {
      await deleteApoyo(deleteDialog.id);
      setDeleteDialog(null);
    } catch {
      console.error("Error al eliminar el apoyo");
    }
  }

  function validateForm() {
    const errors = { id_catalogo_apoyo: "", id_caso: "", id_programa: "" };
    if (!newApoyo.id_catalogo_apoyo || newApoyo.id_catalogo_apoyo === 0) {
      errors.id_catalogo_apoyo = "Debe seleccionar un tipo de apoyo";
    }
    if (!newApoyo.id_caso || newApoyo.id_caso === 0) {
      errors.id_caso = "Debe seleccionar un caso";
    }
    if (!newApoyo.id_programa || newApoyo.id_programa === 0) {
      errors.id_programa = "Debe seleccionar un programa";
    }
    setFormErrors(errors);
    return Object.values(errors).every((err) => err === "");
  }

  async function handleCreateApoyo() {
    if (!validateForm()) return;
    try {
      await createApoyo({
        id_catalogo_apoyo: newApoyo.id_catalogo_apoyo,
        fecha_inicio: newApoyo.fecha_inicio || null,
        fecha_fin: newApoyo.fecha_fin || null,
        id_caso: newApoyo.id_caso,
        id_programa: newApoyo.id_programa,
      });
      resetNewApoyoForm();
    } catch {
      console.error("Error al crear el apoyo");
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Apoyos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra los apoyos otorgados a los casos
          </p>
        </div>
        <Button onClick={() => setNewApoyoDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo apoyo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Apoyos
                </p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-muted p-2 text-primary flex items-center justify-center w-8 h-8">
                <span className="text-xs leading-none">📋</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Apoyos Activos
                </p>
                <p className="text-2xl font-bold mt-1" suppressHydrationWarning>
                  {stats.activos}
                </p>
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
                <p className="text-xs font-medium text-muted-foreground">
                  Programas Involucrados
                </p>
                <p className="text-2xl font-bold mt-1">{stats.programas}</p>
              </div>
              <div className="rounded-lg bg-muted p-2 text-chart-4 flex items-center justify-center w-8 h-8">
                <span className="text-xs leading-none">🎯</span>
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
                placeholder="Buscar por tipo, caso o programa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterTipoApoyo} onValueChange={setFilterTipoApoyo}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Tipo de apoyo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {catalogo.map((item) => (
                  <SelectItem key={item.id_catalogo_apoyo} value={item.nombre}>
                    {item.nombre}
                  </SelectItem>
                ))}
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
                <TableHead>TIPO DE APOYO</TableHead>
                <TableHead>CASO</TableHead>
                <TableHead>PROGRAMA</TableHead>
                <TableHead>FECHA INICIO</TableHead>
                <TableHead>FECHA FIN</TableHead>
                <TableHead className="text-right">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {loading
                        ? "Cargando apoyos..."
                        : "No se encontraron apoyos"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((apoyo) => {
                  const caso = casos.find((c) => c.id_caso === apoyo.idCaso);
                  const programa = programas.find(
                    (p) => p.id_programa === apoyo.idPrograma,
                  );
                  return (
                    <TableRow key={apoyo.id}>
                      <TableCell className="font-medium">
                        {apoyo.tipoApoyo ?? "-"}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {caso?.nombre_caso || `Caso #${apoyo.idCaso}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100">
                          {programa?.nombre || `Programa #${apoyo.idPrograma}`}
                        </span>
                      </TableCell>
                      <TableCell
                        className="text-sm text-muted-foreground"
                        suppressHydrationWarning
                      >
                        {formatDate(apoyo.fechaInicio)}
                      </TableCell>
                      <TableCell
                        className="text-sm text-muted-foreground"
                        suppressHydrationWarning
                      >
                        {formatDate(apoyo.fechaFin)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteDialog(apoyo)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar apoyo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este apoyo? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteApoyo}
              disabled={loading}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Apoyo Dialog */}
      <Dialog
        open={newApoyoDialog}
        onOpenChange={(open) => {
          if (!open) resetNewApoyoForm();
          else setNewApoyoDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="border-b px-6 py-4 flex-shrink-0">
            <DialogTitle>Nuevo Apoyo</DialogTitle>
            <DialogDescription>
              Completa los datos para registrar un nuevo apoyo
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-6 py-6">
            <div className="space-y-4">
              <div>
                {formErrors.id_catalogo_apoyo && (
                  <p className="text-xs text-red-500 font-medium mb-1">
                    {formErrors.id_catalogo_apoyo}
                  </p>
                )}
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Tipo de Apoyo *
                </label>
                <Select
                  value={
                    newApoyo.id_catalogo_apoyo === 0
                      ? ""
                      : newApoyo.id_catalogo_apoyo.toString()
                  }
                  onValueChange={(value) =>
                    setNewApoyo({
                      ...newApoyo,
                      id_catalogo_apoyo: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger
                    className={
                      formErrors.id_catalogo_apoyo ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Seleccione un tipo de apoyo" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogo.map((item) => (
                      <SelectItem
                        key={item.id_catalogo_apoyo}
                        value={item.id_catalogo_apoyo.toString()}
                      >
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {formErrors.id_caso && (
                  <p className="text-xs text-red-500 font-medium mb-1">
                    {formErrors.id_caso}
                  </p>
                )}
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Caso *
                </label>
                <Select
                  value={newApoyo.id_caso.toString()}
                  onValueChange={(value) =>
                    setNewApoyo({ ...newApoyo, id_caso: parseInt(value) })
                  }
                >
                  <SelectTrigger
                    className={formErrors.id_caso ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccione un caso" />
                  </SelectTrigger>
                  <SelectContent>
                    {casos.map((caso) => (
                      <SelectItem
                        key={caso.id_caso}
                        value={caso.id_caso.toString()}
                      >
                        {caso.nombre_caso}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {formErrors.id_programa && (
                  <p className="text-xs text-red-500 font-medium mb-1">
                    {formErrors.id_programa}
                  </p>
                )}
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Programa *
                </label>
                <Select
                  value={newApoyo.id_programa.toString()}
                  onValueChange={(value) =>
                    setNewApoyo({ ...newApoyo, id_programa: parseInt(value) })
                  }
                >
                  <SelectTrigger
                    className={formErrors.id_programa ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccione un programa" />
                  </SelectTrigger>
                  <SelectContent>
                    {programas.map((programa) => (
                      <SelectItem
                        key={programa.id_programa}
                        value={programa.id_programa.toString()}
                      >
                        {programa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={newApoyo.fecha_inicio}
                  onChange={(e) =>
                    setNewApoyo({ ...newApoyo, fecha_inicio: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={newApoyo.fecha_fin}
                  onChange={(e) =>
                    setNewApoyo({ ...newApoyo, fecha_fin: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4 flex-shrink-0">
            <Button variant="outline" onClick={resetNewApoyoForm}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateApoyo}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Crear Apoyo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
