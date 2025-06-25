// componentsFinance/Calendar/CalendarView.js

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css'; // Tema elegante para o tooltip
import { eventTypes } from '../../data/financeData';

const CalendarView = ({ events }) => {

    // Função que o FullCalendar chama para cada evento para determinar suas classes CSS.
    // Esta é a forma mais moderna e confiável de aplicar estilos dinâmicos.
    const eventClassNames = (arg) => {
        const type = arg.event.extendedProps.type;
        // Mapeia o tipo do evento para um nome de classe CSS.
        // É CRUCIAL que estes nomes de classe não tenham espaços.
        const classMap = {
            [eventTypes.RECEITA]: 'event-Receita',
            [eventTypes.RECEITA_FUTURA]: 'event-Receita-Futura',
            [eventTypes.DESPESA]: 'event-Despesa',
            [eventTypes.DESPESA_FUTURA]: 'event-Despesa-Futura',
            [eventTypes.REUNIAO]: 'event-Reuniao',
            [eventTypes.SPRINT]: 'event-Sprint',
            [eventTypes.PROJETO]: 'event-Projeto',
            [eventTypes.RECORRENCIA]: 'event-Recorrencia',
        };
        // Retorna um array com o nome da classe correspondente.
        return [classMap[type] || ''];
    };
    
    // Usamos useMemo para otimizar a performance. O array de eventos só será
    // recalculado se a prop 'events' mudar, evitando re-renderizações desnecessárias.
    const memoizedEvents = useMemo(() => events, [events]);

    // Hook do FullCalendar que é chamado depois que um evento é montado no DOM.
    // É o lugar ideal para inicializar bibliotecas de terceiros como o Tippy.js.
    const handleEventDidMount = (info) => {
        const props = info.event.extendedProps;
        
        // Constrói o conteúdo HTML para o tooltip
        let content = `<div class="p-1 text-sm">
                         <strong class="text-white">${info.event.title}</strong>
                         <br/>
                         <span class="text-gray-300">Tipo: ${props.type}</span>`;
        
        if (props.amount) {
            content += `<br/><span class="text-gray-300">Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.amount)}</span>`;
        }
        if (props.location) {
            content += `<br/><span class="text-gray-300">Local: ${props.location}</span>`;
        }
        content += `</div>`;
        
        // Cria a instância do Tippy.js no elemento do evento.
        tippy(info.el, {
            content: content,
            allowHTML: true,
            theme: 'translucent', // Tema escuro e translúcido
            placement: 'top',
            arrow: true,
            animation: 'scale-subtle', // Uma animação sutil
        });
    };

    return (
        <motion.div 
            className="bg-light-surface dark:bg-dark-surface p-4 sm:p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full text-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={memoizedEvents}
                locale='pt-br'
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: '' // Deixamos vazio para um visual mais limpo
                }}
                buttonText={{
                    today: 'Hoje',
                }}
                height="100%" // Garante que o calendário ocupe toda a altura do container pai
                eventClassNames={eventClassNames} // Aplica as classes dinâmicas
                eventDidMount={handleEventDidMount} // Adiciona o tooltip quando o evento é montado
                dayMaxEventRows={true} // Evita que os dias fiquem muito altos
                views={{
                    dayGridMonth: {
                        dayMaxEventRows: 2 // Mostra no máximo 2 eventos por dia, depois "+X mais"
                    }
                }}
            />
        </motion.div>
    );
};

export default CalendarView;