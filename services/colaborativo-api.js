import axios from 'axios';

const API_URL = 'https://n8n-colaborativo-api.r954jc.easypanel.host/api';

const api = axios.create({
  baseURL: API_URL,
});

// Removido: let openSessionExpiredModalGlobally e setGlobalSessionExpiredModal
// Removido: export let isSessionExpired = false;

// Interceptor de requisições
api.interceptors.request.use(
  (config) => {
    // --- NOVO: Verifica se o token ainda existe antes de enviar.
    // Se o token foi removido por um 401 anterior, não tenta mais requisições.
    const token = localStorage.getItem('authToken');
    if (!token && !config.url.includes('/users/login') && !config.url.includes('/users/register')) {
        // Se não há token e não é login/register, cancela a requisição para evitar loops.
        return Promise.reject(new axios.Cancel('Nenhum token. Redirecionando para login.'));
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
        return Promise.reject(error); // Retorna o cancelamento sem processar como erro
    }

    if (error.response && error.response.status === 401) {
      // --- CORREÇÃO CRÍTICA AQUI: Redireciona diretamente para a nova página ---
      localStorage.removeItem('authToken'); // Limpa o token imediatamente
      // Apenas redireciona se não estiver já na página de sessão expirada ou login
      if (!window.location.pathname.startsWith('/colaborativo/session-expired') && 
          !window.location.pathname.startsWith('/colaborativo/login') &&
          !window.location.pathname.startsWith('/colaborativo/register')) {
        window.location.href = '/colaborativo/session-expired'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;