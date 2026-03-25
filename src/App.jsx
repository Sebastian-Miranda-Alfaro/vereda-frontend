import { useState, useEffect } from 'react'
import LecturaEnVivo from './LecturaEnVivo'
import MuroOraciones from './MuroOraciones'
import CuadroDevocional from './CuadroDevocional'
import fotoLugar from './assets/foto-comunidad.jpg'
import Eventos from './Eventos'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)  // Estado para saber si estamos en modo "Registro" o "Login"
  const [datosDevocional, setDatosDevocional] = useState(null)
  const [mostrarDevocional, setMostrarDevocional] = useState(false)
  const [vistaActual, setVistaActual] = useState('inicio') // Puede ser 'inicio', 'oraciones' o 'lecturas'
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token_vereda')
    const usuarioGuardado = localStorage.getItem('usuario_vereda')
    
    if (tokenGuardado) {
      setIsLoggedIn(true)
      if (usuarioGuardado) setUsername(usuarioGuardado)
      
      // --- LÓGICA DE 24 HORAS ---
      // Sacamos la fecha actual (ej. "24/3/2026")
      const fechaDeHoy = new Date().toLocaleDateString()
      const fechaUltimoDevocional = localStorage.getItem('vereda_fecha_devocional')
      
      // Si la fecha guardada no es la de hoy, cargamos el devocional
      if (fechaUltimoDevocional !== fechaDeHoy) {
        cargarDevocional(tokenGuardado)
      }
    }
  }, [])

  // --- FUNCIÓN PARA LLAMAR A CHATGPT ---
  const cargarDevocional = async (token) => {
    try {
      const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/devocional/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const datos = await respuesta.json()
      if (respuesta.ok) {
        setDatosDevocional(datos)
        setMostrarDevocional(true) // Mostramos el cuadro
      }
    } catch (error) {
      console.error("Error cargando devocional", error)
    }
  }

  // --- FUNCIÓN DE LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const datos = await respuesta.json()
      if (respuesta.ok) {
        // 1. Guardamos los pases de acceso
        localStorage.setItem('token_vereda', datos.access)
        localStorage.setItem('usuario_vereda', username)
        
        // --- 2. LÓGICA DE 24 HORAS EN EL LOGIN ---
        const fechaDeHoy = new Date().toLocaleDateString()
        const fechaUltimoDevocional = localStorage.getItem('vereda_fecha_devocional')
        
        // Solo llamamos a la IA si la fecha guardada no es la de hoy
        if (fechaUltimoDevocional !== fechaDeHoy) {
          cargarDevocional(datos.access)
        }
        // ----------------------------------------
        
        // 3. Lo dejamos entrar a la app
        setIsLoggedIn(true)
      } else {
        alert("Usuario o contraseña incorrectos")
      }
    } catch (error) {
      alert("Error de conexión con el servidor.")
    }
  }

  // --- Función para cerrar el cuadro ---
  const cerrarDevocional = () => {
    setMostrarDevocional(false)
    
    // Guardamos la fecha de hoy para que no vuelva a salir hasta mañana
    const fechaDeHoy = new Date().toLocaleDateString()
    localStorage.setItem('vereda_fecha_devocional', fechaDeHoy)
  }

  // --- NUEVA FUNCIÓN DE REGISTRO ---
  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const datos = await respuesta.json()
      
      if (respuesta.ok) {
        alert("¡Tu cuenta fue creada con éxito! Ahora puedes iniciar sesión.")
        setIsRegistering(false) // Lo regresamos a la pantalla de Login
        setPassword('') // Borramos la contraseña por seguridad
      } else {
        alert(datos.error || "Ocurrió un error al registrarte.")
      }
    } catch (error) {
      alert("Error de conexión con el servidor.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token_vereda')
    localStorage.removeItem('usuario_vereda')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  const cambiarVista = (nuevaVista) => {
    setVistaActual(nuevaVista)
    setMenuAbierto(false)
  }
  
  // --- PANTALLA PRINCIPAL (Logueado) ---
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] pb-10 font-sans antialiased relative">
        
        {/* Cuadro Devocional Condicional */}
        {mostrarDevocional && datosDevocional && (
          <CuadroDevocional datos={datosDevocional} alCerrar={cerrarDevocional} />
        )}

        {/* --- BARRA DE NAVEGACIÓN SUPERIOR --- */}
        <nav className="bg-[#FFFFFF] p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Botón de Hamburguesa */}
            <button 
              onClick={() => setMenuAbierto(true)}
              className="p-2 bg-[#F4F5F7] rounded-lg text-[#5241C7] hover:bg-[#E2E8F0] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FF5359] to-[#FF3EF8]">
              VEREDA
            </h1>
          </div>
          
          {/* Avatar del usuario (inicial del nombre) */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5241C7] to-[#FF3EF8] text-white flex items-center justify-center font-bold text-lg shadow-md">
            {username ? username.charAt(0).toUpperCase() : 'V'}
          </div>
        </nav>

        {/* --- MENÚ LATERAL (HAMBURGUESA) --- */}
        {/* Fondo oscuro desenfocado */}
        {menuAbierto && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
            onClick={() => setMenuAbierto(false)}
          ></div>
        )}
        
        {/* Panel del menú que se desliza */}
        <div className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 bg-gradient-to-br from-[#FF5359]/10 to-[#FF3EF8]/10 border-b border-gray-100">
            <h2 className="text-2xl font-black text-[#212121]">Menú Principal</h2>
            <p className="text-[#757C8A] font-medium text-sm">Hola, {username}</p>
          </div>
          
          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <button onClick={() => cambiarVista('inicio')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${vistaActual === 'inicio' ? 'bg-[#5241C7]/10 text-[#5241C7]' : 'text-[#757C8A] hover:bg-gray-50'}`}>
              🏠 Inicio
            </button>
            <button onClick={() => cambiarVista('lecturas')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${vistaActual === 'lecturas' ? 'bg-[#5241C7]/10 text-[#5241C7]' : 'text-[#757C8A] hover:bg-gray-50'}`}>
              📖 Lectura en Vivo
            </button>
            <button onClick={() => cambiarVista('oraciones')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${vistaActual === 'oraciones' ? 'bg-[#5241C7]/10 text-[#5241C7]' : 'text-[#757C8A] hover:bg-gray-50'}`}>
              🙏 Muro de Oraciones
            </button>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full border-2 border-[#FF5359] text-[#FF5359] hover:bg-[#FF5359] hover:text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95">
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* --- ÁREA DE CONTENIDO DINÁMICO --- */}
        <main className="max-w-md mx-auto p-4 mt-2 space-y-6">
          
          {/* VISTA 1: INICIO (Quiénes Somos) */}
          {vistaActual === 'inicio' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-[#FFFFFF] p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF5359] to-[#FF3EF8]"></div>
                
                <h2 className="text-3xl font-black text-[#212121] mb-4 tracking-tight">Bienvenidos a Vereda</h2>
                
                {/* Imagen del lugar*/}
                <div className="w-full h-48 bg-gray-200 rounded-2xl mb-6 overflow-hidden relative shadow-md">
                  <img
                    src={fotoLugar}
                    alt="Nuestra Comunidad Vereda"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* --- EVENTOS --- */}
                <Eventos />

                {/* --- TEXTO --- */}
                <div className="space-y-4 text-[#4A5568] font-medium leading-relaxed">
                  <p>
                    Somos una comunidad de jóvenes buscando crecer en fe, amistad y propósito. Creemos que nadie debe caminar solo.
                  </p>
                  <p>
                    En esta app podrás compartir tus necesidades de oración para que todos te apoyemos, y seguir las lecturas de la semana junto a tus amigos en tiempo real.
                  </p>
                  <div className="p-4 bg-[#00F3FF]/10 rounded-xl border border-[#00F3FF]/20 mt-4">
                    <p className="text-[#00B4CC] font-bold text-sm text-center">
                      "Tu palabra es una lámpara a mis pies; es una luz en mi sendero."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: LECTURAS */}
          {vistaActual === 'lecturas' && (
             <div className="animate-fade-in-up">
               <LecturaEnVivo />
             </div>
          )}

          {/* VISTA 3: ORACIONES */}
          {vistaActual === 'oraciones' && (
            <div className="animate-fade-in-up">
              <MuroOraciones />
            </div>
          )}

        </main>
      </div>
    )
  }

  // --- PANTALLA DE LOGIN / REGISTRO (Esta es la parte que se te había borrado) ---
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#FF5359] rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-[#00F3FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

      <div className="bg-[#FFFFFF]/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm relative z-10 border border-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-gradient-to-r from-[#FF5359] to-[#FF3EF8] rounded-b-full"></div>

        <div className="text-center mb-8 mt-4">
          <h1 className="text-5xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FF5359] to-[#5241C7]">
            Vereda
          </h1>
          <p className="text-[#757C8A] font-medium">
            {isRegistering ? 'Crea tu perfil para unirte.' : 'Tu espacio, tu comunidad.'}
          </p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#757C8A] uppercase tracking-wider mb-2 ml-1">Usuario</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-5 py-4 rounded-2xl bg-[#F4F5F7] border-none text-[#212121] focus:ring-2 focus:ring-[#23D9A6] transition-all font-medium placeholder-[#B0B3BA]"
              placeholder="¿Cómo te llamas?"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#757C8A] uppercase tracking-wider mb-2 ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-5 py-4 rounded-2xl bg-[#F4F5F7] border-none text-[#212121] focus:ring-2 focus:ring-[#23D9A6] transition-all font-medium placeholder-[#B0B3BA]"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#FF5359] text-[#FFFFFF] font-bold text-lg py-4 rounded-2xl hover:bg-[#e6474d] transition-all active:scale-95 shadow-[0_8px_20px_rgba(255,62,248,0.3)] hover:shadow-[0_8px_25px_rgba(255,62,248,0.5)] mt-2"
          >
            {isRegistering ? 'Crear mi cuenta' : 'Entrar al grupo'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-bold text-[#5241C7] hover:text-[#FF3EF8] transition-colors"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default App