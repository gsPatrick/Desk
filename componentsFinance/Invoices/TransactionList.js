// componentsFinance/Invoices/TransactionList.js
import { motion } from 'framer-motion';
import { TagIcon, ShoppingCartIcon, FireIcon } from '@heroicons/react/24/solid'; // Ícones de exemplo

const categoryIcons = {
  'Software': <TagIcon className="h-5 w-5 text-blue-400" />,
  'Alimentação': <FireIcon className="h-5 w-5 text-orange-400" />,
  'Transporte': <ShoppingCartIcon className="h-5 w-5 text-purple-400" />,
  'Compras': <ShoppingCartIcon className="h-5 w-5 text-green-400" />,
  'default': <TagIcon className="h-5 w-5 text-gray-400" />
};

const TransactionItem = ({ transaction }) => (
  <motion.div
    className="flex items-center justify-between py-4 border-b border-black/5 dark:border-white/5"
    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
  >
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-surface-light dark:bg-surface-dark border border-black/5 dark:border-white/10">
        {categoryIcons[transaction.category] || categoryIcons.default}
      </div>
      <div>
        <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">{transaction.description}</p>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{transaction.date}</p>
      </div>
    </div>
    <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
    </p>
  </motion.div>
);

const TransactionList = ({ transactions = [] }) => {
  return (
    <div className="flex-1 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-white/10 overflow-y-auto">
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Lançamentos na Fatura</h3>
      <motion.div variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
        {transactions.map(tx => <TransactionItem key={tx.id} transaction={tx} />)}
      </motion.div>
    </div>
  );
};

export default TransactionList;