// componentsFinance/Calendar/UpcomingEvents.js
import { motion } from 'framer-motion';
import { eventTypes } from '../../data/financeData';

const eventTypeStyles = {
    [eventTypes.RECEITA]: 'bg-finance-lime', [eventTypes.RECEITA_FUTURA]: 'bg-finance-lime',
    [eventTypes.DESPESA]: 'bg-finance-pink', [eventTypes.DESPESA_FUTURA]: 'bg-finance-pink',
    [eventTypes.REUNIAO]: 'bg-blue-500', [eventTypes.SPRINT]: 'bg-violet-500',
    [eventTypes.PROJETO]: 'bg-yellow-500', [eventTypes.RECORRENCIA]: 'bg-orange-500',
};

const EventItem = ({ event }) => (
    <motion.div className="flex items-start gap-4 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
        <div className={`w-1.5 h-10 mt-1 rounded-full ${eventTypeStyles[event.extendedProps.type] || 'bg-gray-400'}`}></div>
        <div>
            <p className="font-semibold text-light-text dark:text-dark-text">{event.title}</p>
            <p className="text-sm text-light-subtle dark:text-dark-subtle">{new Date(event.start).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</p>
        </div>
    </motion.div>
);

const UpcomingEvents = ({ events }) => {
    const upcoming = events
        .filter(event => new Date(event.start) > new Date())
        .sort((a,b) => new Date(a.start) - new Date(b.start))
        .slice(0, 5);

    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex-shrink-0">Próximos Eventos</h3>
            <div className="flex-1 space-y-2 overflow-y-auto -mr-2 pr-2">
                {upcoming.length > 0 ? (
                  upcoming.map(event => <EventItem key={event.id} event={event}/>)
                ) : (
                  <p className="text-sm text-center text-light-subtle dark:text-dark-subtle mt-4">Nenhum evento futuro.</p>
                )}
            </div>
        </div>
    );
};
export default UpcomingEvents;