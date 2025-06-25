// componentsFinance/Shared/QuickNoteModal.js
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const QuickNoteModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Nota Rápida</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><XMarkIcon className="h-5 w-5"/></button>
            </div>
            <div className="p-4">
              <textarea
                placeholder="Ex: Ligar para o contador sobre o imposto..."
                className="w-full h-32 p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              ></textarea>
            </div>
             <div className="flex items-center justify-end p-4 border-t border-white/10">
              <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">Salvar Nota</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default QuickNoteModal;