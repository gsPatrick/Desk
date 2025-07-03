// componentsFinance/Shared/AddTransactionModal.js (CORRIGIDO: TypeError no startsWith)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns'; // Importa format para formatar a data inicial


// O modal recebe accountOptions, categoryOptions, seus loadings/erros
// e os handlers para abrir modais de criação: onOpenAddCardModal, onOpenAddCategoryModal
const AddTransactionModal = ({
    isOpen,
    onClose,
    onSave, // Handler para salvar a transação principal
    accountOptions = [], // Lista de { value: id, label: name } contas/cartões
    categoryOptions = [], // Lista de { value: id, label: name } categorias
    accountsLoading,
    accountsError,
    categoriesLoading,
    categoriesError,
    onOpenAddCardModal, // Handler para abrir modal de cartão (passado pelo pai)
    onOpenAddCategoryModal, // Handler para abrir modal de categoria (passado pelo pai)
    // TODO: defaultAccountValue, defaultCategoryValue para pré-selecionar items criados ao re-abrir
}) => {
  const [transactionType, setTransactionType] = useState('despesa'); // 'receita' ou 'despesa'
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'), // Data atual em formato YYYY-MM-DD usando date-fns
    account: '', // ID da conta/cartão selecionado (será um number)
    category: '', // ID da categoria selecionada (será um number)
    forecast: false, // Checkbox "Lançamento Futuro" - Mapeia para 'forecast' na API
    repeatType: 'normal', // 'normal', 'recurring', 'installment' (estado local para UI)
    recurrenceFrequency: 'Mensal', // Frequência para recorrência
    installmentCount: 1, // Quantidade de parcelas
    installmentUnit: 'Meses', // Unidade das parcelas
    observation: '',
  });

   // Estados para UI do modal
   const [showObservationField, setShowObservationField] = useState(false);
   const [savingLoading, setSavingLoading] = useState(false); // Estado para loading do save
   const [saveError, setSaveError] = useState(null); // Estado para erro do save


    // Resetar formulário ao abrir o modal para adicionar um novo lançamento
    useEffect(() => {
        if (isOpen) {
            setFormData({
                description: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), // Reseta com data atual formatada
                account: '', category: '', forecast: false, repeatType: 'normal', // Reseta forecast para false
                recurrenceFrequency: 'Mensal', installmentCount: 1, installmentUnit: 'Meses',
                observation: '',
            });
            setTransactionType('despesa');
            setShowObservationField(false);
            setSaveError(null);
            setSavingLoading(false);

            // TODO: Usar defaultAccountValue, defaultCategoryValue se existirem
            // if(defaultAccountValue) setFormData(prev => ({...prev, account: defaultAccountValue}));
            // if(defaultCategoryValue) setFormData(prev => ({...prev, category: defaultCategoryValue}));
        }
    }, [isOpen]); // Depende apenas de isOpen (e potencialmente defaultAccountValue/CategoryValue)

  const handleTypeToggle = (type) => {
    setTransactionType(type);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Lógica para "Adicionar Novo..." (CHAMA PARENTE)
    // Ao selecionar o valor dummy, chama o handler do pai e sai da função
    if (name === 'account' && value === '__NEW_CARD__') {
        if (onOpenAddCardModal) onOpenAddCardModal();
        // Não atualiza o estado com '__NEW_CARD__', o pai fecha este modal.
        // Opcional: setFormData(prev => ({ ...prev, account: '' })); // Reseta a seleção no dropdown antes de fechar
        return;
    }
     if (name === 'category' && value === '__NEW_CATEGORY__') {
        if (onOpenAddCategoryModal) onOpenAddCategoryModal();
         // Não atualiza o estado com '__NEW_CATEGORY__', o pai fecha este modal.
        // Opcional: setFormData(prev => ({ ...prev, category: '' })); // Reseta a seleção no dropdown antes de fechar
        return;
     }

    // Para inputs normais, atualiza o estado
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

   const handleRepeatTypeChange = (type) => {
       setFormData(prev => ({ ...prev, repeatType: type }));
       // Resetar campos específicos ao mudar o tipo de repetição para garantir payload limpo
       if (type === 'recurring') {
             setFormData(prev => ({ ...prev, installmentCount: 1, installmentUnit: 'Meses' })); // Reseta campos de parcela
       } else if (type === 'installment') {
           setFormData(prev => ({ ...prev, recurrenceFrequency: 'Mensal' })); // Reseta campos de recorrência
       } else { // type === 'normal'
            setFormData(prev => ({ ...prev, recurrenceFrequency: 'Mensal', installmentCount: 1, installmentUnit: 'Meses' })); // Reseta ambos
       }
   }

    const handleToggleObservation = () => {
        setShowObservationField(prev => !prev);
        // Opcional: Limpar observação ao esconder? Decidimos manter o texto.
    }


  // Função de salvar a transação principal (chamada pela prop onSave)
  const handleSave = async () => {
    // Validação básica dos campos obrigatórios no frontend
    if (!formData.description || !formData.amount || !formData.date || formData.account === '' || formData.category === '') {
        setSaveError("Por favor, preencha todos os campos obrigatórios (Descrição, Valor, Data, Conta/Cartão, Categoria).");
        return;
    }
     const amount = parseFloat(formData.amount);
     if (isNaN(amount) || amount <= 0) {
         setSaveError("Por favor, insira um valor válido maior que zero.");
         return;
     }
      if (formData.repeatType === 'installment') {
           const installmentCount = parseInt(formData.installmentCount, 10);
           if (isNaN(installmentCount) || installmentCount < 1) {
                setSaveError("Número de parcelas inválido.");
                return;
           }
      }
       // Validação de recorrência (opcional, Joi no backend já valida frequency se recurring for true)
       // if (formData.repeatType === 'recurring' && !formData.recurrenceFrequency) {
       //      setSaveError("Por favor, selecione a frequência da recorrência.");
       //      return;
       // }


      // Preparar dados para a API (mapeamento para o schema do backend)
      const apiPayload = {
           description: formData.description,
           amount: amount,
           date: formData.date, // Envia a data no formato YYYY-MM-DD (ISO)
           accountId: parseInt(formData.account, 10),
           categoryId: parseInt(formData.category, 10), // Pode ser null/omitido se a categoria for opcional e não selecionada
           type: transactionType === 'receita' ? 'income' : 'expense',
           forecast: formData.forecast, // Envia o estado do checkbox 'Lançamento Futuro'

           // Lógica de Repetição: Define recurring/installment booleanos E adiciona campos dependentes
           recurring: formData.repeatType === 'recurring',
           installment: formData.repeatType === 'installment',

           // Adiciona campos de recorrência APENAS se repeatType for 'recurring'
           ...(formData.repeatType === 'recurring' && {
               frequency: formData.recurrenceFrequency,
               // A data de início da recorrência é a data principal da transação (formData.date)
               recurringStartDate: formData.date,
           }),

           // Adiciona campos de parcelamento APENAS se repeatType for 'installment'
           ...(formData.repeatType === 'installment' && {
               installmentCount: parseInt(formData.installmentCount, 10),
               installmentUnit: formData.installmentUnit,
               // installmentCurrent não é enviado na criação da primeira parcela, o backend gerencia
               // parentId não é enviado na criação da primeira parcela (ela é o parent)
           }),

           observation: formData.observation || null, // Envia string vazia como null, se vazio/opcional
      };

        // Limpeza final do payload (remove campos que não se aplicam ou são null/vazios)
        // A validação Joi com stripUnknown: true já ajuda, mas limpar aqui é boa prática.
        Object.keys(apiPayload).forEach(key => {
            // Remove campos de recorrência se não for recorrente
            if (apiPayload.recurring === false && (key === 'frequency' || key === 'recurringStartDate')) {
                delete apiPayload[key];
            }
            // Remove campos de parcelamento se não for parcelado
             if (apiPayload.installment === false && (key === 'installmentCount' || key === 'installmentUnit')) {
                 delete apiPayload[key];
             }
             // Remove categoryId se for null
             if (key === 'categoryId' && apiPayload[key] === null) {
                 delete apiPayload[key];
             }
             // Remove observation se for null
             if (key === 'observation' && apiPayload[key] === null) {
                 delete apiPayload[key];
             }
        });


      console.log("Payload to send to onSave:", apiPayload);

      setSavingLoading(true);
      setSaveError(null);
      try {
          // Chama a função onSave passada pela página pai
          // Espera uma Promise que resolve ou rejeita
          await onSave(apiPayload);

          setSavingLoading(false);
          // O modal será fechado pelo handler onSave na página pai após sucesso.
          // onClose(); // Removi chamada direta aqui para garantir que o pai controle o fechamento após o save

      } catch (error) {
          console.error("Error received from onSave:", error);
          // Exibe o erro retornado pelo onSave (que vem da API via hook/api.js)
          // A mensagem de erro já deve vir formatada pelo errorMiddleware do backend
          setSaveError(error.message || 'Erro ao salvar lançamento.');
          setSavingLoading(false);
      }
  };

  const modalTitle = transactionType === 'receita' ? 'Nova Receita' : 'Nova Despesa';


  // Adiciona a opção "Adicionar Novo Cartão..." apenas para despesas, se o handler existir e não estiver carregando/erro
   const accountOptionsWithNew = useMemo(() => {
       // Se estiver carregando ou com erro, retorna apenas as opções brutas
       if (accountsLoading || accountsError) return accountOptions;

       const options = [...accountOptions]; // Começa com as opções reais carregadas
       if (transactionType === 'despesa' && onOpenAddCardModal) {
             // Adiciona a opção dummy NO FIM da lista de contas/cartões REAIS
             options.push({ value: '__NEW_CARD__', label: '⊕ Adicionar Novo Cartão...' });
       }
       return options;
       // Recalcula se accountOptions, loading/error, transactionType, onOpenAddCardModal mudarem
   }, [accountOptions, accountsLoading, accountsError, transactionType, onOpenAddCardModal]);


   // Adiciona a opção "Adicionar Nova Categoria..." SEMPRE se o handler existir e não estiver carregando/erro
   const categoryOptionsWithNew = useMemo(() => {
       // Se estiver carregando ou com erro, retorna apenas as opções brutas
       if (categoriesLoading || categoriesError) return categoryOptions;

       const options = [...categoryOptions]; // Começa com as opções reais carregadas
       // ADICIONA A OPÇÃO DUMMY NO FIM da lista de categorias REAIS, SE O HANDLER EXISTIR
       if (onOpenAddCategoryModal) {
           options.push({ value: '__NEW_CATEGORY__', label: '⊕ Adicionar Nova Categoria...' });
       }
       return options;
       // Recalcula se categoryOptions, loading/error, onOpenAddCategoryModal mudarem
   }, [categoryOptions, categoriesLoading, categoriesError, onOpenAddCategoryModal]);


    // --- Lógica para exibição da mensagem de "nenhum item encontrado" e desabilitar botão ---
    // Mensagem para contas/cartões: Exibir se loading/error terminou E não houver nenhuma conta REAL
    const showNoAccountMessage = !accountsLoading && !accountsError && accountOptions.length === 0;
     // Mensagem para categorias: Exibir se loading/error terminou E não houver nenhuma categoria REAL
    const showNoCategoryMessage = !categoriesLoading && !categoriesError && categoryOptions.length === 0;

    // Botão Salvar deve ser desabilitado se:
    // - Estiver salvando (savingLoading)
    // - Dados essenciais (contas/categorias) estiverem carregando ou com erro
    // - Campos obrigatórios do formulário principal estiverem vazios (description, amount, date)
    // - Seleção de Conta/Cartão estiver vazia (formData.account === ''). Isso garante que o usuário selecionou uma conta REAL ou a opção dummy (que já trata o desvio)
    // - Seleção de Categoria estiver vazia (formData.category === ''). Isso garante que o usuário selecionou uma categoria REAL ou a opção dummy.
    // - Para parcelamento, o número de parcelas for inválido (< 1)
    const isSaveButtonDisabled = savingLoading ||
                                 accountsLoading || categoriesLoading ||
                                 accountsError || categoriesError ||
                                 !formData.description || !formData.amount || !formData.date ||
                                 formData.account === '' || formData.category === '' ||
                                 (formData.repeatType === 'installment' && (isNaN(parseInt(formData.installmentCount, 10)) || parseInt(formData.installmentCount, 10) < 1)) ||
                                 (formData.repeatType === 'recurring' && !formData.recurrenceFrequency); // Adiciona validação básica para frequência


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
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
              </button>
            </div>

            {/* Corpo do Formulário com Scroll apenas no mobile */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto sm:overflow-visible">

                {/* Toggle Receita/Despesa */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-md">
                    <button
                        onClick={() => handleTypeToggle('receita')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                            transactionType === 'receita'
                            ? 'bg-finance-lime text-black'
                            : 'text-light-subtle dark:text-dark-subtle hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                    >
                        Receita
                    </button>
                    <button
                        onClick={() => handleTypeToggle('despesa')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                            transactionType === 'despesa'
                            ? 'bg-finance-pink text-white'
                            : 'text-light-subtle dark:text-dark-subtle hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                    >
                        Despesa
                    </button>
                </div>

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


                {/* Campos Principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Descrição</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Ex: Pagamento Projeto X"
                            className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                     {/* Data */}
                     <div>
                        <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Data</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 appearance-none"
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-subtle dark:text-dark-subtle pointer-events-none"/>
                        </div>
                     </div>
                    {/* Valor */}
                    <div className="sm:col-span-1">
                         <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Valor</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-subtle dark:text-dark-subtle">R$</span>
                             <input
                                 type="number"
                                 name="amount"
                                 value={formData.amount}
                                 onChange={handleInputChange}
                                 placeholder="0.00" // Use ponto como separador decimal em inputs type="number"
                                 step="0.01" // Permite centavos
                                 className="w-full p-2 pl-10 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                             />
                         </div>
                    </div>
                </div>

                {/* Campo Conta/Cartão */}
                 <div>
                    <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Conta/Cartão</label>
                     {accountsLoading ? (
                         <p className="p-2 text-sm text-light-subtle dark:text-dark-subtle">Carregando contas...</p>
                     ) : accountsError ? (
                          <p className="p-2 text-sm text-red-400">Erro ao carregar contas: {accountsError}</p>
                     ) : (
                        // Exibe a mensagem SE não houver contas reais
                         showNoAccountMessage && (
                             <p className="p-2 text-sm text-yellow-400">Nenhuma conta encontrada. Por favor, adicione uma via Configurações ou crie um cartão.</p>
                         )
                     )}
                     {/* Exibe o select SEMPRE se não estiver carregando/erro, permitindo a seleção ou a opção "adicionar novo" */}
                     {!accountsLoading && !accountsError && (
                        <select
                           name="account"
                           value={formData.account}
                           onChange={handleInputChange}
                           className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                       >
                           <option value="" disabled>Selecione uma conta ou cartão</option>
                           {/* Renderiza as opções reais + a opção "Adicionar Novo" */}
                           {accountOptionsWithNew.map(option => (
                               <option
                                   key={option.value}
                                   value={option.value}
                                   // CORRIGIDO: Verifica se o value é a string dummy antes de desabilitar
                                   disabled={option.value === '__NEW_CARD__' && (accountsLoading || accountsError)}
                               >
                                   {option.label}
                               </option>
                           ))}
                       </select>
                     )}
                </div>

                {/* Campo Categoria */}
                 <div>
                    <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Categoria</label>
                     {categoriesLoading ? (
                         <p className="p-2 text-sm text-light-subtle dark:text-dark-subtle">Carregando categorias...</p>
                     ) : categoriesError ? (
                         <p className="p-2 text-sm text-red-400">Erro ao carregar categorias: {categoriesError}</p>
                     ) : (
                        // Exibe a mensagem SE não houver categorias reais
                        showNoCategoryMessage && ( // <-- Exibe mensagem se NÃO houver categorias reais
                             <p className="p-2 text-sm text-yellow-400">Nenhuma categoria encontrada. Por favor, adicione uma via Configurações ou crie uma abaixo.</p>
                         )
                     )}
                     {/* Exibe o select SEMPRE se não estiver carregando/erro, permitindo a seleção ou a opção "adicionar novo" */}
                      {!categoriesLoading && !categoriesError && (
                        <select
                           name="category"
                           value={formData.category}
                           onChange={handleInputChange}
                           className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                       >
                           <option value="" disabled>Selecione uma categoria</option>
                           {/* Renderiza as opções reais + a opção "Adicionar Novo" */}
                           {categoryOptionsWithNew.map(cat => (
                               <option
                                   key={cat.value}
                                   value={cat.value}
                                   // CORRIGIDO: Verifica se o value é a string dummy antes de desabilitar
                                   disabled={cat.value === '__NEW_CATEGORY__' && (categoriesLoading || categoriesError)}
                               >
                                   {cat.label}
                               </option>
                           ))}
                       </select>
                     )}
                </div>

                {/* Checkbox Lançamento Futuro (forecast) */}
                 <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-light-subtle dark:text-dark-subtle cursor-pointer">
                        <input
                            type="checkbox"
                            name="forecast" // Mapeia para 'forecast' no formData e API
                            checked={formData.forecast}
                            onChange={handleInputChange}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-700 bg-black/5 dark:bg-white/5 focus:ring-blue-500"
                        />
                        Lançamento Futuro (Ainda não aconteceu)
                    </label>
                 </div>


                {/* Botões de Opções Adicionais (Repetir, Observação) */}
                 <div className="flex items-center justify-center gap-12 py-4 border-y border-black/5 dark:border-white/10">
                     {/* Botão Repetir */}
                     <button onClick={() => handleRepeatTypeChange(formData.repeatType === 'normal' ? 'recurring' : 'normal')} className="flex flex-col items-center text-sm text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${formData.repeatType !== 'normal' ? 'bg-blue-600 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                             <ArrowPathIcon className="h-6 w-6"/>
                         </div>
                         <span className="mt-1">Repetir</span>
                     </button>
                      {/* Botão Observação */}
                     <button onClick={handleToggleObservation} className="flex flex-col items-center text-sm text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showObservationField ? 'bg-blue-600 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                             <ChatBubbleLeftRightIcon className="h-6 w-6"/>
                         </div>
                         <span className="mt-1">Observação</span>
                     </button>
                 </div>

                 {/* Campo Observação (Condicional) */}
                 <AnimatePresence>
                      {showObservationField && (
                         <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             transition={{ duration: 0.3, ease: 'easeInOut' }}
                             className="space-y-2 overflow-hidden"
                         >
                             <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Observação</label>
                             <textarea
                                 name="observation"
                                 value={formData.observation}
                                 onChange={handleInputChange}
                                 placeholder="Adicione detalhes sobre o lançamento aqui..."
                                 rows={3}
                                 className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md resize-y border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                             ></textarea>
                         </motion.div>
                     )}
                 </AnimatePresence>


                {/* Seção de Repetição (Condicional) */}
                 <AnimatePresence>
                     {formData.repeatType !== 'normal' && (
                         <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             transition={{ duration: 0.3, ease: 'easeInOut' }}
                             className="space-y-4 overflow-hidden pt-4 border-t border-black/5 dark:border-white/10"
                         >
                             <h3 className="text-md font-semibold text-light-text dark:text-dark-text">Configurar Repetição</h3>
                             {/* Opções de Rádio para Recorrência/Parcelado */}
                             <div>
                                 <label className="flex items-center gap-2 text-sm text-light-subtle dark:text-dark-subtle cursor-pointer">
                                     <input
                                         type="radio"
                                         name="repeatOption"
                                         value="recurring"
                                         checked={formData.repeatType === 'recurring'}
                                         onChange={() => handleRepeatTypeChange('recurring')}
                                         className="form-radio h-4 w-4 text-blue-600 rounded-full border-gray-300 dark:border-gray-700 bg-black/5 dark:bg-white/5 focus:ring-blue-500"
                                     />
                                     É uma {transactionType} fixa (Recorrência)
                                 </label>
                             </div>
                             <div>
                                 <label className="flex items-center gap-2 text-sm text-light-subtle dark:text-dark-subtle cursor-pointer">
                                     <input
                                         type="radio"
                                         name="repeatOption"
                                         value="installment"
                                         checked={formData.repeatType === 'installment'}
                                         onChange={() => handleRepeatTypeChange('installment')}
                                         className="form-radio h-4 w-4 text-blue-600 rounded-full border-gray-300 dark:border-gray-700 bg-black/5 dark:bg-white/5 focus:ring-blue-500"
                                     />
                                     É um lançamento parcelado em
                                 </label>
                             </div>

                             {/* Campos Específicos de Recorrência/Parcelamento */}
                              <AnimatePresence mode="wait">
                                {/* Campos de Recorrência */}
                                {formData.repeatType === 'recurring' && (
                                    <motion.div
                                         key="recurring-fields"
                                         initial={{ opacity: 0, y: 10 }}
                                         animate={{ opacity: 1, y: 0 }}
                                         exit={{ opacity: 0, y: -10 }}
                                         transition={{ duration: 0.2 }}
                                         className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Frequência</label>
                                            <select
                                                name="recurrenceFrequency" // Mapeia para recurrenceFrequency no formData
                                                value={formData.recurrenceFrequency}
                                                onChange={handleInputChange}
                                                className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                                            >
                                                <option value="Diária">Diária</option>
                                                <option value="Semanal">Semanal</option>
                                                <option value="Quinzenal">Quinzenal</option>
                                                <option value="Mensal">Mensal</option>
                                                <option value="Bimestral">Bimestral</option>
                                                <option value="Trimestral">Trimestral</option>
                                                <option value="Semestral">Semestral</option>
                                                <option value="Anual">Anual</option>
                                            </select>
                                        </div>
                                         {/* A data de início da recorrência é a data principal da transação (formData.date) */}
                                         {/* Não precisa de um campo separado para recurringStartDate no form */}
                                    </motion.div>
                                 )}

                                {/* Campos de Parcelamento */}
                                {formData.repeatType === 'installment' && (
                                     <motion.div
                                          key="installment-fields"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          transition={{ duration: 0.2 }}
                                          className="space-y-4"
                                     >
                                         <div className="grid grid-cols-2 gap-4">
                                             <div>
                                                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Número de Parcelas</label>
                                                 <input
                                                     type="number"
                                                     name="installmentCount" // Mapeia para installmentCount no formData
                                                     value={formData.installmentCount}
                                                     onChange={handleInputChange}
                                                     min="1"
                                                      // Remove setas numéricas
                                                     className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Intervalo</label>
                                                 <select
                                                     name="installmentUnit" // Mapeia para installmentUnit no formData
                                                     value={formData.installmentUnit}
                                                     onChange={handleInputChange}
                                                     className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                                                 >
                                                     <option value="Dias">Dias</option>
                                                     <option value="Semanas">Semanas</option>
                                                     <option value="Quinzenas">Quinzenas</option>
                                                     <option value="Meses">Meses</option>
                                                     <option value="Bimestres">Bimestres</option>
                                                     <option value="Trimestres">Trimestres</option>
                                                     <option value="Semestres">Semestres</option>
                                                     <option value="Anos">Anos</option>
                                                 </select>
                                             </div>
                                         </div>
                                          {/* Exibe valor calculado da parcela */}
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

            {/* Ações do Modal (Botão Salvar Centralizado) */}
            <div className="p-6 flex justify-center flex-shrink-0">
              <motion.button
                onClick={handleSave}
                className="w-16 h-16 rounded-full bg-finance-lime text-black flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: savingLoading ? 1 : 1.1 }}
                whileTap={{ scale: savingLoading ? 1 : 0.9 }}
                 disabled={isSaveButtonDisabled} // Usa a nova variável de controle
                title="Salvar Lançamento"
              >
                {savingLoading ? (
                    <svg className="animate-spin h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

export default AddTransactionModal;