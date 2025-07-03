// pages/finance/calendar.js (VERSÃO COM MODAL DE AGENDAMENTO)
import { useState, useMemo } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
// Importe o modal correto para agendamentos
import AddCalendarEventModal from '../../componentsFinance/Shared/AddCalendarEventModal'; // <-- IMPORT CORRETO
import CalendarView from '../../componentsFinance/Calendar/CalendarView';
import EventFilters from '../../componentsFinance/Calendar/EventFilters';
import UpcomingEvents from '../../componentsFinance/Calendar/UpcomingEvents';
import { calendarEvents as initialCalendarEvents, eventTypes } from '../../data/financeData'; // Renomeado para usar estado local
import { PlusIcon } from '@heroicons/react/24/solid';

export default function FinanceCalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleTypes, setVisibleTypes] = useState(Object.values(eventTypes));
   // Estado para a lista de eventos, para poder adicionar/remover (simulado)
  const [currentCalendarEvents, setCurrentCalendarEvents] = useState(initialCalendarEvents);
   // Estado para armazenar o evento selecionado para edição (null para adicionar)
  const [selectedEvent, setSelectedEvent] = useState(null);


  const filteredEvents = useMemo(() => {
    return currentCalendarEvents.filter(event => visibleTypes.includes(event.extendedProps.type));
  }, [visibleTypes, currentCalendarEvents]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } };

  // Função para abrir o modal para adicionar um novo evento
  const handleAddEvent = () => {
      setSelectedEvent(null); // Garante que estamos adicionando, não editando
      setIsModalOpen(true);
  }

   // Função para abrir o modal para editar um evento existente
  const handleEditEvent = (event) => {
      setSelectedEvent(event); // Define o evento para edição
      setIsModalOpen(true);
  }

   // Função placeholder para salvar (adicionar ou editar) um evento
   const handleSaveEvent = (eventData) => {
       console.log("Salvando evento:", eventData);
        if (eventData.id && currentCalendarEvents.find(e => e.id === eventData.id)) {
            // Editar evento existente
            setCurrentCalendarEvents(prev => prev.map(e => e.id === eventData.id ? eventData : e));
            alert(`Evento "${eventData.title}" atualizado! (Simulado)`);
        } else {
            // Adicionar novo evento
             // Gerar um ID simples para o novo evento, se ainda não tiver
             const newEvent = { ...eventData, id: eventData.id || `event-${Date.now()}` };
            setCurrentCalendarEvents(prev => [...prev, newEvent]);
            alert(`Evento "${newEvent.title}" adicionado! (Simulado)`);
        }
        setSelectedEvent(null); // Limpa o evento selecionado
        // Fechar modal já é feito dentro do AddCalendarEventModal.js
   }

    // Função placeholder para excluir um evento
   const handleDeleteEvent = (eventId) => {
       console.log("Excluindo evento:", eventId);
       setCurrentCalendarEvents(prev => prev.filter(e => e.id !== eventId));
       alert(`Evento excluído! (Simulado)`);
       setSelectedEvent(null); // Limpa o evento selecionado
        // Fechar modal já é feito dentro do AddCalendarEventModal.js
   }


  return (
    <>
      {/* Removido h-screen e overflow-hidden. Adicionado flex flex-col min-h-screen lg:h-screen lg:overflow-hidden */}
      <div className="bg-light-bg dark:bg-dark-bg flex flex-col min-h-screen lg:h-screen lg:overflow-hidden">
        <Head><title>Calendário | Finance OS</title></Head>
        <FinanceHeader />

        {/* Removido overflow-hidden. Adicionado flex-1 e lg:overflow-hidden */}
        <main className="flex-1 flex flex-col pt-32 pb-10 lg:overflow-hidden">
          {/* Mantido flex-shrink-0 no container do cabeçalho */}
          <motion.div className="container mx-auto px-6 flex-shrink-0" variants={itemVariants} initial="hidden" animate="visible">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Calendário</h1>
                <p className="text-light-subtle dark:text-dark-subtle">Planeje seus pagamentos, recebimentos e projetos.</p>
              </div>
              <motion.button onClick={handleAddEvent} className="flex items-center gap-2 px-4 py-2 bg-finance-pink text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PlusIcon className="h-5 w-5"/> Agendar
              </motion.button>
            </div>
          </motion.div>

          {/* Adicionado flex-1 e lg:overflow-hidden no container do grid principal */}
          <motion.div className="container mx-auto px-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0 lg:overflow-hidden" variants={containerVariants} initial="hidden" animate="visible">

            {/* Coluna Esquerda com Filtros e Próximos Eventos */}
            <div className="lg:col-span-1 h-full flex flex-col gap-8">
              <div className="flex-shrink-0">
                <EventFilters visibleTypes={visibleTypes} setVisibleTypes={setVisibleTypes} />
              </div>
              <div className="flex-1 min-h-0"> {/* min-h-0 para permitir que este flex-item encolha */}
                 {/* Passa a lista atual de eventos */}
                 <UpcomingEvents events={currentCalendarEvents} onEventClick={handleEditEvent}/> {/* Adicionado onEventClick */}
              </div>
            </div>

            {/* Coluna Direita com o Calendário Principal */}
             {/* flex-1 para ocupar espaço no flex-col pai, min-h-0 para evitar transbordamento */}
            <div className="lg:col-span-3 flex-1 min-h-0">
              {/* Passa a lista filtrada e o handler de click no evento */}
              <CalendarView events={filteredEvents} onEventClick={handleEditEvent} /> {/* Adicionado onEventClick */}
            </div>
          </motion.div>
        </main>
      </div>
      {/* Renderiza o modal de Agendamento/Evento, passando o evento selecionado e os handlers */}
      <AddCalendarEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent} // Passa o evento para o modal (null para adicionar)
        onSave={handleSaveEvent} // Passa a função de salvar
        onDelete={handleDeleteEvent} // Passa a função de excluir
      />
    </>
  );
}