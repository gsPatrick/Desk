// componentsFinance/Investments/AssetCard.js (REFINADO)
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const AssetCard = ({ item }) => {
  const totalValue = item.quantity * item.currentPrice;
  const isPositive = item.dailyChange >= 0;

  return (
    <motion.div
      className="grid grid-cols-6 gap-4 items-center p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
      variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
      transition={{ duration: 0.3 }}
    >
      <div className="col-span-2 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex-shrink-0 bg-black/5 dark:bg-white/5 flex items-center justify-center font-bold text-light-text dark:text-dark-text`}>
          {item.asset.substring(0, 1)}
        </div>
        <div>
          <p className="font-bold text-light-text dark:text-dark-text">{item.asset}</p>
          <p className="text-sm text-light-subtle dark:text-dark-subtle truncate">{item.name}</p>
        </div>
      </div>

      <div className="col-span-1 h-10 -ml-4">
        <ResponsiveContainer>
          <LineChart data={item.history.map(value => ({ value }))}>
            <Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 text-right">
        <p className="font-semibold text-light-text dark:text-dark-text">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.currentPrice)}</p>
      </div>

      <div className="col-span-1 text-right">
         <p className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{isPositive ? '+' : ''}{item.dailyChange.toFixed(2)}%</p>
      </div>

      <div className="col-span-1 text-right">
        <p className="font-bold text-lg text-light-text dark:text-dark-text">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</p>
      </div>
    </motion.div>
  );
};
export default AssetCard;