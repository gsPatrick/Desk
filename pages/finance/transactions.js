// pages/finance/transactions.js (MODIFICADO - Gerencia múltiplos modais)

import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

// Componentes do frontend
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import LogEntry from '../../componentsFinance/Transactions/LogEntry';
import TimelineChart from '../../componentsFinance/Transactions/SummaryChart';

// Importe TODOS os modais que podem ser abertos
import AddTransactionModal from '../../componentsFinance/Shared/AddTransactionModal';
import AddCreditCardModal from '../../componentsFinance/Shared/AddCreditCardModal'; // <-- Importar
import AddCategoryModal from '../../componentsFinance/Shared/AddCategoryModal'; // <-- Importar (o novo)


import { PlusIcon } from '@heroicons/react/24/solid';
import pillStyles from '../../styles/TransactionsPageStyles.module.css';

// Importe os hooks necessários
import useAuth from '../../hooks/useAuth';
import useTransactionsData from '../../hooks/useTransactionsData';
import useAccounts from '../../hooks/userAccountsData';
import useCategories from '../../hooks/useCategoriesData';

import api from '../../utils/api';

// Componente FilterPill (mantido)
const FilterPill = ({ label, value, activeFilter, onFilterChange }) => {
  const isActive = activeFilter === value;
  const tailwindLayoutClasses = "px-3 py-1.5 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:focus:ring-offset-dark-surface";
  const tailwindActiveFocus = "focus:ring-blue-500";
  const tailwindInactiveFocus = "focus:ring-blue-400";
  const tailwindActiveShadow = "shadow-md";

  return (
    <button
      onClick={() => onFilterChange(value)}
      className={`
        ${pillStyles.filterPillBase}
        ${tailwindLayoutClasses}
        ${isActive
          ? `${pillStyles.active} ${tailwindActiveFocus} ${tailwindActiveShadow}`
          : `${pillStyles.inactive} ${tailwindInactiveFocus}`
        }
      `}
    >
      {label}
    </button>
  );
};


export default function FinanceTransactionsPage() {
  // --- Variáveis de Animação ---
  const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05, delayChildren: 0.2 }
      }
  };


  // --- Estados de Visibilidade dos Modais ---
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isAddCreditCardModalOpen, setIsAddCreditCardModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false); // <-- Estado para o modal de Categoria


  // Estado para os filtros da UI
  const [filters, setFilters] = useState({ type: 'all', status: 'all', recurring: 'all', search: '' });
  // Estado para forçar um re-fetch após adicionar/editar/deletar (principalmente transações)
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  // --- Autenticação ---
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- Redirecionar se não autenticado (APÓS o loading inicial da autenticação) ---
  useEffect(() => {
      if (!authLoading && !isAuthenticated) {
          router.push('/auth/login');
      }
  }, [authLoading, isAuthenticated, router]);


   // --- Hooks de Dados ---
  const { transactions, total, loading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = useTransactionsData(user?.id, filters, refreshTrigger);
  const { accounts, loading: accountsLoading, error: accountsError, refetch: refetchAccounts } = useAccounts(user?.id);
  const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories(user?.id);


  // --- Formata dados para os dropdowns do Modal (Mantido) ---
  const accountOptions = useMemo(() => {
      if (accountsLoading || accountsError || !accounts) return [];
      return accounts.map(acc => ({
          value: acc.id,
          label: acc.type === 'credit_card' ? `${acc.name} (Final ${acc.finalDigits || '????'})` : `${acc.name} (Cash)`
      }));
  }, [accounts, accountsLoading, accountsError]);

  const categoryOptions = useMemo(() => {
       if (categoriesLoading || categoriesError || !categories) return [];
      return categories.map(cat => ({ value: cat.id, label: cat.name }));
  }, [categories, categoriesLoading, categoriesError]);


  // --- Funções para Orquestração dos Modais ---

  // Abre o modal principal de Adicionar Transação
  const handleOpenAddTransactionModal = () => {
      setIsAddTransactionModalOpen(true);
  };

  // Funções chamadas pelo AddTransactionModal para abrir modais de criação
  const handleOpenAddCardFromTransaction = () => {
      setIsAddTransactionModalOpen(false); // Fecha o modal de transação
      setIsAddCreditCardModalOpen(true);    // Abre o modal de cartão
  };

   // <-- Handler para abrir modal de Categoria (JÁ EXISTIA) -->
  const handleOpenAddCategoryFromTransaction = () => {
      setIsAddTransactionModalOpen(false);  // Fecha o modal de transação
      setIsAddCategoryModalOpen(true);      // Abre o modal de categoria
  };


  // Funções de Save para os modais de criação (chamadas por seus `onSave`)
  const handleSaveNewCreditCard = async (newCardData) => {
      console.log("Saving new credit card:", newCardData);
      try {
           const response = await api.post('/accounts', newCardData);
           console.log("New card saved successfully:", response.data.data);

          refetchAccounts(); // Re-carrega a lista de contas
          setIsAddCreditCardModalOpen(false); // Fecha o modal de cartão
          setIsAddTransactionModalOpen(true); // Re-abre o modal de transação

          return { success: true, data: response.data.data };
      } catch (error) {
           console.error("Error saving new credit card:", error);
           throw error; // Re-lança para o modal filho exibir
      }
  };

   // <-- Handler para salvar nova Categoria (CHAMA API AGORA) -->
  const handleSaveNewCategory = async (newCategoryData) => {
       console.log("Saving new category:", newCategoryData);
       try {
           // *** CHAMA A API DE CATEGORIA ***
           const response = await api.post('/categories', newCategoryData); // <-- POST para /categories
           console.log("New category saved successfully:", response.data.data);

           refetchCategories(); // Re-carrega a lista de categorias
           setIsAddCategoryModalOpen(false); // Fecha o modal de categoria
           setIsAddTransactionModalOpen(true); // Re-abre o modal de transação

            return { success: true, data: response.data.data };
       } catch (error) {
           console.error("Error saving new category:", error);
           throw error; // Re-lança para o modal filho exibir
       }
  };


  // Função de Save para o modal principal de Transação (chamada por seu `onSave`) - Mantida
  const handleSaveTransaction = async (apiPayload) => {
      console.log("Attempting to save transaction with payload:", apiPayload);
      try {
          const response = await api.post('/transactions', apiPayload);
          console.log("Transaction saved successfully:", response.data);

          refetchTransactions(); // Re-carrega a lista de transações

          return { success: true, data: response.data.data };

      } catch (error) {
          console.error("Error saving transaction:", error);
          throw error;
      }
  };


   // --- Renderização de estado de loading/erro inicial da página (Mantido) ---
    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
                Carregando autenticação...
            </div>
        );
    }

    if (!isAuthenticated) {
         return null;
    }

    if (transactionsLoading && transactions.length === 0 && !transactionsError) {
        return (
             <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex flex-col items-center justify-center">
                 <FinanceHeader />
                 <div className="flex-1 flex items-center justify-center">
                     <p className="text-light-subtle dark:text-dark-subtle">Carregando lançamentos...</p>
                 </div>
             </div>
        );
    }

    if (transactionsError && transactions.length === 0) {
        return (
             <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex flex-col items-center justify-center">
                 <FinanceHeader />
                  <div className="flex-1 flex items-center justify-center text-red-500">
                      <p>Erro ao carregar lançamentos: {transactionsError}</p>
                  </div>
             </div>
        );
    }


  return (
    <>
      {/* Estrutura principal da página */}
      <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex flex-col lg:h-screen lg:overflow-hidden">
        <Head><title>Lançamentos | Finance OS</title></Head>

        {/* Header fixo */}
        <FinanceHeader />

        {/* Conteúdo principal com scroll */}
        <main className="flex-1 flex flex-col pt-24 sm:pt-32 pb-10 lg:overflow-hidden">
          {/* Container do cabeçalho da página (não rola) */}
          <div className="container mx-auto px-4 sm:px-6 flex flex-col flex-shrink-0">
             <motion.div
                className="flex flex-col items-center sm:flex-row sm:items-center justify-center sm:justify-between gap-4 mb-6 text-center sm:text-left"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
             >
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Lançamentos</h1>
                  <p className="text-sm text-light-subtle dark:text-dark-subtle">Suas movimentações financeiras.</p>
                </div>
                {/* Botão de adicionar - Chama a função para abrir o modal PRINCIPAL */}
                <motion.button
                  onClick={handleOpenAddTransactionModal}
                  className="flex items-center gap-2 px-4 py-2 bg-finance-pink text-white font-semibold rounded-lg shadow-lg self-center sm:self-auto"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <PlusIcon className="h-5 w-5"/> Adicionar
                </motion.button>
              </motion.div>
          </div>

          {/* Container principal com o painel de lançamentos (rolável no desktop) */}
          <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:h-full">
            <motion.div
                className="bg-light-surface dark:bg-dark-surface p-3 sm:p-6 rounded-2xl border border-black/5 dark:border-white/10 flex flex-col lg:flex-1"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* --- SEÇÃO SUPERIOR (GRÁFICO E FILTROS) - ESTÁTICA --- */}
                <div className="flex-shrink-0">
                    {/* Gráfico */}
                    <div className="h-48 sm:h-64">
                         {transactionsLoading && transactions.length === 0 && !transactionsError ? (
                              <div className="flex items-center justify-center h-full text-light-subtle dark:text-dark-subtle">Carregando gráfico...</div>
                         ) : transactionsError && transactions.length === 0 ? (
                             <div className="flex items-center justify-center h-full text-red-500">Erro ao carregar gráfico.</div>
                         ) : (
                            <TimelineChart transactions={transactions} />
                         )}
                    </div>

                    {/* Container dos Filtros (mantido) */}
                     <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 mb-4 p-2 border-y border-black/5 dark:border-white/5">
                        {/* Grupos de Filtro (Tipo, Status, Recorrência) - Mantidos */}
                         <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2 w-full md:w-auto">
                           <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle mb-1 sm:mb-0 whitespace-nowrap">Tipo:</span>
                            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
                             <FilterPill label="Todos" value="all" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                             <FilterPill label="Receitas" value="receita" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                             <FilterPill label="Despesas" value="despesa" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                           </div>
                         </div>
                         <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2 w-full md:w-auto">
                           <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle mb-1 sm:mb-0 whitespace-nowrap">Status:</span>
                            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
                             <FilterPill label="Todos" value="all" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                             <FilterPill label="Realizados" value="realized" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                             <FilterPill label="Futuros" value="forecast" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                           </div>
                         </div>
                         <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2 w-full md:w-auto">
                           <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle mb-1 sm:mb-0 whitespace-nowrap">Recorrência:</span>
                            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
                             <FilterPill label="Todos" value="all" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                             <FilterPill label="Sim" value="yes" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                             <FilterPill label="Não" value="no" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                           </div>
                         </div>
                     </div>
                </div>

                {/* --- LISTA DE LANÇAMENTOS - ROLÁVEL --- */}
                <div className="flex-1 overflow-y-auto -mr-2 pr-2 flex flex-col items-center">
                    <motion.div variants={containerVariants} className="w-full max-w-md sm:max-w-none">
                         {transactionsLoading && transactions.length === 0 ? (
                              <p className="text-center text-light-subtle dark:text-dark-subtle py-10">Carregando lançamentos...</p>
                         ) : transactionsError && transactions.length === 0 ? (
                              <p className="text-center text-red-500 py-10">Erro ao carregar lançamentos: {transactionsError}</p>
                         ) : transactions.length > 0 ? (
                            <motion.div variants={{ visible: { transition: { staggerChildren: 0.03 } } }}>
                                {transactions.map(tx => <LogEntry key={tx.id} transaction={tx} />)}
                            </motion.div>
                        ) : (
                             <p className="text-center text-light-subtle dark:text-dark-subtle py-10">
                                 Nenhum lançamento encontrado com os filtros selecionados.
                            </p>
                        )}
                    </motion.div>
                </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modal de Adicionar/Editar Transação */}
      {/* Passa as opções de contas, categorias, seus loadings/erros */}
      {/* Passa funções para abrir modais de criação */}
      {/* Passa a função de salvar a transação */}
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onSave={handleSaveTransaction} // Salva a transação principal
        accountOptions={accountOptions}
        categoryOptions={categoryOptions}
        accountsLoading={accountsLoading}
        accountsError={accountsError}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        onOpenAddCardModal={handleOpenAddCardFromTransaction} // Handler para abrir modal de cartão
        onOpenAddCategoryModal={handleOpenAddCategoryFromTransaction} // <-- Handler para abrir modal de categoria
        // TODO: Passar transaction se for modo edição
        // TODO: Passar defaultAccount/Category ID se um novo item foi criado e voltamos para este modal
      />

       {/* Modal de Adicionar Cartão de Crédito */}
       {/* Passa a função de salvar que orquestra o re-fetch e re-abertura do modal principal */}
       <AddCreditCardModal
         isOpen={isAddCreditCardModalOpen}
         onClose={() => setIsAddCreditCardModalOpen(false)}
         onSave={handleSaveNewCreditCard} // Salva o novo cartão e orquestra volta
       />

       {/* Modal de Adicionar Categoria */}
       {/* Passa a função de salvar que orquestra o re-fetch e re-abertura do modal principal */}
       <AddCategoryModal
          isOpen={isAddCategoryModalOpen} // <-- Estado para controlar este modal
          onClose={() => setIsAddCategoryModalOpen(false)}
          onSave={handleSaveNewCategory} // <-- Handler para salvar categoria
       />
    </>
  );
}

// Marca a página como protegida, redirecionando para login se não autenticado
FinanceTransactionsPage.auth = true;