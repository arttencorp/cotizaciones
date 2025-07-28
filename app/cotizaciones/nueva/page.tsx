"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCotizacion } from "@/components/nueva/hooks/useCotizacion"
import { InformacionGeneral } from "@/components/nueva/components/informacionGeneral"
import { ProductosServicios } from "@/components/nueva/components/productosServicios"
import { InformacionAdicional } from "@/components/nueva/components/informacionAdicional"

export default function NuevaCotizacion() {
  const {
    // Estados
    activeTab,
    setActiveTab,
    tipoDocumento,
    setTipoDocumento,
    preciosConIGV,
    setPreciosConIGV,
    numeroCotizacion,
    setNumeroCotizacion,
    fechaEmision,
    setFechaEmision,
    fechaVencimiento,
    setFechaVencimiento,
    razonSocial,
    setRazonSocial,
    dniRuc,
    setDniRuc,
    direccion,
    setDireccion,
    telefono,
    setTelefono,
    items,
    terminosCondiciones,
    setTerminosCondiciones,
    lugarRecojo,
    setLugarRecojo,
    formaPago,
    setFormaPago,
    formaEntrega,
    setFormaEntrega,
    certificadosCalidad,
    setCertificadosCalidad,
    
    // Funciones
    seleccionarProducto,
    actualizarItem,
    agregarItem,
    eliminarItem,
    vistaPrevia,
    avanzarPaso,
    retrocederPaso,
    calcularTotales,
    
    // Helpers
    tieneLaboratorio,
    obtenerTituloDocumento
  } = useCotizacion()

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
          <div className="w-[100px]"></div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        {/* Selección de tipo de documento */}
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

        {/* Título y descripción */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nuevo {obtenerTituloDocumento()}</h1>
          <p className="text-muted-foreground">
            Crea un {obtenerTituloDocumento().toLowerCase()} profesional en pocos pasos
          </p>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="informacion"
              className="data-[state=active]:bg-[#5D9848] data-[state=active]:text-white"
            >
              1. Información General
            </TabsTrigger>
            <TabsTrigger 
              value="productos" 
              className="data-[state=active]:bg-[#5D9848] data-[state=active]:text-white"
            >
              2. Productos y Servicios
            </TabsTrigger>
            <TabsTrigger 
              value="adicional" 
              className="data-[state=active]:bg-[#5D9848] data-[state=active]:text-white"
            >
              3. Información Adicional
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Información General */}
          <TabsContent value="informacion">
            <InformacionGeneral
              numeroCotizacion={numeroCotizacion}
              setNumeroCotizacion={setNumeroCotizacion}
              fechaEmision={fechaEmision}
              setFechaEmision={setFechaEmision}
              fechaVencimiento={fechaVencimiento}
              setFechaVencimiento={setFechaVencimiento}
              razonSocial={razonSocial}
              setRazonSocial={setRazonSocial}
              dniRuc={dniRuc}
              setDniRuc={setDniRuc}
              direccion={direccion}
              setDireccion={setDireccion}
              telefono={telefono}
              setTelefono={setTelefono}
              onSiguiente={avanzarPaso}
            />
          </TabsContent>

          {/* Tab 2: Productos y Servicios */}
          <TabsContent value="productos">
            <ProductosServicios
              items={items}
              preciosConIGV={preciosConIGV}
              setPreciosConIGV={setPreciosConIGV}
              seleccionarProducto={seleccionarProducto}
              actualizarItem={actualizarItem}
              agregarItem={agregarItem}
              eliminarItem={eliminarItem}
              calcularTotales={calcularTotales}
              onAnterior={retrocederPaso}
              onSiguiente={avanzarPaso}
            />
          </TabsContent>

          {/* Tab 3: Información Adicional */}
          <TabsContent value="adicional">
            <InformacionAdicional
              lugarRecojo={lugarRecojo}
              setLugarRecojo={setLugarRecojo}
              formaEntrega={formaEntrega}
              setFormaEntrega={setFormaEntrega}
              formaPago={formaPago}
              setFormaPago={setFormaPago}
              terminosCondiciones={terminosCondiciones}
              setTerminosCondiciones={setTerminosCondiciones}
              certificadosCalidad={certificadosCalidad}
              setCertificadosCalidad={setCertificadosCalidad}
              tieneLaboratorio={tieneLaboratorio}
              onAnterior={retrocederPaso}
              onVistaPrevia={vistaPrevia}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
