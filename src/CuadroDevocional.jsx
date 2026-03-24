function CuadroDevocional({ datos, alCerrar }) {
  // Si no hay datos (está cargando), no mostramos nada
  if (!datos) return null;

  return (
    // Fondo oscuro con blur para efecto Glassmorphism total
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans antialiased">
      
      {/* Tarjeta Principal */}
      <div className="bg-[#FFFFFF]/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative border border-white animate-fade-in-up">
        
        {/* Acento superior degradado juvenil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-gradient-to-r from-[#FF5359] to-[#FF3EF8] rounded-b-full"></div>

        <div className="text-center mb-8 mt-4 relative">
          {/* Micro-acento neón Cian */}
          <div className="absolute top-[-10px] left-[-10px] w-4 h-4 bg-[#00F3FF] rounded-full filter blur-[8px] opacity-70"></div>
          
          <h2 className="text-xs font-bold text-[#5241C7] uppercase tracking-widest mb-1.5">Devocional diario</h2>
          <h3 className="text-3xl font-black text-[#212121] tracking-tight leading-tight">Empieza con Energía </h3>
        </div>

        <div className="space-y-6 text-center">
          {/* Versículo Bíblico (Estilo badge Morado Vibrante) */}
          <div className="inline-block bg-[#5241C7]/10 text-[#5241C7] px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wide shadow-inner border border-[#5241C7]/15">
             "{datos.versiculo}"
          </div>

          {/* Mensaje de la IA (Texto Primario, legible) */}
          <p className="text-[#212121] text-base font-medium leading-relaxed px-2">
            {datos.mensaje}
          </p> 
        </div>

        {/* Botón de acción (Rojo Coral con Glow Neón Rosa) */}
        <div className="mt-10">
          <button 
            onClick={alCerrar} 
            className="w-full bg-[#FF5359] text-[#FFFFFF] font-bold text-lg py-4 rounded-2xl hover:bg-[#e6474d] transition-all active:scale-95 shadow-[0_8px_20px_rgba(255,62,248,0.3)] hover:shadow-[0_8px_25px_rgba(255,62,248,0.5)]"
          >
            ¡Amén, listo para el día!
          </button>
        </div>

      </div>
    </div>
  )
}

export default CuadroDevocional