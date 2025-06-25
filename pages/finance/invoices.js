// pages/finance/invoices.js (COM SCROLL E FILTRO)

import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import WalletCard from '../../componentsFinance/Invoices/WalletCard';
import InvoicePanel from '../../componentsFinance/Invoices/InvoicePanel';
import { creditCards, invoices } from '../../data/financeData';

export default function FinanceInvoicesPage() {
  const [selectedCardId, setSelectedCardId] = useState(creditCards[0].id);

  const selectedCard = creditCards.find(c => c.id === selectedCardId);
  const selectedInvoice = invoices.find(inv => inv.cardId === selectedCardId && inv.month === 'Junho');

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex flex-col">
      <Head><title>Faturas | Finance OS</title></Head>
      <FinanceHeader />

      <main className="flex-1 pt-28 pb-10">
        <LayoutGroup>
          <div className="container mx-auto px-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8 h-full items-start">
              
              {/* Coluna Esquerda: Wallet com Scroll */}
              <div className="lg:col-span-1 flex flex-col h-[80vh]">
                <h2 className="text-lg font-bold text-light-text dark:text-dark-text px-2 mb-6 flex-shrink-0">Minha Carteira</h2>
                <div className="flex-1 space-y-6 overflow-y-auto -mr-4 pr-4"> {/* Container de Scroll */}
                  {creditCards.map(card => (
                    <WalletCard
                      key={card.id}
                      card={card}
                      invoice={invoices.find(inv => inv.cardId === card.id && inv.month === 'Junho')}
                      isSelected={card.id === selectedCardId}
                      onSelect={() => setSelectedCardId(card.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Coluna Direita: Painel de Detalhes */}
              <div className="lg:col-span-2 h-[80vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCardId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'circOut' } }}
                    exit={{ opacity: 0, y: -30, transition: { duration: 0.3, ease: 'circIn' } }}
                    className="h-full"
                  >
                    <InvoicePanel card={selectedCard} invoice={selectedInvoice} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </LayoutGroup>
      </main>
    </div>
  );
}