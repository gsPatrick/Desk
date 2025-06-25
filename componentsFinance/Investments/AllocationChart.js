// componentsFinance/Investments/AllocationChart.js
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg border border-black/10 dark:border-white/10">
          <p className="font-bold">{`${payload[0].name}`}</p>
          <p>{`Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
          <p>{`Alocação: ${payload[0].payload.percent.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

const AllocationChart = ({ data, totalValue }) => {
  const allocationData = data.map(item => ({...item, percent: (item.value / totalValue) * 100}));
  return (
    <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Alocação de Ativos</h3>
      </div>
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3}>
              {allocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2">
          {allocationData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                  <span className="text-light-subtle dark:text-dark-subtle">{item.name}</span>
              </div>
          ))}
      </div>
    </div>
  );
};
export default AllocationChart;