"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, FileEdit, Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Datos de ejemplo para cotizaciones
const cotizacionesEjemplo = {
  "COT-001": {
    id: "COT-001",
    fecha: "2024-04-01",
    validez: "15",
    estado: "Pendiente",
    cliente: {
      nombre: "Empresa ABC",
      email: "contacto@empresaabc.com",
      telefono: "555-123-4567",
      direccion: "Av. Principal #123, Ciudad Ejemplo, CP 12345",
    },
    items: [
      { id: 1, descripcion: "Desarrollo de sitio web", cantidad: 1, precioUnitario: 850.0, total: 850.0 },
      { id: 2, descripcion: "Diseño de logo corporativo", cantidad: 1, precioUnitario: 250.0, total: 250.0 },
      { id: 3, descripcion: "Mantenimiento mensual", cantidad: 1, precioUnitario: 150.0, total: 150.0 },
    ],
    notas:
      "Esta cotización tiene una validez de 15 días. El tiempo de entrega es de 30 días hábiles después de la aprobación. Se requiere un anticipo del 50% para iniciar el trabajo.",
  },
  "COT-002": {
    id: "COT-002",
    fecha: "2024-03-28",
    validez: "30",
    estado: "Aprobada",
    cliente: {
      nombre: "Corporación XYZ",
      email: "compras@corpxyz.com",
      telefono: "555-987-6543",
      direccion: "Calle Comercial #456, Ciudad Negocio, CP 54321",
    },
    items: [
      { id: 1, descripcion: "Consultoría estratégica", cantidad: 20, precioUnitario: 125.0, total: 2500.0 },
      { id: 2, descripcion: "Implementación de sistema", cantidad: 1, precioUnitario: 950.75, total: 950.75 },
    ],
    notas: "Precios sujetos a cambio sin previo aviso. La implementación incluye 2 sesiones de capacitación.",
  },
  "COT-003": {
    id: "COT-003",
    fecha: "2024-03-25",
    validez: "7",
    estado: "Rechazada",
    cliente: {
      nombre: "Distribuidora 123",
      email: "info@dist123.com",
      telefono: "555-111-2222",
      direccion: "Blvd. Industrial #789, Zona Industrial, CP 67890",
    },
    items: [{ id: 1, descripcion: "Servicio de logística", cantidad: 1, precioUnitario: 875.5, total: 875.5 }],
    notas:
      "El servicio no incluye seguro de mercancía. Cotización rechazada por el cliente por motivos presupuestarios.",
  },
  "COT-004": {
    id: "COT-004",
    fecha: "2024-03-20",
    validez: "30",
    estado: "Aprobada",
    cliente: {
      nombre: "Servicios Técnicos",
      email: "soporte@servtec.com",
      telefono: "555-333-4444",
      direccion: "Av. Tecnológica #101, Ciudad Innovación, CP 13579",
    },
    items: [
      { id: 1, descripcion: "Mantenimiento preventivo", cantidad: 4, precioUnitario: 250.0, total: 1000.0 },
      { id: 2, descripcion: "Reemplazo de componentes", cantidad: 1, precioUnitario: 1100.0, total: 1100.0 },
    ],
    notas: "Servicio con garantía de 3 meses. Incluye reporte técnico detallado.",
  },
  "COT-005": {
    id: "COT-005",
    fecha: "2024-03-15",
    validez: "60",
    estado: "Pendiente",
    cliente: {
      nombre: "Constructora Norte",
      email: "proyectos@constnorte.com",
      telefono: "555-555-5555",
      direccion: "Calle Constructor #202, Fraccionamiento Obras, CP 24680",
    },
    items: [
      { id: 1, descripcion: "Proyecto arquitectónico", cantidad: 1, precioUnitario: 3500.25, total: 3500.25 },
      { id: 2, descripcion: "Planos estructurales", cantidad: 1, precioUnitario: 1200.0, total: 1200.0 },
      { id: 3, descripcion: "Renderizado 3D", cantidad: 3, precioUnitario: 300.0, total: 900.0 },
    ],
    notas: "Los precios no incluyen trámites municipales. Se entregará en formato digital e impreso.",
  },
}

export default function DetalleCotizacion() {
  const params = useParams()
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Simulando carga de datos
    setTimeout(() => {
      const id = params.id
      if (cotizacionesEjemplo[id]) {
        setCotizacion(cotizacionesEjemplo[id])
      }
      setCargando(false)
    }, 500)
  }, [params.id])

  if (cargando) {
    return (
      <div className="container mx-auto flex h-[70vh] items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Cargando información de la cotización...</p>
        </div>
      </div>
    )
  }

  if (!cotizacion) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver a cotizaciones
          </Link>
        </div>

        <Card>
          <CardContent className="flex h-40 flex-col items-center justify-center">
            <p className="text-lg font-medium">Cotización no encontrada</p>
            <p className="text-muted-foreground">La cotización que buscas no existe o ha sido eliminada</p>
            <Link href="/" className="mt-4">
              <Button>Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calcular subtotal
  const subtotal = cotizacion.items.reduce((sum, item) => sum + item.total, 0)
  const impuesto = subtotal * 0.16 // 16% de impuesto
  const total = subtotal + impuesto

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Volver a cotizaciones
        </Link>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Cotización #{cotizacion.id}</h1>
          <p className="text-muted-foreground">Creada el {new Date(cotizacion.fecha).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/cotizaciones/${cotizacion.id}/editar`}>
            <Button variant="outline">
              <FileEdit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Nombre/Empresa:</dt>
                <dd className="col-span-2">{cotizacion.cliente.nombre}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Email:</dt>
                <dd className="col-span-2">{cotizacion.cliente.email}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Teléfono:</dt>
                <dd className="col-span-2">{cotizacion.cliente.telefono}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Dirección:</dt>
                <dd className="col-span-2">{cotizacion.cliente.direccion}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Número:</dt>
                <dd className="col-span-2">{cotizacion.id}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Fecha:</dt>
                <dd className="col-span-2">{new Date(cotizacion.fecha).toLocaleDateString()}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Validez:</dt>
                <dd className="col-span-2">{cotizacion.validez} días</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">Estado:</dt>
                <dd className="col-span-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      cotizacion.estado === "Aprobada"
                        ? "bg-green-100 text-green-800"
                        : cotizacion.estado === "Rechazada"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {cotizacion.estado}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Productos/Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Descripción</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cotizacion.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>${item.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex flex-col items-end space-y-2">
            <div className="flex w-full justify-between border-t pt-4 sm:w-72">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex w-full justify-between sm:w-72">
              <span>Impuesto (16%):</span>
              <span className="font-medium">${impuesto.toFixed(2)}</span>
            </div>
            <div className="flex w-full justify-between border-t pt-2 sm:w-72">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {cotizacion.notas && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notas/Condiciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{cotizacion.notas}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
