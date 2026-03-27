// src/api/FeedComunidad.jsx
import React, { useState, useEffect } from 'react';
import { obtenerFeedComunidad, eliminarCompartido } from './api/comunidadApi';

const FeedComunidad = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // 👉 PASO 1: OBTENER TU NOMBRE DE USUARIO
  // Usamos la misma llave 'usuario_vereda' que guardaste en el handleLogin
  const miUsuarioLogueado = localStorage.getItem('usuario_vereda');

  // Detecta automáticamente si estamos en local o en la nube
  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000' 
    : 'https://vereda-backend-6otc.onrender.com';

  useEffect(() => {
    const cargarMuro = async () => {
      try {
        const datos = await obtenerFeedComunidad();
        setPublicaciones(datos);
      } catch (error) {
        console.error("Error al cargar el feed:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarMuro();
  }, []);

  // La función para borrar publicaciones
  const manejarEliminarPublicacion = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar esta publicación de la comunidad?")) return;

    try {
      await eliminarCompartido(id);
      
      // Actualizamos la lista del muro al instante sin recargar la página
      setPublicaciones((prev) => prev.filter((post) => post.id !== id));
      
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      alert("Hubo un error al eliminar. Revisa tu conexión.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-[#212121] dark:text-white">
          Comunidad
        </h2>
        <span className="bg-[#EEFDF9] dark:bg-[#1A2E29] text-[#23D9A6] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#23D9A6] animate-pulse"></span>
          Últimas 24h
        </span>
      </div>

      {cargando ? (
        <div className="text-center text-gray-500 py-10">Cargando comunidad...</div>
      ) : publicaciones.length === 0 ? (
        <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Nadie ha compartido nada hoy. ¡Sé el primero en la sección de Lectura! ✨</p>
        </div>
      ) : (
        <div className="space-y-6">
          {publicaciones.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative">
              
              {/* 👉 PASO 2: RENDERIZADO CONDICIONAL DEL BOTÓN BASURERO 👉 */}
              {/* Solo si el dueño del post (post.nombre_usuario) soy yo (miUsuarioLogueado), pintamos el basurero */}
              {post.nombre_usuario === miUsuarioLogueado && (
                <button 
                  onClick={() => manejarEliminarPublicacion(post.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Eliminar publicación"
                >
                  🗑️
                </button>
              )}
              {/* ---------------------------------------------------- */}

              {/* CABECERA: Avatar y Nombre */}
              {/* Agregamos padding-right pr-10 para que el nombre no choque con el basurero */}
              <div className="flex items-center gap-4 mb-5 pr-10">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden flex-shrink-0">
                  <img 
                    src={post.avatar_usuario ? `${BACKEND_URL}${post.avatar_usuario}` : `https://ui-avatars.com/api/?name=${post.nombre_usuario}&background=23D9A6&color=fff`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#212121] dark:text-white">{post.nombre_usuario}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    compartió <span className="font-bold text-[#5241C7] dark:text-[#7f6df2]">{post.libro} {post.capitulo}:{post.versiculo}</span>
                  </p>
                </div>
              </div>

              {/* CUERPO: Versículo */}
              <div className="bg-[#F4F5F7] dark:bg-gray-900/50 p-4 rounded-2xl mb-4 border-l-4 border-[#23D9A6]">
                <p className="text-gray-700 dark:text-gray-300 font-serif italic text-lg leading-relaxed">
                  "{post.texto_biblico}"
                </p>
              </div>

              {/* PIE: Reflexión */}
              {post.nota_publica && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-[#212121] dark:text-gray-200">
                    <span className="font-bold mr-2">Reflexión:</span> 
                    {post.nota_publica}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedComunidad;