// pages/finance/dashboard.js

import Head from 'next/head';
import { useState, useMemo } from 'react'; // Adicionado useMemo
import { motion } from 'framer-motion';

// Componentes do Dashboard
import StatCard from '../../componentsFinance/Dashboard/StatCard';
import CashFlowChart from '../../componentsFinance/Dashboard/CashFlowChart';
import RecentActivity from '../../componentsFinance/Dashboard/RecentActivity';
import CreditCardBill from '../../componentsFinance/Dashboard/CreditCardBill';
import BillsToPay from '../../componentsFinance/Dashboard/BillsToPay';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ClockIcon } from '@heroicons/react/24/outline';

// Componentes Globais e da Dock
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import FinanceDock from '../../componentsFinance/Dock/FinanceDock';

// Importando TODOS os Modais
import AddTransactionModal from '../../componentsFinance/Shared/AddTransactionModal';
import AddCardExpenseModal from '../../componentsFinance/Shared/AddCardExpenseModal';
import AddCalendarEventModal from '../../componentsFinance/Shared/AddCalendarEventModal';
import AddInvestmentModal from '../../componentsFinance/Shared/AddInvestmentModal';
import DockSettingsModal from '../../componentsFinance/Shared/DockSettingsModal';

// Definindo os atalhos disponíveis e iniciais da Dock
const ALL_DOCK_ACTIONS = [
  { id: 'add-transaction', label: 'Novo Lançamento', iconName: 'PlusCircleIcon', iconColor: 'text-white' },
  { id: 'add-recurrence', label: 'Nova Recorrência', iconName: 'ArrowPathIcon', iconColor: 'text-cyan-300' },
  { id: 'add-card-expense', label: 'Gasto no Cartão', iconName: 'CreditCardIcon', iconColor: 'text-blue-300' },
  { id: 'add-calendar-event', label: 'Agendar Evento', iconName: 'CalendarDaysIcon', iconColor: 'text-purple-300' },
  { id: 'add-investment', label: 'Novo Investimento', iconName: 'BeakerIcon', iconColor: 'text-amber-300' },
  { id: 'quick-cards', label: 'Ver Cartões', iconName: 'RectangleStackIcon', iconColor: 'text-indigo-300' }, // Adicionado para exemplo de item disponível
  { id: 'quick-note', label: 'Nota Rápida', iconName: 'ClipboardDocumentIcon', iconColor: 'text-yellow-300' }, // Adicionado para exemplo
];

const INITIAL_DOCK_ITEM_IDS = ['add-transaction', 'add-card-expense', 'add-calendar-event'];


export default function FinanceDashboardPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [dockLayout, setDockLayout] = useState('default'); 
  const [dockItems, setDockItems] = useState(
    INITIAL_DOCK_ITEM_IDS.map(id => ALL_DOCK_ACTIONS.find(action => action.id === id)).filter(Boolean)
  );
  const [dockHasBackground, setDockHasBackground] = useState(true);

  const availableItems = useMemo(() => 
    ALL_DOCK_ACTIONS.filter(action => !dockItems.find(item => item.id === action.id))
  , [dockItems]);

  const handleDockAction = (actionId) => {
    setActiveModal(actionId);
  };

  const handleAddItemToDock = (itemId) => {
    const itemToAdd = ALL_DOCK_ACTIONS.find(action => action.id === itemId);
    if (itemToAdd && !dockItems.find(item => item.id === itemId)) {
      setDockItems(prev => [...prev, itemToAdd]);
    }
  };

  const handleRemoveItemFromDock = (itemId) => {
    setDockItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleMoveItemInDock = (index, direction) => {
    const newItems = [...dockItems];
    const item = newItems[index];
    newItems.splice(index, 1); // Remove o item da posição atual
    if (direction === 'up' && index > 0) {
      newItems.splice(index - 1, 0, item); // Insere na posição anterior
    } else if (direction === 'down' && index < dockItems.length -1) { // Corrigido para dockItems.length - 1
      newItems.splice(index + 1, 0, item); // Insere na posição seguinte
    } else if (direction === 'up' && index === 0) {
        newItems.unshift(item); // Se for o primeiro e mover para cima, mantém no início
    } else if (direction === 'down' && index === dockItems.length -1) {
        newItems.push(item); // Se for o último e mover para baixo, mantém no final
    }
    setDockItems(newItems);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    },
  };

  return (
    <>
      <div className="bg-finance-cream dark:bg-finance-black h-screen flex flex-col overflow-hidden">
        <Head>
          <title>Dashboard | Finance OS</title>
        </Head>
        
        <FinanceHeader />

        <main className="flex-1 overflow-y-auto">
          <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header de Saldo */}
            <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="text-center mb-8">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Saldo Líquido Atual</p>
              <p className="text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tighter">R$ 10.320,80</p>
            </motion.div>
            
            {/* Grid Principal do Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-3 gap-6">
              <div className="lg:col-span-1"><StatCard title="Receita (Mês)" value="R$ 7.850,00" icon={<ArrowTrendingUpIcon className="h-6 w-6 text-green-500"/>} /></div>
              <div className="lg:col-span-1"><StatCard title="Despesas (Mês)" value="R$ 2.130,00" icon={<ArrowTrendingDownIcon className="h-6 w-6 text-red-500"/>} /></div>
              <div className="lg:col-span-1"><StatCard title="A Receber (Próx. 30d)" value="R$ 12.500,00" icon={<ClockIcon className="h-6 w-6 text-blue-500"/>} /></div>
              <div className="lg:col-span-1"><BillsToPay /></div>
              <div className="lg:col-span-2 lg:row-span-2"><CashFlowChart /></div>
              <div className="lg:col-span-1 lg:row-span-2"><RecentActivity /></div>
              <div className="lg:col-span-1 lg:row-span-2"><CreditCardBill /></div>
            </div>
          </motion.div>
        </main>

        <FinanceDock 
            onIconClick={handleDockAction} 
            layoutStyle={dockLayout} 
            items={dockItems}
            hasBackground={dockHasBackground}
        />
      </div>

      {/* Seção de renderização condicional para todos os modais */}
      <AddTransactionModal 
        isOpen={activeModal === 'add-transaction' || activeModal === 'add-recurrence'} 
        onClose={() => setActiveModal(null)} 
      />
      <AddCardExpenseModal 
        isOpen={activeModal === 'add-card-expense'} 
        onClose={() => setActiveModal(null)} 
      />
      <AddCalendarEventModal 
        isOpen={activeModal === 'add-calendar-event'} 
        onClose={() => setActiveModal(null)} 
      />
      <AddInvestmentModal 
        isOpen={activeModal === 'add-investment'} 
        onClose={() => setActiveModal(null)} 
      />
      <DockSettingsModal 
        isOpen={activeModal === 'dock-settings'} 
        onClose={() => setActiveModal(null)}
        currentLayout={dockLayout}
        onLayoutChange={setDockLayout}
        currentItems={dockItems}
        availableItems={availableItems}
        onAddItem={handleAddItemToDock}
        onRemoveItem={handleRemoveItemFromDock}
        onMoveItem={handleMoveItemInDock}
        hasBackground={dockHasBackground}
        onToggleBackground={() => setDockHasBackground(prev => !prev)}
      />
    </>
  );
}