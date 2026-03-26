// src/api/comunidadApi.js

const API_URL = 'https://vereda-backend-6otc.onrender.com/api/comunidad'; 
//const API_URL = 'http://127.0.0.1:8000/api/comunidad'; // Usaremos este para pruebas
// Función auxiliar para obtener los headers con el Token de seguridad
const getAuthHeaders = () => {
    const token = localStorage.getItem('token_vereda');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// 1. NOTAS PERSONALES
export const guardarNota = async (libro, capitulo, versiculo, texto) => {
    const response = await fetch(`${API_URL}/notas/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ libro, capitulo, versiculo, texto })
    });
    return response.json();
};

export const obtenerMisNotas = async () => {
    const response = await fetch(`${API_URL}/notas/`, {
        headers: getAuthHeaders(),
    });
    return response.json();
};

// 2. SUBRAYADOS
export const guardarSubrayado = async (libro, capitulo, versiculo, color = 'amarillo') => {
    const response = await fetch(`${API_URL}/subrayados/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ libro, capitulo, versiculo, color })
    });
    return response.json();
};

export const obtenerMisSubrayados = async () => {
    const response = await fetch(`${API_URL}/subrayados/`, {
        headers: getAuthHeaders(),
    });
    return response.json();
};

// 3. VERSÍCULOS COMPARTIDOS (Feed)
export const compartirVersiculo = async (libro, capitulo, versiculo, texto_biblico, nota_publica) => {
    const response = await fetch(`${API_URL}/compartidos/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ libro, capitulo, versiculo, texto_biblico, nota_publica })
    });
    return response.json();
};