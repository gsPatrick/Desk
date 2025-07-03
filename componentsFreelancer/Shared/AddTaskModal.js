// componentsFreelancer/Shared/AddTaskModal.js (NOVO)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const AddTaskModal = ({ isOpen, onClose, projectId, taskToEdit, onSave, onDelete }) => { // Recebe projectId e taskToEdit
     // Estado local para os dados da tarefa
     const [formData, setFormData] = useState({
         description: '',
         dueDate: '',
         status: 'pending', // pending ou completed
         projectId: projectId, // Associa a tarefa ao projeto
     });

     // Efeito para carregar dados se estiver editando uma tarefa
     useEffect(() => {
         if (taskToEdit) {
             setFormData({
                 description: taskToEdit.description || '',
                 dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
                 status: taskToEdit.status || 'pending',
                 projectId: taskToEdit.projectId, // Mantém o project ID
             });
         } else {
              // Limpa o formulário se não houver tarefa para editar (modo adição)
             setFormData({
                 description: '',
                 dueDate: '',
                 status: 'pending',
                 projectId: projectId, // Garante que novas tarefas sejam associadas ao projeto atual
             });
         }
     }, [taskToEdit, projectId]); // Roda quando taskToEdit ou projectId muda

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validação básica
        if (!formData.description) {
            alert("A descrição da tarefa é obrigatória.");
            return;
        }
         if (!formData.projectId) {
             console.error("Erro: ProjectId não encontrado para a tarefa.");
             alert("Erro interno: Projeto da tarefa não identificado."); // Mensagem mais amigável
             return;
         }

        const taskDataToSave = {
             // Inclui o ID se estiver editando, gera um novo se for adição
            id: taskToEdit ? taskToEdit.id : `task-${Date.now()}`, // ID simulado
            ...formData,
             // Garante que o status padrão seja 'pending' se não for 'completed'
            status: formData.status === 'completed' ? 'completed' : 'pending',
        };

        console.log("Dados da tarefa a salvar:", taskDataToSave);

        if (onSave) {
            onSave(taskDataToSave); // Chama a função onSave no componente pai
        }

        onClose(); // Fecha o modal após salvar
    };

     // Handler para exclusão (simulado)
     const handleDelete = () => {
        if (taskToEdit?.id && onDelete) {
             console.log("Excluindo tarefa:", taskToEdit.id);
             onDelete(taskToEdit.id); // Chama a função onDelete no componente pai
             onClose(); // Fecha o modal após excluir
        }
     };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" // Z-index maior
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
                            <h2 className="text-xl font-bold">{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
                            </button>
                        </div>

                        {/* Corpo do Formulário (Scroll interno) */}
                         <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                            {/* Campo Descrição */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Descrição da Tarefa</label>
                                <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Ex: Implementar feature X" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                             {/* Campo Data de Vencimento */}
                             <div>
                                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Data de Vencimento (Opcional)</label>
                                 <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"/>
                             </div>
                             {/* Campo Status (Dropdown) */}
                             {taskToEdit && ( // Mostra status apenas no modo edição
                                 <div>
                                      <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Status</label>
                                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
                                          <option value="pending">Pendente</option>
                                          <option value="completed">Concluída</option>
                                      </select>
                                  </div>
                             )}
                         </div>

                         {/* Ações do Modal (Footer) */}
                        <div className="flex items-center justify-between p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
                             {/* Botão de Excluir (visível no modo edição) */}
                            {taskToEdit && (
                                 <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">Excluir</button>
                             )}
                            <div className="flex-grow flex justify-end space-x-4">
                                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-light-text dark:text-dark-text transition-colors">Cancelar</button>
                                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg transition-colors">Salvar Tarefa</button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddTaskModal;