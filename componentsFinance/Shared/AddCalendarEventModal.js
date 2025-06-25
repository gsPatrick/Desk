// componentsFinance/Shared/AddCalendarEventModal.js
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const AddCalendarEventModal = ({ isOpen, onClose }) => {
    return (
    <AnimatePresence>
      {isOpen && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Novo Evento no Calendário</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><XMarkIcon className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Título do Evento (ex: Reunião Cliente X)" className="w-full p-2 bg-white/5 rounded-md"/>
              <input type="date" className="w-full p-2 bg-white/5 rounded-md text-white/70"/>
              <textarea placeholder="Detalhes..." className="w-full h-24 p-2 bg-white/5 rounded-md resize-none"></textarea>
            </div>
             <div className="flex justify-end p-6 border-t border-white/10"><button className="px-6 py-2 font-semibold bg-blue-600 text-white rounded-lg">Agendar</button></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default AddCalendarEventModal;