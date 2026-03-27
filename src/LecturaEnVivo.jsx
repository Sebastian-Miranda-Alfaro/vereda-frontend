import React, { useState, useEffect } from 'react';
import { guardarSubrayado, guardarNota,obtenerMisNotas, compartirVersiculo, obtenerMisSubrayados,eliminarSubrayado, eliminarNota } from './api/comunidadApi';
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
  // Guarda el versículo que el usuario tocó
  const [versiculoActivo, setVersiculoActivo] = useState(null); 
  // Abrir las ventanas de notas o compartir
  const [modalNotaAbierto, setModalNotaAbierto] = useState(false);
  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);

  // --- ESTADOS DEL TIEMPO REAL (De tu código anterior) ---
  const [lecturasActivas, setLecturasActivas] = useState([]);

  // --- FUNCIONES PARA LA API ---
  const [textoNota, setTextoNota] = useState(''); // Lo que el usuario escribe en la nota
  const [subrayadosCapitulo, setSubrayadosCapitulo] = useState([]); // Guarda los versículos pintados
  // versiculo compartido
  const [textoReflexion, setTextoReflexion] = useState('');
  const [notasGuardadas, setNotasGuardadas] = useState({});
  const [notaParaLeer, setNotaParaLeer] = useState(null);

  const manejarSubrayado = async (numeroVersiculo) => {
    const yaEstabaSubrayado = subrayadosCapitulo.includes(numeroVersiculo);
    try {
      if (yaEstabaSubrayado) {
        // Si ya estaba, lo ELIMINAMOS de la base de datos y de la pantalla 
        await eliminarSubrayado(libroSeleccionado.nombre, capituloSeleccionado, numeroVersiculo);
        setSubrayadosCapitulo((prev) => prev.filter(v => v !== numeroVersiculo));
      } else {
        // Si no estaba, lo GUARDAMOS
        await guardarSubrayado(libroSeleccionado.nombre, capituloSeleccionado, numeroVersiculo, 'amarillo');
        setSubrayadosCapitulo((prev) => [...prev, numeroVersiculo]);
      }
      setVersiculoActivo(null); // Cerramos el menú
    }  catch (error) {
       console.error("Error al modificar el subrayado:", error);
       alert("Hubo un error al guardar/eliminar. Revisa tu consola.");

    
    }
  };  


  const manejarGuardarNota = async () => {
    if (!textoNota.trim()) return;
    try {
      await guardarNota(libroSeleccionado.nombre, capituloSeleccionado, versiculoActivo, textoNota);
      setNotasGuardadas((prev) => ({ ...prev, [versiculoActivo]: textoNota }));
      alert("¡Nota privada guardada con éxito! ✍️");
      setModalNotaAbierto(false);
      setTextoNota('');
      setVersiculoActivo(null);
    } catch (error) {
      console.error("Error al guardar nota:", error);
    }
  };
  const manejarEliminarNota = async (numeroVersiculo) => {
    // Le pedimos confirmación al usuario para no borrar por accidente
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) return;

    try {
      await eliminarNota(libroSeleccionado.nombre, capituloSeleccionado, numeroVersiculo);
      
      // Eliminamos la nota de nuestro diccionario local para que desaparezca el ícono 📝
      setNotasGuardadas((prev) => {
        const nuevoDiccionario = { ...prev };
        delete nuevoDiccionario[numeroVersiculo];
        return nuevoDiccionario;
      });

      setNotaParaLeer(null); // Cerramos el modal
      alert("Nota eliminada correctamente 🗑️");
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
      alert("Hubo un error al eliminar la nota.");
    }
  };



  // --- CARGAR INDICADORES DE NOTAS ---
  useEffect(() => {
    const cargarIndicadores = async () => {
      try {
        const todasMisNotas = await obtenerMisNotas();
        
        // Creamos diccionario
        const diccionarioNotas = {};
        todasMisNotas.forEach(nota => {
          if (nota.libro === libroSeleccionado.nombre && parseInt(nota.capitulo) === capituloSeleccionado) {
            diccionarioNotas[parseInt(nota.versiculo)] = nota.texto; // Aseguramos guardar el texto
          }
        });
          
        setNotasGuardadas(diccionarioNotas);
      } catch (error) {
        console.error("Error al cargar los indicadores de notas:", error);
      }
    };

    if (libroSeleccionado && capituloSeleccionado) {
      cargarIndicadores();
    }
  }, [libroSeleccionado, capituloSeleccionado]); // Se vuelve a ejecutar si cambias de página

  // 1. OBTENER TEXTO + AVISAR AL SERVIDOR
useEffect(() => {
  const obtenerTextoBiblico = async () => {
    setCargando(true);
    setError(null);

    const url = `https://bible-api.deno.dev/api/read/rv1960/${libroSeleccionado.valor}/${capituloSeleccionado}`;

    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error();

      const datos = await respuesta.json();

      const versiculosFormateados = datos.vers.map(v => ({
        verse: v.number,
        text: v.verse
      }));

      setVersiculos(versiculosFormateados);
    } catch (err) {
      console.error(err);
      setError("Error al cargar la Biblia.");
    } finally {
      setCargando(false);
    }
  };

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

}, [libroSeleccionado, capituloSeleccionado]);


// 2. SUBRAYADOS (SEPARADO)
useEffect(() => {
  const cargarSubrayados = async () => {
    try {
      const todosMisSubrayados = await obtenerMisSubrayados();

      const deEsteCapitulo = todosMisSubrayados
        .filter(sub => sub.libro === libroSeleccionado.nombre && sub.capitulo === capituloSeleccionado)
        .map(sub => sub.versiculo);

      setSubrayadosCapitulo(deEsteCapitulo);
    } catch (error) {
      console.error("Error al cargar subrayados", error);
    }
  };

  cargarSubrayados();

}, [libroSeleccionado, capituloSeleccionado]);

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
  const manejarPublicarCompartido = async () => {
    try {
      // Obtenemos el texto bíblico exacto del versículo activo
      const textoBiblicoACompartir = versiculos.find(v => v.verse === versiculoActivo)?.text;

      await compartirVersiculo(
        libroSeleccionado.nombre,
        capituloSeleccionado,
        versiculoActivo,
        textoBiblicoACompartir,
        textoReflexion // Su nota opcional
      );

      alert("¡Versículo enviado al Feed de la comunidad! ✨");
      setModalCompartirAbierto(false); // Cierra modal
      setTextoReflexion(''); // Limpia textarea
      setVersiculoActivo(null); // Cierra menú
      
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Hubo un error al publicar en el feed. Revisa tu conexión.");
    }
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
              
              {/* Indicador de Tiempo Real */}
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
                {versiculos.map((v) => {
                  // 1. Verificamos si este versículo está en nuestra lista de subrayados
                  const estaSubrayado = subrayadosCapitulo.includes(v.verse);

                  return (
                    <div 
                      key={v.verse}
                      // 2. Aquí está la magia: Si está subrayado, pinta el fondo amarillo. Si no, déjalo normal.
                      className={`relative group flex gap-4 p-2 rounded-xl transition-colors cursor-pointer ${
                        estaSubrayado 
                          ? 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => setVersiculoActivo(versiculoActivo === v.verse ? null : v.verse)}
                    >
                      {/* El contenedor para el número y el iconito de nota 👇 */}
                      <div className="flex flex-col items-center pt-1.5 min-w-[24px]">
                        <span className="text-sm font-bold text-gray-400">{v.verse}</span>
                        {/* Si el versículo actual está en nuestra lista de notas, pintamos el ícono */}
                        {notasGuardadas[v.verse] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // 🛑 Importante: Evita que se abra el menú de abajo al darle clic al icono
                              setNotaParaLeer({ versiculo: v.verse, texto: notasGuardadas[v.verse] }); // Abrimos la nota
                            }}
                            className="text-[12px] mt-0.5 animate-fade-in-up hover:scale-125 transition-transform cursor-pointer" 
                            title="Ver mi nota"
                          >
                            📝
                          </button>
                        )}
                      </div>
                      
                      {/* El texto del versículo */}
                      <p className="flex-1">{v.text}</p>
                      
                      {/* EL MENÚ FLOTANTE MÁGICO */}
                      {versiculoActivo === v.verse && (
                        <div className="absolute top-full left-10 mt-2 z-10 flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in-up">

                          {/* Botón Subrayar (Amarillo) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); manejarSubrayado(v.verse); }} 
                            className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-300 transition-colors flex items-center justify-center text-lg" 
                            title="Subrayar de amarillo"
                          >
                            🖍️
                          </button>

                          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                          {/* Botón Anotar */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setModalNotaAbierto(true); }}
                            className="px-3 py-1.5 text-sm font-bold text-[#5241C7] bg-[#5241C7]/10 rounded-lg hover:bg-[#5241C7]/20 transition-colors flex items-center gap-1.5"
                          >
                            <span>✍️</span> Nota
                          </button>

                          {/* Botón Compartir */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setModalCompartirAbierto(true); }}
                            className="px-3 py-1.5 text-sm font-bold text-[#23D9A6] bg-[#23D9A6]/10 rounded-lg hover:bg-[#23D9A6]/20 transition-colors flex items-center gap-1.5"
                          >
                            <span>✨</span> Compartir
                          </button>
                          
                          {/* Botón Cerrar (X) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setVersiculoActivo(null); }}
                            className="ml-1 p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          )}
        </main>

        {/* ========================================== */}
        {/* 👉 AQUÍ VAN LOS MODALES, ADENTRO DEL RETURN 👈 */}
        {/* ========================================== */}
        
        {/* --- MODAL PARA ESCRIBIR NOTA PRIVADA --- */}
        {modalNotaAbierto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm animate-fade-in-up">
              <h3 className="text-xl font-bold text-[#5241C7] mb-2">Mi Nota Personal</h3>
              <p className="text-sm text-gray-500 mb-4">
                {libroSeleccionado.nombre} {capituloSeleccionado}:{versiculoActivo}
              </p>
              <textarea
                className="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#5241C7] outline-none min-h-[120px] resize-none mb-4 dark:text-white"
                placeholder="¿Qué te habló Dios en este versículo?..."
                value={textoNota}
                onChange={(e) => setTextoNota(e.target.value)}
              ></textarea>
              <div className="flex gap-3">
                <button
                  onClick={() => { setModalNotaAbierto(false); setTextoNota(''); }}
                  className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={manejarGuardarNota}
                  className="flex-1 py-3 font-bold text-white bg-[#5241C7] hover:bg-[#4133A1] rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  Guardar Nota
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL PARA COMPARTIR EN EL FEED --- */}
        {modalCompartirAbierto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm animate-fade-in-up">
              <h3 className="text-xl font-bold text-[#23D9A6] mb-2">Compartir con la Comunidad</h3>
              <p className="text-sm text-gray-500 mb-4">
                Todos verán: {libroSeleccionado.nombre} {capituloSeleccionado}:{versiculoActivo}
              </p>
              
              {/* Aquí mostramos un mini-resumen del versículo que va a compartir */}
              <div className="bg-[#EEFDF9] dark:bg-[#1A2E29] p-3 rounded-lg mb-4 border-l-4 border-[#23D9A6]">
                 <p className="text-sm italic text-gray-700 dark:text-gray-300">
                    "{versiculos.find(v => v.verse === versiculoActivo)?.text}"
                 </p>
              </div>

              <textarea 
                className="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#23D9A6] outline-none min-h-[100px] resize-none mb-4 dark:text-white"
                placeholder="Escribe una reflexión pública (opcional)..."
                value={textoReflexion}
                onChange={(e) => setTextoReflexion(e.target.value)}
              ></textarea>

              <div className="flex gap-3">
                <button 
                  onClick={() => setModalCompartirAbierto(false)}
                  className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-xl transition-colors"
                >
                  Cancelar
                </button>

                <button 
                  onClick={manejarPublicarCompartido}
                  className="flex-1 py-3 font-bold text-white bg-[#23D9A6] hover:bg-[#1eb98e] rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}
{/* --- MODAL PARA LEER LA NOTA --- */}
        {notaParaLeer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setNotaParaLeer(null)}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm animate-fade-in-up" onClick={e => e.stopPropagation()}>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#212121] dark:text-white">
                  Mi Nota Privada
                </h3>
                <span className="bg-[#5241C7]/10 text-[#5241C7] text-xs font-bold px-3 py-1 rounded-full">
                  {libroSeleccionado?.nombre} {capituloSeleccionado}:{notaParaLeer.versiculo}
                </span>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-700/50 mb-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {notaParaLeer.texto}
                </p>
              </div>
              
              {/* Botones de acción del Modal de Lectura */}
              <div className="flex gap-3">
                <button 
                  onClick={() => manejarEliminarNota(notaParaLeer.versiculo)}
                  className="flex-1 py-3 font-bold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl transition-colors"
                >
                  🗑️ Eliminar
                </button>
                <button 
                  onClick={() => setNotaParaLeer(null)}
                  className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

