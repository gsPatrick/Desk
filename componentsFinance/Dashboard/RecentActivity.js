// componentsFinance/Dashboard/RecentActivity.js
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const activities = [
    { id: 1, type: 'receita', description: 'Pagamento Projeto X', date: 'Hoje', amount: '+ R$ 4.500,00' },
    { id: 2, type: 'despesa', description: 'Assinatura Adobe', date: 'Ontem', amount: '- R$ 129,90' },
    { id: 3, type: 'despesa', description: 'Almoço com cliente', date: '2 dias atrás', amount: '- R$ 85,50' },
    { id: 4, type: 'receita', description: 'Consultoria H. Extra', date: '3 dias atrás', amount: '+ R$ 800,00' },
];

// O resto do seu componente...
const ActivityItem = ({ activity }) => {
  const isIncome = activity.type === 'receita';
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
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{activity.date}</p>
        </div>
      </div>
      <p className={`font-semibold text-sm ${isIncome ? 'text-green-500' : 'text-red-500'}`}>{activity.amount}</p>
    </motion.div>
  );
};

const RecentActivity = () => {
  return (
    <motion.div 
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-white/10 flex flex-col"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Atividade Recente</h3>
      <motion.div 
        className="flex-1 -mx-6 px-6 overflow-y-auto"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {activities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default RecentActivity;