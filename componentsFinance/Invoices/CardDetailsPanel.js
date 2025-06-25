// componentsFinance/Invoices/CardDetailsPanel.js
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

const CardDetailsPanel = ({ card, invoice }) => {
  if (!card || !invoice) return <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-2xl animate-pulse h-full"></div>;
  
  const limitUsedPercentage = (invoice.total / card.limit) * 100;
  const bestPurchaseDay = card.closingDay + 1;

  return (
    <div className="p-8 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-white/10 flex flex-col">
      <div className="mb-8">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Fatura de {invoice.month}</p>
        <p className="text-5xl font-extrabold text-finance-pink tracking-tighter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total)}</p>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Vencimento em {card.dueDay} do próximo mês</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Limite Utilizado</span>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total)} de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limit)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-finance-pink h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${limitUsedPercentage}%`}}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg mb-8">
          <div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Fechamento</p>
              <p className="font-bold text-text-primary-light dark:text-text-primary-dark">Dia {card.closingDay}</p>
          </div>
          <div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Melhor dia de compra</p>
              <p className="font-bold text-text-primary-light dark:text-text-primary-dark">Dia {bestPurchaseDay}</p>
          </div>
      </div>

      <div className="mt-auto">
        <motion.button
          className="w-full py-4 text-lg font-bold bg-finance-lime text-white rounded-xl shadow-lg shadow-lime-500/20"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Pagar ou Parcelar Fatura
        </motion.button>
      </div>
    </div>
  );
};

export default CardDetailsPanel;