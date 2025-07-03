// componentsFinance/Shared/CalendarEventModal.js (REFACTORADO)
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react'; // Importar useEffect
import { eventTypes } from '../../data/financeData'; // Importar eventTypes se necessário para o select

// Mapeamento inverso para obter a chave (string) a partir do valor (string)
const eventTypeKeys = Object.keys(eventTypes).reduce((acc, key) => {
    acc[eventTypes[key]] = key;
    return acc;
}, {});


const CalendarEventModal = ({ isOpen, onClose, event, onSave, onDelete }) => { // Adicionado 'event', 'onSave', 'onDelete' props
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar o modo de edição
    const [formData, setFormData] = useState({ // Estado para os dados do formulário
        title: '',
        date: '',
        details: '',
        type: eventTypes.REUNIAO, // Valor padrão
        amount: '', // Adicionado campo de valor
        // Adicione outros campos conforme seus eventos (ex: location)
    });

    // Efeito para carregar os dados do evento quando ele muda (modo edição)
    useEffect(() => {
        if (event) {
            // Formatar a data para o formato YYYY-MM-DD para inputs type="date"
            const eventDate = event.start ? new Date(event.start) : new Date();
            const formattedDate = eventDate.toISOString().split('T')[0];

            setFormData({
                title: event.title || '',
                date: formattedDate,
                details: event.extendedProps.details || '',
                type: event.extendedProps.type || eventTypes.REUNIAO, // Usar tipo do evento ou padrão
                amount: event.extendedProps.amount ? String(event.extendedProps.amount) : '', // Converter para string para o input
                // Carregar outros campos aqui
            });
            setIsEditing(false); // Começa no modo visualização se um evento é passado
        } else {
            // Resetar para o formulário de adição vazio
            setFormData({
                title: '',
                date: new Date().toISOString().split('T')[0], // Data de hoje como padrão para adição
                details: '',
                type: eventTypes.REUNIAO,
                amount: '',
            });
            setIsEditing(true); // Começa no modo edição para adicionar
        }
    }, [event]); // Roda este efeito sempre que o 'event' prop mudar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Aqui você formataria os dados corretamente (converter valor para número, etc.)
        const eventDataToSave = {
            ...formData,
            amount: formData.amount ? parseFloat(formData.amount) : undefined, // Converter valor para número
             // Incluir o ID se estiver editando um evento existente
            id: event ? event.id : undefined, 
        };
        onSave(eventDataToSave); // Chama a função onSave passada via prop
        onClose(); // Fecha o modal após salvar
    };

     const handleDelete = () => {
        if (event && event.id && onDelete) {
            onDelete(event.id); // Chama a função onDelete com o ID do evento
            onClose(); // Fecha o modal após excluir
        }
    };


    // Determina o título do modal
    const modalTitle = event ? (isEditing ? 'Editar Lançamento/Evento' : 'Detalhes do Lançamento/Evento') : 'Novo Lançamento/Evento';

     // Determina o texto do botão principal e a cor
    const primaryButtonText = event ? (isEditing ? 'Salvar Alterações' : 'Editar') : 'Salvar Lançamento/Evento';
    const primaryButtonColor = event ? (isEditing ? 'bg-blue-600' : 'bg-blue-600') : 'bg-finance-pink'; // Pode ajustar a cor do Editar vs Salvar

    return (
    <AnimatePresence>
      {isOpen && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }} exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh]" // Adicionado flex-col e max-h para scroll interno se o conteúdo for grande
            onClick={(e) => e.stopPropagation()}>
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0"> {/* flex-shrink-0 para não encolher */}
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/></button>
            </div>
            
            {/* Corpo do Formulário com Scroll Interno */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto"> {/* flex-1 overflow-y-auto para scroll */}
              {/* Campo Título */}
               <div>
                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Título</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={!isEditing} placeholder="Ex: Reunião Cliente X / Pagamento Projeto" className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}/>
              </div>

              {/* Campo Data */}
              <div>
                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Data</label>
                 <input type="date" name="date" value={formData.date} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}/>
              </div>

              {/* Campo Tipo (Select) */}
              <div>
                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Tipo</label>
                 <select name="type" value={formData.type} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {/* Mapear os tipos de evento do data/financeData.js */}
                    {Object.values(eventTypes).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                 </select>
              </div>
               
               {/* Campo Valor (Condicional, se for Receita/Despesa) */}
               {(formData.type === eventTypes.RECEITA || formData.type === eventTypes.DESPESA ||
                 formData.type === eventTypes.RECEITA_FUTURA || formData.type === eventTypes.DESPESA_FUTURA) && (
                   <div>
                       <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Valor</label>
                       <input type="number" name="amount" value={formData.amount} onChange={handleChange} disabled={!isEditing} placeholder="Ex: 1500.00" className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}/>
                   </div>
               )}

              {/* Campo Detalhes */}
              <div>
                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Detalhes</label>
                 <textarea name="details" value={formData.details} onChange={handleChange} disabled={!isEditing} placeholder="Ex: Reunião para definir escopo do projeto." className={`w-full h-24 p-2 bg-black/5 dark:bg-white/5 rounded-md resize-none border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}></textarea>
              </div>

               {/* Adicionar outros campos conforme necessário (ex: Recorrência, Local, etc.) */}

            </div>

            {/* Ações do Modal (Footer) */}
            {/* flex-shrink-0 para não encolher */}
            <div className="flex items-center justify-between p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
              {/* Botão de Excluir (visível apenas se estiver editando um evento existente E não no modo edição) */}
               {event && !isEditing && (
                   <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">Excluir</button>
               )}

              {/* Botões Cancelar/Voltar e o botão principal (Editar ou Salvar) */}
              <div className="flex-grow flex justify-end space-x-4"> {/* Mantém os botões agrupados à direita */}
                 {/* Botão Cancelar/Voltar */}
                 {isEditing && event && ( // Mostra "Cancelar" apenas quando editando um evento existente
                     <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Cancelar</button>
                 )}
                  {/* Botão Fechar (Mostra "Fechar" se não estiver editando) */}
                 {!isEditing && (
                      <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Fechar</button>
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

export default CalendarEventModal;