// componentsFinance/Invoices/InvoicePanel.js (AJUSTADO: Menu de Opções como Overlay)

import { useState, useMemo, useEffect } from 'react'; // Importe useEffect
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence
import { TagIcon, MagnifyingGlassIcon, PlusIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import useTransactionsData from '../../hooks/useTransactionsData';

// Componente para um item da lista de transações
const TransactionItem = ({ transaction, onEditClick, onDeleteClick }) => {
    const { category } = transaction;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handler para toggle do menu (agora apenas abre, o overlay click fecha)
    const handleMenuToggle = (e) => {
        e.stopPropagation(); // Impede propagação para o item pai
        setIsMenuOpen(true); // Abre o menu (overlay)
    };

    // Handlers para as ações do menu (fecham o menu e chamam a prop)
    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsMenuOpen(false); // Fecha o menu overlay
        if (onEditClick) onEditClick(transaction.id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setIsMenuOpen(false); // Fecha o menu overlay
        if (onDeleteClick) onDeleteClick(transaction.id);
    };

    // Handler para o botão Cancelar/Sair do menu
    const handleCancelClick = (e) => {
        e.stopPropagation();
        setIsMenuOpen(false); // Fecha o menu overlay
    };

    // Não precisamos mais do useEffect para fechar ao clicar fora, o overlay handle faz isso.
    // useEffect(() => { ... }, [isMenuOpen]);


    return (
        // Contêiner principal da transação
        <div className="flex items-center justify-between p-3 pr-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 relative">
            <div className="flex items-center gap-3 min-w-0 flex-shrink">
                <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category?.color ? `${category.color}20` : 'rgba(128, 128, 128, 0.125)' }}
                >
                    <TagIcon
                        className="h-5 w-5"
                        style={{ color: category?.color || '#808080' }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-light-text dark:text-dark-text truncate">{transaction.description}</p>
                    <p className="text-xs text-light-subtle dark:text-dark-subtle whitespace-nowrap">{new Date(transaction.date + 'T00:00:00Z').toLocaleDateString('pt-BR')}</p>
                </div>
            </div>

            <p className="font-semibold text-sm text-light-text dark:text-dark-text flex-shrink-0 whitespace-nowrap">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount || 0)}</p>

             {/* Botão que abre o Overlay de Opções */}
             {/* Posicionado de forma flexível no final, não absoluto */}
             <div className="flex-shrink-0 ml-2 z-10"> {/* z-index para garantir que o botão esteja clicável */}
                 <motion.button
                     onClick={handleMenuToggle} // Agora apenas abre o overlay
                     className="p-1 rounded-full hover:bg-black/30 transition-colors text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text"
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     title="Opções da Transação"
                 >
                     <EllipsisHorizontalIcon className="h-6 w-6"/>
                 </motion.button>
             </div>


             {/* CORRIGIDO: Overlay Centralizado para o Menu de Opções */}
             {/* AnimatePresence para animar a entrada/saída */}
             <AnimatePresence>
                 {isMenuOpen && (
                     // Container principal do overlay (fundo semi-transparente e centralização)
                     <motion.div
                         key="transaction-menu-overlay" // Chave para AnimatePresence
                         initial={{ opacity: 0 }} // Animação de entrada do fundo
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }} // Animação de saída do fundo
                         className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" // Fixado, cobre a tela, fundo transparente, centraliza conteúdo
                         onClick={handleCancelClick} // Clicar no fundo semi-transparente fecha o menu
                     >
                         {/* Container das Opções do Menu (centralizado) */}
                         <motion.div
                             initial={{ y: 50, opacity: 0 }} // Animação de entrada do menu (vindo de baixo)
                             animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
                             exit={{ y: 50, opacity: 0 }} // Animação de saída do menu (voltando para baixo)
                             className="w-full max-w-xs bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden z-50" // Largura máxima, background, sombra, z-index alto
                             onClick={(e) => e.stopPropagation()} // Impede que o clique DENTRO do menu feche o overlay
                         >
                             {/* Opções do Menu (Botões) */}
                             <button onClick={handleEditClick} className="block w-full text-left px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5">
                                 Editar
                             </button>
                             <button onClick={handleDeleteClick} className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10">
                                 Remover
                             </button>
                             {/* Separador visual (opcional) */}
                             <div className="h-px bg-black/10 dark:bg-white/10 my-1"></div>
                             {/* Botão Cancelar */}
                             <button onClick={handleCancelClick} className="block w-full text-center px-4 py-3 text-sm font-semibold text-blue-500 hover:bg-blue-500/10">
                                 Cancelar
                             </button>
                         </motion.div>
                     </motion.div>
                 )}
             </AnimatePresence>
        </div>
    );
};


const InvoicePanel = ({ card, invoice, invoiceLoading, invoiceError, onDateChange, selectedDate, onAddTransactionClick, onEditTransactionClick, onDeleteTransactionClick }) => {
  // Importado useState, useMemo, useEffect aqui no topo
  // ... (resto do código do InvoicePanel) ...
  const [searchTerm, setSearchTerm] = useState('');

   const transactionFilters = useMemo(() => ({
       invoiceId: invoice?.id,
       limit: 500,
       search: searchTerm,
   }), [invoice?.id, searchTerm]);

  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactionsData(
    card?.userId,
    transactionFilters,
  );

  const handleMonthChange = (direction) => {
    const currentDate = new Date(selectedDate.year, selectedDate.month - 1, 15);
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
    onDateChange({
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    });
  };

  if (!card) return null;

  const isLoading = invoiceLoading || transactionsLoading;

  return (
    <motion.div className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-black/5 dark:border-white/10 flex flex-col h-full overflow-hidden">
        {/* Header do Painel */}
        <div className="p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text">{card.name}</h2>
                <div className="flex items-center gap-4 text-light-subtle dark:text-dark-subtle">
                    <button onClick={() => handleMonthChange(-1)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ArrowLeftIcon className="h-5 w-5"/></button>
                    <span className="font-semibold whitespace-nowrap">{new Date(selectedDate.year, selectedDate.month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => handleMonthChange(1)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ArrowRightIcon className="h-5 w-5"/></button>
                </div>
            </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="p-6 space-y-4 border-b border-black/5 dark:border-white/10 flex-shrink-0 relative">
             {isLoading && (
                 <div className="absolute inset-0 bg-light-surface dark:bg-dark-surface bg-opacity-80 flex items-center justify-center z-10">
                     <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.088-2.647zm9.286 2.038A7.96 7.960 0 0120 12h4c0 3.042-1.135 5.824-3 7.938l-2.714-2.647z"></path>
                    </svg>
                 </div>
             )}

            {invoiceLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            ) : invoiceError ? (
                 <p className="text-center text-red-500 mt-4">{invoiceError}</p>
            ) : !invoice ? (
                   !invoiceLoading && <p className="text-center text-light-subtle dark:text-dark-subtle">Fatura para este período não encontrada.</p>
            ) : (
                <>
                    <div>
                        <p className="text-sm text-light-subtle dark:text-dark-subtle">Valor da Fatura</p>
                        <p className="text-4xl font-extrabold text-finance-pink tracking-tighter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total || 0)}</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-medium text-light-text dark:text-dark-text">Limite Utilizado</span>
                            <span className="text-light-subtle dark:text-dark-subtle">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limit || 0)}</span>
                        </div>
                        <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                                className="bg-gradient-to-r from-finance-pink to-orange-400 h-2.5 rounded-full"
                                initial={{ width: 0 }} animate={{ width: `${(parseFloat(invoice.total || 0) / parseFloat(card.limit || 1)) * 100}%`}} transition={{ duration: 1, ease: 'circOut', delay: 0.3 }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* Lista de Transações */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 className="text-md font-semibold text-light-text dark:text-dark-text">Lançamentos</h3>
               {invoice && onAddTransactionClick && (
                    <motion.button
                       onClick={onAddTransactionClick}
                       className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-light-subtle dark:text-dark-subtle"
                       whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                       title="Adicionar Lançamento nesta Fatura"
                   >
                       <PlusIcon className="h-6 w-6"/>
                   </motion.button>
               )}
            </div>
             {/* Campo de Busca - Visível apenas se uma fatura válida foi encontrada */}
             {invoice && (
                 <div className="mb-4 flex-shrink-0">
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-subtle dark:text-dark-subtle pointer-events-none"/>
                        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 pl-9 pr-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-full text-sm focus:ring-2 focus:ring-dark-accent focus:outline-none"/>
                      </div>
                 </div>
             )}

            {/* Container da lista de transações com scroll e overlay de loading */}
            <div className="flex-1 overflow-y-auto -mr-3 pr-3 relative">
                {/* Overlay de Loading */}
                 {isLoading && (
                     <div className="absolute inset-0 bg-light-surface dark:bg-dark-surface bg-opacity-80 flex items-center justify-center z-10">
                         <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.088-2.647zm9.286 2.038A7.96 7.960 0 0120 12h4c0 3.042-1.135 5.824-3 7.938l-2.714-2.647z"></path>
                        </svg>
                     </div>
                 )}

              {/* Conteúdo da Lista ou Mensagens */}
              {invoiceError ? (
                  <p className="text-center text-red-500 mt-4">{invoiceError}</p>
              ) : !invoice ? (
                   !invoiceLoading && <p className="text-center text-light-subtle dark:text-dark-subtle mt-4">Fatura para este período não encontrada.</p>
              ) : transactionsError ? (
                  <p className="text-center text-red-500 mt-4">{transactionsError}</p>
              ) : transactions.length > 0 ? (
                  <div className="space-y-2">
                      {transactions.map(tx => (
                          <TransactionItem key={tx.id} transaction={tx} onEditClick={onEditTransactionClick} onDeleteClick={onDeleteTransactionClick} />
                      ))}
                  </div>
              ) : (
                   !transactionsLoading && <p className="text-center text-light-subtle dark:text-dark-subtle mt-4">Nenhum lançamento nesta fatura.</p>
              )}
            </div>
        </div>
    </motion.div>
  );
};

export default InvoicePanel;