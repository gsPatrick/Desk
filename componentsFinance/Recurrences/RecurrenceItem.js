// componentsFinance/Recurrences/RecurrenceItem.js (AJUSTADO PARA LAYOUT GRID)
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, PencilSquareIcon } from '@heroicons/react/24/solid'; // Ícones
import { ClockIcon } from '@heroicons/react/24/outline'; // Ícone Clock para recorrência

// Função auxiliar para formatar data
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Remove a parte do fuso horário para garantir que Date() interprete corretamente no UTC 0
    const cleanDateString = dateString.split('T')[0]; 
    try {
       const date = new Date(cleanDateString + 'T00:00:00Z'); // Adiciona T00:00:00Z para tratar como UTC
       const options = { year: 'numeric', month: 'long', day: 'numeric' };
       // toLocaleDateString com fuso horário UTC para evitar offset local
       return date.toLocaleDateString('pt-BR', { ...options, timeZone: 'UTC' }); 
    } catch (e) {
        console.error("Erro ao formatar data:", dateString, e);
        return 'Data Inválida';
    }
};


// Função para calcular a próxima ocorrência real (simulada)
const calculateNextOccurrence = (startDate, frequency) => {
    if (!startDate || !frequency) return 'N/A';
     // Remove a parte do fuso horário para garantir que Date() interprete corretamente no UTC 0
     const cleanStartDateString = startDate.split('T')[0];
    try {
        // Trata a data de início como UTC 0 para evitar problemas de fuso horário
        const start = new Date(cleanStartDateString + 'T00:00:00Z');
        const today = new Date();
        today.setUTCHours(0,0,0,0); // Usar UTC para comparar com datas tratadas como UTC

        let next = new Date(start); // Começa com a data de início

        // Se a data de início já passou, avança para a próxima ocorrência
        // Garante que mesmo recorrências que começaram no passado mostrem a próxima data correta
        while (next <= today) {
             const currentDay = next.getUTCDate(); // Usa getUTCDate
             const currentMonth = next.getUTCMonth(); // Usa getUTCMonth
             const currentYear = next.getUTCFullYear(); // Usa getUTCFullYear

             switch (frequency) {
                case 'Mensal':
                    next.setUTCMonth(currentMonth + 1); // Usa setUTCMonth
                    // Corrige problemas de fim de mês (ex: 31 jan + 1 mês = 3 mar -> corrige para 28/29 fev)
                    if (next.getUTCDate() !== currentDay) {
                         next.setUTCDate(0); // Define para o último dia do mês anterior
                         next.setUTCDate(next.getUTCDate() + 1); // Adiciona 1 para ir para o primeiro dia do mês atual
                          // Define para o último dia do mês calculado
                          next = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0));
                    }
                    break;
                case 'Semanal':
                    next.setUTCDate(currentDay + 7); // Usa setUTCDate
                    break;
                case 'Trimestral':
                     next.setUTCMonth(currentMonth + 3); // Usa setUTCMonth
                     // Aplicar mesma correção de fim de mês se necessário
                     if (next.getUTCDate() !== currentDay) {
                         next = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0));
                     }
                    break;
                case 'Anual':
                    next.setUTCFullYear(currentYear + 1); // Usa setUTCFullYear
                     // Aplicar mesma correção de fim de mês se necessário
                     if (next.getUTCDate() !== currentDay) {
                         next = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0));
                     }
                    break;
                // Adicionar outros casos
                default:
                     // Se a frequência for desconhecida, retornamos N/A ou a data de início se futura
                     if (start > today) return `Próx: ${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}`;
                     return 'N/A';
            }
             // Se a data calculada ainda não passou, saímos do loop
             if (next > today) break;
        }

         // Formata a próxima data encontrada, garantindo UTC
         return `Próx: ${next.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}`;

    } catch (e) {
         console.error("Erro ao calcular próxima ocorrência:", startDate, frequency, e);
         return 'Cálculo Inválido';
    }
};


// Status (mantido, mas pode ser adaptado)
const RecurrenceStatusBadge = ({ status }) => {
    // Adapte os status conforme a lógica real de recorrências (ex: Ativa, Pausada)
    const statusClasses = {
      Ativa: 'bg-green-500/10 text-green-400',
      Pausada: 'bg-yellow-500/10 text-yellow-400',
      // Outros status como Cancelada, Finalizada
    };
     // Um status padrão se não houver um status específico de recorrência nos dados
     const displayStatus = status || 'Ativa'; // Assumindo 'Ativa' se não houver status específico
     return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[displayStatus] || 'bg-gray-500/10 text-gray-400'}`}>{displayStatus}</span>;
};


const RecurrenceItem = ({ recurrence, onEditRecurrence }) => {
  const isIncome = recurrence.type === 'receita';

  // Calcula a próxima ocorrência usando a nova função
  const nextOccurrence = calculateNextOccurrence(recurrence.startDate, recurrence.frequency);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      // Adicionado group para hover no botão de editar
      // Usamos grid sm:grid-cols-12 para alinhar com o cabeçalho da "tabela"
      className="group flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center py-4 px-2 sm:px-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors gap-3 sm:gap-4 border-b border-black/5 dark:border-white/5 last:border-b-0"
    >
      {/* Coluna 1: Ícone (Recorrência ou Tipo) */}
      {/* sm:col-span-1 para ocupar a primeira coluna no grid */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center sm:col-span-1 mr-2 sm:mr-0 text-blue-400"> {/* Ícone de recorrência */}
         <ClockIcon className="h-6 w-6" /> {/* Usar ícone de relógio para indicar recorrência */}
      </div>

      {/* Coluna 2: Descrição e Categoria */}
      {/* sm:col-span-3 para ocupar 3 colunas no grid */}
      <div className="flex-1 sm:col-span-3 min-w-0">
        <p className="font-semibold text-light-text dark:text-dark-text truncate">{recurrence.description}</p>
        <p className="text-sm text-light-subtle dark:text-dark-subtle truncate">{recurrence.category || 'Sem Categoria'}</p>
      </div>

      {/* Coluna 3: Valor */}
      {/* sm:col-span-2 e text-right para alinhar na terceira coluna */}
      <div className={`font-bold text-sm sm:text-base whitespace-nowrap sm:col-span-2 text-left sm:text-right ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recurrence.amount)}
      </div>

      {/* Coluna 4: Frequência */}
      {/* sm:col-span-2 e text-center para alinhar na quarta coluna */}
       <div className="text-sm text-light-subtle dark:text-dark-subtle whitespace-nowrap sm:col-span-2 text-left sm:text-center">
           {recurrence.frequency || 'N/A'}
       </div>

      {/* Coluna 5: Próxima Ocorrência */}
      {/* sm:col-span-2 e text-center para alinhar na quinta coluna */}
      <div className="text-sm text-light-subtle dark:text-dark-subtle whitespace-nowrap sm:col-span-2 text-left sm:text-center">
          {nextOccurrence}
      </div>

      {/* Coluna 6: Ações (Botão Editar) */}
      {/* sm:col-span-2 e justify-end para alinhar na última coluna */}
      <div className="sm:col-span-2 flex justify-end items-center gap-2 w-full sm:w-auto">
           {/* Botão de Editar - Visível no hover do item pai */}
           <button
               onClick={() => onEditRecurrence && onEditRecurrence(recurrence)}
               className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-light-subtle dark:text-dark-subtle transition-opacity sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
           >
              <PencilSquareIcon className="h-5 w-5" />
          </button>
      </div>
    </motion.div>
  );
};

export default RecurrenceItem;