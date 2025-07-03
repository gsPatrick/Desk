// componentsFinance/Investments/InvestmentTerminal.js (AJUSTADO PARA MODAL)

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { PlusIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; 
import AssetDetailPanel from './AssetDetailPanel'; // Importado o painel de detalhes (agora um modal)

// -- COMPONENTE INTERNO: Linha de Ativo (Mantido) --
const AssetRow = ({ item, onAssetClick }) => {
    const totalValue = item.quantity * item.currentPrice;
    const isPositive = item.dailyChange >= 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="py-3 px-2 rounded-lg hover:bg-white/10 cursor-pointer sm:px-4" 
            onClick={() => onAssetClick(item)} 
        >
            {/* --- Layout para Mobile (< sm) --- */}
            <div className="flex items-center justify-between gap-2 sm:hidden">
                 <div className="flex items-center gap-2 flex-grow min-w-0"> 
                    <motion.div key={`${item.id}-${item.currentPrice}-mobile`} className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </motion.div>
                    <div className="flex flex-col flex-1 min-w-0"> 
                        <p className="font-bold text-white text-sm truncate">{item.asset}</p>
                        <p className="text-xs text-white/60 truncate">{item.name}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 flex-shrink-0 text-sm">
                     <p className="font-bold text-base text-white whitespace-nowrap">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</p>
                     <ChevronRightIcon className="h-5 w-5 text-white/50" />
                 </div>
            </div>

            {/* --- Layout para Desktop (>= sm) --- */}
            <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                <div className="sm:col-span-1 flex justify-center"> 
                     <motion.div key={`${item.id}-${item.currentPrice}-desktop`} className="w-4 h-4 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </motion.div>
                </div>
                 <div className="sm:col-span-3"> 
                    <p className="font-bold text-white truncate">{item.asset}</p>
                    <p className="text-xs text-white/60 truncate">{item.name}</p>
                </div>
                <div className="sm:col-span-2 w-full h-8 -ml-4 sm:-ml-0"> 
                    <ResponsiveContainer>
                        <LineChart data={item.history.map(value => ({ value }))}>
                            <Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="sm:col-span-2 text-right text-sm sm:text-base whitespace-nowrap">
                    <p className="font-semibold text-white/90">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.currentPrice)}</p>
                </div>
                <div className={`sm:col-span-1 text-right font-semibold text-sm sm:text-base ${isPositive ? 'text-green-400' : 'text-red-400'} whitespace-nowrap`}>
                    {isPositive ? '+' : ''}{item.dailyChange.toFixed(2)}%
                </div>
                <div className="sm:col-span-3 text-right font-bold text-base sm:text-lg text-white whitespace-nowrap">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                </div>
                 {/* Removemos o ícone daqui no desktop, pois a linha toda é clicável */}
            </div>
        </motion.div>
    );
};


// -- COMPONENTE PRINCIPAL: O Terminal (AJUSTADO) --
const InvestmentTerminal = ({ investments, onAdd }) => {
  const assetTypes = ['Todos', 'Ações', 'Cripto', 'Renda Fixa', 'Custom'];
  const [activeTab, setActiveTab] = useState('Todos');
  const [selectedAsset, setSelectedAsset] = useState(null); // Estado para o ativo selecionado

  const filteredInvestments = useMemo(() =>
    activeTab === 'Todos' ? investments : investments.filter(inv => inv.type === activeTab)
  , [activeTab, investments]);

  const { totalValue } = useMemo(() => {
    const total = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
    return { totalValue: total };
  }, [investments]);
  
  // Função para abrir o painel de detalhes
  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    // setIsDetailPanelOpen(true); // Não precisamos mais deste estado, AssetDetailPanel gerencia sua visibilidade
  };

  // Função para fechar o painel de detalhes
  const handleCloseDetailPanel = () => {
    setSelectedAsset(null); // Limpar o ativo selecionado para fechar o modal
  };


  return (
    <motion.div
      // Mantido flex-1 e lg:overflow-y-auto
      // Removida a classe 'relative' pois o modal agora é fixo na tela inteira
      className="bg-black/20 dark:bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col flex-1 lg:overflow-y-auto" 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
        {/* Header do Terminal - Mantido */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-b border-white/10 flex-shrink-0 gap-4 sm:gap-0">
            <div className="text-center sm:text-left">
                <p className="text-white/60 text-sm sm:text-base">Patrimônio Investido</p> 
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</p>
            </div>
        </div>

        {/* Barra de Ferramentas: Filtros e Ações - Mantido */}
        <div className="p-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between border-b border-white/10 flex-shrink-0 gap-3 sm:gap-0">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center sm:justify-start">
                {assetTypes.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="relative px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-md text-white/70 hover:text-white transition-colors">
                    {activeTab === tab && <motion.div layoutId="active-invest-terminal-tab" className="absolute inset-0 bg-white/10 rounded-md" />}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
            </div>
            <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-500 transition-colors">
                <PlusIcon className="h-4 w-4"/> Adicionar Ativo
            </button>
        </div>

        {/* Tabela de Ativos - Scroll interno no desktop mantido */}
        {/* Conteúdo da lista de ativos */}
        <div className="p-2 sm:p-4"> 
            {/* Cabeçalho da "tabela" - escondido no mobile, grid no sm+ */}
            <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 text-white/60 text-xs font-semibold px-4 pb-2 border-b border-white/10">
                <div className="sm:col-span-1"></div> {/* Pulse column */}
                <div className="sm:col-span-3">Ativo</div>
                <div className="sm:col-span-2">Gráfico (7d)</div>
                <div className="sm:col-span-2 text-right">Preço</div>
                <div className="sm:col-span-1 text-right">Var.</div>
                <div className="sm:col-span-3 text-right">Posição</div>
            </div>
             {/* Lista de Ativos */}
            <AnimatePresence>
                {filteredInvestments.length > 0 ? (
                    filteredInvestments.map(item => (
                        // Passar a prop onAssetClick para cada AssetRow
                        <AssetRow key={item.id} item={item} onAssetClick={handleAssetClick} />
                    ))
                ) : (
                     <p className="text-center text-white/50 py-10 text-sm">
                        Nenhum ativo encontrado com os filtros selecionados.
                    </p>
                )}
            </AnimatePresence>
        </div>

        {/* Renderizar o modal de detalhes do ativo */}
        {/* AssetDetailPanel agora gerencia seu próprio overlay e visibilidade com base em `asset` */}
        <AssetDetailPanel asset={selectedAsset} onClose={handleCloseDetailPanel} />

    </motion.div>
  );
};

export default InvestmentTerminal;