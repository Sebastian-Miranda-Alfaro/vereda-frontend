import { useState, useEffect } from 'react'

function Eventos() {
  const [eventos, setEventos] = useState([])

  // 1. Buscamos los eventos en Django
  useEffect(() => {
    const obtenerEventos = async () => {
      const token = localStorage.getItem('token_vereda')
      try {
        const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/eventos/', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const datos = await respuesta.json()
        if (respuesta.ok) {
          setEventos(datos)
        }
      } catch (error) {
        console.error("Error al obtener eventos:", error)
      }
    }
    obtenerEventos()
  }, [])

  // --- SUBCOMPONENTE: El Reloj de Cuenta Regresiva ---
  const Reloj = ({ fechaDestino }) => {
    const [tiempo, setTiempo] = useState(calcularTiempo())

    function calcularTiempo() {
      // Restamos la fecha del evento menos la fecha y hora de ESTE segundo exacto
      const diferencia = new Date(fechaDestino) - new Date()
      
      // Si la diferencia es menor a 0, el evento ya empezó
      if (diferencia <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 }
      
      // Matemáticas para convertir milisegundos en días, horas, mins y segs
      return {
        dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diferencia / 1000 / 60) % 60),
        segundos: Math.floor((diferencia / 1000) % 60)
      }
    }

    // Actualizamos el reloj cada 1000 milisegundos (1 segundo)
    useEffect(() => {
      const timer = setInterval(() => {
        setTiempo(calcularTiempo())
      }, 1000)
      return () => clearInterval(timer) // Limpiamos la memoria al salir
    }, [fechaDestino])

    return (
      <div className="flex justify-between gap-2 text-center mt-5">
        <div className="bg-[#F4F5F7] text-[#5241C7] rounded-xl p-3 w-full border border-[#5241C7]/10">
          <span className="block text-2xl font-black">{tiempo.dias}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Días</span>
        </div>
        <div className="bg-[#F4F5F7] text-[#5241C7] rounded-xl p-3 w-full border border-[#5241C7]/10">
          <span className="block text-2xl font-black">{tiempo.horas}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Hrs</span>
        </div>
        <div className="bg-[#F4F5F7] text-[#5241C7] rounded-xl p-3 w-full border border-[#5241C7]/10">
          <span className="block text-2xl font-black">{tiempo.minutos}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Min</span>
        </div>
        <div className="bg-[#F4F5F7] text-[#FF5359] rounded-xl p-3 w-full shadow-[0_4px_10px_rgba(255,83,89,0.2)]">
          <span className="block text-2xl font-black animate-pulse">{tiempo.segundos}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Seg</span>
        </div>
      </div>
    )
  }

  // Si no hay eventos futuros, no mostramos nada en la pantalla
  if (eventos.length === 0) return null

  return (
    <div className="space-y-6 mt-8 animate-fade-in-up">
      <h2 className="text-xl font-black text-[#212121] ml-2 border-l-4 border-[#00F3FF] pl-3">
        Próximos Eventos
      </h2>
      
      {eventos.map((evento) => (
        <div key={evento.id} className="bg-[#FFFFFF] p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden border border-gray-100">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F3FF] rounded-bl-full mix-blend-multiply filter blur-[40px] opacity-20"></div>
          
          {/* Mostramos la imagen solo si pusiste un link en el panel de admin */}
          {evento.imagen_url && (
            <div className="w-full h-40 bg-gray-200 rounded-2xl mb-5 overflow-hidden shadow-inner">
              <img src={evento.imagen_url} alt={evento.titulo} className="w-full h-full object-cover object-[50%_50%]" />
            </div>
          )}
          
          <h3 className="text-2xl font-black text-[#212121] leading-tight">{evento.titulo}</h3>
          <p className="text-[#757C8A] font-medium mt-2 text-sm leading-relaxed">{evento.descripcion}</p>
          
          <Reloj fechaDestino={evento.fecha_evento} />
        </div>
      ))}
    </div>
  )
}

export default Eventos