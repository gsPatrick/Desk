// pages/finance/calendar.js (VERSÃO "INTELLIGENCE HUB")
import { useState, useMemo } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import AddTransactionModal from '../../componentsFinance/Transactions/AddTransactionModal';
import CalendarView from '../../componentsFinance/Calendar/CalendarView';
import EventFilters from '../../componentsFinance/Calendar/EventFilters';
import UpcomingEvents from '../../componentsFinance/Calendar/UpcomingEvents'; // Importe o componente de volta
import { calendarEvents, eventTypes } from '../../data/financeData';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function FinanceCalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleTypes, setVisibleTypes] = useState(Object.values(eventTypes));
  
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(event => visibleTypes.includes(event.extendedProps.type));
  }, [visibleTypes]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } };

  return (
    <>
      <div className="bg-light-bg dark:bg-dark-bg h-screen flex flex-col overflow-hidden">
        <Head><title>Calendário | Finance OS</title></Head>
        <FinanceHeader />

        <main className="flex-1 flex flex-col pt-32 pb-10 overflow-hidden">
          <motion.div className="container mx-auto px-6" variants={itemVariants} initial="hidden" animate="visible">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Calendário</h1>
                <p className="text-light-subtle dark:text-dark-subtle">Planeje seus pagamentos, recebimentos e projetos.</p>
              </div>
              <motion.button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-finance-pink text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PlusIcon className="h-5 w-5"/> Agendar
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="container mx-auto px-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0" variants={containerVariants} initial="hidden" animate="visible">
            
            {/* Coluna Esquerda com Filtros e Próximos Eventos */}
            <div className="lg:col-span-1 h-full flex flex-col gap-8">
              <div className="flex-shrink-0">
                <EventFilters visibleTypes={visibleTypes} setVisibleTypes={setVisibleTypes} />
              </div>
              <div className="flex-1 min-h-0">
                 <UpcomingEvents events={calendarEvents} />
              </div>
            </div>

            {/* Coluna Direita com o Calendário Principal */}
            <div className="lg:col-span-3 h-full">
              <CalendarView events={filteredEvents} />
            </div>
          </motion.div>
        </main>
      </div>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}