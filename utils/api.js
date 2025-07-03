// src/utils/api.js (MODIFICADO)

import axios from 'axios';

const API_BASE_URL = 'https://jackbear-financeos-api.r954jc.easypanel.host/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir o token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    // Não anexa o token para rotas de login ou registro
    if (config.url.includes('/auth/login') || config.url.includes('/users/register')) {
        return config;
    }

    const token = localStorage.getItem('token'); // Obtém o token do localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opcional: Interceptor para lidar com respostas 401 Unauthorized
// Útil para deslogar o usuário automaticamente se o token expirar ou for inválido
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Unauthorized) e não for a rota de login original,
    // e a requisição ainda não tentou refazer (para evitar loops infinitos),
    // podemos tentar deslogar o usuário.
    if (error.response.status === 401 && originalRequest.url !== '/auth/login' && !originalRequest._retry) {
        originalRequest._retry = true; // Marca a requisição como retentativa
        console.error('401 Unauthorized. Token inválido ou expirado. Deslogando usuário...');
        // TODO: Implementar lógica de deslogar no frontend (remover token, limpar estado de usuário)
        // Ex: Chamar uma função de logout do AuthContext
        // window.location.href = '/auth/login'; // Redirecionar para login
         // Disparar um evento ou chamar uma função global de logout
         if (typeof window !== 'undefined' && window.dispatchEvent) {
             window.dispatchEvent(new CustomEvent('unauthorized'));
         }
    }

    return Promise.reject(error);
  }
);


export default api;