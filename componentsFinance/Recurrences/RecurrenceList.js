// componentsFinance/Recurrences/RecurrenceList.js (PEQUENO AJUSTE)
import { motion, AnimatePresence } from 'framer-motion';
import RecurrenceItem from './RecurrenceItem';

const RecurrenceList = ({ recurrences, onEditRecurrence }) => { // Recebe onEditRecurrence
  const containerVariants = {
    visible: { transition: { staggerChildren: 0.05 } }
  };

  return (
    <motion.div
      className="flex flex-col" // Removido bg/padding/border para ficar apenas a lista
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {recurrences.length > 0 ? (
        <AnimatePresence>
          {recurrences.map(recurrence => (
            <RecurrenceItem
                key={recurrence.id}
                recurrence={recurrence}
                onEditRecurrence={onEditRecurrence} // Repassa o handler de edição
            />
          ))}
        </AnimatePresence>
      ) : (
        <p className="text-center text-light-subtle dark:text-dark-subtle py-10">
          Nenhum lançamento recorrente encontrado.
        </p>
      )}
    </motion.div>
  );
};

export default RecurrenceList;