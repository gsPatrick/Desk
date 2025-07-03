// componentsFinance/Investments/AssetRow.js (NÃO PRECISA ALTERAR ESTE ARQUIVO SE OS AJUSTES JÁ FORAM FEITOS EM InvestmentTerminal.js)
// Este arquivo foi ajustado diretamente em InvestmentTerminal.js para fins de organização na resposta.
// Se você estiver usando este arquivo separadamente, copie os ajustes feitos na função AssetRow acima para cá.

import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

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
        // Ajustado para flex column no mobile e grid no sm+
        // Adicionado gap para mobile e sm+
        // Ajustado padding
        className="flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:gap-4 items-center py-3 px-2 sm:px-4 rounded-lg hover:bg-white/10"
    >
        {/* Indicador de pulso - flex-shrink para mobile, col-span para desktop */}
        <motion.div 
            key={`${item.id}-${item.currentPrice}`} // Reinicia a animação a cada mudança
            className="flex-shrink-0 flex justify-center sm:col-span-1 w-full sm:w-auto" // w-full para centralizar no mobile se o flex for horizontal, w-auto para grid
        >
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {/* Removed animate-ping as per previous comment */}
        </motion.div>
        
        {/* Descrição e Nome - flex-1 para mobile (ocupa espaço), col-span para desktop */}
        <div className="flex-1 min-w-0 sm:col-span-3">
            <p className="font-bold text-white truncate">{item.asset}</p> {/* truncate para textos longos */}
            <p className="text-xs text-white/60 truncate">{item.name}</p> {/* truncate para textos longos */}
        </div>

        {/* Container para Sparkline, Preço, Variação e Total - flex no mobile, col-span no desktop */}
        {/* justify-between para distribuir o espaço no mobile */}
        <div className="flex items-center justify-between w-full sm:col-span-8 gap-2 sm:gap-4"> {/* w-full para mobile */}
             {/* Sparkline - escondido no mobile, mostrado no sm+ */}
            <div className="hidden sm:block sm:col-span-3 w-full sm:w-24 h-8 sm:h-10 -ml-4 sm:-ml-0"> {/* Ajustar ml/mr */}
                <ResponsiveContainer>
                    <LineChart data={item.history.map(value => ({ value }))}>
                        <Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* Preço - flex-1 no mobile (para preencher espaço), text-right */}
            <div className="flex-1 text-right sm:col-span-2 text-sm sm:text-base whitespace-nowrap">
                <p className="font-semibold text-white/90">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.currentPrice)}</p>
            </div>
            {/* Variação - flex-1 no mobile, text-right */}
            <div className={`flex-1 text-right font-semibold text-sm sm:text-base ${isPositive ? 'text-green-400' : 'text-red-400'} whitespace-nowrap`}>
                {isPositive ? '+' : ''}{item.dailyChange.toFixed(2)}%
            </div>
            {/* Total - flex-1 no mobile, text-right, font bold, maior */}
            <div className="flex-1 text-right font-bold text-base sm:text-lg text-white whitespace-nowrap">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
            </div>
        </div>
    </motion.div>
  );
};
export default AssetRow;