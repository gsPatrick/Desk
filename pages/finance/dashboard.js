// pages/finance/dashboard.js (MODIFICADO)

import Head from 'next/head';
import { useState, useMemo, useEffect } from 'react'; // Importado useEffect
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'; // Importado useRouter

// Importar hook de API e hook de autenticação
import useDashboardData from '../../hooks/useDashboardData'; // Ajuste o caminho conforme sua estrutura
import useAuth from '../../hooks/useAuth'; // Importa o hook useAuth

// Componentes do Dashboard (mantidos)
import StatCard from '../../componentsFinance/Dashboard/StatCard';
import CashFlowChart from '../../componentsFinance/Dashboard/CashFlowChart';
import RecentActivity from '../../componentsFinance/Dashboard/RecentActivity';
import BillsToPayWidget from '../../componentsFinance/Dashboard/BillsToPay';
import CreditCardBill from '../../componentsFinance/Dashboard/CreditCardBill';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ClockIcon } from '@heroicons/react/24/outline';

// Componentes Globais e da Dock (mantidos)
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import FinanceDock from '../../componentsFinance/Dock/FinanceDock';

// Importando TODOS os Modais (mantidos)
import AddTransactionModal from '../../componentsFinance/Shared/AddTransactionModal';
import AddCardExpenseModal from '../../componentsFinance/Shared/AddCardExpenseModal';
import AddCalendarEventModal from '../../componentsFinance/Shared/AddCalendarEventModal';
import AddInvestmentModal from '../../componentsFinance/Shared/AddInvestmentModal';
import DockSettingsModal from '../../componentsFinance/Shared/DockSettingsModal';
import AddCreditCardModal from '../../componentsFinance/Shared/AddCreditCardModal';


// Definindo os atalhos disponíveis e iniciais da Dock (mantido)
const ALL_DOCK_ACTIONS = [
  { id: 'add-transaction', label: 'Novo Lançamento', iconName: 'PlusCircleIcon', iconColor: 'text-white' },
  { id: 'add-recurrence', label: 'Nova Recorrência', iconName: 'ArrowPathIcon', iconColor: 'text-cyan-300' },
  { id: 'add-card-expense', label: 'Gasto no Cartão', iconName: 'CreditCardIcon', iconColor: 'text-blue-300' },
  { id: 'add-calendar-event', label: 'Agendar Evento', iconName: 'CalendarDaysIcon', iconColor: 'text-purple-300' },
  { id: 'add-investment', label: 'Novo Investimento', iconName: 'BeakerIcon', iconColor: 'text-amber-300' },
  { id: 'add-credit-card', label: 'Novo Cartão', iconName: 'RectangleStackIcon', iconColor: 'text-indigo-300' },
  { id: 'quick-cards', label: 'Ver Cartões', iconName: 'RectangleStackIcon', iconColor: 'text-indigo-300' },
  { id: 'quick-note', label: 'Nota Rápida', iconName: 'ClipboardDocumentIcon', iconColor: 'text-yellow-300' },
];

const INITIAL_DOCK_ITEM_IDS = ['add-transaction', 'add-card-expense', 'add-calendar-event', 'add-credit-card'];


export default function FinanceDashboardPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [dockLayout, setDockLayout] = useState('default');
  const [dockItems, setDockItems] = useState(
    INITIAL_DOCK_ITEM_IDS.map(id => ALL_DOCK_ACTIONS.find(action => action.id === id)).filter(Boolean)
  );
  const [dockHasBackground, setDockHasBackground] = useState(true);

  // --- Obter estado de autenticação do contexto ---
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- Hook para buscar dados da API (agora usa o ID real do usuário) ---
  const { data: dashboardData, loading: dashboardLoading, error } = useDashboardData(user?.id); // Passa user.id se o user existir

  // --- Redirecionar se não estiver autenticado (APÓS o loading inicial da autenticação) ---
  useEffect(() => {
      if (!authLoading && !isAuthenticated) {
          router.push('/auth/login');
      }
  }, [authLoading, isAuthenticated, router]); // Depende do estado de auth e do router

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
    } else if (direction === 'down' && index < dockItems.length -1) {
      newItems.splice(index + 1, 0, item);
    } else if (direction === 'up' && index === 0) {
        newItems.unshift(item);
    } else if (direction === 'down' && index === dockItems.length -1) {
        newItems.push(item);
    }
    setDockItems(newItems);
  };

  // Placeholder para a função de salvar o novo cartão
  const handleSaveCreditCard = (newCardData) => {
      console.log("Dados do novo cartão salvos:", newCardData);
      alert(`Cartão "${newCardData.name}" (Final ${newCardData.final}) salvo com sucesso! (Simulado)`);
      // TODO: Chamar API para salvar o cartão
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    },
  };

  // --- Tratamento de estados: Loading, Erro, Dados ---
  // Exibe "Carregando..." enquanto a autenticação ou os dados do dashboard estão carregando
  // ou se o usuário não está autenticado mas a autenticação inicial ainda está verificando.
  if (authLoading || !isAuthenticated || dashboardLoading) {
      return (
          <div className="flex items-center justify-center h-screen bg-finance-cream dark:bg-finance-black text-light-text dark:text-dark-text">
              Carregando...
          </div>
      );
  }

  // Se houver erro após o carregamento (e o usuário estiver autenticado)
  if (error) {
      return (
          <div className="flex items-center justify-center h-screen bg-finance-cream dark:bg-finance-black text-red-500">
              Erro ao carregar dados do dashboard: {error.message}
          </div>
      );
  }

  // Se não houver dados (pode acontecer se a API retornar sucesso mas sem dados,
  // ou se for um usuário novo sem dados financeiros)
  if (!dashboardData) {
       return (
          <div className="flex items-center justify-center h-screen bg-finance-cream dark:bg-finance-black text-yellow-500">
              Nenhum dado de dashboard disponível para o usuário.
              {/* Opcional: Botão para adicionar primeiro lançamento/conta */}
          </div>
      );
  }

    // Mapeamento de brands para ícones de cartão (assumindo que você tem esses componentes)
    const mapBrandToIcon = (brand) => {
        switch(brand?.toLowerCase()) { // Usar toLowerCase para ser mais flexível
            case 'visa': return require('react-icons/si').SiVisa;
            case 'mastercard': return require('react-icons/si').SiMastercard;
            default: return null;
        }
    };
    // Formatar a data de vencimento se existir
    const formatDueDate = (dateString) => {
        if (!dateString) return 'N/A';
         try {
             // Adiciona 'T00:00:00Z' para garantir que a data seja tratada como UTC 0
             // Isso ajuda a evitar problemas de fuso horário ao criar o objeto Date
             const date = new Date(dateString + 'T00:00:00Z');
             return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
         } catch (e) {
             console.error("Erro ao formatar data:", dateString, e);
             return 'Data Inválida';
         }
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
            {/* Header de Saldo (Usando dado da API) */}
            <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="text-center mb-8">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Saldo Líquido Atual</p>
              <p className="text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tighter">
                 {/* Formata o valor do saldo */}
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.netBalance || 0)}
              </p>
            </motion.div>

            {/* Grid Principal do Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-3 gap-6">
              {/* Receita Mês (Usando dado da API) */}
              <div className="lg:col-span-1">
                 <StatCard
                   title="Receita (Mês)"
                   value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.monthlySummary?.income || 0)} // Acessa com ?. para segurança
                   icon={<ArrowTrendingUpIcon className="h-6 w-6 text-green-500"/>}
                 />
              </div>
               {/* Despesas Mês (Usando dado da API) */}
              <div className="lg:col-span-1">
                 <StatCard
                    title="Despesas (Mês)"
                    value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.monthlySummary?.expense || 0)} // Acessa com ?.
                    icon={<ArrowTrendingDownIcon className="h-6 w-6 text-red-500"/>}
                 />
              </div>
               {/* A Receber Próx. 30d (Usando dado da API) */}
              <div className="lg:col-span-1">
                 <StatCard
                   title="A Receber (Próx. 30d)"
                   value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.receivables || 0)}
                   icon={<ClockIcon className="h-6 w-6 text-blue-500"/>}
                 />
              </div>
              {/* Contas a Pagar (Usando dado da API) */}
              <div className="lg:col-span-1">
                 <BillsToPayWidget
                    totalDue={dashboardData.billsToPay?.totalDue || 0} // Acessa com ?.
                    billsDueIn7Days={dashboardData.billsToPay?.billsDueIn7Days || 0} // Acessa com ?.
                 />
              </div>
               {/* Fluxo de Caixa Mensal (Usando dado da API) */}
               {/* Passa os dados diretamente, a transformação é feita dentro do componente CashFlowChart */}
              <div className="lg:col-span-2 lg:row-span-2">
                 <CashFlowChart apiData={dashboardData.cashFlow || []} />
              </div>
               {/* Atividade Recente (Usando dado da API) */}
              <div className="lg:col-span-1 lg:row-span-2">
                 <RecentActivity activities={dashboardData.recentActivity || []} />
              </div>
               {/* Cartão de Crédito (Usando dado da API) */}
               {/* Renderiza apenas se houver dados de cartão */}
              <div className="lg:col-span-1 lg:row-span-2">
                 {dashboardData.creditCardBill?.card ? (
                     <CreditCardBill
                         card={dashboardData.creditCardBill.card}
                         invoice={dashboardData.creditCardBill.invoice}
                         mapBrandToIcon={mapBrandToIcon}
                         formatDueDate={formatDueDate}
                     />
                 ) : (
                      // Placeholder ou mensagem se não houver cartão
                      <motion.div
                           className="relative col-span-1 md:col-span-2 p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white h-full flex flex-col justify-center items-center" // Added items-center
                           variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                           initial="hidden" animate="visible"
                       >
                           <p className="text-center text-white/60">Nenhum cartão de crédito cadastrado.</p>
                           {/* Opcional: Botão para adicionar cartão diretamente aqui */}
                            <button onClick={() => handleDockAction('add-credit-card')} className="mt-4 px-4 py-2 text-sm font-semibold text-finance-pink hover:underline">Adicionar Cartão</button>
                       </motion.div>
                 )}
              </div>
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

      {/* Seção de renderização condicional para todos os modais (mantidos) */}
      <AddTransactionModal
        isOpen={activeModal === 'add-transaction' || activeModal === 'add-recurrence'}
        onClose={() => setActiveModal(null)}
        // onSave={handleSaveTransaction} // TODO: Chamar API para salvar Transação/Recorrência
      />
      <AddCardExpenseModal
        isOpen={activeModal === 'add-card-expense'}
        onClose={() => setActiveModal(null)}
        // onSave={handleSaveCardExpense} // TODO: Chamar API para salvar Gasto no Cartão
      />
      <AddCalendarEventModal
        isOpen={activeModal === 'add-calendar-event'}
        onClose={() => setActiveModal(null)}
        // event={selectedCalendarEvent} // TODO: Estado para selecionar evento do calendário para editar
        // onSave={handleSaveCalendarEvent} // TODO: Chamar API para salvar Evento do Calendário
        // onDelete={handleDeleteCalendarEvent} // TODO: Chamar API para deletar Evento do Calendário
      />
      <AddInvestmentModal
        isOpen={activeModal === 'add-investment'}
        onClose={() => setActiveModal(null)}
        // investment={selectedInvestment} // TODO: Estado para selecionar investimento para editar
        // onSave={handleSaveInvestment} // TODO: Chamar API para salvar Investimento
      />
      <AddCreditCardModal
        isOpen={activeModal === 'add-credit-card'}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveCreditCard}
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
       {/* Adicione outros modais se necessário (ex: QuickCardsModal, QuickNoteModal) */}
       {/*
       <QuickCardsModal
         isOpen={activeModal === 'quick-cards'}
         onClose={() => setActiveModal(null)}
       />
        <QuickNoteModal
         isOpen={activeModal === 'quick-note'}
         onClose={() => setActiveModal(null)}
       />
       */}
    </>
  );
}

// Adiciona esta função para proteger a rota do dashboard
// Isto é uma forma básica. Uma forma mais avançada envolveria um componente de HOC (High-Order Component)
// que encapsula páginas que requerem autenticação.
// No Next.js 13/14 com App Router, a abordagem seria diferente (middleware.js).
// Como estamos usando Pages Router, esta é uma opção simples.
 FinanceDashboardPage.auth = true; // Marca a página como protegida