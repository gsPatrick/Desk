// pages/finance/transactions.js
import { useState, useMemo, useEffect } from 'react'; // Importei useEffect para verificar o tamanho da tela
import Head from 'next/head';
import { motion } from 'framer-motion';
import FinanceHeader from '@/componentsFinance/Header/FinanceHeader';
import LogEntry from '@/componentsFinance/Transactions/LogEntry';
import TimelineChart from '@/componentsFinance/Transactions/SummaryChart';
import AddTransactionModal from '@/componentsFinance/Transactions/AddTransactionModal';
import { transactionsLog } from '@/data/financeData';
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
          ? 'font-semibold bg-[#131312] text-[#f8f6eb] dark:bg-[#f8f6eb] dark:text-[#131312] shadow-md focus:ring-blue-500'
          : `text-light-subtle dark:text-dark-subtle 
             hover:bg-[#131312] hover:text-[#f8f6eb]
             dark:hover:bg-[#f8f6eb] dark:hover:text-[#131312]
             focus:ring-blue-400`
        }
      `}
    >{label}</button>
  );
};

export default function FinanceTransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ type: 'all', status: 'all', recurring: 'all' });
  const [isMobile, setIsMobile] = useState(false); // Estado para verificar se é mobile

  // Hook para detectar se a tela é mobile (usando breakpoint padrão do Tailwind xs: 640px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 640px é o breakpoint do Tailwind para 'sm'
    };
    handleResize(); // Executa uma vez ao montar o componente
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // Limpa o listener ao desmontar
  }, []);

  const filteredTransactions = useMemo(() => transactionsLog.sort((a,b) => new Date(b.date) - new Date(a.date)).filter(tx => {
    const typeMatch = filters.type === 'all' || tx.type === filters.type;
    const statusMatch = filters.status === 'all' || (filters.status === 'realized' && !tx.forecast) || (filters.status === 'forecast' && tx.forecast);
    const recurringMatch = filters.recurring === 'all' || (filters.recurring === 'yes' && tx.recurring) || (filters.recurring === 'no' && !tx.recurring);
    return typeMatch && statusMatch && recurringMatch;
  }), [filters]);
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } } };

  // Define a classe de overflow com base no estado isMobile
  const listWrapperClasses = isMobile
    ? 'flex-1 overflow-y-visible' // No mobile, o scroll é na página, então removemos o overflow-y-auto aqui
    : 'flex-1 overflow-y-auto'; // No desktop, a lista tem seu próprio scroll

  return (
    <>
      {/* O body não deve ter overflow-y: hidden no mobile se quisermos que a página role */}
      <div className={`${isMobile ? '' : 'h-screen overflow-hidden'} bg-light-bg dark:bg-dark-bg flex flex-col`}>
        <Head><title>Lançamentos | Finance OS</title></Head>
        
        <FinanceHeader />

        <main className="flex-1 flex flex-col pt-32 pb-10"> {/* pt-32 garante espaço para o header fixo */}
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

          {/* Container principal para o gráfico, filtros e lista */}
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

                {/* --- LISTA DE LANÇAMENTOS - ROLÁVEL CONFORME O DISPOSITIVO --- */}
                {/* A classe overflow-y-auto será aplicada aqui no desktop, e removida (tornando visível o scroll da página) no mobile */}
                <div className={`${listWrapperClasses} no-scrollbar-visible`}> {/* Adicionei no-scrollbar-visible para exibir a barra de scroll */}
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