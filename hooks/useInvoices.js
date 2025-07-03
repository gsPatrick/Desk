// src/hooks/useInvoices.js

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * Hook para buscar faturas do usuário autenticado.
 * @param {object} filters - Objeto contendo os filtros para a API (accountId, month, year, status, etc.)
 * @returns {{invoices: object[], loading: boolean, error: string | null, refetch: () => void}}
 */
const useInvoices = (filters) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalRefresh, setInternalRefresh] = useState(0);

  const fetchInvoices = useCallback(async () => {
    // Só busca se houver filtros (pelo menos o accountId é esperado)
    if (!filters || !filters.accountId) {
       setLoading(false);
       setInvoices([]);
       setError(null);
       return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/invoices', { params: filters });
      setInvoices(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('[useInvoices] Error fetching invoices:', err);
      setError(err.message || 'Erro ao carregar faturas.');
      setLoading(false);
      setInvoices([]);
    }
  }, [filters, internalRefresh]); // Depende dos filtros e do refresh

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const refetch = () => {
      setInternalRefresh(prev => prev + 1);
  }

  return { invoices, loading, error, refetch };
};

export default useInvoices;