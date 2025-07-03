// componentsFinance/Dashboard/BillsToPayWidget.js (MODIFICADO)
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

// Aceita totalDue e billsDueIn7Days via props
const BillsToPayWidget = ({ totalDue, billsDueIn7Days }) => {
  return (
    <motion.div
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col justify-center" // Added h-full flex flex-col justify-center
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">Contas a Pagar (Mês)</h3>
        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
      </div>
      {/* Exibe o total a pagar formatado */}
      <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDue || 0)}
      </p>
       {/* Exibe a contagem de contas a vencer em 7 dias */}
      {billsDueIn7Days > 0 ? (
        <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          <span className="font-semibold text-finance-pink">{billsDueIn7Days} conta{billsDueIn7Days > 1 ? 's' : ''}</span> vencem nos próximos 7 dias.
        </p>
      ) : (
        <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
           Nenhuma conta a vencer nos próximos 7 dias.
        </p>
      )}
    </motion.div>
  );
};

export default BillsToPayWidget;