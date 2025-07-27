"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Datos de ejemplo para cotizaciones (mismo objeto que en la página de detalle)
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
      direccion: "Av. Principal #123, Ciudad Ejemplo, CP 12345"
    },
    items: [
      { id: 1, descripcion: "Desarrollo de sitio web", cantidad: 1, precioUnitario: 850.00, total: 850.00 },
      { id: 2, descripcion: "Diseño de logo corporativo", cantidad: 1, precioUnitario: 250.00, total: 250.00 },
      { id: 3, descripcion: "Mantenimiento mensual", cantidad: 1, precioUnitario: 150.00, total: 150.00 }
    ],
    notas: "Esta cotización tiene una validez de 15 días. El tiempo de entrega es de 30 días hábiles después de la aprobación. Se requiere un anticipo del 50% para iniciar el trabajo."
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
      direccion: "Calle Comercial #456, Ciudad Negocio, CP 54321"
    },
    items: [
      { id: 1, descripcion: "Consultoría estratégica", cantidad: 20, precioUnitario: 125.00, total: 2500.00 },
      { id: 2, descripcion: "Implementación de sistema", cantidad: 1, precioUnitario: 950.75, total: 950.75 }
    ],
    notas: "Precios sujetos a cambio sin previo aviso. La implementación incluye 2 sesiones de capacitación."
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
      direccion: "Blvd. Industrial #789, Zona Industrial, CP 67890"
    },
    items: [
      { id: 1, descripcion: "Servicio de logística", cantidad: 1, precioUnitario: 875.50, total: 875.50 }
    ],
    notas: "El servicio no incluye seguro de mercancía. Cotización rechazada por el cliente por motivos presupuestarios."
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
      direccion: "Av. Tecnológica #101, Ciudad Innovación, CP 13579"
    },
    items: [
      { id: 1, descripcion: "Mantenimiento preventivo", cantidad: 4, precioUnitario: 250.00, total: 1000.00 },
      { id: 2, descripcion: "Reemplazo de componentes", cantidad: 1, precioUnitario: 1100.00, total: 1100.00 }
    ],
    notas: "Servicio con garantía de 3 meses. Incluye reporte técnico detallado."
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
      direccion: "Calle Constructor #202, Fraccionamiento Obras, CP 24680"
    },
    items: [
      { id: 1, descripcion: "Proyecto arquitectónico", cantidad: 1, precioUnitario: 3500.25, total: 3500.25 },
      { id: 2, descripcion: "Planos estructurales", cantidad: 1, precioUnitario: 1200.00, total: 1200.00 },
      { id: 3, descripcion: "Renderizado 3D", cantidad: 3, precioUnitario: 300.00, total: 900.00 }
    ],
    notas: "Los precios no incluyen trámites municipales. Se entregará en formato digital e impreso."
  }
}

export default function EditarCotizacion() {
  const params = useParams()
  const router = useRouter()
  const [cargando, setCargando] = useState(true)
  
  // Estados para los campos del formulario
  const [cliente, setCliente] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [validez, setValidez] = useState("15")
  const [estado, setEstado] = useState("Pendiente")
  const [notas, setNotas] = useState("")
  const [items, setItems] = useState([])
  const [fecha, setFecha] = useState("")
  
  useEffect(() => {
    // Simulando carga de datos
    setTimeout(() => {
      const id = params.id
      if (cotizacionesEjemplo[id]) {
        const cotizacion = cotizacionesEjemplo[id]
        
        // Cargar datos en el formulario
        setCliente(cotizacion.cliente.nombre)
        setEmail(cotizacion.cliente.email)
        setTelefono(cotizacion.cliente.telefono)
        setDireccion(cotizacion.cliente.direccion)
        setValidez(cotizacion.validez)
        setEstado(cotizacion.estado)
        setNotas(cotizacion.notas)
        setItems([...cotizacion.items]) // Copia profunda
        setFecha(cotizacion.fecha)
      }
      setCargando(false)
    }, 500)
  }, [params.id])
  
  // Calcular subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const impuesto = subtotal * 0.16 // 16% de impuesto
  const total = subtotal + impuesto

  // Actualizar item
  const actualizarItem = (id, campo, valor) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const itemActualizado = { ...item, [campo]: valor }
        
        // Recalcular total si cambia cantidad o precio
        if (campo === 'cantidad' || campo === 'precioUnitario') {
          itemActualizado.total = itemActualizado.cantidad * itemActualizado.precioUnitario
        }
        
        return itemActualizado
      }
      return item
    }))
  }

  // Agregar nuevo item
  const agregarItem = () => {
    const nuevoId = Math.max(...items.map(item => item.id), 0) + 1
    setItems([...items, { id: nuevoId, descripcion: "", cantidad: 1, precioUnitario: 0, total: 0 }])
  }

  // Eliminar item
  const eliminarItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  // Guardar cambios
  const guardarCambios = () => {
    // Aquí se implementaría la lógica para actualizar en una base de datos
    // Por ahora solo redirigimos a la página de detalle
    router.push(`/cotizaciones/${params.id}`)
  }
  
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
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href={`/cotizaciones/${params.id}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Volver a la cotización
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Cotización #{params.id}</h1>
        <p className="text-muted-foreground">Modifica los detalles de la cotización</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>
              Modifica los datos del cliente para la cotización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cliente">Nombre/Empresa</Label>
              <Input 
                id="cliente" 
                value={cliente} 
                onChange={(e) => setCliente(e.target.value)} 
                placeholder="Nombre del cliente o empresa"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input 
                id="telefono" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)} 
                placeholder="Teléfono de contacto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea 
                id="direccion" 
                value={direccion} 
                onChange={(e) => setDireccion(e.target.value)} 
                placeholder="Dirección completa"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Cotización</CardTitle>
            <CardDescription>
              Configura los detalles generales de la cotización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input 
                id="fecha" 
                type="date" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="validez">Validez (días)</Label>
              <Select value={validez} onValueChange={setValidez}>
                <SelectTrigger id="validez">
                  <SelectValue placeholder="Selecciona los días de validez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 días</SelectItem>
                  <SelectItem value="15">15 días</SelectItem>
                  <SelectItem value="30">30 días</SelectItem>
                  <SelectItem value="60">60 días</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notas">Notas/Condiciones</Label>
              <Textarea 
                id="notas" 
                value={notas} 
                onChange={(e) => setNotas(e.target.value)} 
                placeholder="Términos, condiciones o notas adicionales"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Productos/Servicios</CardTitle>
          <CardDescription>
            Modifica los productos o servicios incluidos en la cotización
          </CardDescription>
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input 
                        value={item.descripcion} 
                        onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)} 
                        placeholder="Descripción del producto o servicio"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="1"
                        value={item.cantidad} 
                        onChange={(e) => actualizarItem(item.id, 'cantidad', parseInt(e.target.value) || 0)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={item.precioUnitario} 
                        onChange={(e) => actualizarItem(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)} 
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${item.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => eliminarItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={agregarItem}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto/Servicio
          </Button>
          
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
        <CardFooter className="flex justify-end gap-4">
          <Link href={`/cotizaciones/${params.id}`}>
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button onClick={guardarCambios}>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
