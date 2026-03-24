import { useState, useEffect } from 'react'
import LecturaEnVivo from './LecturaEnVivo'
import MuroOraciones from './MuroOraciones'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token_vereda')
    if (tokenGuardado) setIsLoggedIn(true)
  }, [])

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
        localStorage.setItem('token_vereda', datos.access)
        setIsLoggedIn(true)
      } else {
        alert("Usuario o contraseña incorrectos")
      }
    } catch (error) {
      alert("Error de conexión con el servidor.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token_vereda')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  // --- PANTALLA PRINCIPAL (Logueado) ---
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] pb-10 font-sans">
        {/* Navbar Neutro con acento en el logo */}
        <nav className="bg-[#FFFFFF] p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FF5359] to-[#FF3EF8]">
            VEREDA
          </h1>
          {/* Botón Secundario según tu manual */}
          <button 
            onClick={handleLogout} 
            className="border-2 border-[#5241C7] text-[#5241C7] bg-transparent hover:bg-[#5241C7] hover:text-[#FFFFFF] px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
          >
            Salir
          </button>
        </nav>

        <main className="max-w-md mx-auto p-4 mt-4 space-y-6">
          {/* Card de bienvenida con degradado superior */}
          <div className="bg-[#FFFFFF] p-6 rounded-[2rem] shadow-sm relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF5359] to-[#FF3EF8]"></div>
            <h2 className="text-2xl font-black text-[#212121] mt-2">¡Hola, Vereda! ✌️</h2>
            <p className="text-[#757C8A] font-medium mt-1">Conéctate con tu comunidad.</p>
          </div>

          <LecturaEnVivo />
          <MuroOraciones />
        </main>
      </div>
    )
  }

  // --- PANTALLA DE LOGIN (Neon-tinged minimalism + glassmorphism) ---
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Esferas de color desenfocadas de fondo (Efecto Glassmorphism) */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#FF5359] rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-[#00F3FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

      {/* Card Principal */}
      <div className="bg-[#FFFFFF]/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm relative z-10 border border-white">
        
        {/* Acento superior en la card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-gradient-to-r from-[#FF5359] to-[#FF3EF8] rounded-b-full"></div>

        <div className="text-center mb-10 mt-4">
          <h1 className="text-5xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FF5359] to-[#5241C7]">
            Vereda
          </h1>
          <p className="text-[#757C8A] font-medium">Tu espacio, tu comunidad.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          {/* Botón Primario con glow neón */}
          <button 
            type="submit" 
            className="w-full bg-[#FF5359] text-[#FFFFFF] font-bold text-lg py-4 rounded-2xl hover:bg-[#e6474d] transition-all active:scale-95 shadow-[0_8px_20px_rgba(255,62,248,0.3)] hover:shadow-[0_8px_25px_rgba(255,62,248,0.5)] mt-2"
          >
            Entrar al grupo
          </button>
        </form>

      </div>
    </div>
  )
}

export default App