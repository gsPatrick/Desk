// componentsFinance/Investments/AssetDetailPanel.js (COM IMPORTAÇÃO DINÂMICA PARA SSR)

// Importar as dependências que NÃO são do framer-motion diretamente
import { XMarkIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react'; // Precisamos de useState e useEffect para o dynamic import

// Importar dinamicamente AnimatePresence e motion do framer-motion
// Isso garante que só sejam carregados no lado do cliente (browser)
import dynamic from 'next/dynamic';

// Importação dinâmica dos componentes do framer-motion com ssr: false
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });
const AnimatePresence = dynamic(() => import('framer-motion').then(mod => mod.AnimatePresence), { ssr: false });


// Custom Tooltip para o gráfico (Mantido)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-black/70 text-white text-xs rounded-md shadow-lg">
          <p className="font-bold mb-1">{`Ponto: ${label}`}</p> 
          <p>{`Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };


// O componente que contém o conteúdo do modal (agora usa MotionDiv)
const AssetDetailPanelContent = ({ asset, onClose }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const totalValue = asset.quantity * asset.currentPrice;
    const isPositive = asset.dailyChange >= 0;
    // Reverter dados para o gráfico mostrar da esquerda (mais antigo) para a direita (mais recente)
    const chartData = asset.history.map((value, i) => ({ name: `D-${asset.history.length - 1 - i}`, value })).reverse();

    const tickColor = isDarkMode ? 'rgba(248, 246, 235, 0.4)' : 'rgba(19, 19, 18, 0.5)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const lineColor = isPositive ? (isDarkMode ? '#22c55e' : '#16a34a') : (isDarkMode ? '#ef4444' : '#dc2626');

    return (
      // Usar MotionDiv em vez de motion.div
      <MotionDiv
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
           exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
           // Mantido as classes de layout e estilo
           className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh]"
           onClick={(e) => e.stopPropagation()}
      >
          {/* Restante do conteúdo do painel, sem alterações */}
          <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
              <div>
                  <h2 className="text-xl sm:text-2xl font-bold">{asset.asset}</h2>
                  <p className="text-sm sm:text-base text-light-subtle dark:text-dark-subtle">{asset.name}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle" />
              </button>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="name" stroke={tickColor} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis domain={['dataMin', 'dataMax']} stroke={tickColor} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: tickColor, strokeDasharray: '5 5' }} wrapperStyle={{ zIndex: 100 }} />
                        <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/10">
                  <div className="p-2 rounded-md">
                      <p className="text-sm text-light-subtle dark:text-dark-subtle">Posição Total</p>
                      <p className="text-lg sm:text-xl font-bold text-light-text dark:text-dark-text">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</p>
                  </div>
                   <div className="p-2 rounded-md">
                      <p className="text-sm text-light-subtle dark:text-dark-subtle">Variação (24h)</p>
                      <p className={`text-lg sm:text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{isPositive ? '+' : ''}{asset.dailyChange.toFixed(2)}%</p>
                  </div>
                  <div className="p-2 rounded-md">
                      <p className="text-sm text-light-subtle dark:text-dark-subtle">Quantidade</p>
                      <p className="text-lg sm:text-xl font-bold text-light-text dark:text-dark-text">{asset.quantity}</p>
                  </div>
                  <div className="p-2 rounded-md">
                      <p className="text-sm text-light-subtle dark:text-dark-subtle">Preço Médio</p>
                      <p className="text-lg sm:text-xl font-bold text-light-text dark:text-dark-text">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset.avgPrice)}</p>
                  </div>
              </div>
          </div>
      </MotionDiv>
    );
};

// O componente principal que inclui a animação e o overlay (agora usa AnimatePresence dinâmico e MotionDiv)
const AssetDetailPanel = ({ asset, onClose }) => {
     // Adicionado estado mounted para garantir que AnimatePresence só renderize no cliente
     const [mounted, setMounted] = useState(false);
     useEffect(() => setMounted(true), []);

     if (!mounted) return null; // Não renderiza nada no servidor

    return (
        // Usar o AnimatePresence importado dinamicamente
        <AnimatePresence>
            {asset && ( // Renderiza apenas se houver um ativo selecionado
                // Usar MotionDiv para o overlay
                <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // Overlay de fundo que cobre a tela inteira
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose} // Clicar no overlay fecha o modal
                >
                    {/* O conteúdo do modal com animação de entrada/saída já usa MotionDiv internamente */}
                    <AssetDetailPanelContent asset={asset} onClose={onClose} />
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};


export default AssetDetailPanel;