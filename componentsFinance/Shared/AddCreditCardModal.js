// componentsFinance/Shared/AddCreditCardModal.js (AJUSTADO: Modo Edição)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
// Ícones (mantidos)
import { SiVisa, SiMastercard, SiAmericanexpress, SiEllo } from 'react-icons/si';


const AddCreditCardModal = ({ isOpen, onClose, onSave, initialData = null }) => { // Adicionado initialData
  // Estado inicializado. Adicionado 'id' para modo edição.
  const [formData, setFormData] = useState({
    id: null, // Adicionado ID para identificar o cartão em modo edição
    name: '',
    finalDigits: '',
    brand: 'Visa',
    limit: '',
    closingDay: '',
    dueDay: '',
    color: '',
    icon: '',
  });

  const [savingLoading, setSavingLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);


  // CORRIGIDO: Resetar/Inicializar formulário ao abrir OU quando initialData muda
  useEffect(() => {
      if (isOpen) {
          // Se initialData tem um ID, estamos em modo edição
          const isEditing = initialData?.id !== undefined && initialData?.id !== null;

          setFormData({
               id: initialData?.id || null,
               name: initialData?.name || '',
               finalDigits: initialData?.finalDigits || '',
               brand: initialData?.brand || 'Visa',
               limit: initialData?.limit !== undefined && initialData.limit !== null ? parseFloat(initialData.limit) : '', // Converter de string para number no estado
               closingDay: initialData?.closingDay !== undefined && initialData.closingDay !== null ? initialData.closingDay : '',
               dueDay: initialData?.dueDay !== undefined && initialData.dueDay !== null ? initialData.dueDay : '',
               color: initialData?.color || '',
               icon: initialData?.icon || '',
               // type e userId não são no formData, são fixos ou do contexto
          });

          setSavingLoading(false);
          setSaveError(null);
      }
  }, [isOpen, initialData]); // Depende de isOpen E initialData


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'finalDigits' && (value.length > 4 || !/^\d*$/.test(value))) return;
    if ((name === 'closingDay' || name === 'dueDay') && value) {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1 || numValue > 31) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaveError(null);

    if (!formData.name || !formData.finalDigits || !formData.brand || !formData.limit || !formData.closingDay || !formData.dueDay) {
        setSaveError("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
     const limit = parseFloat(formData.limit);
     const closingDay = parseInt(formData.closingDay, 10);
     const dueDay = parseInt(formData.dueDay, 10);

     if (isNaN(limit) || limit <= 0) { setSaveError("Limite de crédito inválido."); return; }
     if (isNaN(closingDay) || closingDay < 1 || closingDay > 31) { setSaveError("Dia de fechamento inválido (1-31)."); return; }
     if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) { setSaveError("Dia de vencimento inválido (1-31)."); return; }
     if (formData.finalDigits.length !== 4 || !/^\d{4}$/.test(formData.finalDigits)) {
          setSaveError("O final do cartão deve ter exatamente 4 dígitos numéricos.");
          return;
     }

    // Preparar o payload para a API
    const apiPayload = {
      // Inclui o ID apenas se estiver em modo edição
      ...(formData.id !== null && { id: formData.id }),
      name: formData.name,
      type: 'credit_card', // Fixo
      limit: limit,
      closingDay: closingDay,
      dueDay: dueDay,
      brand: formData.brand,
      finalDigits: formData.finalDigits,
      color: formData.color || null,
      icon: formData.icon || null,
    };

    console.log("Payload para salvar cartão:", apiPayload);

    setSavingLoading(true);
    try {
        if (onSave) {
            await onSave(apiPayload); // onSave na página pai chama a API (POST ou PUT)
        }
    } catch (error) {
        console.error("Error received from onSave:", error);
        setSaveError(error.message || (formData.id !== null ? 'Erro ao editar cartão.' : 'Erro ao salvar cartão.'));
    } finally {
        setSavingLoading(false);
    }
  };

  // Título do modal muda se estiver em modo edição
  const modalTitle = formData.id !== null ? 'Editar Cartão' : 'Adicionar Cartão de Crédito';


  const isSaveButtonDisabled = savingLoading ||
                                 !formData.name || !formData.finalDigits || !formData.brand || !formData.limit || !formData.closingDay || !formData.dueDay; // Validações básicas


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
                 <AnimatePresence>
                     {saveError && (
                         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm text-center">{saveError}</motion.div>
                     )}
                 </AnimatePresence>
                {/* Nome do Cartão */}
                 <div>
                    <label htmlFor="card-name" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome do Cartão</label>
                    <input id="card-name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Cartão Principal, Cartão PJ" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50" disabled={savingLoading}/>
                </div>
                 {/* Bandeira e Final */}
                 <div className="grid grid-cols-2 gap-4">
                     {/* Bandeira */}
                     <div>
                         <label htmlFor="card-brand" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Bandeira</label>
                         <select id="card-brand" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none disabled:opacity-50" disabled={savingLoading}>
                             <option value="Visa">Visa</option>
                             <option value="Mastercard">Mastercard</option>
                             <option value="American Express">American Express</option>
                             <option value="Elo">Elo</option>
                         </select>
                     </div>
                     {/* Final 4 Dígitos */}
                      <div>
                         <label htmlFor="card-final" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Final (4 Dígitos)</label>
                         <input id="card-final" type="text" name="finalDigits" value={formData.finalDigits} onChange={handleInputChange} placeholder="4242" maxLength="4" inputMode="numeric" pattern="[0-9]*" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50" disabled={savingLoading}/>
                     </div>
                 </div>
                 {/* Limite de Crédito */}
                 <div>
                    <label htmlFor="card-limit" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Limite de Crédito</label>
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-subtle dark:text-dark-subtle">R$</span>
                        <input id="card-limit" type="number" name="limit" value={formData.limit} onChange={handleInputChange} placeholder="5000.00" step="0.01" className="w-full p-2 pl-10 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50" disabled={savingLoading}/>
                     </div>
                </div>
                {/* Dias de Fechamento e Vencimento */}
                 <div className="grid grid-cols-2 gap-4">
                     {/* Dia de Fechamento */}
                     <div>
                         <label htmlFor="card-closing" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Dia de Fechamento</label>
                         <input id="card-closing" type="number" name="closingDay" value={formData.closingDay} onChange={handleInputChange} placeholder="28" min="1" max="31" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50" disabled={savingLoading}/>
                     </div>
                     {/* Dia de Vencimento */}
                     <div>
                         <label htmlFor="card-due" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Dia de Vencimento</label>
                         <input id="card-due" type="number" name="dueDay" value={formData.dueDay} onChange={handleInputChange} placeholder="10" min="1" max="31" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50" disabled={savingLoading}/>
                     </div>
                 </div>
                  {/* Campos opcionais de Cor e Ícone */}
                  <div>
                     <label htmlFor="card-color" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Cor (Opcional)</label>
                     <input id="card-color" type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="#f6339a" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50" disabled={savingLoading}/>
                 </div>
                  <div>
                     <label htmlFor="card-icon" className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Ícone (Opcional)</label>
                     <input id="card-icon" type="text" name="icon" value={formData.icon} onChange={handleInputChange} placeholder="SiVisa" className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50" disabled={savingLoading}/>
                 </div>
            </div>

            {/* Ações do Modal */}
            <div className="flex items-center justify-end p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-light-text dark:text-dark-text transition-colors disabled:opacity-50" disabled={savingLoading}>Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-finance-pink text-white rounded-lg transition-colors disabled:opacity-50" disabled={isSaveButtonDisabled}> {/* Usa isSaveButtonDisabled */}
                  {savingLoading ? 'Salvando...' : (formData.id !== null ? 'Salvar Edição' : 'Salvar Cartão')} {/* Título do botão muda */}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCreditCardModal;