// componentsFinance/Dashboard/DashboardHero.js
import { motion } from 'framer-motion';
import { BanknotesIcon } from '@heroicons/react/24/solid';

const DashboardHero = () => {
  return (
    <motion.div
      className="relative w-full p-8 mb-8 overflow-hidden text-center rounded-3xl bg-finance-pink"
      variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
    >
      {/* Padrão de fundo sutil */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/noise.svg)', backgroundSize: '200px' }}></div>
      
      <motion.p 
        className="mb-2 text-lg font-medium text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Saldo Líquido Atual
      </motion.p>
      
      <motion.h2
        className="text-6xl md:text-7xl font-black text-white tracking-tighter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      >
        R$ 10.320,80
      </motion.h2>
    </motion.div>
  );
};

export default DashboardHero;