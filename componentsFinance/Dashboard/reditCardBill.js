// componentsFinance/Dashboard/BillsToPay.js
import { motion } from 'framer-motion';

const BillsToPay = () => {
  const totalDue = 875;
  const totalBills = 1250;
  const percentage = (totalDue / totalBills) * 100;

  return (
    <motion.div
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-white/10"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <h3 className="text-md font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Contas a Pagar (Mês)</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">R$ {totalDue.toFixed(2)}</p>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">de R$ {totalBills.toFixed(2)}</p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
        <motion.div 
          className="bg-finance-lime h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%`}}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
        />
      </div>
    </motion.div>
  );
};

export default BillsToPay;