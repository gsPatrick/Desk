// componentsFinance/Dashboard/CashFlowChart.js (AJUSTADO: Adicionado log para apiData)

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { useState, useEffect, useMemo } from 'react';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente customizado para o Tooltip (a caixa que aparece no hover) (Mantido)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-black/10 dark:border-white/10">
        <p className="label font-bold text-text-primary-light dark:text-text-primary-dark">{`${label}`}</p>
        {/* Garante que 'receita' e 'despesa' existem no payload */}
        {payload.find(p => p.dataKey === 'receita') && (
             <p className="intro text-finance-lime">{`Receita: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload.find(p => p.dataKey === 'receita').value)}`}</p>
        )}
        {payload.find(p => p.dataKey === 'despesa') && (
             <p className="intro text-finance-pink">{`Despesa: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload.find(p => p.dataKey === 'despesa').value)}`}</p>
        )}
      </div>
    );
  }
  return null;
};

// Aceita os dados da API via prop `apiData`
const CashFlowChart = ({ apiData = [] }) => { // Default para array vazio para evitar erro
  // Hook para detectar o tema atual e evitar erros de hidratação no servidor
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

   // --- LOG PARA DIAGNÓSTICO ---
   // Verifique no console do navegador o que está sendo recebido aqui.
   console.log('[CashFlowChart] Received apiData:', apiData);


   // --- Transformação dos dados da API para o formato do gráfico ---
   const chartData = useMemo(() => {
       // apiData esperado: [{ month: 'YYYY-MM', type: 'income'|'expense', total: number }]
       const formattedData = {};
       apiData.forEach(item => {
           // CORRIGIDO: Adiciona verificação se item e item.month existem e se item.month é string
           if (item && typeof item.month === 'string') {
               // Usa o month 'YYYY-MM' para garantir a ordem cronológica na chave
               if (!formattedData[item.month]) {
                   const [year, month] = item.month.split('-').map(Number); // Divide 'YYYY-MM' e converte para números
                   // Verifica se a conversão foi bem-sucedida antes de criar a data
                   if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
                        const dateForFormatting = new Date(year, month - 1, 1); // Cria Date (mês é 0-indexado)

                        formattedData[item.month] = {
                            name: format(dateForFormatting, 'MMM', { locale: ptBR }), // Formata o objeto Date válido
                            receita: 0,
                            despesa: 0
                        };
                   } else {
                       console.warn("[CashFlowChart] Skipping invalid month format:", item.month);
                       return; // Pula este item se o formato do mês for inválido
                   }
               }
               // Verifica se type e total existem antes de somar
               if (item.type && item.total !== undefined && item.total !== null) {
                    if (item.type === 'income') {
                        formattedData[item.month].receita += parseFloat(item.total);
                    } else if (item.type === 'expense') {
                        formattedData[item.month].despesa += parseFloat(item.total);
                    }
               } else {
                   console.warn("[CashFlowChart] Skipping item with missing type or total:", item);
               }
           } else {
               console.warn("[CashFlowChart] Skipping invalid cash flow data item (missing month or invalid type):", item);
           }
       });

       // Converte o objeto formatado para um array e ordena pelas chaves (datas)
       return Object.keys(formattedData).sort().map(key => formattedData[key]);

   }, [apiData]); // Recalcula se apiData mudar


  if (!mounted) {
    // Renderiza um placeholder enquanto o tema não foi detectado no cliente
    // Pode ser um spinner ou um esqueleto
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
      {chartData.length > 0 ? (
           <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
                tickFormatter={(value) => `R$${value >= 1000 ? value/1000 + 'k' : value}`} // Formata valores grandes
              />
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Area type="monotone" dataKey="receita" stroke="#a7cc1a" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" />
              <Area type="monotone" dataKey="despesa" stroke="#f6339a" strokeWidth={2} fillOpacity={1} fill="url(#colorDespesa)" />
            </AreaChart>
          </ResponsiveContainer>
      ) : (
           <div className="flex items-center justify-center h-full">
               <p className="text-text-secondary-light dark:text-text-secondary-dark">Nenhum dado de fluxo de caixa disponível.</p>
           </div>
      )}
    </motion.div>
  );
};

export default CashFlowChart;