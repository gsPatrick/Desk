// componentsFinance/Shared/AddCardExpenseModal.js (AJUSTADO: Modo Edição)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, ChatBubbleLeftRightIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';

// Este modal recebe o cartão (card) e a fatura (invoice) selecionados (para NOVA despesa)
// E initialData (para EDIÇÃO)
const AddCardExpenseModal = ({
    isOpen, onClose, onSave,
    card, invoice, // card e invoice do contexto da página (para nova despesa)
    categoryOptions = [], categoriesLoading, categoriesError,
    onOpenAddCategoryModal,
    initialData = null, // Adicionado initialData (para edição)
}) => {
  // Estado do formulário, agora inclui 'id' e campos de série para edição
  const [formData, setFormData] = useState({
    id: null, // Adicionado ID para identificar a transação em modo edição
    description: '', amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '', // ID da categoria selecionada
    repeatType: 'normal', recurrenceFrequency: 'Mensal',
    installmentCount: 1, installmentUnit: 'Meses',
    observation: '',
     // Em modo edição, precisamos do parentId para desabilitar campos de série
     parentId: null,
  });

   const [showObservationField, setShowObservationField] = useState(false);
   const [savingLoading, setSavingLoading] = useState(false);
   const [saveError, setSaveError] = useState(null);

   const recurrenceFrequencies = ['Diária', 'Semanal', 'Quinzenal', 'Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
   const installmentUnits = ['Dias', 'Semanas', 'Quinzenas', 'Meses', 'Bimestres', 'Trimestres', 'Semestres', 'Anos'];


    // CORRIGIDO: Resetar/Inicializar formulário ao abrir OU quando initialData muda
    useEffect(() => {
        if (isOpen) {
            // Se initialData tem um ID, estamos em modo edição
            const isEditing = initialData?.id !== undefined && initialData?.id !== null;

            setFormData({
                 id: initialData?.id || null,
                 description: initialData?.description || '',
                 // Converte para number (API manda string) ou string vazia
                 amount: initialData?.amount !== undefined && initialData.amount !== null ? parseFloat(initialData.amount) : '',
                 date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
                 // Categoria pode ser null, use '' para o select
                 category: initialData?.categoryId !== undefined && initialData.categoryId !== null ? initialData.categoryId : '',
                 // Em modo edição, o repeatType é derivado de recurring/installment
                 repeatType: isEditing ? (initialData?.recurring ? 'recurring' : (initialData?.installment ? 'installment' : 'normal')) : 'normal',
                 recurrenceFrequency: initialData?.frequency || 'Mensal',
                 installmentCount: initialData?.installmentCount !== undefined && initialData.installmentCount !== null ? initialData.installmentCount : 1,
                 installmentUnit: initialData?.installmentUnit || 'Meses',
                 observation: initialData?.observation || '',
                 // invoiceId e accountId vêm do initialData em modo edição
                 // parentId vem do initialData para desabilitar campos de série
                 parentId: initialData?.parentId || null,
            });

             // Em modo edição, a observação pode já existir
             setShowObservationField(!!initialData?.observation);

            setSaveError(null);
            setSavingLoading(false);
        }
    }, [isOpen, initialData]); // Depende de isOpen E initialData


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'category' && value === '__NEW_CATEGORY__') {
        if (onOpenAddCategoryModal) onOpenAddCategoryModal();
        return;
     }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

   const handleRepeatTypeChange = (type) => {
       // Permite mudar o repeatType apenas se NÃO estiver em modo edição E não for uma transação filha
       if (formData.id === null || formData.parentId === null) {
            setFormData(prev => ({ ...prev, repeatType: type }));
            if (type === 'recurring') {
                  setFormData(prev => ({ ...prev, installmentCount: 1, installmentUnit: 'Meses' }));
            } else if (type === 'installment') {
                setFormData(prev => ({ ...prev, recurrenceFrequency: 'Mensal' }));
            } else {
                 setFormData(prev => ({ ...prev, recurrenceFrequency: 'Mensal', installmentCount: 1, installmentUnit: 'Meses' }));
            }
       }
   }

    const handleToggleObservation = () => {
        setShowObservationField(prev => !prev);
    }


  const handleSave = async () => {
    setSaveError(null); // Limpa erros antigos

    if (!formData.description || !formData.amount || !formData.date || formData.category === '') {
        setSaveError("Por favor, preencha todos os campos obrigatórios (Descrição, Valor, Data, Categoria).");
        return;
    }
     const amount = parseFloat(formData.amount);
     if (isNaN(amount) || amount <= 0) {
         setSaveError("Por favor, insira um valor válido maior que zero.");
         return;
     }
      // Validação de count/frequency apenas se NÃO estiver desabilitado (não for filha em edição)
      const isSerieFieldDisabled = formData.id !== null && formData.parentId !== null;
      if (!isSerieFieldDisabled && formData.repeatType === 'installment') {
           const installmentCount = parseInt(formData.installmentCount, 10);
           if (isNaN(installmentCount) || installmentCount < 1) {
                setSaveError("Número de parcelas inválido.");
                return;
           }
      }
       if (!isSerieFieldDisabled && formData.repeatType === 'recurring' && !formData.recurrenceFrequency) {
            setSaveError("Por favor, selecione a frequência da recorrência.");
            return;
       }


    // Preparar dados para a API
    const apiPayload = {
           // Incluir o ID apenas se estiver em modo edição
           ...(formData.id !== null && { id: formData.id }),

           description: formData.description,
           amount: amount,
           date: formData.date,

           // accountId e type:
           // Em modo CRIAÇÃO, vêm das props card/invoice.
           // Em modo EDIÇÃO, vêm do initialData (mas não devemos sobrescrever o ID da conta na edição?)
           // A API PUT para transação já espera o ID no endpoint e não muda accountId/type.
           // Se permitirmos mudar accountId/type na edição, precisa adicionar campos no form.
           // Vamos assumir que accountId/type NÃO MUDAM na edição de transação.
           // invoiceId PODE MUDAR na edição de despesa de cartão se a data mudar e cair em outra fatura.
           // Mas a API PUT também não espera invoiceId no body.
           // A lógica de re-associação de invoiceId deve ser no TransactionService.updateTransaction
           // baseado na nova data.
           // Pelo schema da API e service, só Description, Amount, Date, CategoryId, Observation
           // e campos de SÉRIE (se for a mestra) podem ser atualizados.
           // forecast também pode ser atualizado.

           // Incluíndo apenas campos que podem ser atualizados via PUT:
           // accountId, type, invoiceId, recurring, installment, parentId NÃO são atualizáveis via PUT
           // A lógica de série (recurring/installment/frequency/count/unit) só pode ser atualizada
           // se for a transação MESTRA (parentId === null).

           // Desabilita campos de série em modo edição se for uma transação filha (parentId !== null)
            ...(isSerieFieldDisabled ? {} : { // Se não for filha em edição, inclui campos de série
                 recurring: formData.repeatType === 'recurring',
                 installment: formData.repeatType === 'installment',
                 ...(formData.repeatType === 'recurring' && {
                     frequency: formData.recurrenceFrequency,
                     recurringStartDate: formData.date,
                 }),
                 ...(formData.repeatType === 'installment' && {
                     installmentCount: parseInt(formData.installmentCount, 10),
                     installmentUnit: formData.installmentUnit,
                 }),
            }),
             // forecast pode ser atualizado sempre
             forecast: formData.forecast,

             observation: formData.observation || null,
    };

    // Remove campos de série se a transação for filha em edição (garantia extra)
    // (Redundante com o spread condicional acima, mas seguro)
     if (isSerieFieldDisabled) {
         delete apiPayload.recurring;
         delete apiPayload.installment;
         delete apiPayload.frequency;
         delete apiPayload.recurringStartDate;
         delete apiPayload.installmentCount;
         delete apiPayload.installmentUnit;
     }


    console.log("Payload para salvar despesa:", apiPayload);

    setSavingLoading(true);
    try {
        if (onSave) {
            await onSave(apiPayload); // onSave na página pai chama a API (POST ou PUT)
        }
    } catch (error) {
        console.error("Error received from onSave:", error);
        setSaveError(error.message || (formData.id !== null ? 'Erro ao editar despesa.' : 'Erro ao salvar despesa.'));
    } finally {
        setSavingLoading(false);
    }
  };

  // Título do modal
  const modalTitle = formData.id !== null ? 'Editar Despesa' : 'Nova Despesa no Cartão';

   const categoryOptionsWithNew = useMemo(() => {
       if (categoriesLoading || categoriesError) return categoryOptions;
       const options = [...categoryOptions];
       // Adicionar opção 'Adicionar Nova Categoria' apenas se NÃO estiver em modo edição
       if (formData.id === null && onOpenAddCategoryModal) {
           options.push({ value: '__NEW_CATEGORY__', label: '⊕ Adicionar Nova Categoria...' });
       }
       return options;
   }, [categoryOptions, categoriesLoading, categoriesError, onOpenAddCategoryModal, formData.id]);


    const showNoCategoryMessage = !categoriesLoading && !categoriesError && categoryOptions.length === 0;

    // Determina se campos de série (repetição/parcelamento) devem ser desabilitados
    // Isso acontece se estiver em modo edição E a transação editada tiver parentId (for uma filha)
    const isSerieFieldDisabled = formData.id !== null && formData.parentId !== null;


    const isSaveButtonDisabled = savingLoading ||
                                 categoriesLoading || categoriesError ||
                                 !formData.description || !formData.amount || !formData.date ||
                                 formData.category === '' ||
                                 // Desabilita validação de count/frequency se campos de série estiverem desabilitados
                                 (!isSerieFieldDisabled && formData.repeatType === 'installment' && (isNaN(parseInt(formData.installmentCount, 10)) || parseInt(formData.installmentCount, 10) < 1)) ||
                                 (!isSerieFieldDisabled && formData.repeatType === 'recurring' && !formData.recurrenceFrequency);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }} exit={{ y: 50, opacity: 0 }} className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh] sm:max-h-none" onClick={(e) => e.stopPropagation()}>

            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors" disabled={savingLoading}>
                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
              </button>
            </div>

            {/* Corpo do Formulário */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto sm:overflow-visible">

                 {/* Mensagem de Erro */}
                 <AnimatePresence>
                     {saveError && (
                         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm text-center">{saveError}</motion.div>
                     )}
                 </AnimatePresence>

                 {/* Card/Fatura Selecionados (para referência do usuário) - Mostra apenas em modo CRIAÇÃO */}
                 {formData.id === null && card && (
                     <div className="p-4 bg-black/5 dark:bg-white/5 rounded-md flex items-center gap-3 text-sm font-semibold text-light-text dark:text-dark-text">
                         <CreditCardIcon className="h-5 w-5 text-blue-500"/>
                         <span>{card.name} (Final {card.finalDigits})</span>
                          {invoice && (
                              <span className="ml-auto text-light-subtle dark:text-dark-subtle">Fatura {invoice.month}/{invoice.year}</span>
                          )}
                     </div>
                 )}


                {/* Campos Principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Descrição</label>
                        <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Ex: Supermercado, Uber" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50" disabled={savingLoading}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Data da Compra</label>
                        <div className="relative">
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 appearance-none disabled:opacity-50" disabled={savingLoading}/>
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-subtle dark:text-dark-subtle pointer-events-none"/>
                        </div>
                     </div>
                    <div className="sm:col-span-1">
                         <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Valor</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-subtle dark:text-dark-subtle">R$</span>
                             <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="0.00" step="0.01" className="w-full p-2 pl-10 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50" disabled={savingLoading}/>
                         </div>
                    </div>
                </div>

                {/* Campo Categoria */}
                 <div>
                    <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Categoria</label>
                     {categoriesLoading ? <p className="p-2 text-sm text-light-subtle dark:text-dark-subtle">Carregando categorias...</p> : categoriesError ? <p className="p-2 text-sm text-red-400">Erro ao carregar categorias: {categoriesError}</p> : showNoCategoryMessage && <p className="p-2 text-sm text-yellow-400">Nenhuma categoria encontrada. Por favor, adicione uma via Configurações ou crie uma abaixo.</p> }
                      {!categoriesLoading && !categoriesError && (
                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none disabled:opacity-50" disabled={savingLoading || categoryOptionsWithNew.length === 0}>
                           <option value="" disabled>Selecione uma categoria</option>
                           {categoryOptionsWithNew.map(cat => (<option key={cat.value} value={cat.value} disabled={cat.value === '__NEW_CATEGORY__' && (categoriesLoading || categoriesError)}>{cat.label}</option>))}
                       </select>
                     )}
                </div>

                {/* Checkbox Lançamento Futuro (forecast) */}
                 <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-light-subtle dark:text-dark-subtle cursor-pointer">
                        <input type="checkbox" name="forecast" checked={formData.forecast} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-700 bg-black/5 dark:bg-white/5 focus:ring-blue-500 disabled:opacity-50" disabled={savingLoading}/>
                        Marcação futura (compra ainda não processada/não na fatura)
                    </label>
                 </div>


                {/* Botões de Opções Adicionais (Repetir, Observação) */}
                 <div className="flex items-center justify-center gap-12 py-4 border-y border-black/5 dark:border-white/10">
                     {/* Botão Repetir (Desabilitado se for edição de transação filha) */}
                     <button onClick={() => handleRepeatTypeChange(formData.repeatType === 'normal' ? 'recurring' : 'normal')} className={`flex flex-col items-center text-sm text-light-subtle dark:text-dark-subtle transition-colors ${savingLoading || isSerieFieldDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-light-text dark:hover:text-dark-text'}`} disabled={savingLoading || isSerieFieldDisabled}>
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${formData.repeatType !== 'normal' ? 'bg-blue-600 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                             <ArrowPathIcon className="h-6 w-6"/>
                         </div>
                         <span className="mt-1">Repetir</span>
                     </button>
                      {/* Botão Observação */}
                     <button onClick={handleToggleObservation} className={`flex flex-col items-center text-sm text-light-subtle dark:text-dark-subtle transition-colors ${savingLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-light-text dark:hover:text-dark-text'}`} disabled={savingLoading}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showObservationField ? 'bg-blue-600 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                             <ChatBubbleLeftRightIcon className="h-6 w-6"/>
                         </div>
                         <span className="mt-1">Observação</span>
                     </button>
                 </div>

                 {/* Campo Observação (Condicional) */}
                 <AnimatePresence>
                      {showObservationField && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="space-y-2 overflow-hidden">
                             <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Observação</label>
                             <textarea name="observation" value={formData.observation} onChange={handleInputChange} placeholder="Adicione detalhes sobre o lançamento aqui..." rows={3} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md resize-y border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50" disabled={savingLoading}></textarea>
                         </motion.div>
                     )}
                 </AnimatePresence>


                {/* Seção de Repetição (Condicional) (Desabilitado em modo edição se for transação filha) */}
                 <AnimatePresence>
                     {formData.repeatType !== 'normal' && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="space-y-4 overflow-hidden pt-4 border-t border-black/5 dark:border-white/10">
                             <h3 className="text-md font-semibold text-light-text dark:text-dark-text">Configurar Repetição</h3>
                             {/* Opções de Rádio (Desabilitado em modo edição se for transação filha) */}
                             <div>
                                 <label className="flex items-center gap-2 text-sm text-light-subtle dark:text-dark-subtle cursor-pointer disabled:opacity-50">
                                     <input type="radio" name="repeatOption" value="recurring" checked={formData.repeatType === 'recurring'} onChange={() => handleRepeatTypeChange('recurring')} className="form-radio h-4 w-4 text-blue-600 rounded-full border-gray-300 dark:border-gray-700 bg-black/5 dark:bg-white/5 focus:ring-blue-500 disabled:opacity-50" disabled={savingLoading || isSerieFieldDisabled}/>
                                     É uma despesa fixa (Recorrência)
                                 </label>
                             </div>
                             <div>
                                 <label className="flex items-center gap-2 text-sm text-light-subtle dark:text-dark-subtle cursor-pointer disabled:opacity-50">
                                     <input type="radio" name="repeatOption" value="installment" checked={formData.repeatType === 'installment'} onChange={() => handleRepeatTypeChange('installment')} className="form-radio h-4 w-4 text-blue-600 rounded-full border-gray-300 dark:border-gray-700 bg-black/5 dark:bg-white/5 focus:ring-blue-500 disabled:opacity-50" disabled={savingLoading || isSerieFieldDisabled}/>
                                     É um lançamento parcelado em
                                 </label>
                             </div>

                             {/* Campos Específicos de Recorrência/Parcelamento (Desabilitado em modo edição se for transação filha) */}
                              <AnimatePresence mode="wait">
                                {formData.repeatType === 'recurring' && (
                                    <motion.div key="recurring-fields" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Frequência</label>
                                            <select name="recurrenceFrequency" value={formData.recurrenceFrequency} onChange={handleInputChange} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none disabled:opacity-50" disabled={savingLoading || isSerieFieldDisabled}>
                                                {recurrenceFrequencies.map(freq => (<option key={freq} value={freq}>{freq}</option>))}
                                            </select>
                                        </div>
                                    </motion.div>
                                 )}
                                 {formData.repeatType === 'installment' && (
                                     <motion.div key="installment-fields" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                                         <div className="grid grid-cols-2 gap-4">
                                             <div>
                                                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Número de Parcelas</label>
                                                 <input type="number" name="installmentCount" value={formData.installmentCount} onChange={handleInputChange} min="1" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50" disabled={savingLoading || isSerieFieldDisabled}/>
                                             </div>
                                             <div>
                                                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Intervalo</label>
                                                 <select name="installmentUnit" value={formData.installmentUnit} onChange={handleInputChange} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none disabled:opacity-50" disabled={savingLoading || isSerieFieldDisabled}>
                                                     {installmentUnits.map(unit => (<option key={unit} value={unit}>{unit}</option>))}
                                                 </select>
                                             </div>
                                         </div>
                                          {formData.installmentCount > 0 && parseFloat(formData.amount) > 0 && (
                                             <p className="text-xs text-light-subtle dark:text-dark-subtle mt-2">
                                                 Serão lançadas {formData.installmentCount} parcelas de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(formData.amount) / parseInt(formData.installmentCount, 10) || 0)} cada, a cada {formData.installmentUnit.toLowerCase()}.
                                             </p>
                                          )}
                                     </motion.div>
                                 )}
                             </AnimatePresence>
                         </motion.div>
                     )}
                 </AnimatePresence>


            </div>

            {/* Ações do Modal */}
            <div className="p-6 flex justify-center flex-shrink-0">
              <motion.button onClick={handleSave} className="w-16 h-16 rounded-full bg-finance-pink text-white flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{ scale: savingLoading ? 1 : 1.1 }} whileTap={{ scale: savingLoading ? 1 : 0.9 }} disabled={isSaveButtonDisabled} title={formData.id !== null ? "Salvar Edição" : "Salvar Despesa"}>
                {savingLoading ? (
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.088-2.647zm9.286 2.038A7.96 7.960 0 0120 12h4c0 3.042-1.135 5.824-3 7.938l-2.714-2.647z"></path>
                   </svg>
                ) : (
                    <CheckIcon className="h-8 w-8" />
                )}
              </motion.button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCardExpenseModal;