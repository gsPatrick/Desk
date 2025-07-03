// componentsFinance/Recurrences/RecurrenceTimelineChart.js (NOVO)

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTheme } from 'next-themes';
import { useState, useEffect, useMemo } from 'react';

// Função para gerar dados de projeção mensal de recorrências
const generateRecurrenceProjectionData = (recurrences, numMonths = 6) => {
    const data = [];
    const today = new Date();
    today.setUTCHours(0,0,0,0); // Comparar em UTC

    for (let i = 0; i < numMonths; i++) {
        const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + i, 1));
        const monthEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + i + 1, 0)); // Último dia do mês

        let monthlyRevenue = 0;
        let monthlyExpense = 0;

        recurrences.forEach(rec => {
            // Implementação simplificada: assume que a recorrência ocorre no mês
            // TODO: Lógica mais robusta para calcular ocorrências exatas no mês
            // Baseado na frequência e startDate, calcular as datas das ocorrências dentro do range monthStart - monthEnd
             // Por enquanto, apenas verifica se a data de início da recorrência é antes ou no início do mês de projeção
             // E assume que ela continua ocorrendo mensalmente.
             // Isso NÃO é preciso para frequências diferentes de mensal.
             // UMA IMPLEMENTAÇÃO MELHOR CALCULARIA A PRÓXIMA DATA A PARTIR DE today,
             // E IRIA AVANÇANDO MÊS A MÊS ADICIONANDO VALORES QUANDO HOUVER OCORRÊNCIA NAQUELE MÊS.

             // Exemplo SIMPLES (apenas para visualização do gráfico):
             // Assume mensal e que started antes ou no começo do primeiro mês do gráfico
             // Uma implementação real precisa considerar a frequência e o startDate de cada recorrência
             const recStartDate = rec.startDate ? new Date(rec.startDate + 'T00:00:00Z') : null;
             if (recStartDate && rec.frequency === 'Mensal' && recStartDate <= monthStart) {
                 if (rec.type === 'receita') {
                     monthlyRevenue += rec.amount;
                 } else {
                     monthlyExpense += rec.amount;
                 }
             }
             // Implementar lógica para outras frequências (Semanal, Anual, etc.)
             // Ex: Para Anual, verificar se o aniversário da data de início cai dentro deste mês de projeção
             if (recStartDate && rec.frequency === 'Anual') {
                const anniversaryThisMonth = new Date(Date.UTC(monthStart.getUTCFullYear(), recStartDate.getUTCMonth(), recStartDate.getUTCDate()));
                // Verifica se o aniversário cai no mês correto e se a recorrência já deveria ter começado (após startDate)
                 if (anniversaryThisMonth.getUTCMonth() === monthStart.getUTCMonth() && anniversaryThisMonth >= recStartDate) {
                      // Se for Anual, adiciona o valor total anual naquele mês
                       if (anniversaryThisMonth.getUTCDate() >= monthStart.getUTCDate() && anniversaryThisMonth.getUTCDate() <= monthEnd.getUTCDate()) {
                            if (rec.type === 'receita') {
                                monthlyRevenue += rec.amount;
                            } else {
                                monthlyExpense += rec.amount;
                            }
                       }
                 }
             }


        });

        data.push({
            name: monthStart.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
            receitaRecorrente: monthlyRevenue,
            despesaRecorrente: monthlyExpense,
        });
    }
    return data;
};


// Componente customizado para o Tooltip (a caixa que aparece no hover)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-black/10 dark:border-white/10">
        <p className="label font-bold text-text-primary-light dark:text-text-primary-dark">{`${label}`}</p>
        {payload.map((entry, index) => (
             <p key={`item-${index}`} className={`intro ${entry.color}`}>
                 {`${entry.name}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};


const RecurrenceTimelineChart = ({ recurrences }) => {
  // Hook para detectar o tema atual e evitar erros de hidratação no servidor
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Gere os dados do gráfico com base nas recorrências
  const chartData = useMemo(() => {
     if (!mounted) return []; // Não gerar dados no servidor
     return generateRecurrenceProjectionData(recurrences);
  }, [recurrences, mounted]); // Recalcular se as recorrências ou o estado mounted mudar

  if (!mounted) {
    // Renderiza um placeholder enquanto o tema não foi detectado no cliente
    return <div className="w-full h-full bg-surface-light dark:bg-surface-dark rounded-2xl animate-pulse"></div>;
  }

  const tickColor = resolvedTheme === 'dark' ? 'rgba(248, 246, 235, 0.4)' : 'rgba(19, 19, 18, 0.5)';
  const gridColor = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  return (
     // Removido motion.div externa aqui para que a animação seja aplicada no container da página
    <div className="w-full h-full text-sm"> {/* Adicionado text-sm para escala */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={tickColor}
            fontSize={10} // Ajustado para mobile
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={tickColor}
            fontSize={10} // Ajustado para mobile
            tickLine={false}
            axisLine={false}
             tickFormatter={(value) => {
                 // Formata valores grandes de forma mais compacta
                 if (value >= 1000) return `R$${value/1000}k`;
                 if (value <= -1000) return `-R$${Math.abs(value)/1000}k`;
                 return `R$${value}`;
             }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} formatter={(value) => {
              if(value === 'receitaRecorrente') return 'Receita Recorrente';
              if(value === 'despesaRecorrente') return 'Despesa Recorrente';
              return value;
          }}/>
           {/* Barras para Receita e Despesa Recorrente */}
          <Bar dataKey="receitaRecorrente" stackId="a" fill="#a7cc1a" name="Receita Recorrente"/> {/* Usando finance-lime */}
          <Bar dataKey="despesaRecorrente" stackId="a" fill="#f6339a" name="Despesa Recorrente"/> {/* Usando finance-pink */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RecurrenceTimelineChart;