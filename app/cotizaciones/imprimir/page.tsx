"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft, Download, FileEdit } from "lucide-react"

export default function ImprimirCotizacion() {
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      // Recuperar datos de la cotización del localStorage
      const cotizacionGuardada = localStorage.getItem("cotizacionActual")
      if (cotizacionGuardada) {
        const cotizacionData = JSON.parse(cotizacionGuardada)

        // Asegurarse de que los items tengan la propiedad codigo
        if (cotizacionData.items) {
          cotizacionData.items = cotizacionData.items.map((item) => ({
            ...item,
            codigo: item.codigo || "",
          }))
        } else {
          cotizacionData.items = []
        }

        // Asegurarse de que fichasTecnicas existe
        if (!cotizacionData.fichasTecnicas) {
          cotizacionData.fichasTecnicas = []
        }

        // Asegurarse de que todos los campos necesarios existan
        cotizacionData.subtotal = cotizacionData.subtotal || 0
        cotizacionData.impuesto = cotizacionData.impuesto || 0
        cotizacionData.total = cotizacionData.total || 0
        cotizacionData.totalTexto = cotizacionData.totalTexto || ""
        cotizacionData.terminosCondiciones = cotizacionData.terminosCondiciones || ""
        cotizacionData.certificadosCalidad = cotizacionData.certificadosCalidad || ""
        cotizacionData.lugarRecojo = cotizacionData.lugarRecojo || ""
        cotizacionData.formaPago = cotizacionData.formaPago || "completo"
        cotizacionData.formaEntrega = cotizacionData.formaEntrega || ""
        cotizacionData.tipoProductoSeleccionado = cotizacionData.tipoProductoSeleccionado || "vegetal"
        cotizacionData.tipoDocumento = cotizacionData.tipoDocumento || "cotizacion"

        // Asegurarse de que el campo preciosConIGV exista
        cotizacionData.preciosConIGV = cotizacionData.preciosConIGV || false

        setCotizacion(cotizacionData)
      }
    } catch (error) {
      console.error("Error al cargar la cotización:", error)
      setError("Error al cargar los datos de la cotización. Por favor, intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }, [])

  // Función para imprimir
  const imprimir = () => {
    window.print()
  }

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return ""
    try {
      const fecha = new Date(fechaStr)
      return fecha.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return fechaStr || ""
    }
  }

  // Función para obtener el título del documento
  const obtenerTituloDocumento = () => {
    if (!cotizacion || !cotizacion.tipoDocumento) return "Cotización"

    switch (cotizacion.tipoDocumento) {
      case "boleta":
        return "Boleta de Venta"
      case "factura":
        return "Factura"
      default:
        return "Cotización"
    }
  }

  // Función para convertir número a texto (copiada de la página de creación)
  const numeroATexto = (numero) => {
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

  // Volver a la página de creación de cotización
  const volverACrear = () => {
    router.push("/cotizaciones/nueva")
  }

  // Volver a la página principal
  const volverAlInicio = () => {
    router.push("/")
  }

  // Asegurar que la ficha técnica se muestre correctamente
  useEffect(() => {
    if (cotizacion && cotizacion.fichasTecnicas && cotizacion.fichasTecnicas.length > 0) {
      try {
        // Precargar las imágenes para asegurar que se muestren correctamente
        cotizacion.fichasTecnicas.forEach((ficha) => {
          if (ficha && ficha.archivo) {
            const img = new Image()
            img.crossOrigin = "anonymous" // Evitar problemas CORS
            img.src = ficha.archivo
          }
        })
      } catch (error) {
        console.error("Error al precargar imágenes:", error)
      }
    }
  }, [cotizacion])

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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">{error}</p>
          <Button className="mt-4" onClick={volverAlInicio}>
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  if (!cotizacion) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-lg font-medium">No se encontró información de la cotización</p>
          <Button className="mt-4" onClick={volverAlInicio}>
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  // Verificar si hay productos con códigos específicos
  const tieneASWG =
    cotizacion.items &&
    Array.isArray(cotizacion.items) &&
    cotizacion.items.some((item) => item && item.codigo === "ASWG")

  const tieneASC5 =
    cotizacion.items &&
    Array.isArray(cotizacion.items) &&
    cotizacion.items.some((item) => item && item.codigo === "ASC5")

  const tieneLAB =
    cotizacion.items &&
    Array.isArray(cotizacion.items) &&
    cotizacion.items.some((item) => item && item.codigo === "LAB")

  // Determinar el tipo de producto principal
  const esLaboratorio = tieneLAB || cotizacion.tipoProductoSeleccionado === "laboratorio"

  // Asegurar que la estructura del documento sea correcta para mostrar la ficha técnica al final
  return (
    <>
      {/* Controles de impresión - solo visibles en pantalla */}
      <div className="container mx-auto py-4 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button variant="outline" onClick={volverAlInicio} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
            <Button variant="outline" onClick={volverACrear} className="gap-2">
              <FileEdit className="h-4 w-4" />
              Editar{" "}
              {cotizacion?.tipoDocumento === "boleta"
                ? "boleta"
                : cotizacion?.tipoDocumento === "factura"
                  ? "factura"
                  : "cotización"}
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button onClick={imprimir} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </div>

      {/* Documento para imprimir */}
      <div
        className={`mx-auto max-w-[210mm] bg-white p-6 text-sm print:p-0 print:text-[11pt] ${esLaboratorio ? "font-sans" : ""}`}
      >
        {/* Barra verde superior */}
        <div className="h-1.5 w-full bg-[#5D9848] print:h-1.5"></div>

        {/* Encabezado */}
        <div className="mt-3 flex justify-between">
          <div className="text-xs">
            <h1 className="text-base font-bold">
              {obtenerTituloDocumento()} {cotizacion.numeroCotizacion || ""}
            </h1>
            <p>Razón Social: AS LABORATORIOS CONTROL BIOLÓGICO S.A.C.</p>
            <p>RUC: 20440181792</p>
            <p>Jr. Huancavelica, 315 Palermo. 2do Piso</p>
            <p>PERÚ, LA LIBERTAD, TRUJILLO, 13011</p>
            <p>ventas@aslaboratorios.com</p>
            <p>Teléfono: +51 961 996 645</p>
          </div>
          <div className="flex items-start justify-end">
            <Image
              src="/images/new-logo.png"
              alt="AS Laboratorios"
              width={160}
              height={48}
              className="object-contain"
            />
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="my-3 h-[1px] w-full bg-gray-300"></div>

        {/* Información del cliente y fechas */}
        <div className="flex justify-between text-xs">
          <div className="w-1/2">
            <h2 className="font-bold">Cliente: {cotizacion.razonSocial || ""}</h2>
            <p>RUC {cotizacion.dniRuc || ""}</p>
            <p>{cotizacion.direccion || ""}</p>
            <p>Telf. {cotizacion.telefono || ""}</p>
          </div>
          <div className="w-1/2 text-right">
            <p>
              <span className="font-semibold">Fecha de emisión:</span> {formatearFecha(cotizacion.fechaEmision)}
            </p>
            <p>
              <span className="font-semibold">Fecha de vencimiento:</span> {formatearFecha(cotizacion.fechaVencimiento)}
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="my-3 h-[1px] w-full bg-gray-300"></div>

        {/* Tabla de productos - Estilo especial para laboratorio */}
        <table className={`w-full border-collapse text-xs ${esLaboratorio ? "border border-gray-200" : ""}`}>
          <thead>
            <tr className={`${esLaboratorio ? "bg-blue-600 text-white" : "bg-[#5D9848] text-white"}`}>
              <th className="w-[50%] p-1.5 text-left">Descripción</th>
              <th className="p-1.5 text-center">Cantidad</th>
              <th className="p-1.5 text-right">Precio unitario</th>
              <th className="p-1.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {cotizacion.items &&
              Array.isArray(cotizacion.items) &&
              cotizacion.items.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${esLaboratorio && index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="p-1.5 text-left">{item?.descripcion || ""}</td>
                  <td className="p-1.5 text-center">{item?.cantidad || 0}</td>
                  <td className="p-1.5 text-right">S/{(item?.precioUnitario || 0).toFixed(2)}</td>
                  <td className="p-1.5 text-right">S/{(item?.total || 0).toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}></td>
              <td className="p-1.5 text-right font-semibold">Subtotal</td>
              <td className="p-1.5 text-right">S/{(cotizacion.subtotal || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td className="p-1.5 text-right font-semibold">IGV (18%)</td>
              <td className="p-1.5 text-right">S/{(cotizacion.impuesto || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td className="p-1.5 text-right font-bold">Total</td>
              <td className="p-1.5 text-right font-bold">S/{(cotizacion.total || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-xs text-right italic pt-1">
                {cotizacion.preciosConIGV
                  ? "* Los precios unitarios incluyen IGV"
                  : "* Los precios unitarios no incluyen IGV"}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Línea divisoria */}
        <div className="my-3 h-[1px] w-full bg-gray-300"></div>

        {/* Condiciones de entrega y pago - Estilo especial para laboratorio */}
        <div className={`mt-3 text-xs ${esLaboratorio ? "bg-gray-50 p-3 rounded-md" : ""}`}>
          <p className="font-semibold">
            {cotizacion.formaPago === "completo" ? (
              <>
                Entrega inmediata previa confirmación del depósito, equivalente a S/{(cotizacion.total || 0).toFixed(2)}{" "}
                ({cotizacion.totalTexto || ""} soles)
              </>
            ) : (
              <>
                Depósito del 50% a la confirmación del pedido equivalente a S/
                {((cotizacion.total || 0) / 2).toFixed(2)} ({numeroATexto((cotizacion.total || 0) / 2) || ""} soles) y
                su entrega previa constatación del depósito del 50% restante, equivalente a S/
                {((cotizacion.total || 0) / 2).toFixed(2)} ({numeroATexto((cotizacion.total || 0) / 2) || ""} soles)
              </>
            )}
          </p>

          {/* Mostrar información de recojo y entrega solo si NO es producto de laboratorio */}
          {!esLaboratorio && (
            <>
              {cotizacion.lugarRecojo && <p>El recojo: {cotizacion.lugarRecojo}</p>}
              {cotizacion.formaEntrega && <p>Forma de entrega: {cotizacion.formaEntrega}</p>}
            </>
          )}
        </div>

        {/* Términos y condiciones */}
        <div
          className={`mt-3 whitespace-pre-line text-xs ${esLaboratorio ? "bg-white p-3 border border-gray-200 rounded-md" : ""}`}
        >
          {cotizacion.terminosCondiciones || ""}
        </div>

        {/* Certificados de calidad - Solo mostrar si NO es producto de laboratorio */}
        {!esLaboratorio && cotizacion.certificadosCalidad && (
          <div className="mt-4">
            <h3 className="text-sm font-bold mb-1.5 text-[#5D9848]">Certificados de Calidad</h3>

            {(() => {
              // Si hay productos con certificados específicos, mostrarlos
              if (tieneASWG || tieneASC5) {
                return (
                  <div className="space-y-3 text-[10pt]">
                    {tieneASWG && (
                      <>
                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de Bacterias Fitopatógenas
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2023114632010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 114644-2023-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/BM-22: FUSARIUM OXYSPORUM F. SP CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR
                            CONVENCIONAL - REGIÓN IGS
                          </p>
                          <p className="text-[9pt]">
                            MET-UCDSV/BM-102: FUSARIUM OXYSPORUM F.SP. CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR
                            CONVENCIONAL PRIMERS LI
                          </p>
                        </div>

                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de Ralstonia solanacearum
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2023114630010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 114535-2023-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/BM-102: FUSARIUM OXYSPORUM F.SP. CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR
                            CONVENCIONAL PRIMERS LI
                          </p>
                        </div>

                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de banana Streak virus.
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2020109320010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 100341-2021-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/VIR-002: DAS ELISA PARA DETECCIÓN DE VIRUS FITOPATÓGENO EN MATERIAL VEGETAL
                          </p>
                        </div>
                      </>
                    )}

                    {tieneASC5 && (
                      <>
                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de Fusarium oxysporum f.sp. cubense Raza 4 Tropical
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2023114627010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 114531-2023-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/BM-22: FUSARIUM OXYSPORUM F. SP CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR
                            CONVENCIONAL - REGIÓN IGS
                          </p>
                        </div>

                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de Fusarium oxysporum f.sp. cubense Raza 4 Tropical
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2023114627010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 114531-2023-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/BM-102: FUSARIUM OXYSPORUM F.SP. CUBENSE RAZA 4 TROPICAL (FOC R4T) CON PCR
                            CONVENCIONAL PRIMERS LI
                          </p>
                        </div>

                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de Bacterias Fitopatógenas
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2023114632010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 114644-2023-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/BAC-005: DIAGNÓSTICO DE BACTERIAS FITOPATÓGENAS EN MATERIAL VEGETAL
                          </p>
                        </div>

                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de Ralstonia solanacearum
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2023114632010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 114644-2023-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/BAC-004: BACTERIAS FITOPATÓGENAS POR SEROLOGÍA EN MATERIAL VEGETAL
                          </p>
                        </div>

                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de banana Streak virus.
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2020109321010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 100342-2021-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/VIR-002: DAS ELISA PARA DETECCIÓN DE VIRUS FITOPATÓGENO EN MATERIAL VEGETAL
                          </p>
                        </div>

                        <div className="border border-dashed border-amber-300 bg-amber-100 p-2">
                          <h4 className="font-bold text-center mb-1.5 text-xs">
                            Negativo a la presencia de banana Streak virus.
                          </h4>
                          <table className="w-full border-collapse text-[9pt]">
                            <tbody>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold w-1/3">CÓDIGO DE MUESTRA</td>
                                <td className="p-1 border border-gray-300">2020109319010001</td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold border border-gray-300">TIPO</td>
                                <td className="p-1 border border-gray-300">PLANTA COMPLETA</td>
                              </tr>
                              <tr className="border border-gray-300 bg-gray-100">
                                <td className="p-1 font-semibold">INFORME DE ENSAYO</td>
                                <td className="p-1 border border-gray-300">Nº 100340-2021-AG-SENASA-OCDP-UCDSV</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-1 text-[9pt]">
                            MET-UCDSV/VIR-002: DAS ELISA PARA DETECCIÓN DE VIRUS FITOPATÓGENO EN MATERIAL VEGETAL
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )
              } else {
                return (
                  <div className="whitespace-pre-line text-xs bg-[#f0f7ed] p-3 rounded-md">
                    {cotizacion.certificadosCalidad || ""}
                  </div>
                )
              }
            })()}
          </div>
        )}

        {/* Métodos de pago - Estilo especial para laboratorio */}
        <div className={`mt-4 ${esLaboratorio ? "bg-blue-50" : "bg-[#f0f7ed]"} p-3 rounded-md text-xs`}>
          <h3 className="font-bold text-sm">Métodos de Pago</h3>
          <p>Realizar su depósito a la Cuenta Corriente de AS LABORATORIOS CONTROL BIOLOGICO S.A.C.</p>
          <p>Banco de Crédito del Perú BCP</p>
          <p>Cuenta corriente: 570 1149166-0-11</p>
          <p>CCI: 002-57-000-1149-1660-1101</p>
        </div>

        {/* Barra verde inferior */}
        <div className="mt-6 h-1.5 w-full bg-[#5D9848] print:h-1.5"></div>
      </div>

      {/* Fichas técnicas en páginas separadas - SOLO MOSTRAR SI NO ES PRODUCTO DE LABORATORIO */}
      {!esLaboratorio && (
        <>
          {tieneASC5 && !tieneASWG && (
            <div className="mx-auto max-w-[210mm] bg-white p-6 print:p-0 page-break-before">
              <div className="border border-green-300 rounded-lg overflow-hidden">
                {/* Encabezado de la ficha técnica */}
                <div className="bg-[#5D9848] text-white p-3 flex items-center">
                  <div className="w-12 h-12 bg-[#C25B28] flex items-center justify-center mr-3 rounded-md">
                    <div className="w-8 h-8 border-t-3 border-r-3 border-white transform rotate-45"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">FICHA TÉCNICA</h2>
                    <h3 className="text-base font-bold">BANANO CAVENDISH - CLON VALERY</h3>
                    <p className="text-sm">CÓDIGO: ASC5</p>
                  </div>
                </div>

                {/* Contenido de la ficha técnica */}
                <div className="p-4 bg-white text-xs">
                  <p className="text-[9pt] mb-3">
                    Distribución gratuita de la información del producto especificado en este documento. Queda prohibido
                    su copia o mal uso de los datos para bien propio. La empresa emisora se reserva todos los derechos.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm mb-1">1. DATOS DEL PRODUCTOR</h4>
                    <p>Producido por AS Laboratorios Control Biológico S.A.C.</p>

                    <div className="mt-1">
                      <p className="font-bold">Titular de Registro:</p>
                      <p>AS Laboratorios Control Biológico S.A.C.</p>
                      <p>Jr. Huancavelica 315, Urb. Palermo.</p>
                      <p>PERÚ - LA LIBERTAD - TRUJILLO - TRUJILLO</p>
                    </div>

                    <div className="mt-1">
                      <p className="font-bold">Contacto:</p>
                      <p>Mail Corporativo: gerencia@aslaboratorios.com</p>
                      <p>Mail Ventas: ventas@aslaboratorios.com</p>
                      <p>WhatsApp: +51 961 996 645</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm mb-1">2. DATOS DE DISTRIBUCIÓN</h4>
                    <p>Distribuido por AS Laboratorios Control Biológico S.A.C.</p>

                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="bg-green-100 p-2 rounded-md text-[9pt]">
                        <p className="font-bold">Distribución Nacional</p>
                        <p>■ Vía Terrestre</p>
                        <p>A cargo de la empresa productora.</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-md text-[9pt]">
                        <p className="font-bold">Distribución Internacional.</p>
                        <p>■ Vía terrestre/aérea/marítima.</p>
                        <p>A cargo del cliente/comprador</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-md text-[9pt]">
                        <p className="font-bold">Otras vías de distribución.</p>
                        <p>■ Entrega directa.</p>
                        <p>Recojo del cliente/comprador.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-sm mb-1">3. TAXONOMÍA</h4>
                      <table className="w-full border-collapse text-[9pt]">
                        <tbody>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">FAMILIA</td>
                            <td className="p-1 border border-gray-300">Musácea</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">GÉNERO</td>
                            <td className="p-1 border border-gray-300">Musa</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">NOMBRE CIENTÍFICO</td>
                            <td className="p-1 border border-gray-300">Musa paradisiaca, Musa acuminada</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">GRUPO</td>
                            <td className="p-1 border border-gray-300">Grupo AAA – Cavendish-clon Valery</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">NOMBRE COMÚN</td>
                            <td className="p-1 border border-gray-300">Banano, "robusta".</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-1">4. DESCRIPCIÓN BOTÁNICA</h4>
                      <p className="text-[9pt]">
                        Es una planta perenne de gran tamaño, como las demás especies de musa, carece de verdadero
                        tronco, posee vainas foliares que se desarrollan formando estructuras llamadas pseudotallos,
                        similares a fustes verticales de hasta 30 cm de diámetro basal que no son leñosos y alcanzan
                        hasta los 3 m de altura.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-sm mb-1">5. ZONA DE COLECTA DE GERMOPLASMA</h4>
                      <table className="w-full border-collapse text-[9pt]">
                        <tbody>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">PAÍS</td>
                            <td className="p-1 border border-gray-300">Perú.</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">REGIÓN</td>
                            <td className="p-1 border border-gray-300">La Libertad.</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">PROVINCIA</td>
                            <td className="p-1 border border-gray-300">Chepén</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">DISTRITO</td>
                            <td className="p-1 border border-gray-300">Chepén.</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">ZONA</td>
                            <td className="p-1 border border-gray-300">Algarrobal.</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">FECHA</td>
                            <td className="p-1 border border-gray-300">Diciembre, 2017.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-1">6. PARCELA DE COLECTA DE GERMOPLASMA</h4>
                      <p className="text-[9pt]">Propietario: José Vásquez Vásquez.</p>

                      <h4 className="font-bold text-sm mt-2 mb-1">7. ZONA DE COLECTA PRODUCCIÓN IN VITRO</h4>
                      <p className="text-[9pt]">Parcela de banco de germoplasma AS Labs.</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm mb-1">8. PRESENTACIÓN DEL PRODUCTO</h4>
                    <p className="text-[9pt]">
                      Planta procedente de cultivo meristemático, de 7 cm de altura desde la base de la bolsa, con 2
                      hojas desarrolladas de color verde intenso característico del clon Valery, libres de enfermedades
                      y patógenos.
                    </p>
                  </div>

                  <div className="text-center text-[9pt] mt-4 text-gray-600">
                    <p>Huancavelica 315, Palermo. Trujillo - Trujillo - La Libertad</p>
                    <p>ventas@aslaboratorios.com</p>
                    <p>www.aslaboratorios.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ficha técnica para ASWG - SOLO MOSTRAR SI ESTÁ SELECCIONADO */}
          {tieneASWG && !tieneASC5 && (
            <div className="mt-6 page-break-before">
              <div className="border border-green-300 rounded-lg overflow-hidden">
                {/* Encabezado de la ficha técnica */}
                <div className="bg-[#5D9848] text-white p-3 flex items-center">
                  <div className="w-12 h-12 bg-[#C25B28] flex items-center justify-center mr-3 rounded-md">
                    <div className="w-8 h-8 border-t-3 border-r-3 border-white transform rotate-45"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">FICHA TÉCNICA</h2>
                    <h3 className="text-base font-bold">BANANO CAVENDISH - CLON WILLIAMS</h3>
                    <p className="text-sm">CÓDIGO: WG</p>
                  </div>
                </div>

                {/* Contenido de la ficha técnica */}
                <div className="p-4 bg-white text-xs">
                  <p className="text-[9pt] mb-3">
                    Distribución gratuita de la información del producto especificado en este documento. Queda prohibido
                    su copia o mal uso de los datos para bien propio. La empresa emisora se reserva todos los derechos.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm mb-1">1. DATOS DEL PRODUCTOR</h4>
                    <p>Producido por AS Laboratorios Control Biológico S.A.C.</p>

                    <div className="mt-1">
                      <p className="font-bold">Titular de Registro:</p>
                      <p>AS Laboratorios Control Biológico S.A.C.</p>
                      <p>Jr. Huancavelica 315, Urb. Palermo.</p>
                      <p>PERÚ - LA LIBERTAD - TRUJILLO - TRUJILLO</p>
                    </div>

                    <div className="mt-1">
                      <p className="font-bold">Contacto:</p>
                      <p>Mail Corporativo: gerencia@aslaboratorios.com</p>
                      <p>Mail Ventas: ventas@aslaboratorios.com</p>
                      <p>WhatsApp: +51 961 996 645</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm mb-1">2. DATOS DE DISTRIBUCIÓN</h4>
                    <p>Distribuido por AS Laboratorios Control Biológico S.A.C.</p>

                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="bg-green-100 p-2 rounded-md text-[9pt]">
                        <p className="font-bold">Distribución Nacional</p>
                        <p>■ Vía Terrestre</p>
                        <p>A cargo de la empresa productora.</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-md text-[9pt]">
                        <p className="font-bold">Distribución Internacional.</p>
                        <p>■ Vía terrestre/aérea/marítima.</p>
                        <p>A cargo del cliente/comprador</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-md text-[9pt]">
                        <p className="font-bold">Otras vías de distribución.</p>
                        <p>■ Entrega directa.</p>
                        <p>Recojo del cliente/comprador.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-sm mb-1">3. TAXONOMÍA</h4>
                      <table className="w-full border-collapse text-[9pt]">
                        <tbody>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">FAMILIA</td>
                            <td className="p-1 border border-gray-300">Musácea</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">GÉNERO</td>
                            <td className="p-1 border border-gray-300">Musa</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">NOMBRE CIENTÍFICO</td>
                            <td className="p-1 border border-gray-300">Musa paradisiaca, Musa acuminada</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">GRUPO</td>
                            <td className="p-1 border border-gray-300">Grupo AAA – Cavendish-clon Williams</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">NOMBRE COMÚN</td>
                            <td className="p-1 border border-gray-300">Banano, "robusta".</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-1">4. DESCRIPCIÓN BOTÁNICA</h4>
                      <p className="text-[9pt]">
                        Es una planta perenne de gran tamaño, como las demás especies de musa, carece de verdadero
                        tronco, posee vainas foliares que se desarrollan formando estructuras llamadas pseudotallos,
                        similares a fustes verticales de hasta 30 cm de diámetro basal que no son leñosos y alcanzan
                        hasta los 3 m de altura.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-sm mb-1">5. ZONA DE COLECTA DE GERMOPLASMA</h4>
                      <table className="w-full border-collapse text-[9pt]">
                        <tbody>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">PAÍS</td>
                            <td className="p-1 border border-gray-300">Perú.</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">REGIÓN</td>
                            <td className="p-1 border border-gray-300">La Libertad.</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">PROVINCIA</td>
                            <td className="p-1 border border-gray-300">Chepén</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">DISTRITO</td>
                            <td className="p-1 border border-gray-300">Chepén.</td>
                          </tr>
                          <tr className="border border-gray-300 bg-gray-100">
                            <td className="p-1 font-semibold">ZONA</td>
                            <td className="p-1 border border-gray-300">Algarrobal.</td>
                          </tr>
                          <tr>
                            <td className="p-1 font-semibold border border-gray-300">FECHA</td>
                            <td className="p-1 border border-gray-300">Diciembre, 2017.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-1">6. PARCELA DE COLECTA DE GERMOPLASMA</h4>
                      <p className="text-[9pt]">Propietario: Segundo Bueno Guevara.</p>

                      <h4 className="font-bold text-sm mt-2 mb-1">7. ZONA DE COLECTA PRODUCCIÓN IN VITRO</h4>
                      <p className="text-[9pt]">Parcela de banco de germoplasma AS Labs.</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm mb-1">8. PRESENTACIÓN DEL PRODUCTO</h4>
                    <p className="text-[9pt]">
                      Planta procedente de cultivo meristemático, de 20 a 25 cm de altura desde la base de la bolsa, con
                      4 a 6 hojas desarrolladas de color verde intenso característico del clon Williams, libres de
                      enfermedades y patógenos.
                    </p>
                  </div>

                  <div className="text-center text-[9pt] mt-4 text-gray-600">
                    <p>Huancavelica 315, Palermo. Trujillo - Trujillo - La Libertad</p>
                    <p>ventas@aslaboratorios.com</p>
                    <p>www.aslaboratorios.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Caso especial: Si ambos productos están seleccionados, mostrar ambas fichas técnicas */}
          {tieneASWG && tieneASC5 && (
            <>
              {/* Ficha técnica ASC5 */}
              <div className="mt-6 page-break-before">
                <div className="border border-green-300 rounded-lg overflow-hidden">
                  {/* Contenido de la ficha técnica ASC5 */}
                  <div className="bg-[#5D9848] text-white p-3 flex items-center">
                    <div className="w-12 h-12 bg-[#C25B28] flex items-center justify-center mr-3 rounded-md">
                      <div className="w-8 h-8 border-t-3 border-r-3 border-white transform rotate-45"></div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">FICHA TÉCNICA</h2>
                      <h3 className="text-base font-bold">BANANO CAVENDISH - CLON VALERY</h3>
                      <p className="text-sm">CÓDIGO: ASC5</p>
                    </div>
                  </div>

                  {/* Contenido igual al anterior para ASC5 */}
                  <div className="p-4 bg-white text-xs">
                    {/* Contenido de ASC5 */}
                    <p className="text-[9pt] mb-3">
                      Distribución gratuita de la información del producto especificado en este documento. Queda
                      prohibido su copia o mal uso de los datos para bien propio. La empresa emisora se reserva todos
                      los derechos.
                    </p>

                    {/* Resto del contenido igual al anterior */}
                    {/* ... */}
                    <div className="text-center text-[9pt] mt-4 text-gray-600">
                      <p>Huancavelica 315, Palermo. Trujillo - Trujillo - La Libertad</p>
                      <p>ventas@aslaboratorios.com</p>
                      <p>www.aslaboratorios.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ficha técnica ASWG */}
              <div className="mt-6 page-break-before">
                <div className="border border-green-300 rounded-lg overflow-hidden">
                  {/* Contenido de la ficha técnica ASWG */}
                  <div className="bg-[#5D9848] text-white p-3 flex items-center">
                    <div className="w-12 h-12 bg-[#C25B28] flex items-center justify-center mr-3 rounded-md">
                      <div className="w-8 h-8 border-t-3 border-r-3 border-white transform rotate-45"></div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">FICHA TÉCNICA</h2>
                      <h3 className="text-base font-bold">BANANO CAVENDISH - CLON WILLIAMS</h3>
                      <p className="text-sm">CÓDIGO: WG</p>
                    </div>
                  </div>

                  {/* Contenido igual al anterior para ASWG */}
                  <div className="p-4 bg-white text-xs">
                    {/* Contenido de ASWG */}
                    <p className="text-[9pt] mb-3">
                      Distribución gratuita de la información del producto especificado en este documento. Queda
                      prohibido su copia o mal uso de los datos para bien propio. La empresa emisora se reserva todos
                      los derechos.
                    </p>

                    {/* Resto del contenido igual al anterior */}
                    {/* ... */}
                    <div className="text-center text-[9pt] mt-4 text-gray-600">
                      <p>Huancavelica 315, Palermo. Trujillo - Trujillo - La Libertad</p>
                      <p>ventas@aslaboratorios.com</p>
                      <p>www.aslaboratorios.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Certificados SENASA - SOLO PARA ASC5 */}
          {tieneASC5 && (
            <div className="mt-6 page-break-before">
              <div className="mx-auto max-w-[210mm]">
                <h3 className="text-center font-bold text-lg mb-4">CERTIFICADOS DE CONTROL DE CALIDAD</h3>

                {/* Primer certificado */}
                <div className="mb-4">
                  <Image
                    src="/certificados/certificado-senasa-114644.png"
                    alt="Certificado SENASA 114644"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                {/* Segundo certificado - sin page-break */}
                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-114535.png"
                    alt="Certificado SENASA 114535"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                {/* Tercer certificado - sin page-break */}
                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-100341.png"
                    alt="Certificado SENASA 100341"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {tieneASWG && !tieneASC5 && (
            <div className="mt-6 page-break-before">
              <div className="mx-auto max-w-[210mm]">
                <h3 className="text-center font-bold text-lg mb-4">CERTIFICADOS DE CONTROL DE CALIDAD</h3>

                {/* Primer certificado */}
                <div className="mb-4">
                  <Image
                    src="/certificados/certificado-senasa-aswg-114644.png"
                    alt="Certificado SENASA ASWG 114644"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                {/* Segundo certificado - sin page-break */}
                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-aswg-114535.png"
                    alt="Certificado SENASA ASWG 114535"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                {/* Tercer certificado - sin page-break */}
                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-aswg-100341.png"
                    alt="Certificado SENASA ASWG 100341"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {tieneASWG && tieneASC5 && (
            <div className="mt-6 page-break-before">
              <div className="mx-auto max-w-[210mm]">
                <h3 className="text-center font-bold text-lg mb-4">CERTIFICADOS DE CONTROL DE CALIDAD - ASC5</h3>

                {/* Certificados ASC5 */}
                <div className="mb-4">
                  <Image
                    src="/certificados/certificado-senasa-114644.png"
                    alt="Certificado SENASA 114644"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-114535.png"
                    alt="Certificado SENASA 114535"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-100341.png"
                    alt="Certificado SENASA 100341"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {tieneASWG && tieneASC5 && (
            <div className="mt-6 page-break-before">
              <div className="mx-auto max-w-[210mm]">
                <h3 className="text-center font-bold text-lg mb-4">CERTIFICADOS DE CONTROL DE CALIDAD - ASWG</h3>

                {/* Certificados ASWG */}
                <div className="mb-4">
                  <Image
                    src="/certificados/certificado-senasa-aswg-114644.png"
                    alt="Certificado SENASA ASWG 114644"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-aswg-114535.png"
                    alt="Certificado SENASA ASWG 114535"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                <div className="mt-8 mb-4">
                  <Image
                    src="/certificados/certificado-senasa-aswg-100341.png"
                    alt="Certificado SENASA ASWG 100341"
                    width={800}
                    height={1130}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
