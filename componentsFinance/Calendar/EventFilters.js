// componentsFinance/Calendar/EventFilters.js (DESIGN FINAL E ROBUSTO)
import { motion } from 'framer-motion';
import { eventTypes } from '../../data/financeData';
import { CheckIcon } from '@heroicons/react/24/solid';

const eventTypeStyles = {
    [eventTypes.RECEITA]: 'bg-finance-lime', [eventTypes.RECEITA_FUTURA]: 'bg-finance-lime',
    [eventTypes.DESPESA]: 'bg-finance-pink', [eventTypes.DESPESA_FUTURA]: 'bg-finance-pink',
    [eventTypes.REUNIAO]: 'bg-blue-500', [eventTypes.SPRINT]: 'bg-violet-500',
    [eventTypes.PROJETO]: 'bg-yellow-500', [eventTypes.RECORRENCIA]: 'bg-orange-500',
};

const EventFilters = ({ visibleTypes, setVisibleTypes }) => {
    const toggleType = (type) => {
        setVisibleTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };
    
    // Agrupa os filtros para um layout de 2 colunas
    const filterGroups = [
      [eventTypes.RECEITA, eventTypes.DESPESA, eventTypes.RECEITA_FUTURA, eventTypes.DESPESA_FUTURA],
      [eventTypes.RECORRENCIA, eventTypes.PROJETO, eventTypes.REUNIAO, eventTypes.SPRINT]
    ];

    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex-shrink-0">Filtrar Eventos</h3>
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {Object.values(eventTypes).map(type => {
                        const isChecked = visibleTypes.includes(type);
                        return (
                            <label key={type} htmlFor={`filter-${type}`} className="flex items-center gap-3 cursor-pointer group">
                                <div className="flex-shrink-0 relative w-5 h-5">
                                    <input
                                        id={`filter-${type}`}
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleType(type)}
                                        className="appearance-none w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 checked:bg-dark-accent checked:border-dark-accent transition-all duration-200 group-hover:border-dark-accent"
                                    />
                                    {isChecked && <div className="absolute inset-0 flex items-center justify-center text-white">✓</div>}
                                </div>
                                <span className="text-sm font-medium text-light-text dark:text-dark-text">{type}</span>
                                <div className={`w-2 h-2 ml-auto rounded-full ${eventTypeStyles[type]}`}></div>
                            </label>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default EventFilters;