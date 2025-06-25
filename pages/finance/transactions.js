// pages/finance/transactions.js (PAINEL FIXO E LISTA ROLÁVEL - RESPONSIVO)
import { useState, useMemo } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import LogEntry from '../../componentsFinance/Transactions/LogEntry'; // Verifique se LogEntry está responsivo
import TimelineChart from '../../componentsFinance/Transactions/SummaryChart'; // Verifique se TimelineChart está responsivo
import AddTransactionModal from '../../componentsFinance/Transactions/AddTransactionModal';
import { transactionsLog } from '../../data/financeData';
import { PlusIcon } from '@heroicons/react/24/solid';
import pillStyles from '../../styles/TransactionsPageStyles.module.css'; // Importe o módulo CSS

const FilterPill = ({ label, value, activeFilter, onFilterChange }) => {
  const isActive = activeFilter === value;
  const tailwindLayoutClasses = "px-3 py-1.5 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:focus:ring-offset-dark-surface"; // Ajustado py e text-xs
  const tailwindActiveFocus = "focus:ring-blue-500";
  const tailwindInactiveFocus = "focus:ring-blue-400";
  const tailwindActiveShadow = "shadow-md";

  return (
    <button
      onClick={() => onFilterChange(value)}
      className={`
        ${pillStyles.filterPillBase} /* Se estiver usando CSS Modules */
        ${tailwindLayoutClasses}
        ${isActive
          ? `${pillStyles.active} ${tailwindActiveFocus} ${tailwindActiveShadow}` // Se CSS Modules
          // OU, se voltou para Tailwind puro para FilterPill:
          // ? 'font-semibold bg-[#131312] text-[#f8f6eb] dark:bg-[#f8f6eb] dark:text-[#131312] shadow-md focus:ring-blue-500'
          : `${pillStyles.inactive} ${tailwindInactiveFocus}` // Se CSS Modules
          // OU, se voltou para Tailwind puro para FilterPill:
          // : `text-light-subtle dark:text-dark-subtle hover:bg-[#131312] hover:text-[#f8f6eb] dark:hover:bg-[#f8f6eb] dark:hover:text-[#131312] focus:ring-blue-400`
        }
      `}
    >
      {label}
    </button>
  );
};

export default function FinanceTransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ type: 'all', status: 'all', recurring: 'all' });

  const filteredTransactions = useMemo(() => transactionsLog.sort((a,b) => new Date(b.date) - new Date(a.date)).filter(tx => {
    const typeMatch = filters.type === 'all' || tx.type === filters.type;
    const statusMatch = filters.status === 'all' || (filters.status === 'realized' && !tx.forecast) || (filters.status === 'forecast' && tx.forecast);
    const recurringMatch = filters.recurring === 'all' || (filters.recurring === 'yes' && tx.recurring) || (filters.recurring === 'no' && !tx.recurring);
    return typeMatch && statusMatch && recurringMatch;
  }), [filters]);
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } } };

  return (
    <>
      <div className="bg-light-bg dark:bg-dark-bg h-screen flex flex-col overflow-hidden">
        <Head><title>Lançamentos | Finance OS</title></Head>
        
        <FinanceHeader />

        <main className="flex-1 flex flex-col pt-24 sm:pt-32 pb-10 overflow-hidden"> {/* Padding top menor no mobile */}
          <div className="container mx-auto px-4 sm:px-6 flex flex-col flex-shrink-0"> {/* Padding x menor no mobile */}
            <motion.div 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6" 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-full sm:w-auto"> {/* Ocupa toda largura no mobile para alinhar botão à direita */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Lançamentos</h1>
                <p className="text-sm text-light-subtle dark:text-dark-subtle">Suas movimentações financeiras.</p> {/* Texto mais curto */}
              </div>
              <motion.button 
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-finance-pink text-white font-semibold rounded-lg shadow-lg self-end sm:self-auto" /* Botão alinhado à direita no mobile */
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="h-5 w-5"/> Adicionar
              </motion.button>
            </motion.div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 flex-1 flex flex-col min-h-0">
            <motion.div 
                className="bg-light-surface dark:bg-dark-surface p-3 sm:p-6 rounded-2xl border border-black/5 dark:border-white/10 flex flex-col h-full"
                initial="hidden" 
                animate="visible"
                variants={containerVariants}
            >
                {/* --- SEÇÃO SUPERIOR (GRÁFICO E FILTROS) - ESTÁTICA --- */}
                <div className="flex-shrink-0">
                    {/* O componente TimelineChart precisa ser responsivo internamente */}
                    <div className="h-48 sm:h-64"> {/* Altura ajustável para o gráfico */}
                        <TimelineChart transactions={filteredTransactions} />
                    </div>
                    
                    {/* Container dos Filtros */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 mb-4 p-2 border-y border-black/5 dark:border-white/5">
                        {/* Grupo de Filtro: Tipo */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full md:w-auto">
                          <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle mb-1 sm:mb-0 whitespace-nowrap">Tipo:</span>
                          <div className="flex gap-1 sm:gap-2 flex-wrap"> {/* flex-wrap para pills em telas muito pequenas */}
                            <FilterPill label="Todos" value="all" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                            <FilterPill label="Receitas" value="receita" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                            <FilterPill label="Despesas" value="despesa" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                          </div>
                        </div>
                        {/* Grupo de Filtro: Status */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full md:w-auto">
                          <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle mb-1 sm:mb-0 whitespace-nowrap">Status:</span>
                           <div className="flex gap-1 sm:gap-2 flex-wrap">
                            <FilterPill label="Todos" value="all" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                            <FilterPill label="Realizados" value="realized" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                            <FilterPill label="Futuros" value="forecast" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                          </div>
                        </div>
                        {/* Grupo de Filtro: Recorrência */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full md:w-auto">
                          <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle mb-1 sm:mb-0 whitespace-nowrap">Recorrência:</span>
                           <div className="flex gap-1 sm:gap-2 flex-wrap">
                            <FilterPill label="Todos" value="all" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                            <FilterPill label="Sim" value="yes" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                            <FilterPill label="Não" value="no" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                          </div>
                        </div>
                    </div>
                </div>

                {/* --- LISTA DE LANÇAMENTOS - ROLÁVEL --- */}
                {/* O componente LogEntry precisa ser responsivo internamente */}
                <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                    <motion.div variants={containerVariants}>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(tx => <LogEntry key={tx.id} transaction={tx} />)
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
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}