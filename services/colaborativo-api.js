import axios from 'axios';

// Define a URL base da sua API
const API_URL = 'https://n8n-colaborativo-api.r954jc.easypanel.host/api';

// Cria uma instância do Axios com a configuração base
const api = axios.create({
  baseURL: API_URL,
});

// Isso é um "interceptor". Ele executa um código ANTES de cada requisição ser enviada.
// Aqui, ele vai pegar o token de autenticação do localStorage e adicioná-lo ao cabeçalho.
api.interceptors.request.use(
  (config) => {
    // Assumimos que o token é salvo no localStorage após o login com a chave 'authToken'
    const token = localStorage.getItem('authToken'); 
    
    if (token) {
      // Se o token existir, adiciona ao cabeçalho 'Authorization'
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Se houver um erro na configuração, a promessa é rejeitada
    return Promise.reject(error);
  }
);

export default api;