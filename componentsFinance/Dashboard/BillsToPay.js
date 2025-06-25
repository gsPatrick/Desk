// componentsFinance/Dashboard/BillsToPayWidget.js
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const BillsToPayWidget = () => {
  return (
    <motion.div
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-black/5 dark:border-white/10"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">Contas a Pagar (Mês)</h3>
        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
      </div>
      <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">R$ 980,00</p>
      <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
        <span className="font-semibold text-finance-pink">2 contas</span> vencem nos próximos 7 dias.
      </p>
    </motion.div>
  );
};

export default BillsToPayWidget;