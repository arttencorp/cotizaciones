"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Printer, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Modificar la constante productosPreexistentes para añadir el nuevo producto
const productosPreexistentes = [
  {
    id: "ASWG",
    descripcion: "Material Vegetal Banano Código ASWG",
    precioUnitario: 4.5,
    certificados: [
      {
        titulo: "Negativo a la presencia de Bacterias Fitopatógenas",
        codigo: "2023114632010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 114644-2023-AG-SENASA-OCDP-UCDSV",
        detalle: [
          "MET-UCDSV/BM-22: FUSARIUM OXYSPORUM F. SP CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR CONVENCIONAL - REGIÓN IGS",
          "MET-UCDSV/BM-102: FUSARIUM OXYSPORUM F.SP. CUBENSE  CON PCR CONVENCIONAL - REGIÓN IGS",
          "MET-UCDSV/BM-102: FUSARIUM OXYSPORUM F.SP. CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR CONVENCIONAL PRIMERS LI",
        ],
      },
      {
        titulo: "Negativo a la presencia de Ralstonia solanacearum",
        codigo: "2023114630010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 114535-2023-AG-SENASA-OCDP-UCDSV",
        detalle: [
          "MET-UCDSV/BM-102: FUSARIUM OXYSPORUM F.SP. CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR CONVENCIONAL PRIMERS LI",
        ],
      },
      {
        titulo: "Negativo a la presencia de banana Streak virus.",
        codigo: "2020109320010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 100341-2021-AG-SENASA-OCDP-UCDSV",
        detalle: ["MET-UCDSV/VIR-002: DAS ELISA PARA DETECCIÓN DE VIRUS FITOPATÓGENO EN MATERIAL VEGETAL"],
      },
    ],
    fichaTecnica: {
      titulo: "FICHA TÉCNICA BANANO CAVENDISH - CLON WILLIAMS",
      descripcion: "Información técnica del producto Banano Cavendish - Clon Williams (CÓDIGO: WG)",
      archivo: "/fichas/ficha-tecnica-aswg.png",
    },
    tipoProducto: "vegetal",
  },
  {
    id: "ASC5",
    descripcion: "Material Vegetal Banano Código ASC5",
    precioUnitario: 4.5,
    certificados: [
      {
        titulo: "Negativo a la presencia de Fusarium oxysporum f.sp. cubense Raza 4 Tropical",
        codigo: "2023114627010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 114531-2023-AG-SENASA-OCDP-UCDSV",
        detalle: [
          "MET-UCDSV/BM-22: FUSARIUM OXYSPORUM F. SP CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR CONVENCIONAL - REGIÓN IGS",
        ],
      },
      {
        titulo: "Negativo a la presencia de Fusarium oxysporum f.sp. cubense Raza 4 Tropical",
        codigo: "2023114627010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 114531-2023-AG-SENASA-OCDP-UCDSV",
        detalle: [
          "MET-UCDSV/BM-102: FUSARIUM OXYSPORUM F.SP. CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR CONVENCIONAL PRIMERS LI",
        ],
      },
      {
        titulo: "Negativo a la presencia de Bacterias Fitopatógenas",
        codigo: "2023114632010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 114644-2023-AG-SENASA-OCDP-UCDSV",
        detalle: ["MET-UCDSV/BAC-005: DIAGNÓSTICO DE BACTERIAS FITOPATÓGENAS EN MATERIAL VEGETAL"],
      },
      {
        titulo: "Negativo a la presencia de Ralstonia solanacearum",
        codigo: "2023114632010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 114644-2023-AG-SENASA-OCDP-UCDSV",
        detalle: ["MET-UCDSV/BAC-004: BACTERIAS FITOPATÓGENAS POR SEROLOGÍA EN MATERIAL VEGETAL"],
      },
      {
        titulo: "Negativo a la presencia de banana Streak virus.",
        codigo: "2020109321010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 100342-2021-AG-SENASA-OCDP-UCDSV",
        detalle: ["MET-UCDSV/VIR-002: DAS ELISA PARA DETECCIÓN DE VIRUS FITOPATÓGENO EN MATERIAL VEGETAL"],
      },
      {
        titulo: "Negativo a la presencia de banana Streak virus.",
        codigo: "2020109319010001",
        tipo: "PLANTA COMPLETA",
        informe: "Nº 100340-2021-AG-SENASA-OCDP-UCDSV",
        detalle: ["MET-UCDSV/VIR-002: DAS ELISA PARA DETECCIÓN DE VIRUS FITOPATÓGENO EN MATERIAL VEGETAL"],
      },
    ],
    fichaTecnica: {
      titulo: "FICHA TÉCNICA BANANO CAVENDISH - CLON VALERY",
      descripcion: "Información técnica del producto Banano Cavendish - Clon Valery (CÓDIGO: ASC5)",
      archivo: "/fichas/ficha-tecnica-asc5.png",
    },
    tipoProducto: "vegetal",
  },
  {
    id: "LAB",
    descripcion: "Material/Instrumento de laboratorio",
    precioUnitario: 0,
    tipoProducto: "laboratorio",
  },
]

export default function NuevaCotizacion() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("informacion")
  const [razonSocial, setRazonSocial] = useState("")
  const [dniRuc, setDniRuc] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")
  const [terminosCondiciones, setTerminosCondiciones] = useState(
    "Las plantas meristemáticas son producidas en nuestro laboratorio, procedentes de nuestra parcela de plantas madre de procedencia nacional.\n\nPRESENTACIÓN DEL PRODUCTO:\nPlantas de 20 a 25 cm de altura desde la base de bolsa.\nPlantas libres de enfermedades y patógenos.\nCertificado de prueba de virus",
  )
  const [items, setItems] = useState([{ id: 1, descripcion: "", cantidad: 1, precioUnitario: 0, total: 0, codigo: "" }])
  const [numeroCotizacion, setNumeroCotizacion] = useState(generarNumeroCotizacion())
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split("T")[0])
  const [fechaVencimiento, setFechaVencimiento] = useState(calcularFechaVencimiento(10))
  const [lugarRecojo, setLugarRecojo] = useState("")
  const [formaPago, setFormaPago] = useState("completo")
  const [formaEntrega, setFormaEntrega] = useState("")
  const [certificadosCalidad, setCertificadosCalidad] = useState(
    "- Certificado de calidad genética\n- Certificado de sanidad vegetal\n- Certificado libre de virus",
  )
  const [fichasTecnicas, setFichasTecnicas] = useState([])
  const [tipoProductoSeleccionado, setTipoProductoSeleccionado] = useState("vegetal")

  // Añadir un nuevo estado para el tipo de documento
  const [tipoDocumento, setTipoDocumento] = useState("cotizacion")

  // Añadir un nuevo estado para controlar si los precios incluyen IGV
  const [preciosConIGV, setPreciosConIGV] = useState(false)

  // Modificar el título dinámicamente según el tipo de documento seleccionado
  const obtenerTituloDocumento = () => {
    switch (tipoDocumento) {
      case "boleta":
        return "Boleta"
      case "factura":
        return "Factura"
      default:
        return "Cotización"
    }
  }

  // Generar número de cotización
  function generarNumeroCotizacion() {
    const año = new Date().getFullYear()
    const numero = Math.floor(Math.random() * 9000) + 1000
    return `${numero}-${año}`
  }

  // Calcular fecha de vencimiento
  function calcularFechaVencimiento(dias) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() + dias)
    return fecha.toISOString().split("T")[0]
  }

  // Calcular subtotal e IGV según la opción seleccionada
  const calcularTotales = () => {
    if (preciosConIGV) {
      // Si los precios incluyen IGV, extraemos el valor sin IGV
      const totalConIGV = items.reduce((sum, item) => sum + (item.total || 0), 0)
      const subtotalSinIGV = totalConIGV / 1.18
      const igv = totalConIGV - subtotalSinIGV
      return {
        subtotal: subtotalSinIGV,
        impuesto: igv,
        total: totalConIGV,
      }
    } else {
      // Si los precios no incluyen IGV, el cálculo es directo
      const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
      const impuesto = subtotal * 0.18
      const total = subtotal + impuesto
      return {
        subtotal,
        impuesto,
        total,
      }
    }
  }

  const { subtotal, impuesto, total } = calcularTotales()

  // Convertir número a texto
  function numeroATexto(numero) {
    if (typeof numero !== "number") {
      return "cero y 00/100"
    }

    const unidades = [
      "",
      "uno",
      "dos",
      "tres",
      "cuatro",
      "cinco",
      "seis",
      "siete",
      "ocho",
      "nueve",
      "diez",
      "once",
      "doce",
      "trece",
      "catorce",
      "quince",
      "dieciséis",
      "diecisiete",
      "dieciocho",
      "diecinueve",
    ]
    const decenas = [
      "",
      "diez",
      "veinte",
      "treinta",
      "cuarenta",
      "cincuenta",
      "sesenta",
      "setenta",
      "ochenta",
      "noventa",
    ]
    const centenas = [
      "",
      "ciento",
      "doscientos",
      "trescientos",
      "cuatrocientos",
      "quinientos",
      "seiscientos",
      "setecientos",
      "ochocientos",
      "novecientos",
    ]

    if (numero === 0) return "cero"

    const entero = Math.floor(numero)
    const decimal = Math.round((numero - entero) * 100)

    let resultado = ""

    if (entero >= 1000) {
      const miles = Math.floor(entero / 1000)
      resultado += miles === 1 ? "mil " : numeroATexto(miles) + " mil "
      numero = entero % 1000
    } else {
      numero = entero
    }

    if (numero >= 100) {
      resultado += centenas[Math.floor(numero / 100)] + " "
      numero = numero % 100
    }

    if (numero >= 20) {
      resultado += decenas[Math.floor(numero / 10)]
      if (numero % 10 !== 0) {
        resultado += " y " + unidades[numero % 10]
      }
    } else {
      resultado += unidades[numero]
    }

    resultado = resultado.trim()

    if (decimal > 0) {
      resultado += ` y ${decimal}/100`
    } else {
      resultado += " y 00/100"
    }

    return resultado
  }

  // Modificar la función seleccionarProducto para acumular certificados y fichas técnicas
  const seleccionarProducto = (id, productoId) => {
    if (!productoId) return

    if (productoId === "personalizado") {
      // Si selecciona "personalizado", solo actualiza el código pero mantiene los demás valores
      setItems(
        items.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              codigo: "personalizado",
            }
          }
          return item
        }),
      )
      return
    }

    const productoSeleccionado = productosPreexistentes.find((p) => p.id === productoId)

    if (productoSeleccionado) {
      setItems(
        items.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              descripcion: productoSeleccionado.descripcion,
              precioUnitario: productoSeleccionado.precioUnitario,
              total: item.cantidad * productoSeleccionado.precioUnitario,
              codigo: productoSeleccionado.id,
            }
          }
          return item
        }),
      )

      // Actualizar el tipo de producto seleccionado
      if (productoSeleccionado.tipoProducto) {
        setTipoProductoSeleccionado(productoSeleccionado.tipoProducto)

        // Si es un producto de laboratorio, actualizar los términos y condiciones
        if (productoSeleccionado.tipoProducto === "laboratorio") {
          setTerminosCondiciones(
            "Términos y condiciones para materiales e instrumentos de laboratorio:\n\n" +
              "1. Los precios incluyen IGV.\n" +
              "2. Garantía según especificaciones del fabricante.\n" +
              "3. Soporte técnico disponible para consultas sobre el uso de los equipos.\n" +
              "4. Los materiales cumplen con estándares de calidad para uso en laboratorio.",
          )
        } else {
          // Restaurar términos y condiciones para productos vegetales
          setTerminosCondiciones(
            "Las plantas meristemáticas son producidas en nuestro laboratorio, procedentes de nuestra parcela de plantas madre de procedencia nacional.\n\nPRESENTACIÓN DEL PRODUCTO:\nPlantas de 20 a 25 cm de altura desde la base de bolsa.\nPlantas libres de enfermedades y patógenos.\nCertificado de prueba de virus",
          )
        }
      }

      // Actualizar los certificados de calidad y fichas técnicas combinando todos los productos seleccionados
      setTimeout(() => {
        actualizarCertificadosCombinados()
        actualizarFichasTecnicas()
      }, 0)
    }
  }

  // Agregar una nueva función para actualizar las fichas técnicas
  const actualizarFichasTecnicas = () => {
    try {
      // Obtener todos los códigos de productos seleccionados (excepto "personalizado" y "LAB")
      const codigosSeleccionados = items
        .filter((item) => item && item.codigo) // Asegurarse de que item existe
        .map((item) => item.codigo)
        .filter((codigo) => codigo && codigo !== "personalizado" && codigo !== "LAB")

      // Si no hay productos, vaciar las fichas técnicas
      if (!codigosSeleccionados || codigosSeleccionados.length === 0) {
        setFichasTecnicas([])
        return
      }

      // Eliminar duplicados de códigos
      const codigosUnicos = [...new Set(codigosSeleccionados)]

      // Obtener todas las fichas técnicas de los productos seleccionados
      const todasFichas = []
      codigosUnicos.forEach((codigo) => {
        const producto = productosPreexistentes.find((p) => p && p.id === codigo)
        if (producto && producto.fichaTecnica) {
          todasFichas.push(producto.fichaTecnica)
        }
      })

      // Actualizar el estado con las fichas técnicas
      setFichasTecnicas(todasFichas)
    } catch (error) {
      console.error("Error al actualizar fichas técnicas:", error)
      setFichasTecnicas([]) // En caso de error, establecer un array vacío
    }
  }

  // Agregar una nueva función para actualizar los certificados combinados
  const actualizarCertificadosCombinados = () => {
    try {
      // Obtener todos los códigos de productos seleccionados (excepto "personalizado" y "LAB")
      const codigosSeleccionados = items
        .filter((item) => item && item.codigo) // Asegurarse de que item existe
        .map((item) => item.codigo)
        .filter((codigo) => codigo && codigo !== "personalizado" && codigo !== "LAB")

      // Si no hay productos con certificados, usar el texto genérico
      if (!codigosSeleccionados || codigosSeleccionados.length === 0) {
        setCertificadosCalidad(
          "- Certificado de calidad genética\n- Certificado de sanidad vegetal\n- Certificado libre de virus",
        )
        return
      }

      // Eliminar duplicados de códigos
      const codigosUnicos = [...new Set(codigosSeleccionados)]

      // Obtener todos los certificados de los productos seleccionados
      let todosCertificados = []
      codigosUnicos.forEach((codigo) => {
        const producto = productosPreexistentes.find((p) => p && p.id === codigo)
        if (producto && producto.certificados && Array.isArray(producto.certificados)) {
          todosCertificados = [...todosCertificados, ...producto.certificados]
        }
      })

      // Generar el texto combinado de certificados
      if (todosCertificados.length > 0) {
        const certificadosTexto = generarCertificadosTexto(todosCertificados)
        setCertificadosCalidad(certificadosTexto)
      }
    } catch (error) {
      console.error("Error al actualizar certificados:", error)
      // En caso de error, establecer un valor predeterminado
      setCertificadosCalidad(
        "- Certificado de calidad genética\n- Certificado de sanidad vegetal\n- Certificado libre de virus",
      )
    }
  }

  // Agregar función para generar el texto de los certificados
  const generarCertificadosTexto = (certificados) => {
    if (!certificados || certificados.length === 0) return ""

    // Usar formato de texto plano para el textarea
    return certificados
      .map(
        (cert) =>
          `${cert.titulo}\n` +
          `CÓDIGO DE MUESTRA: ${cert.codigo}\n` +
          `TIPO: ${cert.tipo}\n` +
          `INFORME DE ENSAYO: ${cert.informe}\n` +
          `${cert.detalle.join("\n")}\n`,
      )
      .join("\n")
  }

  // Modificar la función actualizarItem para actualizar certificados y fichas técnicas cuando cambia un item
  const actualizarItem = (id, campo, valor) => {
    try {
      setItems(
        items.map((item) => {
          if (item.id === id) {
            const itemActualizado = { ...item, [campo]: valor }

            // Recalcular total si cambia cantidad o precio
            if (campo === "cantidad" || campo === "precioUnitario") {
              itemActualizado.total = itemActualizado.cantidad * itemActualizado.precioUnitario
            }

            return itemActualizado
          }
          return item
        }),
      )

      // Si se cambia un código de producto, actualizar los certificados y fichas técnicas
      if (campo === "codigo") {
        setTimeout(() => {
          actualizarCertificadosCombinados()
          actualizarFichasTecnicas()
        }, 0)
      }
    } catch (error) {
      console.error("Error al actualizar item:", error)
    }
  }

  // Modificar la función eliminarItem para actualizar certificados y fichas técnicas cuando se elimina un item
  const eliminarItem = (id) => {
    try {
      if (items.length > 1) {
        setItems(items.filter((item) => item.id !== id))
        // Actualizar certificados y fichas técnicas después de eliminar un item
        setTimeout(() => {
          actualizarCertificadosCombinados()
          actualizarFichasTecnicas()
        }, 0)
      }
    } catch (error) {
      console.error("Error al eliminar item:", error)
    }
  }

  // Modificar la función agregarItem para mantener los certificados actualizados
  const agregarItem = () => {
    try {
      const nuevoId = Math.max(...items.map((item) => item.id), 0) + 1
      setItems([...items, { id: nuevoId, descripcion: "", cantidad: 1, precioUnitario: 0, total: 0, codigo: "" }])
    } catch (error) {
      console.error("Error al agregar item:", error)
    }
  }

  // Vista previa de impresión
  const vistaPrevia = () => {
    try {
      // Validar que los items existan y sean un array
      const itemsValidados = Array.isArray(items)
        ? items.map((item) => ({
            id: item?.id || 0,
            descripcion: item?.descripcion || "",
            cantidad: item?.cantidad || 0,
            precioUnitario: item?.precioUnitario || 0,
            total: item?.total || 0,
            codigo: item?.codigo || "",
          }))
        : []

      // Crear objeto con todos los datos de la cotización
      const cotizacion = {
        numeroCotizacion: numeroCotizacion || "",
        // Añadir el tipo de documento al objeto de cotización en la función vistaPrevia
        tipoDocumento: tipoDocumento || "cotizacion",
        fechaEmision: fechaEmision || new Date().toISOString().split("T")[0],
        fechaVencimiento: fechaVencimiento || calcularFechaVencimiento(10),
        razonSocial: razonSocial || "",
        dniRuc: dniRuc || "",
        direccion: direccion || "",
        telefono: telefono || "",
        items: itemsValidados,
        subtotal: subtotal || 0,
        impuesto: impuesto || 0,
        total: total || 0,
        terminosCondiciones: terminosCondiciones || "",
        lugarRecojo: lugarRecojo || "",
        formaPago: formaPago || "completo",
        formaEntrega: formaEntrega || "",
        totalTexto: numeroATexto(total) || "",
        certificadosCalidad: certificadosCalidad || "",
        fichasTecnicas: Array.isArray(fichasTecnicas) ? fichasTecnicas : [],
        tipoProductoSeleccionado: tipoProductoSeleccionado || "vegetal",
        preciosConIGV: preciosConIGV,
      }

      // Guardar en localStorage para acceder desde la página de impresión
      localStorage.setItem("cotizacionActual", JSON.stringify(cotizacion))

      // Abrir en nueva ventana
      window.open("/cotizaciones/imprimir", "_blank")
    } catch (error) {
      console.error("Error al generar vista previa:", error)
      alert("Ocurrió un error al generar la vista previa. Por favor, intente nuevamente.")
    }
  }

  // Avanzar al siguiente paso
  const avanzarPaso = () => {
    if (activeTab === "informacion") {
      setActiveTab("productos")
    } else if (activeTab === "productos") {
      setActiveTab("adicional")
    } else if (activeTab === "adicional") {
      vistaPrevia()
    }
  }

  // Retroceder al paso anterior
  const retrocederPaso = () => {
    if (activeTab === "productos") {
      setActiveTab("informacion")
    } else if (activeTab === "adicional") {
      setActiveTab("productos")
    }
  }

  // Verificar si hay productos de laboratorio seleccionados
  const tieneLaboratorio = items.some((item) => item.codigo === "LAB")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Volver al inicio</span>
          </Link>
          <h1 className="text-xl font-bold text-[#5D9848]">
            <span className="sr-only">Sistema de Cotizaciones</span>
          </h1>
          <div className="w-[100px]"></div> {/* Spacer para centrar el título */}
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Seleccione el tipo de documento</h2>
          <div className="flex gap-3">
            <Button
              variant={tipoDocumento === "cotizacion" ? "default" : "outline"}
              onClick={() => setTipoDocumento("cotizacion")}
              className={tipoDocumento === "cotizacion" ? "bg-[#5D9848]" : ""}
            >
              Cotización
            </Button>
            <Button
              variant={tipoDocumento === "boleta" ? "default" : "outline"}
              onClick={() => setTipoDocumento("boleta")}
              className={tipoDocumento === "boleta" ? "bg-[#5D9848]" : ""}
            >
              Boleta
            </Button>
            <Button
              variant={tipoDocumento === "factura" ? "default" : "outline"}
              onClick={() => setTipoDocumento("factura")}
              className={tipoDocumento === "factura" ? "bg-[#5D9848]" : ""}
            >
              Factura
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nuevo {obtenerTituloDocumento()}</h1>
          <p className="text-muted-foreground">
            Crea un {obtenerTituloDocumento().toLowerCase()} profesional en pocos pasos
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="informacion"
              className="data-[state=active]:bg-[#5D9848] data-[state=active]:text-white"
            >
              1. Información General
            </TabsTrigger>
            <TabsTrigger value="productos" className="data-[state=active]:bg-[#5D9848] data-[state=active]:text-white">
              2. Productos y Servicios
            </TabsTrigger>
            <TabsTrigger value="adicional" className="data-[state=active]:bg-[#5D9848] data-[state=active]:text-white">
              3. Información Adicional
            </TabsTrigger>
          </TabsList>

          {/* Paso 1: Información General */}
          <TabsContent value="informacion">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Cotización</CardTitle>
                  <CardDescription>Datos generales de la cotización</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="numeroCotizacion">Número de Cotización</Label>
                    <Input
                      id="numeroCotizacion"
                      value={numeroCotizacion}
                      onChange={(e) => setNumeroCotizacion(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
                      <Input
                        id="fechaEmision"
                        type="date"
                        value={fechaEmision}
                        onChange={(e) => setFechaEmision(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                      <Input
                        id="fechaVencimiento"
                        type="date"
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información del Cliente</CardTitle>
                  <CardDescription>Ingresa los datos del cliente para la cotización</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="razonSocial">Razón Social</Label>
                    <Input
                      id="razonSocial"
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                      placeholder="Nombre de la empresa o razón social"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dniRuc">DNI/RUC</Label>
                    <Input
                      id="dniRuc"
                      value={dniRuc}
                      onChange={(e) => setDniRuc(e.target.value)}
                      placeholder="Número de DNI o RUC"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Dirección completa"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Número de teléfono"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={avanzarPaso}>Siguiente: Productos y Servicios</Button>
            </div>
          </TabsContent>

          {/* Paso 2: Productos y Servicios */}
          <TabsContent value="productos">
            <Card>
              <CardHeader>
                <CardTitle>Productos/Servicios</CardTitle>
                <div className="flex justify-between items-center mb-4">
                  <CardDescription>Agrega los productos o servicios incluidos en la cotización</CardDescription>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Precios:</span>
                    <div className="flex border rounded-md overflow-hidden">
                      <button
                        type="button"
                        className={`px-3 py-1 text-sm ${
                          !preciosConIGV ? "bg-[#5D9848] text-white" : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setPreciosConIGV(false)}
                      >
                        SIN IGV
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 text-sm ${
                          preciosConIGV ? "bg-[#5D9848] text-white" : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setPreciosConIGV(true)}
                      >
                        CON IGV
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Descripción</TableHead>
                        <TableHead>Producto</TableHead>
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
                              value={item.descripcion || ""}
                              onChange={(e) => actualizarItem(item.id, "descripcion", e.target.value)}
                              placeholder="Descripción del producto o servicio"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.codigo || ""}
                              onValueChange={(value) => seleccionarProducto(item.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar producto" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="personalizado">Personalizado</SelectItem>
                                {productosPreexistentes.map((producto) => (
                                  <SelectItem key={producto.id} value={producto.id}>
                                    {producto.id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.cantidad || 1}
                              onChange={(e) =>
                                actualizarItem(item.id, "cantidad", Number.parseInt(e.target.value) || 0)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.precioUnitario || 0}
                              onChange={(e) =>
                                actualizarItem(item.id, "precioUnitario", Number.parseFloat(e.target.value) || 0)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">S/ {(item.total || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => eliminarItem(item.id)}
                              disabled={items.length === 1}
                              type="button"
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

                <Button variant="outline" size="sm" className="mt-4" onClick={agregarItem} type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto/Servicio
                </Button>

                <div className="mt-6 flex flex-col items-end space-y-2">
                  <div className="flex w-full justify-between border-t pt-4 sm:w-72">
                    <span>Subtotal:</span>
                    <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex w-full justify-between sm:w-72">
                    <span>IGV (18%):</span>
                    <span className="font-medium">S/ {impuesto.toFixed(2)}</span>
                  </div>
                  <div className="flex w-full justify-between border-t pt-2 sm:w-72">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={retrocederPaso} type="button">
                Anterior: Información General
              </Button>
              <Button onClick={avanzarPaso} type="button">
                Siguiente: Información Adicional
              </Button>
            </div>
          </TabsContent>

          {/* Paso 3: Información Adicional */}
          <TabsContent value="adicional">
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
                <CardDescription>Detalles adicionales para la cotización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mostrar campos específicos solo si NO hay productos de laboratorio */}
                {!tieneLaboratorio && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="lugarRecojo">Lugar de Recojo</Label>
                      <Input
                        id="lugarRecojo"
                        value={lugarRecojo}
                        onChange={(e) => setLugarRecojo(e.target.value)}
                        placeholder="Ej: 4 de Abril en nuestro centro de aclimatación ubicado en Pay Pay - Yonan (a 25km cruce)"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="formaEntrega">Forma de Entrega</Label>
                      <Textarea
                        id="formaEntrega"
                        value={formaEntrega}
                        onChange={(e) => setFormaEntrega(e.target.value)}
                        placeholder="Especifique cuándo y cómo se entregará el producto"
                        rows={2}
                      />
                    </div>
                  </>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="formaPago">Forma de Pago</Label>
                  <Select value={formaPago} onValueChange={setFormaPago}>
                    <SelectTrigger id="formaPago">
                      <SelectValue placeholder="Seleccione la forma de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completo">Pago 100%</SelectItem>
                      <SelectItem value="parcial">Pago 50-50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="terminosCondiciones">Términos y Condiciones</Label>
                  <Textarea
                    id="terminosCondiciones"
                    value={terminosCondiciones}
                    onChange={(e) => setTerminosCondiciones(e.target.value)}
                    placeholder="Ingrese los términos y condiciones de la cotización"
                    rows={5}
                  />
                </div>

                {/* Mostrar certificados solo si NO hay productos de laboratorio */}
                {!tieneLaboratorio && (
                  <div className="grid gap-2">
                    <Label htmlFor="certificadosCalidad">Certificados de Calidad</Label>
                    <Textarea
                      id="certificadosCalidad"
                      value={certificadosCalidad}
                      onChange={(e) => setCertificadosCalidad(e.target.value)}
                      placeholder="Ingrese los certificados de calidad"
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="mt-4 space-y-2 w-full">
                  <h3 className="font-semibold">Métodos de Pago</h3>
                  <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">Banco de Crédito del Perú BCP</p>
                    <p>Cuenta corriente: 570 1149166-0-11</p>
                    <p>CCI: 002-57-000-1149-1660-1101</p>
                    <p>Realizar su depósito a la Cuenta Corriente de AS LABORATORIOS CONTROL BIOLOGICO S.A.C</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={retrocederPaso} type="button">
                Anterior: Productos y Servicios
              </Button>
              <Button onClick={vistaPrevia} className="gap-2" type="button">
                <Printer className="h-4 w-4" />
                Vista Previa
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
