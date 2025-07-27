import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-green-50">
      <div className="container flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/images/new-logo.png"
              alt="AS Laboratorios"
              width={200}
              height={60}
              className="object-contain"
            />
            <h1 className="text-5xl font-bold tracking-tight text-[#5D9848]">Sistema de Cotizaciones</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">AS Laboratorios Control Biológico S.A.C.</p>
        </div>

        <div className="animate-pulse">
          <Link href="/cotizaciones/nueva">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-lg bg-[#5D9848] hover:bg-[#4a7a3a] hover:shadow-xl hover:shadow-green-200 hover:translate-y-[-5px]"
            >
              <span className="inline-block">Crear Documento</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
