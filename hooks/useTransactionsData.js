// src/hooks/useTransactionsData.js (AJUSTADO: Cálculo de Datas e Lógica de Pulo)

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
// Importar funções de data e locale
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importar locale português

const useTransactionsData = (userId, filters, refreshTrigger) => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalRefresh, setInternalRefresh] = useState(0);

  const stableFilters = JSON.stringify(filters);

  const fetchTransactions = useCallback(async () => {
    if (!filters) {
        setLoading(false);
        setTransactions([]);
        setTotal(0);
        return;
    }

    if (!userId) {
       setLoading(false);
       setTransactions([]);
       setTotal(0);
       setError(null);
       return;
    }

    // CORRIGIDO: Lógica de pulo mais robusta (mantida)
    const hasInvoiceFilter = 'invoiceId' in filters;
    const hasAccountFilter = 'accountId' in filters;

    if (
        (hasInvoiceFilter && (filters.invoiceId === null || filters.invoiceId === undefined)) ||
        (hasAccountFilter && (filters.accountId === null || filters.accountId === undefined))
    ) {
         console.log('[useTransactionsData] Skipping fetch: Specific filter (invoiceId or accountId) is present but null/undefined.');
         setLoading(false);
         setTransactions([]);
         setTotal(0);
         setError(null);
         return;
    }


    // CORRIGIDO: Calcular startDate e endDate com base no dateRangeType
    let startDate = undefined;
    let endDate = undefined;
    const today = new Date();
    today.setHours(0,0,0,0); // Zera hora para comparações de dia

    switch (filters.dateRangeType) {
        case 'today':
            startDate = startOfDay(today);
            endDate = endOfDay(today);
            break;
        case 'thisWeek':
            startDate = startOfWeek(today, { locale: ptBR }); // Início da semana (considerando locale)
            endDate = endOfWeek(today, { locale: ptBR });     // Fim da semana
            break;
        case 'lastWeek':
            startDate = startOfWeek(subWeeks(today, 1), { locale: ptBR }); // Início da semana anterior
            endDate = endOfWeek(subWeeks(today, 1), { locale: ptBR });     // Fim da semana anterior
            break;
        case 'thisMonth':
            startDate = startOfMonth(today); // Início do mês atual
            endDate = endOfMonth(today);   // Fim do mês atual
            break;
        case 'lastMonth':
            startDate = startOfMonth(subMonths(today, 1)); // Início do mês anterior
            endDate = endOfMonth(subMonths(today, 1));   // Fim do mês anterior
            break;
        case 'all':
        default:
            // startDate e endDate ficam undefined, API busca todos os lançamentos
            break;
    }


    console.log('[useTransactionsData] Starting fetch with userId:', userId, 'and filters:', filters);

    setLoading(true);
    setError(null);

    try {
      const apiFilters = {
        type: filters.type === 'all' ? undefined : (filters.type === 'receita' ? 'income' : 'expense'),
        status: filters.status === 'all' ? undefined : (filters.status === 'realized' ? 'cleared' : filters.status === 'forecast' ? ['pending', 'scheduled'] : undefined),
        recurring: filters.recurring === 'all' ? undefined : (filters.recurring === 'yes' ? true : false),

        ...(filters.invoiceId !== undefined && filters.invoiceId !== null && { invoiceId: filters.invoiceId }), // Inclui invoiceId se presente e não nulo
        ...(filters.accountId !== undefined && filters.accountId !== null && { accountId: filters.accountId }), // Inclui accountId se presente e não nulo

        search: filters.search && filters.search.trim() ? filters.search.trim() : undefined,

        // CORRIGIDO: Incluir startDate e endDate APENAS se foram calculados (não são undefined)
        ...(startDate !== undefined && { startDate: format(startDate, 'yyyy-MM-dd') }), // Formatar para YYYY-MM-DD
        ...(endDate !== undefined && { endDate: format(endDate, 'yyyy-MM-dd') }),     // Formatar para YYYY-MM-DD


        limit: filters.limit || 500,
        page: filters.page || 1,
        sortBy: filters.sortBy || 'date:desc',
      };

       // Limpeza final de undefined (redundante com o spread, mas seguro)
       Object.keys(apiFilters).forEach(key => apiFilters[key] === undefined && delete apiFilters[key]);

      console.log('[useTransactionsData] Fetching transactions with API filters:', apiFilters);
      const response = await api.get('/transactions', { params: apiFilters });
      console.log('[useTransactionsData] API response received:', response.data);

      setTransactions(response.data.data || []);
      setTotal(response.data.total || 0);
      setLoading(false);

    } catch (err) {
      console.error('[useTransactionsData] Error fetching transactions:', err);
      setError(err.message || 'Erro ao carregar lançamentos.');
      setLoading(false);
      setTransactions([]);
      setTotal(0);
    }
  }, [userId, stableFilters, refreshTrigger, internalRefresh]); // Dependência stableFilters é crucial

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const refetch = () => {
      setInternalRefresh(prev => prev + 1);
  }

  return { transactions, total, loading, error, refetch };
};

export default useTransactionsData;