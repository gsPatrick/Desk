// componentsFinance/Investments/InvestmentTerminal.js

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { PlusIcon } from '@heroicons/react/24/solid';

// -- COMPONENTE INTERNO: Linha de Ativo --
const AssetRow = ({ item }) => {
    const totalValue = item.quantity * item.currentPrice;
    const isPositive = item.dailyChange >= 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-white/10"
        >
            {/* Indicador de pulso */}
            <motion.div 
                key={`${item.id}-${item.currentPrice}`} // Reinicia a animação a cada mudança
                className="col-span-1 flex justify-center"
            >
                <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className={`absolute w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'} animate-ping`}></div>
            </motion.div>
            
            <div className="col-span-3">
                <p className="font-bold text-white">{item.asset}</p>
                <p className="text-xs text-white/60 truncate">{item.name}</p>
            </div>
            <div className="col-span-3 w-24 h-8 -ml-4">
                <ResponsiveContainer>
                    <LineChart data={item.history.map(value => ({ value }))}>
                        <Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="col-span-2 text-right">
                <p className="font-semibold text-white/90">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.currentPrice)}</p>
            </div>
            <div className={`col-span-1 text-right font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{item.dailyChange.toFixed(2)}%
            </div>
            <div className="col-span-2 text-right font-bold text-lg text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</div>
        </motion.div>
    );
};

// -- COMPONENTE INTERNO: Gráfico Sunburst --
const SunburstChart = ({ allocation }) => (
    <div className="w-36 h-36">
        <ResponsiveContainer>
            <PieChart>
                <Pie data={allocation} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={50}>
                    {allocation.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" opacity={0.6} />)}
                </Pie>
                <Pie data={[{value:1}]} dataKey="value" cx="50%" cy="50%" outerRadius={45} fill="rgba(255,255,255,0.05)" />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

// -- COMPONENTE PRINCIPAL: O Terminal --
const InvestmentTerminal = ({ investments, onAdd }) => {
  const assetTypes = ['Todos', 'Ações', 'Cripto', 'Renda Fixa', 'Custom'];
  const [activeTab, setActiveTab] = useState('Todos');

  const filteredInvestments = useMemo(() =>
    activeTab === 'Todos' ? investments : investments.filter(inv => inv.type === activeTab)
  , [activeTab]);

  const { totalValue, allocation } = useMemo(() => {
    const total = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
    const alloc = assetTypes.slice(1).map(type => {
        const totalByType = investments.filter(i => i.type === type).reduce((s,i) => s + i.quantity * i.currentPrice, 0);
        const colors = {'Ações': '#3b82f6', 'Cripto': '#f59e0b', 'Renda Fixa': '#10b981', 'Custom': '#8b5cf6'};
        return { name: type, value: totalByType, color: colors[type] };
    }).filter(a => a.value > 0);
    return { totalValue: total, allocation: alloc };
  }, [investments]);
  
  return (
    <motion.div 
      className="bg-black/20 dark:bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
        {/* Header do Terminal */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div>
                <p className="text-white/60">Patrimônio Investido</p>
                <p className="text-4xl font-extrabold text-white tracking-tighter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</p>
            </div>
            <SunburstChart allocation={allocation} />
        </div>

        {/* Barra de Ferramentas: Filtros e Ações */}
        <div className="p-3 flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-1">
                {assetTypes.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="relative px-3 py-1.5 text-xs font-semibold rounded-md text-white/70 hover:text-white transition-colors">
                    {activeTab === tab && <motion.div layoutId="active-invest-terminal-tab" className="absolute inset-0 bg-white/10 rounded-md" />}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
            </div>
            <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-500 transition-colors">
                <PlusIcon className="h-4 w-4"/> Adicionar
            </button>
        </div>

        {/* Tabela de Ativos */}
        <div className="flex-1 overflow-y-auto">
            <div className="p-2">
                <AnimatePresence>
                    {filteredInvestments.map(item => <AssetRow key={item.id} item={item} />)}
                </AnimatePresence>
            </div>
        </div>
    </motion.div>
  );
};

export default InvestmentTerminal;