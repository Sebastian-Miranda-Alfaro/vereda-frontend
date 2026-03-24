import { useState, useEffect } from 'react'

function LecturaEnVivo() {
  const [lecturas, setLecturas] = useState([])
  const [libro, setLibro] = useState('')
  const [capitulo, setCapitulo] = useState('')

  useEffect(() => {
    obtenerLecturas()
    const socket = new WebSocket('wss://vereda-backend-6otc.onrender.com/ws/lecturas/')

    socket.onmessage = function(event) {
      console.log("🔥 ¡El servidor avisó de un cambio!", JSON.parse(event.data))
      obtenerLecturas()
    }

    return () => socket.close()
  }, [])

  const obtenerLecturas = async () => {
    const token = localStorage.getItem('token_vereda')
    try {
      const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/lecturas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      // --- NUEVA VALIDACIÓN ---
      if (respuesta.status === 401) {
        localStorage.clear() 
        window.location.reload() 
        return
      }
      // ------------------------
      const datos = await respuesta.json()
      if (respuesta.ok) setLecturas(datos)
    } catch (error) {
      console.error("Error al obtener lecturas", error)
    }
  }

  const actualizarMiLectura = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token_vereda')
    try {
      await fetch('https://vereda-backend-6otc.onrender.com/api/lecturas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ libro: libro, capitulo: capitulo })
      })
      setLibro('')
      setCapitulo('')
    } catch (error) {
      console.error("Error al actualizar", error)
    }
  }

  // --- NUEVO DISEÑO CORREGIDO CON TAILWIND ---
  return (
    <div className="bg-[#FFFFFF] p-7 rounded-[2rem] shadow-sm border border-[#F4F5F7] relative overflow-hidden font-sans">
      {/* Acento superior sutil en Cian Neón */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00F3FF] opacity-50"></div>

      <h2 className="text-xl font-black text-[#212121] mb-5 flex items-center gap-2.5">
        <span className="text-2xl">📖</span> Lectura en Vivo
      </h2>
      
      {/* CORRECCIÓN 1: Reducción de separaciones (gap) y paddings para que quepa el botón */}
      <form onSubmit={actualizarMiLectura} className="flex gap-2 mb-8 items-center">
        <input 
          type="text" 
          value={libro} 
          onChange={(e) => setLibro(e.target.value)} 
          placeholder="Libro (ej. Juan)" 
          // Ajuste de padding: px-5 -> px-3.5 para ahorrar espacio
          className="flex-1 px-3.5 py-3 rounded-xl bg-[#F4F5F7] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#23D9A6] text-xs font-medium text-[#212121] placeholder-[#B0B3BA] transition-all"
          required 
        />
        <input 
          type="number" 
          value={capitulo} 
          onChange={(e) => setCapitulo(e.target.value)} 
          placeholder="Cap." 
          // Ajuste de ancho y padding: w-24 -> w-16 para ahorrar espacio
          className="w-16 px-2 py-3 rounded-xl bg-[#F4F5F7] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#23D9A6] text-xs font-medium text-[#212121] text-center placeholder-[#B0B3BA] transition-all"
          required 
        />
        {/* Botón secundario estilizado (Morado vibrante #5241C7) con padding reducido (px-6 -> px-3) */}
        <button type="submit" className="border-2 border-[#5241C7] text-[#5241C7] font-bold px-3 py-3 rounded-xl hover:bg-[#5241C7] hover:text-[#FFFFFF] transition-all active:scale-95 text-xs shadow-sm flex-shrink-0">
          Avisar
        </button>
      </form>

      <div className="space-y-3.5">
        {lecturas.length === 0 ? (
          <p className="text-[#757C8A] text-sm text-center italic font-medium py-4">Nadie está leyendo en este momento.</p>
        ) : (
          lecturas.map((lectura) => (
            <div key={lectura.id} className="bg-[#F4F5F7] p-5 rounded-2xl flex items-center justify-between border border-transparent hover:border-[#23D9A6]/30 transition-colors">
              <span className="text-[#212121] font-semibold text-sm">{lectura.usuario_nombre}</span>
              
              {/* CORRECCIÓN 2: Intercambio de colores para contraste máximo (letras blancas en fondo morado) */}
              <span className="bg-[#5241C7] text-[#FFFFFF] py-2 px-5 rounded-full text-xs font-extrabold tracking-wider shadow">
                {lectura.libro} {lectura.capitulo}
              </span>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LecturaEnVivo