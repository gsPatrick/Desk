// componentsFinance/Recurrences/RecurrenceModal.js (NOVO MODAL DEDICADO)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { eventTypes } from '../../data/financeData'; // Usar tipos de evento para categorias de recorrência, ou criar categorias próprias

const RecurrenceModal = ({ isOpen, onClose, recurrence, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'despesa', // Padrão para despesa, pode ser 'receita'
        category: '', // Nova campo para categoria
        frequency: 'Mensal', // Novo campo: ex: Mensal, Semanal, Anual
        startDate: '', // Novo campo: Data de início da recorrência
        // Adicionar campos como endDate ou numOccurrences se necessário
    });
     // Estado para controlar se estamos no modo de edição ou apenas visualização (se passarmos um objeto `recurrence`)
    const [isEditing, setIsEditing] = useState(false);


    // Efeito para carregar os dados da recorrência quando ela muda (modo edição/visualização)
    useEffect(() => {
        if (recurrence) {
            // Formatar a data para o formato YYYY-MM-DD
            const startDateFormatted = recurrence.startDate ? new Date(recurrence.startDate).toISOString().split('T')[0] : '';

            setFormData({
                description: recurrence.description || '',
                amount: recurrence.amount ? String(recurrence.amount) : '', // Converter para string
                type: recurrence.type || 'despesa',
                category: recurrence.category || '',
                frequency: recurrence.frequency || 'Mensal',
                startDate: startDateFormatted,
            });
            setIsEditing(false); // Inicia no modo visualização se um objeto recurrence é passado
        } else {
            // Resetar para o formulário de adição vazio
            setFormData({
                description: '',
                amount: '',
                type: 'despesa',
                category: '',
                frequency: 'Mensal',
                startDate: new Date().toISOString().split('T')[0], // Data de hoje como padrão
            });
            setIsEditing(true); // Inicia no modo edição para adicionar
        }
    }, [recurrence]); // Roda este efeito sempre que o objeto 'recurrence' prop mudar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Aqui você validaria e formataria os dados (converter valor para número, etc.)
         if (!formData.description || !formData.amount || !formData.startDate) {
             alert("Por favor, preencha todos os campos obrigatórios."); // Validação básica
             return;
         }

        const recurrenceDataToSave = {
            ...formData,
            amount: parseFloat(formData.amount), // Converter valor para número
             // Incluir o ID se estiver editando um existente
            id: recurrence ? recurrence.id : undefined,
        };
        onSave(recurrenceDataToSave); // Chama a função onSave passada via prop
        onClose(); // Fecha o modal após salvar
    };

     const handleDelete = () => {
        if (recurrence && recurrence.id && onDelete) {
            onDelete(recurrence.id); // Chama a função onDelete com o ID da recorrência
            onClose(); // Fecha o modal após excluir
        }
    };

    // Determina o título do modal
    const modalTitle = recurrence ? (isEditing ? 'Editar Recorrência' : 'Detalhes da Recorrência') : 'Nova Recorrência';

    // Determina o texto e cor do botão principal
    const primaryButtonText = recurrence ? (isEditing ? 'Salvar Alterações' : 'Editar') : 'Salvar Recorrência';
    const primaryButtonColor = recurrence ? (isEditing ? 'bg-blue-600' : 'bg-blue-600') : 'bg-finance-pink';


    // Placeholder de categorias comuns. Em um app real, isso viria de uma lista configurável.
    const categories = [
        'Assinaturas', 'Aluguel', 'Salário', 'Mensalidade Cliente',
        'Serviços', 'Software', 'Transporte', 'Outros'
    ];


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 35 } }}
                        exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                        className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                         {/* Header do Modal */}
                        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
                            <h2 className="text-xl font-bold">{modalTitle}</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
                            </button>
                        </div>

                        {/* Corpo do Formulário com Scroll Interno */}
                         <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                            {/* Tipo (Receita/Despesa) Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-2">Tipo</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-md">
                                    <button
                                        onClick={() => isEditing && setFormData(prev => ({...prev, type: 'receita'}))} // Apenas permite alterar se estiver editando
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                            formData.type === 'receita'
                                            ? 'bg-finance-lime text-black'
                                            : 'text-light-subtle dark:text-dark-subtle hover:bg-black/10 dark:hover:bg-white/10'
                                        } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={!isEditing}
                                    >
                                        Receita
                                    </button>
                                    <button
                                        onClick={() => isEditing && setFormData(prev => ({...prev, type: 'despesa'}))} // Apenas permite alterar se estiver editando
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                            formData.type === 'despesa'
                                            ? 'bg-finance-pink text-white'
                                            : 'text-light-subtle dark:text-dark-subtle hover:bg-black/10 dark:hover:bg-white/10'
                                        } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                         disabled={!isEditing}
                                    >
                                        Despesa
                                    </button>
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Descrição</label>
                                <input
                                    type="text" name="description" value={formData.description} onChange={handleChange} disabled={!isEditing}
                                    placeholder="Ex: Mensalidade Cliente X"
                                    className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                />
                            </div>

                             {/* Valor */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Valor</label>
                                <input
                                    type="number" name="amount" value={formData.amount} onChange={handleChange} disabled={!isEditing}
                                     placeholder="Ex: 500.00"
                                     className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            {/* Categoria */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Categoria</label>
                                {/* Poderia ser um input de texto ou um select com categorias pré-definidas */}
                                <select
                                    name="category" value={formData.category} onChange={handleChange} disabled={!isEditing}
                                    className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">Selecione ou Digite...</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                     {/* Implementar um input de texto caso "Outros" seja selecionado */}
                                </select>
                            </div>

                            {/* Frequência */}
                             <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Frequência</label>
                                <select
                                     name="frequency" value={formData.frequency} onChange={handleChange} disabled={!isEditing}
                                    className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <option value="Mensal">Mensal</option>
                                    <option value="Semanal">Semanal</option>
                                     <option value="Trimestral">Trimestral</option>
                                     <option value="Anual">Anual</option>
                                    {/* Adicione outras frequências */}
                                </select>
                            </div>

                             {/* Data de Início */}
                             <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Data de Início</label>
                                 <input
                                     type="date" name="startDate" value={formData.startDate} onChange={handleChange} disabled={!isEditing}
                                     className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                 />
                            </div>

                            {/* TODO: Adicionar campos para Fim da Recorrência (Ex: Data Fim, Número de Ocorrências) */}

                         </div>

                         {/* Ações do Modal (Footer) */}
                        <div className="flex items-center justify-between p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
                             {/* Botão de Excluir (visível apenas se estiver editando um existente E não no modo visualização) */}
                            {recurrence && !isEditing && (
                                <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">Excluir</button>
                            )}

                             {/* Botões Cancelar/Voltar e o botão principal (Editar ou Salvar) */}
                             {/* flex-grow e justify-end para empurrar os botões para a direita */}
                             <div className="flex-grow flex justify-end space-x-4">
                                 {/* Botão Cancelar (visível apenas se estiver no modo edição E for uma recorrência existente) */}
                                 {isEditing && recurrence && (
                                     <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-light-text dark:text-dark-text">Cancelar</button>
                                 )}
                                  {/* Botão Fechar (visível apenas se estiver no modo visualização) */}
                                 {!isEditing && (
                                      <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-light-text dark:text-dark-text">Fechar</button>
                                 )}

                                 {/* Botão Principal (Editar ou Salvar) */}
                                 {/* Se estiver no modo edição OU se for uma nova recorrência (recurrence é null), mostra "Salvar" */}
                                 {/* Se for uma recorrência existente E não estiver no modo edição, mostra "Editar" */}
                                 {(!recurrence || isEditing) ? (
                                     <button onClick={handleSave} className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${primaryButtonColor}`}>
                                         {primaryButtonText}
                                     </button>
                                 ) : (
                                     <button onClick={() => setIsEditing(true)} className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${primaryButtonColor}`}>
                                         {primaryButtonText}
                                     </button>
                                 )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RecurrenceModal;