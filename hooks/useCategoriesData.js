// src/hooks/useCategories.js

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api'; // Assumindo que seu utilitário API está em src/utils/api.js

/**
 * Hook para buscar categorias do usuário autenticado.
 * @param {number | null} userId - O ID do usuário autenticado.
 * @returns {{categories: object[], loading: boolean, error: string | null, refetch: () => void}} Dados das categorias, estados de loading/erro, e função para forçar re-fetch.
 */
const useCategories = (userId) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!userId) {
       setLoading(false);
       setCategories([]);
       setError(null);
       return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/categories'); // Assume que GET /categories retorna todas as categorias do usuário
      // A resposta da sua API tem a estrutura { status, data: [], total: number }
      setCategories(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('[useCategories] Error fetching categories:', err);
      setError(err.message || 'Erro ao carregar categorias.');
      setLoading(false);
      setCategories([]);
    }
  }, [userId]);

  useEffect(() => {
    console.log('[useCategories] Effect triggered - Fetching categories...');
    fetchCategories();
  }, [fetchCategories]);

   const refetch = () => {
       fetchCategories(); // Simplesmente chama a função de busca novamente
   }


  return { categories, loading, error, refetch };
};

export default useCategories;