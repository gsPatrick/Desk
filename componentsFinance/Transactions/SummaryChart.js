// componentsFinance/Transactions/SummaryChart.js
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ transactions }) => {
  // Simula um balanço ao longo do tempo para o gráfico
  const chartData = transactions.slice().reverse().reduce((acc, tx) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1].balanco : 0;
    const currentAmount = tx.type === 'receita' ? tx.amount : -tx.amount;
    const newBalance = tx.forecast ? lastBalance : lastBalance + currentAmount;
    
    acc.push({ 
      date: new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      balanco: newBalance,
    });
    return acc;
  }, []);
  
  return (
    <motion.div
      className="h-64"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
          <Tooltip
            contentStyle={{
              background: 'rgba(30,30,30,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(5px)',
            }}
            itemStyle={{ color: '#f0f0f0' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="balanco" stroke="#3b82f6" strokeWidth={2} fill="url(#balanceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TimelineChart;