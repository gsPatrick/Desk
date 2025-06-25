// componentsFinance/Investments/InvestmentRow.js
import { motion } from 'framer-motion';
import Sparkline from './Sparkline';

const InvestmentRow = ({ item }) => {
  const totalValue = item.quantity * item.currentPrice;
  const isPositive = item.dailyChange >= 0;

  return (
    <motion.div
      className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="col-span-3">
        <p className="font-bold text-light-text dark:text-dark-text">{item.asset}</p>
        <p className="text-sm text-light-subtle dark:text-dark-subtle truncate">{item.name}</p>
      </div>
      <div className="col-span-2 text-light-text dark:text-dark-text">{item.quantity}</div>
      <div className="col-span-2 text-light-text dark:text-dark-text">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.currentPrice)}</div>
      <div className={`col-span-2 font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{isPositive ? '+' : ''}{item.dailyChange.toFixed(2)}%</div>
      <div className="col-span-1"><Sparkline data={item.history} color={isPositive ? '#22c55e' : '#ef4444'} /></div>
      <div className="col-span-2 font-bold text-light-text dark:text-dark-text text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</div>
    </motion.div>
  );
};
export default InvestmentRow;