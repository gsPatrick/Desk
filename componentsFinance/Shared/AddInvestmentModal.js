// componentsFinance/Investments/AddInvestmentModal.js
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const AddInvestmentModal = ({ isOpen, onClose }) => {
  // Em um app real, aqui teriam states para cada campo do formulário
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Adicionar Ativo</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><XMarkIcon className="h-6 w-6"/></button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4">
              {/* Formulário (exemplo) */}
              <div className="col-span-2">
                <label className="text-sm text-white/60">Nome do Ativo (ex: "Apartamento Centro")</label>
                <input type="text" className="w-full mt-1 p-2 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              <div>
                <label className="text-sm text-white/60">Ticker (ex: "PETR4")</label>
                <input type="text" className="w-full mt-1 p-2 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
               <div>
                <label className="text-sm text-white/60">Tipo de Ativo</label>
                <select className="w-full mt-1 p-2 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
                    <option>Ações</option>
                    <option>Cripto</option>
                    <option>Renda Fixa</option>
                    <option>Custom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-white/10 space-x-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white/10">Cancelar</button>
              <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">Salvar Ativo</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default AddInvestmentModal;