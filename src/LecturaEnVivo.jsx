import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE LA BIBLIA ---
const librosBiblia = [
  { nombre: "Génesis", valor: "genesis", capitulos: 50 },
  { nombre: "Éxodo", valor: "exodus", capitulos: 40 },
  { nombre: "Levítico", valor: "leviticus", capitulos: 27 },
  { nombre: "Números", valor: "numbers", capitulos: 36 },
  { nombre: "Deuteronomio", valor: "deuteronomy", capitulos: 34 },
  { nombre: "Josué", valor: "joshua", capitulos: 24 },
  { nombre: "Jueces", valor: "judges", capitulos: 21 },
  { nombre: "Rut", valor: "ruth", capitulos: 4 },
  { nombre: "1 Samuel", valor: "1samuel", capitulos: 31 },
  { nombre: "2 Samuel", valor: "2samuel", capitulos: 24 },
  { nombre: "1 Reyes", valor: "1kings", capitulos: 22 },
  { nombre: "2 Reyes", valor: "2kings", capitulos: 25 },
  { nombre: "1 Crónicas", valor: "1chronicles", capitulos: 29 },
  { nombre: "2 Crónicas", valor: "2chronicles", capitulos: 36 },
  { nombre: "Esdras", valor: "ezra", capitulos: 10 },
  { nombre: "Nehemías", valor: "nehemiah", capitulos: 13 },
  { nombre: "Ester", valor: "esther", capitulos: 10 },
  { nombre: "Job", valor: "job", capitulos: 42 },
  { nombre: "Salmos", valor: "psalms", capitulos: 150 },
  { nombre: "Proverbios", valor: "proverbs", capitulos: 31 },
  { nombre: "Eclesiastés", valor: "ecclesiastes", capitulos: 12 },
  { nombre: "Cantares", valor: "songofsongs", capitulos: 8 },
  { nombre: "Isaías", valor: "isaiah", capitulos: 66 },
  { nombre: "Jeremías", valor: "jeremiah", capitulos: 52 },
  { nombre: "Lamentaciones", valor: "lamentations", capitulos: 5 },
  { nombre: "Ezequiel", valor: "ezekiel", capitulos: 48 },
  { nombre: "Daniel", valor: "daniel", capitulos: 12 },
  { nombre: "Oseas", valor: "hosea", capitulos: 14 },
  { nombre: "Joel", valor: "joel", capitulos: 3 },
  { nombre: "Amós", valor: "amos", capitulos: 9 },
  { nombre: "Abdías", valor: "obadiah", capitulos: 1 },
  { nombre: "Jonás", valor: "jonah", capitulos: 4 },
  { nombre: "Miqueas", valor: "micah", capitulos: 7 },
  { nombre: "Nahúm", valor: "nahum", capitulos: 3 },
  { nombre: "Habacuc", valor: "habakkuk", capitulos: 3 },
  { nombre: "Sofonías", valor: "zephaniah", capitulos: 3 },
  { nombre: "Hageo", valor: "haggai", capitulos: 2 },
  { nombre: "Zacarías", valor: "zechariah", capitulos: 14 },
  { nombre: "Malaquías", valor: "malachi", capitulos: 4 },

  { nombre: "Mateo", valor: "matthew", capitulos: 28 },
  { nombre: "Marcos", valor: "mark", capitulos: 16 },
  { nombre: "Lucas", valor: "luke", capitulos: 24 },
  { nombre: "Juan", valor: "john", capitulos: 21 },
  { nombre: "Hechos", valor: "acts", capitulos: 28 },
  { nombre: "Romanos", valor: "romans", capitulos: 16 },
  { nombre: "1 Corintios", valor: "1corinthians", capitulos: 16 },
  { nombre: "2 Corintios", valor: "2corinthians", capitulos: 13 },
  { nombre: "Gálatas", valor: "galatians", capitulos: 6 },
  { nombre: "Efesios", valor: "ephesians", capitulos: 6 },
  { nombre: "Filipenses", valor: "philippians", capitulos: 4 },
  { nombre: "Colosenses", valor: "colossians", capitulos: 4 },
  { nombre: "1 Tesalonicenses", valor: "1thessalonians", capitulos: 5 },
  { nombre: "2 Tesalonicenses", valor: "2thessalonians", capitulos: 3 },
  { nombre: "1 Timoteo", valor: "1timothy", capitulos: 6 },
  { nombre: "2 Timoteo", valor: "2timothy", capitulos: 4 },
  { nombre: "Tito", valor: "titus", capitulos: 3 },
  { nombre: "Filemón", valor: "philemon", capitulos: 1 },
  { nombre: "Hebreos", valor: "hebrews", capitulos: 13 },
  { nombre: "Santiago", valor: "james", capitulos: 5 },
  { nombre: "1 Pedro", valor: "1peter", capitulos: 5 },
  { nombre: "2 Pedro", valor: "2peter", capitulos: 3 },
  { nombre: "1 Juan", valor: "1john", capitulos: 5 },
  { nombre: "2 Juan", valor: "2john", capitulos: 1 },
  { nombre: "3 Juan", valor: "3john", capitulos: 1 },
  { nombre: "Judas", valor: "jude", capitulos: 1 },
  { nombre: "Apocalipsis", valor: "revelation", capitulos: 22 },
];

export default function LecturaEnVivo() {
  // --- ESTADOS DEL LECTOR ---
  const [libroSeleccionado, setLibroSeleccionado] = useState(librosBiblia[4]); // Inicia en Juan
  const [capituloSeleccionado, setCapituloSeleccionado] = useState(3);
  const [versiculos, setVersiculos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // --- ESTADOS DEL TIEMPO REAL (De tu código anterior) ---
  const [lecturasActivas, setLecturasActivas] = useState([]);

  // 1. OBTENER EL TEXTO BÍBLICO Y AVISAR AL SERVIDOR AUTOMÁTICAMENTE
  useEffect(() => {
    // A. Traer texto de la Biblia
    const obtenerTextoBiblico = async () => {
      setCargando(true);
      setError(null);
      const url = `https://bible-api.com/${libroSeleccionado.valor}+${capituloSeleccionado}?translation=rvr`;
      try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('No se pudo obtener el texto bíblico.');
        const datos = await respuesta.json();
        setVersiculos(datos.verses);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la Biblia.");
      } finally {
        setCargando(false);
      }
    };

    // B. Avisar a tu servidor Django en automático (¡Adiós botón "Avisar"!)
    const actualizarMiLecturaAutomatica = async () => {
      const token = localStorage.getItem('token_vereda');
      if (!token) return;
      try {
        await fetch('https://vereda-backend-6otc.onrender.com/api/lecturas/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            libro: libroSeleccionado.nombre, 
            capitulo: capituloSeleccionado.toString() 
          })
        });
      } catch (error) {
        console.error("Error al actualizar estado en vivo", error);
      }
    };

    obtenerTextoBiblico();
    actualizarMiLecturaAutomatica();

  }, [libroSeleccionado, capituloSeleccionado]); // Se ejecuta cada vez que cambias de libro o capítulo


  // 2. CONEXIÓN WEBSOCKET PARA VER A LOS DEMÁS (De tu código anterior)
  useEffect(() => {
    const obtenerLecturas = async () => {
      const token = localStorage.getItem('token_vereda');
      if (!token) return;
      try {
        const respuesta = await fetch('https://vereda-backend-6otc.onrender.com/api/lecturas/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (respuesta.status === 401) {
          localStorage.removeItem('token_vereda'); 
          return;
        }
        const datos = await respuesta.json();
        if (respuesta.ok) setLecturasActivas(datos);
      } catch (error) {
        console.error("Error al obtener lecturas activas", error);
      }
    };

    obtenerLecturas();
    const socket = new WebSocket('wss://vereda-backend-6otc.onrender.com/ws/lecturas/');

    socket.onmessage = function(event) {
      console.log("🔥 ¡Cambio en la sala!", JSON.parse(event.data));
      obtenerLecturas(); // Actualiza la lista si alguien entra o cambia de capítulo
    };

    return () => socket.close();
  }, []);

  // --- MANEJADORES ---
  const manejarCambioLibro = (e) => {
    const libroValor = e.target.value;
    const nuevoLibro = librosBiblia.find(l => l.valor === libroValor);
    setLibroSeleccionado(nuevoLibro);
    setCapituloSeleccionado(1); 
  };

  // --- COMPONENTES VISUALES ---
  const SelectorMinimalista = ({ value, onChange, options, label }) => (
    <div className="relative">
      <label className="text-xs font-bold text-[#B0B3BA] dark:text-gray-500 uppercase tracking-widest block mb-1.5 ml-1">
        {label}
      </label>
      <select 
        value={value} 
        onChange={onChange}
        className="appearance-none bg-[#F4F5F7] dark:bg-gray-800 text-[#212121] dark:text-gray-100 font-bold text-lg px-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-[#23D9A6] transition-all cursor-pointer w-full min-w-[140px]"
      >
        {options}
      </select>
    </div>
  );

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-900 transition-colors duration-300">
        
        {/* NAVEGACIÓN Y SELECTORES */}
        <header className="sticky top-0 z-10 bg-[#FDFDFD]/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            
            <div className="flex items-end gap-3 flex-wrap">
              <SelectorMinimalista 
                label="Libro"
                value={libroSeleccionado.valor}
                onChange={manejarCambioLibro}
                options={librosBiblia.map(l => <option key={l.valor} value={l.valor}>{l.nombre}</option>)}
              />
              <SelectorMinimalista 
                label="Capítulo"
                value={capituloSeleccionado}
                onChange={(e) => setCapituloSeleccionado(parseInt(e.target.value))}
                options={Array.from({ length: libroSeleccionado.capitulos }, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              />
            </div>

            {/* PANEL DE USUARIOS ACTIVOS Y MODO OSCURO */}
            <div className="flex items-center gap-3">
              
              {/* Indicador de Tiempo Real (Fusionado con tu lógica) */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2.5 bg-[#EEFDF9] dark:bg-[#1A2E29] px-4 py-2 rounded-full text-[#23D9A6] font-semibold text-sm shadow-inner mb-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#23D9A6] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#23D9A6]"></span>
                  </span>
                  <span>{lecturasActivas.length} en línea</span>
                </div>
                {/* Mostramos discretamente quién está en este capítulo */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                   {lecturasActivas.filter(l => l.libro === libroSeleccionado.nombre && parseInt(l.capitulo) === capituloSeleccionado).length} aquí contigo
                </div>
              </div>

              {/* Botón Modo Oscuro */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-3.5 rounded-xl bg-[#F4F5F7] dark:bg-gray-800 text-[#717784] hover:bg-gray-100 transition-colors"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </header>

        {/* ÁREA DE LECTURA */}
        <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
          {cargando && <div className="text-center py-20">Cargando la Palabra...</div>}
          
          {!cargando && !error && versiculos.length > 0 && (
            <article className="prose max-w-none">
              <h1 className="text-4xl font-extrabold text-[#212121] dark:text-white mb-10">
                {libroSeleccionado.nombre} {capituloSeleccionado}
              </h1>
              
              <div className="space-y-6 text-gray-800 dark:text-gray-200 text-xl leading-relaxed font-serif">
                {versiculos.map((v) => (
                  <p key={v.verse} className="flex gap-4">
                    <span className="text-sm font-bold text-gray-400 pt-1.5">{v.verse}</span>
                    <span>{v.text}</span>
                  </p>
                ))}
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}