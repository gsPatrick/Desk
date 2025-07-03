// src/hooks/useAccounts.js

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api'; // Assumindo que seu utilitário API está em src/utils/api.js

/**
 * Hook para buscar contas e cartões do usuário autenticado.
 * @param {number | null} userId - O ID do usuário autenticado.
 * @returns {{accounts: object[], loading: boolean, error: string | null, refetch: () => void}} Dados das contas, estados de loading/erro, e função para forçar re-fetch.
 */
const useAccounts = (userId) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    if (!userId) {
       setLoading(false);
       setAccounts([]);
       setError(null);
       return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/accounts'); // Assume que GET /accounts retorna todas as contas do usuário
      // A resposta da sua API tem a estrutura { status, data: [], total: number }
      setAccounts(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('[useAccounts] Error fetching accounts:', err);
      setError(err.message || 'Erro ao carregar contas.');
      setLoading(false);
      setAccounts([]);
    }
  }, [userId]);

  useEffect(() => {
    console.log('[useAccounts] Effect triggered - Fetching accounts...');
    fetchAccounts();
  }, [fetchAccounts]);

  const refetch = () => {
      fetchAccounts(); // Simplesmente chama a função de busca novamente
  }

  return { accounts, loading, error, refetch };
};

export default useAccounts;