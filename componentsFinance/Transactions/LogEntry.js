// componentsFinance/Transactions/LogEntry.js
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';

const StatusBadge = ({ status }) => {
    const statusClasses = {
      Efetivado: 'bg-green-500/10 text-green-400',
      Pendente: 'bg-yellow-500/10 text-yellow-400',
      Agendado: 'bg-blue-500/10 text-blue-400',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-500/10 text-gray-400'}`}>{status}</span>;
};

const LogEntry = ({ transaction }) => {
  const isIncome = transaction.type === 'receita';
  
  return (
    <motion.div 
      className={`grid grid-cols-12 items-center p-4 rounded-xl transition-colors ${
          transaction.forecast ? 'opacity-60 hover:opacity-100' : 'hover:bg-black/5 dark:hover:bg-white/5'
      }`}
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="col-span-1 flex items-center gap-4">
        {transaction.forecast 
          ? <ClockIcon className="h-6 w-6 text-blue-400" />
          : (isIncome 
              ? <div className="w-6 h-6 rounded-full bg-finance-lime/10 flex items-center justify-center"><ArrowUpIcon className="h-4 w-4 text-finance-lime"/></div>
              : <div className="w-6 h-6 rounded-full bg-finance-pink/10 flex items-center justify-center"><ArrowDownIcon className="h-4 w-4 text-finance-pink"/></div>
            )
        }
      </div>
      <div className="col-span-5">
        <p className="font-semibold text-light-text dark:text-dark-text">{transaction.description}</p>
        <p className="text-sm text-light-subtle dark:text-dark-subtle">{transaction.category}</p>
      </div>
      <div className="col-span-2 text-sm text-light-subtle dark:text-dark-subtle">{new Date(transaction.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}</div>
      <div className="col-span-2"><StatusBadge status={transaction.status} /></div>
      <div className={`col-span-2 font-bold text-right ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
      </div>
    </motion.div>
  );
};
export default LogEntry;