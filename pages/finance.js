// pages/finance/transactions.js (PAINEL FIXO E LISTA ROLÁVEL)
import { useState, useMemo } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import LogEntry from '../../componentsFinance/Transactions/LogEntry';
import TimelineChart from '../../componentsFinance/Transactions/SummaryChart';
import AddTransactionModal from '../../componentsFinance/Transactions/AddTransactionModal';
import { transactionsLog } from '../../data/financeData';
import { PlusIcon } from '@heroicons/react/24/solid';

const FilterPill = ({ label, value, activeFilter, onFilterChange }) => {
  const isActive = activeFilter === value;
  return (
    <button
      onClick={() => onFilterChange(value)}
      className={`
        px-3 py-1 text-sm rounded-md transition-all duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:focus:ring-offset-dark-surface focus:ring-offset-2
        ${isActive
          // Estilos para o botão ATIVO (INVERTIDO com cores HEX)
          ? 'font-semibold bg-[#131312] text-[#f8f6eb] dark:bg-[#f8f6eb] dark:text-[#131312] shadow-md focus:ring-blue-500'
          // Estilos para o botão INATIVO - AGORA COM HOVER INVERTIDO
          : `text-light-subtle dark:text-dark-subtle 
             hover:bg-[#131312] hover:text-[#f8f6eb]  /* Hover tema claro: Fundo preto, Texto creme */
             dark:hover:bg-[#f8f6eb] dark:hover:text-[#131312] /* Hover tema escuro: Fundo creme, Texto preto */
             focus:ring-blue-400`
        }
      `}
    >{label}</button>
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

        <main className="flex-1 flex flex-col pt-32 pb-10 overflow-hidden">
          <div className="container mx-auto px-6 flex flex-col flex-shrink-0">
            <motion.div 
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6" 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h1 className="text-3xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Lançamentos</h1>
                <p className="text-light-subtle dark:text-dark-subtle">Visualize e gerencie todas as suas movimentações.</p>
              </div>
              <motion.button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-finance-pink text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PlusIcon className="h-5 w-5"/> Adicionar
              </motion.button>
            </motion.div>
          </div>

          <div className="container mx-auto px-6 flex-1 flex flex-col min-h-0">
            <motion.div 
                className="bg-light-surface dark:bg-dark-surface p-4 sm:p-6 rounded-2xl border border-black/5 dark:border-white/10 flex flex-col h-full"
                initial="hidden" 
                animate="visible"
                variants={containerVariants}
            >
                {/* --- SEÇÃO SUPERIOR (GRÁFICO E FILTROS) - ESTÁTICA --- */}
                <div className="flex-shrink-0">
                    <TimelineChart transactions={filteredTransactions} />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-4 p-2 border-y border-black/5 dark:border-white/5">
                        {/* Filtros de Tipo */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle">Tipo:</span>
                          <FilterPill label="Todos" value="all" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                          <FilterPill label="Receitas" value="receita" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                          <FilterPill label="Despesas" value="despesa" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
                        </div>
                        {/* Filtros de Status */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle">Status:</span>
                          <FilterPill label="Todos" value="all" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                          <FilterPill label="Realizados" value="realized" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                          <FilterPill label="Futuros" value="forecast" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
                        </div>
                        {/* Filtros de Recorrência */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase text-light-subtle dark:text-dark-subtle">Recorrência:</span>
                          <FilterPill label="Todos" value="all" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                          <FilterPill label="Sim" value="yes" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                          <FilterPill label="Não" value="no" activeFilter={filters.recurring} onFilterChange={(v) => setFilters(f => ({...f, recurring: v}))}/>
                        </div>
                    </div>
                </div>

                {/* --- LISTA DE LANÇAMENTOS - ROLÁVEL --- */}
                <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                    <motion.div variants={containerVariants}>
                        {filteredTransactions.map(tx => <LogEntry key={tx.id} transaction={tx} />)}
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