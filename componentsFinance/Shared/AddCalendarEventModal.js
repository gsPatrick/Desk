// componentsFinance/Shared/AddCalendarEventModal.js (REFACTORADO PARA AGENDAMENTO)
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { CheckIcon } from '@heroicons/react/24/outline'; // Ícone de check
import { useState, useEffect } from 'react';
import { eventTypes } from '../../data/financeData'; // Importar eventTypes

const AddCalendarEventModal = ({ isOpen, onClose, event, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar o modo de edição
    const [formData, setFormData] = useState({ // Estado para os dados do formulário
        title: '',
        date: new Date().toISOString().split('T')[0], // Data de hoje como padrão
        type: eventTypes.REUNIAO, // Tipo/Categoria padrão para agendamento
        observation: '', // Campo de observação
        customType: '', // Campo para quando "Outro..." é selecionado no tipo
    });

    // Estado para controlar a visibilidade do campo de observação e do campo customType
    const [showObservationField, setShowObservationField] = useState(false);
    const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);


    // Efeito para carregar os dados do evento quando ele muda (modo edição)
    useEffect(() => {
        if (event) {
            // Formatar a data para o formato YYYY-MM-DD para inputs type="date"
            const eventDate = event.start ? new Date(event.start) : new Date();
            const formattedDate = eventDate.toISOString().split('T')[0];

            // Verificar se o tipo do evento existe na lista padrão
            const isPredefinedType = Object.values(eventTypes).includes(event.extendedProps.type);

            setFormData({
                title: event.title || '',
                date: formattedDate,
                // Se o tipo for predefinido, use-o, caso contrário, selecione "Outro..." e preencha o customType
                type: isPredefinedType ? event.extendedProps.type : 'Outro...',
                customType: isPredefinedType ? '' : (event.extendedProps.type || ''), // Preenche customType se não for predefinido
                observation: event.extendedProps.details || '', // Usando 'details' como 'observation'
            });
            setShowCustomTypeInput(!isPredefinedType); // Mostra input customizado se o tipo não for predefinido
            // Decide se mostra a observação ao carregar o evento (se já tiver conteúdo)
            setShowObservationField(!!event.extendedProps.details);

            setIsEditing(false); // Começa no modo visualização se um evento é passado
        } else {
            // Resetar para o formulário de adição vazio
            setFormData({
                title: '',
                date: new Date().toISOString().split('T')[0],
                type: eventTypes.REUNIAO,
                observation: '',
                customType: '',
            });
            setShowObservationField(false); // Esconde observação por padrão na adição
            setShowCustomTypeInput(false); // Esconde input customizado por padrão na adição
            setIsEditing(true); // Começa no modo edição para adicionar
        }
    }, [event]); // Roda este efeito sempre que o 'event' prop mudar

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev.formData, [name]: value }));
    };

     // Handler específico para a mudança do campo Tipo/Categoria
    const handleTypeSelectChange = (e) => {
        const selectedType = e.target.value;
        setFormData(prev => ({
             ...prev,
             type: selectedType,
             customType: selectedType === 'Outro...' ? prev.customType : '', // Limpa customType se não for "Outro..."
        }));
        setShowCustomTypeInput(selectedType === 'Outro...'); // Mostra/esconde input customizado
    };

    const handleToggleObservation = () => {
        setShowObservationField(prev => !prev);
        // Opcional: Limpar observação ao esconder? Decidimos manter o texto.
    }


    const handleSave = () => {
        // Validar dados
        const finalType = formData.type === 'Outro...' ? formData.customType : formData.type;
        if (!formData.title || !formData.date || !finalType || (formData.type === 'Outro...' && !formData.customType)) {
            alert("Por favor, preencha Título, Data e Tipo/Categoria.");
            return;
        }

        // Preparar dados para salvar
        const eventDataToSave = {
            // Incluir ID se estiver editando
            id: event ? event.id : `event-${Date.now()}`, // ID simulado para novos eventos
            title: formData.title,
            start: formData.date, // FullCalendar usa 'start' para data/hora
            extendedProps: { // Detalhes adicionais vão aqui
                type: finalType, // Usa o tipo selecionado ou o customizado
                details: formData.observation, // Salva observação como 'details'
                 // Remover 'amount' e outros campos financeiros
            },
             // Campos adicionais que FullCalendar pode usar (opcional)
             allDay: true, // Assumindo que agendamentos são para o dia todo, ajuste se tiver hora
        };

        console.log("Dados do evento a salvar:", eventDataToSave); // Simula o salvamento

        if (onSave) {
             onSave(eventDataToSave); // Chama a função onSave
        }

        onClose(); // Fecha o modal
    };

     const handleDelete = () => {
        if (event && event.id && onDelete) {
            console.log("Excluindo evento:", event.id); // Simula exclusão
            onDelete(event.id); // Chama a função onDelete
            onClose(); // Fecha o modal
        }
    };


    // Determina o título do modal
    const modalTitle = event ? (isEditing ? 'Editar Agendamento' : 'Detalhes do Agendamento') : 'Novo Agendamento';

     // Determina o texto do botão principal e a cor
    const primaryButtonText = event ? (isEditing ? 'Salvar Alterações' : 'Editar') : 'Salvar Agendamento';
    const primaryButtonColor = event ? (isEditing ? 'bg-blue-600' : 'bg-blue-600') : 'bg-finance-pink';


    // Opções para o dropdown de Tipo/Categoria
    // Adiciona "Outro..." no final
    const typeOptions = [...Object.values(eventTypes), 'Outro...'];


    return (
    <AnimatePresence>
      {isOpen && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }} exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh] sm:max-h-none" // Ajustes de altura e scroll
            onClick={(e) => e.stopPropagation()}>

            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/></button>
            </div>

            {/* Corpo do Formulário - Scroll apenas no mobile */}
             {/* flex-1 ocupa espaço, overflow-y-auto no mobile, visible no desktop */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto sm:overflow-visible">

              {/* Campo Título */}
               <div>
                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Título</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={!isEditing && !!event} // Desabilita se não estiver editando E for um evento existente
                    placeholder="Ex: Reunião Cliente X"
                    className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${(!isEditing && !!event) ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>

              {/* Campo Data */}
              <div>
                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Data</label>
                 <div className="relative">
                     <input
                         type="date"
                         name="date"
                         value={formData.date}
                         onChange={handleInputChange}
                         disabled={!isEditing && !!event} // Desabilita se não estiver editando E for um evento existente
                         className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 appearance-none ${(!isEditing && !!event) ? 'opacity-70 cursor-not-allowed' : ''}`}
                     />
                      {/* Ícone de calendário visual */}
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-subtle dark:text-dark-subtle pointer-events-none"/>
                 </div>
              </div>

              {/* Campo Tipo / Categoria */}
              <div>
                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Tipo / Categoria</label>
                 <select
                    name="type"
                    value={formData.type}
                    onChange={handleTypeSelectChange} // Usa handler específico para o tipo
                    disabled={!isEditing && !!event} // Desabilita se não estiver editando E for um evento existente
                    className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none ${(!isEditing && !!event) ? 'opacity-70 cursor-not-allowed' : ''}`}
                 >
                    <option value="" disabled>Selecione um tipo/categoria</option>
                    {/* Mapear os tipos de evento + "Outro..." */}
                    {typeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                 </select>
                 {/* Campo customizado de tipo/categoria (condicional) */}
                 <AnimatePresence>
                     {showCustomTypeInput && (
                         <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                             className="mt-2 overflow-hidden"
                         >
                              <input
                                  type="text"
                                  name="customType"
                                  value={formData.customType}
                                  onChange={handleInputChange}
                                  disabled={!isEditing && !!event} // Desabilita se não estiver editando E for um evento existente
                                  placeholder="Nome da nova categoria (ex: Treinamento)"
                                  className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${(!isEditing && !!event) ? 'opacity-70 cursor-not-allowed' : ''}`}
                              />
                         </motion.div>
                     )}
                 </AnimatePresence>
              </div>


              {/* Botão de Observação */}
               {/* Centralizado com um gap maior */}
                 <div className="flex items-center justify-center gap-12 py-4 border-y border-black/5 dark:border-white/10">
                      {/* Botão Observação */}
                     <button onClick={handleToggleObservation} disabled={!isEditing && !!event} className={`flex flex-col items-center text-sm text-light-subtle dark:text-dark-subtle transition-colors ${(!isEditing && !!event) ? 'opacity-70 cursor-not-allowed' : 'hover:text-light-text dark:hover:text-dark-text'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showObservationField || (!!event?.extendedProps?.details && !isEditing) ? 'bg-blue-600 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                             <ChatBubbleLeftRightIcon className="h-6 w-6"/>
                         </div>
                         <span className="mt-1">Observação</span>
                     </button>
                      {/* Botão Repetir (Removido daqui, era do modal de Transação) */}
                 </div>

                 {/* Campo Observação (Condicional) */}
                 <AnimatePresence>
                      {/* Mostra se estiver no modo edição OU se o evento existente já tiver observação */}
                     {(showObservationField || (!!event?.extendedProps?.details && !isEditing)) && (
                         <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             transition={{ duration: 0.3, ease: 'easeInOut' }}
                             className="space-y-2 overflow-hidden" // Oculta o conteúdo que sai
                         >
                             <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Observação</label>
                             <textarea
                                 name="observation"
                                 value={formData.observation}
                                 onChange={handleInputChange}
                                 disabled={!isEditing && !!event} // Desabilita se não estiver editando E for um evento existente
                                 placeholder="Adicione detalhes sobre o agendamento aqui..."
                                 rows={3} // Altura inicial
                                 className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md resize-y border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${(!isEditing && !!event) ? 'opacity-70 cursor-not-allowed' : ''}`}
                             ></textarea>
                         </motion.div>
                     )}
                 </AnimatePresence>

                {/* Seção de Repetição/Parcelamento removida, pois é específica de lançamentos financeiros */}


            </div>

            {/* Ações do Modal (Footer) */}
            {/* Flex justify-between para alinhar botões na esquerda e direita */}
            <div className="flex items-center justify-between p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
               {/* Botão de Excluir (visível apenas se estiver editando um evento existente E não no modo edição) */}
               {event && !isEditing && (
                   <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">Excluir</button>
               )}

              {/* Botões Cancelar/Voltar e o botão principal (Editar ou Salvar) */}
              <div className="flex-grow flex justify-end space-x-4"> {/* Mantém os botões agrupados à direita */}
                 {/* Botão Cancelar/Voltar */}
                 {isEditing && event && ( // Mostra "Cancelar" apenas quando editando um evento existente
                     <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-light-text dark:text-dark-text">Cancelar</button>
                 )}
                  {/* Botão Fechar (Mostra "Fechar" se não estiver editando E NÃO for um novo agendamento) */}
                 {!isEditing && event && ( // Mostra "Fechar" apenas no modo visualização de um evento existente
                      <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-light-text dark:text-dark-text">Fechar</button>
                 )}
                 {/* Botão principal (Editar ou Salvar) */}
                 {/* Se for um evento existente E não estiver editando, mostra o botão "Editar" */}
                 {/* Se for um evento existente E estiver editando, ou se for um NOVO evento (isEditing é true), mostra o botão "Salvar" */}
                 {(!event || isEditing) ? (
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

export default AddCalendarEventModal;