// componentsFreelancer/Shared/AddFolderModal.js (NOVO)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, FolderIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const AddFolderModal = ({ isOpen, onClose, onSave }) => {
    const [folderName, setFolderName] = useState('');

    const handleSave = () => {
        if (folderName.trim()) {
            console.log("Salvando nova pasta:", folderName.trim());
             const newFolder = {
                 id: `folder-${Date.now()}`, // ID simulado
                 name: folderName.trim(),
             };
            onSave(newFolder); // Chama a função onSave no componente pai
            setFolderName(''); // Limpa o input
            onClose(); // Fecha o modal
        } else {
            alert("O nome da pasta não pode ser vazio.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 35 } }}
                        exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                         className="w-full max-w-sm bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col"
                         onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header do Modal */}
                        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
                            <h2 className="text-xl font-bold">Nova Pasta</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
                            </button>
                        </div>

                        {/* Corpo do Formulário */}
                         <div className="p-6 space-y-4">
                            {/* Campo Nome da Pasta */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome da Pasta</label>
                                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Ex: Cliente XYZ" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                         </div>

                         {/* Ações do Modal (Footer) */}
                        <div className="flex items-center justify-end p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-light-text dark:text-dark-text transition-colors">Cancelar</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg transition-colors">Criar Pasta</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default AddFolderModal;