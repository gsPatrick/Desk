// componentsFinance/Shared/ActionCard.js (NOVO)
import { motion } from 'framer-motion';

const ActionCard = ({ title, value, subValue, buttonText, icon, accentColor, onButtonClick }) => {
  return (
    <motion.div
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-white/10 flex flex-col justify-between h-full"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{title}</p>
          {icon}
        </div>
        <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{value}</p>
        {subValue && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{subValue}</p>}
      </div>
      <motion.button 
        onClick={onButtonClick}
        className={`w-full mt-4 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${accentColor}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
};

export default ActionCard;