// componentsFinance/Investments/AssetDetailPanel.js
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AssetDetailPanel = ({ asset, onClose }) => {
    const totalValue = asset.quantity * asset.currentPrice;
    const isPositive = asset.dailyChange >= 0;
    const chartData = asset.history.map((value, i) => ({ name: `D-${asset.history.length - 1 - i}`, value }));

    return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: '0%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute top-0 right-0 w-full md:w-2/5 h-full bg-light-surface dark:bg-dark-surface border-l border-black/5 dark:border-white/10 flex flex-col"
    >
      <div className="p-6 flex items-center justify-between border-b border-black/5 dark:border-white/10">
        <div>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">{asset.asset}</h2>
            <p className="text-light-subtle dark:text-dark-subtle">{asset.name}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><XMarkIcon className="h-6 w-6" /></button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis domain={['dataMin', 'dataMax']} stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'rgba(30,30,30,0.8)', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                <p className="text-sm text-light-subtle dark:text-dark-subtle">Posição Total</p>
                <p className="text-xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</p>
            </div>
             <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                <p className="text-sm text-light-subtle dark:text-dark-subtle">Variação (24h)</p>
                <p className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{isPositive ? '+' : ''}{asset.dailyChange.toFixed(2)}%</p>
            </div>
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                <p className="text-sm text-light-subtle dark:text-dark-subtle">Quantidade</p>
                <p className="text-xl font-bold">{asset.quantity}</p>
            </div>
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                <p className="text-sm text-light-subtle dark:text-dark-subtle">Preço Médio</p>
                <p className="text-xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset.avgPrice)}</p>
            </div>
        </div>
      </div>

      <div className="p-6 border-t border-black/5 dark:border-white/10 flex gap-4">
        <button className="flex-1 py-3 bg-finance-lime text-white font-bold rounded-lg">Comprar</button>
        <button className="flex-1 py-3 bg-finance-pink text-white font-bold rounded-lg">Vender</button>
      </div>
    </motion.div>
  );
};
export default AssetDetailPanel;