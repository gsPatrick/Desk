// componentsFinance/Dashboard/StatCard.js
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon }) => {
  return (
    <motion.div
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-white/10 h-full flex flex-col justify-center"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{title}</p>
        {icon}
      </div>
      <p className="mt-2 text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{value}</p>
    </motion.div>
  );
};

export default StatCard;