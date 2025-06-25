// componentsFinance/Dashboard/CashFlowChart.js

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

// Dados de exemplo para o gráfico. Em um projeto real, isso viria de uma API.
const data = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  { name: 'Mar', receita: 9800, despesa: 2000 },
  { name: 'Abr', receita: 3908, despesa: 2780 },
  { name: 'Mai', receita: 4800, despesa: 1890 },
  { name: 'Jun', receita: 3800, despesa: 2390 },
];

// Componente customizado para o Tooltip (a caixa que aparece no hover)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-black/10 dark:border-white/10">
        <p className="label font-bold text-text-primary-light dark:text-text-primary-dark">{`${label}`}</p>
        <p className="intro text-finance-lime">{`Receita: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
        <p className="intro text-finance-pink">{`Despesa: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

const CashFlowChart = () => {
  // Hook para detectar o tema atual e evitar erros de hidratação no servidor
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Renderiza um placeholder enquanto o tema não foi detectado no cliente
    return <div className="lg:col-span-2 h-96 bg-surface-light dark:bg-surface-dark rounded-2xl animate-pulse"></div>;
  }

  const tickColor = resolvedTheme === 'dark' ? 'rgba(248, 246, 235, 0.4)' : 'rgba(19, 19, 18, 0.5)';
  const gridColor = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <motion.div
      className="lg:col-span-2 h-96 bg-surface-light dark:bg-surface-dark p-4 sm:p-6 rounded-2xl border border-border-light dark:border-white/10"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 px-2">Fluxo de Caixa Mensal</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a7cc1a" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#a7cc1a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f6339a" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#f6339a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke={tickColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke={tickColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `R$${value/1000}k`} 
          />
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          <Area type="monotone" dataKey="receita" stroke="#a7cc1a" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" />
          <Area type="monotone" dataKey="despesa" stroke="#f6339a" strokeWidth={2} fillOpacity={1} fill="url(#colorDespesa)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CashFlowChart;