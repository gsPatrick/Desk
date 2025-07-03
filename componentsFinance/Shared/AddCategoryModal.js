// componentsFinance/Shared/AddCategoryModal.js (Conteúdo do Modal para adicionar Categoria)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TagIcon, PaintBrushIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
// TODO: Considerar um picker de ícones mais robusto
// TODO: Considerar um picker de cores mais robusto

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#007bff', // Cor padrão (pode ser picker ou string)
    icon: null, // Nome do ícone ou código (depende da sua implementação de ícones)
    // TODO: Adicionar campo para selecionar ícone
  });
  const [savingLoading, setSavingLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

   // TODO: Implementar seleção de ícone de forma mais robusta
   // const handleIconSelect = (iconName) => {
   //     setFormData(prev => ({ ...prev, icon: iconName }));
   // };


  const handleSave = async () => {
    // Validação básica
    if (!formData.name) {
        setSaveError("Por favor, insira o nome da categoria.");
        return;
    }
    // TODO: Validação de cor/ícone se forem campos obrigatórios ou com formato específico

    const newCategoryData = {
      name: formData.name,
      color: formData.color, // Assumindo que a API aceita string hexadecimal
      icon: formData.icon, // Assumindo que a API aceita string/nome do ícone ou null
    };

    console.log("Nova categoria a salvar:", newCategoryData);

    setSavingLoading(true);
    setSaveError(null);
    try {
        // Chama a função onSave passada como prop
        // Espera que onSave chame a API (POST /api/v1/categories)
        await onSave(newCategoryData);

        // Resetar formulário e fechar modal em caso de sucesso
        setFormData({ name: '', color: '#007bff', icon: null });
        setSavingLoading(false);
        onClose(); // Fecha este modal

    } catch (error) {
         console.error("Error received from onSave (AddCategoryModal):", error);
         // Exibe o erro retornado pelo onSave
         setSaveError(error.message || 'Erro ao salvar categoria.');
         setSavingLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose} // Fecha modal clicando no overlay
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh] sm:max-h-none"
            onClick={(e) => e.stopPropagation()} // Previne fechar clicando dentro do modal
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
              <h2 className="text-xl font-bold">Adicionar Nova Categoria</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
              </button>
            </div>

            {/* Corpo do Formulário - Scroll apenas no mobile */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto sm:overflow-visible">

                 {/* Mensagem de Erro de Salvamento */}
                 <AnimatePresence>
                     {saveError && (
                         <motion.div
                             initial={{ opacity: 0, y: -10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm text-center"
                         >
                             {saveError}
                         </motion.div>
                     )}
                 </AnimatePresence>

                {/* Nome da Categoria */}
                 <div>
                    <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome da Categoria</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: Alimentação, Transporte, Software"
                        className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                 {/* Cor e Ícone (simplificado por enquanto) */}
                 <div className="grid grid-cols-2 gap-4">
                     {/* Cor */}
                     <div>
                         <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Cor</label>
                         <input
                             type="color" // Input type color para seleção simples
                             name="color"
                             value={formData.color}
                             onChange={handleInputChange}
                             className="w-full h-10 p-1 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         />
                     </div>
                     {/* Ícone */}
                     {/* TODO: Substituir por um picker de ícones */}
                      <div>
                          <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Ícone (Nome - Opcional)</label>
                           <div className="relative">
                              <input
                                  type="text"
                                  name="icon"
                                  value={formData.icon || ''} // Use '' para controlled input
                                  onChange={handleInputChange}
                                  placeholder="Ex: TagIcon"
                                  className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                              />
                               {/* Ícone placeholder */}
                               {/* <TagIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-subtle dark:text-dark-subtle pointer-events-none"/> */}
                           </div>
                      </div>
                 </div>

            </div>

            {/* Ações do Modal (Footer) */}
             {/* flex-shrink-0 para garantir que o footer não encolha */}
            <div className="flex items-center justify-end p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-light-text dark:text-dark-text transition-colors">Cancelar</button>
              <motion.button
                onClick={handleSave}
                 className="px-4 py-2 text-sm font-semibold bg-finance-pink text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 whileHover={{ scale: savingLoading ? 1 : 1.03 }}
                 whileTap={{ scale: savingLoading ? 1 : 0.98 }}
                 disabled={savingLoading || !formData.name} // Desabilita se estiver salvando ou nome vazio
              >
                {savingLoading ? 'Salvando...' : 'Salvar Categoria'}
              </motion.button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCategoryModal;