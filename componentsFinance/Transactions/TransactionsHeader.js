// componentsFinance/Transactions/TransactionsHeader.js
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/solid';

const FilterButton = ({ label, value, activeFilter, onFilterChange }) => (
  <button
    onClick={() => onFilterChange(value)}
    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
      activeFilter === value ? 'bg-white dark:bg-finance-black shadow-sm' : 'text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text'
    }`}
  >{label}</button>
);

const TransactionsHeader = ({ onAddTransaction, filters, setFilters }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Lançamentos</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center p-1 bg-light-surface dark:bg-dark-surface rounded-full border border-black/5 dark:border-white/10">
          <FilterButton label="Todos" value="all" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
          <FilterButton label="Receitas" value="receita" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
          <FilterButton label="Despesas" value="despesa" activeFilter={filters.type} onFilterChange={(v) => setFilters(f => ({...f, type: v}))}/>
        </div>
        <div className="flex items-center p-1 bg-light-surface dark:bg-dark-surface rounded-full border border-black/5 dark:border-white/10">
          <FilterButton label="Todos" value="all" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
          <FilterButton label="Realizados" value="realized" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
          <FilterButton label="Futuros" value="forecast" activeFilter={filters.status} onFilterChange={(v) => setFilters(f => ({...f, status: v}))}/>
        </div>
        <motion.button onClick={onAddTransaction} className="flex items-center gap-2 px-4 py-2 bg-finance-pink text-white font-semibold rounded-full shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <PlusIcon className="h-5 w-5"/>
        </motion.button>
      </div>
    </div>
  );
};
export default TransactionsHeader;