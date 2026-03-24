import { useState, useEffect } from 'react'

function MuroOraciones() {
  const [oraciones, setOraciones] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    obtenerOraciones()
  }, [])

  const obtenerOraciones = async () => {
    const token = localStorage.getItem('token_vereda')
    try {
      const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/oraciones/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const datos = await respuesta.json()
      if (respuesta.ok) setOraciones(datos)
    } catch (error) {
      console.error("Error de conexión:", error)
    }
  }

  const publicarOracion = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token_vereda')
    try {
      const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/oraciones/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo: titulo, descripcion: descripcion })
      })
      if (respuesta.ok) {
        setTitulo('') 
        setDescripcion('') 
        obtenerOraciones() 
      }
    } catch (error) {
      console.error("Error al publicar:", error)
    }
  }

  const sumarOracion = async (id) => {
    const token = localStorage.getItem('token_vereda')
    try {
      const respuesta = await fetch(`https://vereda-backend-6otc.onrender.com/api/oraciones/${id}/orar/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (respuesta.ok) obtenerOraciones() 
    } catch (error) {
      console.error("Error al sumar oración:", error)
    }
  }

  // --- NUEVO DISEÑO ADAPTADO A TU PALETA ---
  return (
    <div className="bg-[#FFFFFF] p-7 rounded-[2rem] shadow-sm border border-[#F4F5F7]">
      <h2 className="text-xl font-black text-[#212121] mb-6 flex items-center gap-2.5">
        <span className="text-2xl">🙏</span> Muro de Peticiones
      </h2>
      
      <form onSubmit={publicarOracion} className="flex flex-col gap-4 mb-10">
        <input 
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título (ej. Por mi familia)"
          // Foco en Turquesa fresco (#23D9A6)
          className="w-full px-5 py-3.5 rounded-xl bg-[#F4F5F7] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#23D9A6] text-sm font-medium text-[#212121] placeholder-[#B0B3BA] transition-all"
          required
        />
        <textarea 
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Escribe los detalles de tu petición..."
          rows="3"
          className="w-full px-5 py-3.5 rounded-xl bg-[#F4F5F7] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#23D9A6] text-sm font-medium text-[#212121] placeholder-[#B0B3BA] resize-none transition-all"
          required
        />
        {/* Botón Primario (Rojo Coral #FF5359) con Glow Neón Rosa (#FF3EF8) */}
        <button type="submit" className="bg-[#FF5359] text-[#FFFFFF] font-bold py-4 rounded-xl hover:bg-[#e6474d] transition-all active:scale-95 shadow-[0_6px_15px_rgba(255,62,248,0.25)] hover:shadow-[0_6px_20px_rgba(255,62,248,0.4)] mt-1">
          Publicar Oración
        </button>
      </form>

      <div className="space-y-8">
        {oraciones.length === 0 ? (
          <p className="text-[#757C8A] text-sm text-center italic font-medium py-4">Aún no hay oraciones. ¡Sé el primero!</p>
        ) : (
          oraciones.map((oracion) => (
            <div key={oracion.id} className="border-b border-[#F4F5F7] pb-8 last:border-0 last:pb-0 relative">
              {/* Micro-acento en Amarillo cálido (#FFC847) para optimismo */}
              <div className="absolute left-[-15px] top-1.5 w-1 h-6 bg-[#FFC847] rounded-full opacity-70"></div>
              
              <h3 className="font-extrabold text-[#212121] text-lg mb-1.5 tracking-tight">{oracion.titulo}</h3>
              <p className="text-[#757C8A] text-sm mb-5 leading-relaxed font-medium">{oracion.descripcion}</p> 
              
              {/* Botón de acción (Interacción brillante con acento Neón Rosa #FF3EF8) */}
              <button 
                onClick={() => sumarOracion(oracion.id)}
                className="inline-flex items-center gap-2.5 bg-[#F4F5F7] hover:bg-[#FFFFFF] text-[#757C8A] hover:text-[#FF5359] border border-transparent hover:border-[#FF3EF8]/30 rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95 shadow-inner hover:shadow-md"
              >
                <span className="text-sm">❤️</span> Orar por esto ({oracion.oraciones_recibidas})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MuroOraciones