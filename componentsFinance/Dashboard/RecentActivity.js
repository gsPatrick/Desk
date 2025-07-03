// componentsFinance/Dashboard/RecentActivity.js (MODIFICADO)
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNowStrict, isToday, isYesterday, format } from 'date-fns'; // Importe funções de data
import { ptBR } from 'date-fns/locale'; // Importe o locale português

// Função para formatar a data de forma amigável
const formatActivityDate = (dateString) => {
    if (!dateString) return '';
     try {
        const date = new Date(dateString + 'T00:00:00Z'); // Trata como UTC para evitar offset local
        const now = new Date();
        now.setUTCHours(0,0,0,0); // Compara com UTC 0 de hoje

        const dateOnly = new Date(date); // Apenas a data, sem hora
        dateOnly.setUTCHours(0,0,0,0);

        if (isToday(dateOnly)) {
            return 'Hoje';
        }
        if (isYesterday(dateOnly)) {
            return 'Ontem';
        }
         // Adicionado limite para evitar frases longas como "há 365 dias"
         const distance = formatDistanceToNowStrict(date, { addSuffix: true, locale: ptBR, unit: 'day' });
         if (distance.includes('ano') || distance.includes('meses') || distance.includes('mais de') || parseInt(distance.split(' ')[0], 10) > 30) {
              return format(date, 'dd/MM/yyyy'); // Formato mais simples para datas antigas
         }

        // Remove "há" e "atrás" da string e formata para português
        return distance.replace('há ', '').replace(' atrás', '');

     } catch (e) {
         console.error("Erro ao formatar data da atividade:", dateString, e);
         return dateString; // Retorna a string original em caso de erro
     }
};


// Componente para um item de atividade (Mantido, mas usará dados reais)
const ActivityItem = ({ activity }) => {
  const isIncome = activity.type === 'income'; // API retorna 'income'/'expense'
  const formattedDate = formatActivityDate(activity.date); // Formata a data

  return (
    <motion.div
      className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5 last:border-b-0"
      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
    >
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? 'bg-finance-lime/10' : 'bg-finance-pink/10'}`}>
          {isIncome ? <PlusIcon className="h-4 w-4 text-finance-lime" /> : <MinusIcon className="h-4 w-4 text-finance-pink" />}
        </div>
        <div>
          <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">{activity.description}</p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{formattedDate}</p>
        </div>
      </div>
      {/* Formata o valor e adiciona o sinal */}
      <p className={`font-semibold text-sm ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
        {isIncome ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(activity.amount)}
      </p>
    </motion.div>
  );
};

// Aceita a lista de atividades da API via prop
const RecentActivity = ({ activities = [] }) => { // Default para array vazio
  return (
    <motion.div
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-white/10 flex flex-col h-full" // Added h-full flex flex-col
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex-shrink-0">Atividade Recente</h3> {/* flex-shrink-0 */}
      {/* flex-1 para ocupar o espaço restante, -mx-6 px-6 para padding interno */}
      <motion.div
        className="flex-1 -mx-6 px-6 overflow-y-auto" // overflow-y-auto para scroll interno
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {activities.length > 0 ? (
          activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
           <p className="text-sm text-center text-light-subtle dark:text-dark-subtle mt-4">Nenhuma atividade recente.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RecentActivity;