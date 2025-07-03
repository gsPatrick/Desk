// componentsFinance/Transactions/SummaryChart.js
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ transactions }) => {
  // Simula um balanço ao longo do tempo para o gráfico
  const chartData = transactions.slice().reverse().reduce((acc, tx) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1].balanco : 0;
    const currentAmount = tx.type === 'receita' ? tx.amount : -tx.amount;
    // Inclui lançamentos futuros no balanço projetado
    const newBalance = lastBalance + currentAmount; 
    
    acc.push({ 
      date: new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      balanco: newBalance,
    });
    return acc;
  }, []);
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-black/70 text-white text-xs rounded-md shadow-lg">
          <p className="font-bold mb-1">{`Data: ${label}`}</p>
          <p className="text-blue-300">{`Balanço: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="h-48 sm:h-64 w-full" // Added w-full to ensure container takes full width
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {/* Ajustado left margin para dar espaço aos rótulos do eixo Y */}
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 0 }}> 
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
             dataKey="date" 
             stroke="rgba(255,255,255,0.3)" 
             fontSize={10} // Fonte menor para mobile
             tickLine={false} 
             axisLine={false} 
             padding={{ left: 10, right: 10 }} // Adiciona padding nas pontas do eixo X
           />
          <YAxis 
             stroke="rgba(255,255,255,0.3)" 
             fontSize={10} // Fonte menor para mobile
             tickLine={false} 
             axisLine={false} 
             tickFormatter={(value) => {
                 // Formata valores grandes de forma mais compacta
                 if (value >= 1000) return `R$${value/1000}k`;
                 if (value <= -1000) return `-R$${Math.abs(value)/1000}k`;
                 return `R$${value}`;
             }} 
          />
          <Tooltip
            content={<CustomTooltip />} // Usa o tooltip customizado
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // Fundo sutil no cursor
          />
          <Area type="monotone" dataKey="balanco" stroke="#3b82f6" strokeWidth={2} fill="url(#balanceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TimelineChart;