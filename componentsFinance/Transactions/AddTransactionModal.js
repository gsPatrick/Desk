// componentsFinance/Transactions/AddTransactionModal.js
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const AddTransactionModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10">
              <h2 className="text-xl font-bold">Adicionar Lançamento</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <XMarkIcon className="h-6 w-6"/>
              </button>
            </div>
            
            {/* Corpo do Formulário (Placeholder) */}
            <div className="p-6">
              <p className="text-center text-light-subtle dark:text-dark-subtle">
                O formulário para adicionar receitas e despesas será implementado aqui.
              </p>
            </div>

            {/* Ações do Modal */}
            <div className="flex items-center justify-end p-6 border-t border-black/5 dark:border-white/10 space-x-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10">Cancelar</button>
              <button className="px-4 py-2 text-sm font-semibold bg-finance-pink text-white rounded-lg">Salvar Lançamento</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default AddTransactionModal;