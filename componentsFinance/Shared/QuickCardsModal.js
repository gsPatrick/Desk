// componentsFinance/Shared/QuickCardsModal.js
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SiVisa, SiMastercard } from 'react-icons/si';

const CardRow = ({ name, final, total, color }) => (
    <div className={`p-4 rounded-lg flex items-center justify-between bg-gradient-to-r ${color}`}>
        <div className="flex items-center gap-4">
            {final.startsWith('4') ? <SiVisa size={28}/> : <SiMastercard size={28}/>}
            <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm opacity-80">Final {final}</p>
            </div>
        </div>
        <p className="text-lg font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p>
    </div>
);

const QuickCardsModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Visão Rápida dos Cartões</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><XMarkIcon className="h-5 w-5"/></button>
            </div>
            <div className="p-4 space-y-3">
              <CardRow name="Cartão Principal" final="4242" total={1874.50} color="from-blue-900 to-gray-900" />
              <CardRow name="Cartão da Empresa" final="8018" total={950.00} color="from-gray-700 to-gray-800" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default QuickCardsModal;