// src/hooks/useDashboardData.js

import { useState, useEffect } from 'react';
import api from '../utils/api'; // Importa o cliente API

const useDashboardData = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Certifique-se de que userId é válido antes de buscar
    if (!userId) {
      setLoading(false);
      // Opcional: setError(new Error("User ID not provided"));
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // A API busca os dados do usuário autenticado (baseado no token),
        // então talvez não seja necessário passar o userId no endpoint,
        // mas a função do backend `dashboardService.getDashboardData` espera `userId`.
        // Assumindo que o middleware de auth já setou `req.user.id`, o backend
        // usará esse ID. A requisição é apenas GET /api/v1/dashboard.
        const response = await api.get('/dashboard');
        setData(response.data.data); // A resposta da sua API tem a estrutura { status, data: { ... } }
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Dependências do useEffect: refazer a busca se userId mudar
  }, [userId]); // Adicionado userId como dependência

  return { data, loading, error };
};

export default useDashboardData;