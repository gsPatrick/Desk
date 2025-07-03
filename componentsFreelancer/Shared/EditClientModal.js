// componentsFreelancer/Shared/EditClientModal.js (NOVO)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const EditClientModal = ({ isOpen, onClose, clientToEdit, onSave, onDelete }) => {
     // Estado local para os dados do cliente no formulário
    const [formData, setFormData] = useState({
        name: '',
        contactName: '',
        email: '',
        phone: '',
    });

     // Efeito para carregar os dados do cliente quando clientToEdit muda
    useEffect(() => {
        if (clientToEdit) {
            setFormData({
                name: clientToEdit.name || '',
                contactName: clientToEdit.contactName || '',
                email: clientToEdit.email || '',
                phone: clientToEdit.phone || '',
            });
        } else {
             // Limpa o formulário se nenhum cliente for passado (modo adição - embora este modal seja primariamente para edição)
             setFormData({ name: '', contactName: '', email: '', phone: '' });
        }
    }, [clientToEdit]); // Roda sempre que clientToEdit mudar


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validação básica
        if (!formData.name) {
             alert("O nome do cliente é obrigatório.");
             return;
        }

        const clientDataToSave = {
             // Inclui o ID do cliente original
            id: clientToEdit?.id,
            ...formData,
        };

        console.log("Dados do cliente a salvar:", clientDataToSave);

        if (onSave) {
            onSave(clientDataToSave); // Chama a função onSave no componente pai
        }

        onClose(); // Fecha o modal após salvar
    };

     // Handler para exclusão (simulado)
     const handleDelete = () => {
        if (clientToEdit?.id && onDelete) {
             console.log("Excluindo cliente:", clientToEdit.id);
             onDelete(clientToEdit.id); // Chama a função onDelete no componente pai
             onClose(); // Fecha o modal após excluir
        }
     };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" // Z-index maior que outros modais
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 35 } }}
                        exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                         className="w-full max-w-md bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh]"
                         onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header do Modal */}
                        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
                            <h2 className="text-xl font-bold">{clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}</h2> {/* Título ajustado */}
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
                            </button>
                        </div>

                        {/* Corpo do Formulário (Scroll interno) */}
                         <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                            {/* Campo Nome */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome / Empresa</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nome Completo ou Empresa" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                            {/* Campo Contato */}
                             <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome de Contato (Opcional)</label>
                                <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} placeholder="Pessoa de contato" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                            {/* Campo Email */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Email (Opcional)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@cliente.com" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                             {/* Campo Telefone */}
                             <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Telefone (Opcional)</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(XX) 9XXXX-XXXX" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                         </div>

                         {/* Ações do Modal (Footer) */}
                        <div className="flex items-center justify-between p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
                             {/* Botão de Excluir (visível no modo edição) */}
                            {clientToEdit && (
                                 <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">Excluir</button>
                             )}
                            <div className="flex-grow flex justify-end space-x-4">
                                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-light-text dark:text-dark-text transition-colors">Cancelar</button>
                                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg transition-colors">Salvar</button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditClientModal;