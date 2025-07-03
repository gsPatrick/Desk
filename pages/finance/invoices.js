// pages/finance/invoices.js (AJUSTADO: Passando handlers para o WalletCard no modo mobile)

import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/24/solid';

// Componentes
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import WalletCard from '../../componentsFinance/Invoices/WalletCard';
import InvoicePanel from '../../componentsFinance/Invoices/InvoicePanel';
import AddCreditCardModal from '../../componentsFinance/Shared/AddCreditCardModal';
import AddCardExpenseModal from '../../componentsFinance/Shared/AddCardExpenseModal';

// Hooks
import useAuth from '../../hooks/useAuth';
import useAccounts from '../../hooks/userAccountsData';
import useInvoices from '../../hooks/useInvoices';
import useCategories from '../../hooks/useCategoriesData';
import useMediaQuery from '../../hooks/useMediaQuery'; // Importar o hook
import api from '../../utils/api';

export default function FinanceInvoicesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Busca todos os cartões e categorias do usuário
  const { accounts, loading: accountsLoading, error: accountsError, refetch: refetchAccounts } = useAccounts(user?.id);
  const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories(user?.id);

  const creditCards = accounts.filter(acc => acc.type === 'credit_card');

  // Estado para o cartão e data selecionados
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedDate, setSelectedDate] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  // Estados para modais
  const [isAddCreditCardModalOpen, setIsAddCreditCardModalOpen] = useState(false);
  const [isAddCardExpenseModalOpen, setIsAddCardExpenseModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);


  // Seta o primeiro cartão como selecionado assim que os dados carregarem E se nenhum estiver selecionado
  useEffect(() => {
    if (!selectedCardId && creditCards.length > 0) {
      setSelectedCardId(creditCards[0].id);
    }
     // Se o cartão selecionado atual for removido/deletado, resetar ou selecionar o primeiro
    if (selectedCardId && !creditCards.find(card => card.id === selectedCardId)) {
        setSelectedCardId(creditCards.length > 0 ? creditCards[0].id : null);
    }
  }, [creditCards, selectedCardId]);


  // Memoriza o objeto de filtros para o useInvoices
  const invoiceFilters = useMemo(() => ({
    accountId: selectedCardId,
    month: selectedDate.month,
    year: selectedDate.year,
    limit: 1,
  }), [selectedCardId, selectedDate.month, selectedDate.year]);

  // Hook para buscar a fatura com base no cartão e data selecionados
  // Ele só buscará se accountId for válido
  const { invoices, loading: invoiceLoading, error: invoiceError, refetch: refetchInvoice } = useInvoices(invoiceFilters);

  const selectedCard = creditCards.find(c => c.id === selectedCardId);
  const selectedInvoice = invoices && invoices.length > 0 ? invoices[0] : null;


  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

   // Handler para salvar/editar um cartão
   const handleSaveCard = async (cardData) => {
       try {
           const isEditing = cardData.id !== undefined && cardData.id !== null;
           const response = isEditing
                            ? await api.put(`/accounts/${cardData.id}`, cardData)
                            : await api.post('/accounts', cardData);

           console.log("Card saved successfully:", response.data.data);
           refetchAccounts();
           setIsAddCreditCardModalOpen(false);
           setCardToEdit(null);
           return { success: true, data: response.data.data };
       } catch (error) {
           console.error("Error saving card:", error);
           throw error;
       }
   };

    // Handler para abrir o modal de EDIÇÃO de Cartão
    const handleEditCardClick = (cardId) => {
        const cardToEdit = creditCards.find(card => card.id === cardId);
        if (cardToEdit) {
             setCardToEdit(cardToEdit);
             setIsAddCreditCardModalOpen(true);
        } else {
             console.warn("Card not found for editing:", cardId);
        }
    };

    // Handler para REMOVER Cartão
    const handleDeleteCardClick = async (cardId) => {
       console.log("Delete card clicked:", cardId);
        const confirmDelete = confirm("Tem certeza que deseja remover este cartão? Todas as faturas e despesas associadas serão removidas.");
        if (!confirmDelete) return;
        try {
            await api.delete(`/accounts/${cardId}`);
            console.log("Card deleted successfully:", cardId);
             refetchAccounts();
             // A lógica do useEffect já lida com a re-seleção após exclusão
        } catch (error) {
             console.error("Error deleting card:", cardId, error);
        }
    };


    // Handler para abrir o modal de CRIAÇÃO de despesa de cartão
    const handleOpenAddCardExpenseModal = () => {
        if (!selectedCard) {
             console.warn("Cannot open expense modal: No card selected.");
             return;
        }
        setTransactionToEdit(null);
        setIsAddCardExpenseModalOpen(true);
    };

    // Handler para salvar/editar DESPESA do cartão
    const handleSaveCardExpense = async (apiPayload) => {
        try {
            const isEditing = apiPayload.id !== undefined && apiPayload.id !== null;
            const response = isEditing
                             ? await api.put(`/transactions/${apiPayload.id}`, apiPayload)
                             : await api.post('/transactions', apiPayload);

            console.log("Card expense transaction saved successfully:", response.data);
            refetchInvoice();
            setIsAddCardExpenseModalOpen(false);
            setTransactionToEdit(null);

            return { success: true, data: response.data.data };
        } catch (error) {
             console.error("Error saving card expense transaction:", error);
             throw error;
        }
    };

    // Handler para abrir o modal de EDIÇÃO de Despesa de Cartão
    const handleEditCardExpenseClick = async (transactionId) => {
        try {
            const response = await api.get(`/transactions/${transactionId}`);
            const transactionData = response.data.data;
             if (!transactionData) {
                 console.warn("Transaction not found for editing:", transactionId);
                 return;
             }
            setTransactionToEdit(transactionData);
            setIsAddCardExpenseModalOpen(true);
        } catch (error) {
            console.error("Error fetching transaction for editing:", transactionId, error);
        }
   };

    // Handler para REMOVER Transação de Despesa de Cartão
    const handleDeleteCardExpenseClick = async (transactionId) => {
       console.log("Delete card expense clicked:", transactionId);
        const confirmDelete = confirm("Tem certeza que deseja remover esta despesa?");
        if (!confirmDelete) return;
        try {
            await api.delete(`/transactions/${transactionId}`);
            console.log("Card expense transaction deleted successfully:", transactionId);
             refetchInvoice();
        } catch (error) {
             console.error("Error deleting card expense transaction:", transactionId, error);
        }
    };


  // Mapeia as categorias para o formato esperado pelo modal
  const categoryOptionsFormatted = useMemo(() => {
     if (categoriesLoading || categoriesError) return [];
     return categories.map(cat => ({ value: cat.id, label: cat.name }));
  }, [categories, categoriesLoading, categoriesError]);


  // Renderização de estado de loading/erro inicial da página
  if (authLoading || accountsLoading || categoriesLoading) {
    return <div className="flex items-center justify-center h-screen bg-light-bg dark:bg-dark-bg">Carregando...</div>;
  }
  if (accountsError || categoriesError) {
      return <div className="flex items-center justify-center h-screen bg-light-bg dark:bg-dark-bg text-red-500">Erro ao carregar dados: {accountsError || categoriesError}</div>;
  }
  if (!isAuthenticated) return null;

  // Mensagem se não houver cartões cadastrados
  if (creditCards.length === 0) {
      return (
           <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex flex-col">
               <FinanceHeader />
               <main className="flex-1 pt-28 pb-10 flex items-center justify-center">
                   <div className="text-center text-light-subtle dark:text-dark-subtle">
                       <p className="mb-4">Você ainda não tem cartões de crédito cadastrados.</p>
                       <motion.button
                           onClick={() => { setCardToEdit(null); setIsAddCreditCardModalOpen(true); }}
                           className="inline-flex items-center gap-2 px-4 py-2 bg-finance-pink text-white font-semibold rounded-lg shadow-lg"
                           whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                       >
                           <PlusIcon className="h-5 w-5"/> Adicionar Primeiro Cartão
                       </motion.button>
                   </div>
               </main>
               <AddCreditCardModal
                 isOpen={isAddCreditCardModalOpen}
                 onClose={() => { setIsAddCreditCardModalOpen(false); setCardToEdit(null); }}
                 onSave={handleSaveCard}
                 initialData={cardToEdit}
               />
           </div>
      );
  }


  return (
    <>
      <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex flex-col">
        <Head><title>Faturas | Finance OS</title></Head>
        <FinanceHeader />

        <main className="flex-1 pt-28 pb-10">
          <LayoutGroup>
            <div className="container mx-auto px-6 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8 h-full items-start">

                {/* Coluna Esquerda: Wallet com Responsividade */}
                <div className="flex flex-col h-full lg:col-span-1">
                   <div className="flex justify-between items-center px-2 mb-6 flex-shrink-0">
                      <h2 className="text-lg font-bold text-light-text dark:text-dark-text">Minha Carteira</h2>
                      <motion.button
                           onClick={() => { setCardToEdit(null); setIsAddCreditCardModalOpen(true); }}
                           className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-light-subtle dark:text-dark-subtle"
                           whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                       >
                           <PlusIcon className="h-6 w-6"/>
                       </motion.button>
                  </div>

                  {!isDesktop ? ( // Renderização Mobile
                       <div className="flex flex-col space-y-4 flex-shrink-0">
                            {/* Dropdown de seleção de cartão */}
                            <select
                                value={selectedCardId || ''}
                                onChange={(e) => setSelectedCardId(parseInt(e.target.value, 10))}
                                className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none mb-4"
                             >
                                <option value="" disabled>Selecione um cartão</option>
                                {creditCards.map(card => (
                                    <option key={card.id} value={card.id}>
                                         {card.name} {card.finalDigits ? `(Final ${card.finalDigits})` : ''}
                                    </option>
                                ))}
                            </select>

                            {/* Exibe APENAS o cartão selecionado */}
                             {selectedCard && (
                                 <motion.div
                                    key={selectedCard.id}
                                    layoutId={`card-container-${selectedCard.id}`}
                                     className="mb-8"
                                 >
                                     <WalletCard
                                         card={selectedCard}
                                         invoice={selectedInvoice}
                                         isSelected={true}
                                         // CORRIGIDO: Passar os handlers para o card no mobile também
                                          onEditClick={handleEditCardClick}
                                          onDeleteClick={handleDeleteCardClick}
                                     />
                                 </motion.div>
                             )}
                       </div>

                  ) : ( // Renderização Desktop
                       <div className="flex-1 space-y-6 overflow-y-auto -mr-4 pr-4">
                         {creditCards.map(card => (
                           <WalletCard
                             key={card.id}
                             card={card}
                             invoice={card.id === selectedCardId ? selectedInvoice : null}
                             isSelected={card.id === selectedCardId}
                             onSelect={() => setSelectedCardId(card.id)}
                             onEditClick={handleEditCardClick}
                             onDeleteClick={handleDeleteCardClick}
                           />
                         ))}
                       </div>
                  )}
                </div>

                {/* Coluna Direita: Painel de Detalhes */}
                <div className="lg:col-span-2 h-full">
                  <AnimatePresence mode="wait">
                    {selectedCard ? (
                        <motion.div
                          key={selectedCardId}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'circOut' } }}
                          exit={{ opacity: 0, y: -30, transition: { duration: 0.3, ease: 'circIn' } }}
                          className="h-full"
                        >
                          <InvoicePanel
                              card={selectedCard}
                              invoice={selectedInvoice}
                              invoiceLoading={invoiceLoading}
                              invoiceError={invoiceError}
                              onDateChange={setSelectedDate}
                              selectedDate={selectedDate}
                              onAddTransactionClick={handleOpenAddCardExpenseModal}
                              onEditTransactionClick={handleEditCardExpenseClick}
                              onDeleteTransactionClick={handleDeleteCardExpenseClick}
                          />
                        </motion.div>
                    ) : (
                       <div className="flex items-center justify-center h-full text-light-subtle dark:text-dark-subtle">
                           Selecione um cartão para ver os detalhes da fatura.
                       </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </LayoutGroup>
        </main>

         {/* Modais (Renderizados fora do layout principal) */}
        <AddCreditCardModal
          isOpen={isAddCreditCardModalOpen}
          onClose={() => { setIsAddCreditCardModalOpen(false); setCardToEdit(null); }}
          onSave={handleSaveCard}
          initialData={cardToEdit}
        />

         <AddCardExpenseModal
             isOpen={isAddCardExpenseModalOpen}
             onClose={() => { setIsAddCardExpenseModalOpen(false); setTransactionToEdit(null); }}
             onSave={handleSaveCardExpense}
             card={selectedCard}
             invoice={selectedInvoice}
             categoryOptions={categoryOptionsFormatted}
             categoriesLoading={categoriesLoading}
             categoriesError={categoriesError}
             initialData={transactionToEdit}
         />

        {/* TODO: Outros Modais */}

      </div>
    </>
  );
}

FinanceInvoicesPage.auth = true;