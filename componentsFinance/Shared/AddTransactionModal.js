// componentsFinance/Shared/AddTransactionModal.js
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const AddTransactionModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState('receita');
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Novo Lançamento</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><XMarkIcon className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-full">
                <button onClick={() => setType('receita')} className={`px-4 py-2 rounded-full text-sm font-semibold ${type === 'receita' ? 'bg-finance-lime text-black' : ''}`}>Receita</button>
                <button onClick={() => setType('despesa')} className={`px-4 py-2 rounded-full text-sm font-semibold ${type === 'despesa' ? 'bg-finance-pink text-white' : ''}`}>Despesa</button>
              </div>
              <input type="text" placeholder="Descrição (ex: Pagamento Projeto X)" className="w-full p-2 bg-white/5 rounded-md"/>
              <input type="number" placeholder="Valor (ex: 1500.00)" className="w-full p-2 bg-white/5 rounded-md"/>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-blue-500"/> Lançamento Futuro</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-blue-500"/> É Recorrente</label>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-white/10"><button className="px-6 py-2 font-semibold bg-blue-600 text-white rounded-lg">Salvar</button></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default AddTransactionModal;