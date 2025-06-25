// componentsFinance/Invoices/InvoicePanel.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TagIcon, ShoppingCartIcon, FireIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
const categoryIcons = {
    'Software': <TagIcon className="h-5 w-5 text-blue-400" />,
    'Alimentação': <FireIcon className="h-5 w-5 text-orange-400" />,
    'Transporte': <ShoppingCartIcon className="h-5 w-5 text-purple-400" />,
    'Compras': <ShoppingCartIcon className="h-5 w-5 text-green-400" />,
    'default': <TagIcon className="h-5 w-5 text-gray-400" />
};



const InvoicePanel = ({ card, invoice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  if (!card || !invoice) return null;

  const limitUsedPercentage = (invoice.total / card.limit) * 100;
  
  const filteredTransactions = invoice.transactions.filter(tx =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

 return (
    <motion.div className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-black/5 dark:border-white/10 flex flex-col h-full overflow-hidden">
        {/* Header do Painel */}
        <div className="p-6 border-b border-black/5 dark:border-white/10">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text">{card.name}</h2>
                <div className="flex items-center gap-4 text-light-subtle dark:text-dark-subtle">
                    <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ArrowLeftIcon className="h-5 w-5"/></button>
                    <span className="font-semibold">{invoice.month} {invoice.year}</span>
                    <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ArrowRightIcon className="h-5 w-5"/></button>
                </div>
            </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="p-6 space-y-4 border-b border-black/5 dark:border-white/10">
            <div>
                <p className="text-sm text-light-subtle dark:text-dark-subtle">Valor da Fatura</p>
                <p className="text-4xl font-extrabold text-finance-pink tracking-tighter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total)}</p>
            </div>
            <div>
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium text-light-text dark:text-dark-text">Limite Utilizado</span>
                    <span className="text-light-subtle dark:text-dark-subtle">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limit)}</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        className="bg-gradient-to-r from-finance-pink to-orange-400 h-2.5 rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${limitUsedPercentage}%`}} transition={{ duration: 1, ease: 'circOut', delay: 0.3 }}
                    />
                </div>
            </div>
        </div>

        {/* Lista de Transações com Filtro e Scroll */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold text-light-text dark:text-dark-text">Lançamentos</h3>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-subtle dark:text-dark-subtle"/>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 rounded-full pl-9 pr-3 py-1.5 text-sm w-48 focus:ring-2 focus:ring-dark-accent focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto -mr-3 pr-3"> {/* Container de Scroll */}
                <div className="space-y-2">
                    {filteredTransactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5">
                                    {categoryIcons[tx.category] || categoryIcons.default}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-light-text dark:text-dark-text">{tx.description}</p>
                                    <p className="text-xs text-light-subtle dark:text-dark-subtle">{tx.date}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-sm text-light-text dark:text-dark-text">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default InvoicePanel;