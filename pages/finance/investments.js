// pages/finance/investments.js

import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import InvestmentTerminal from '../../componentsFinance/Investments/InvestmentTerminal';
import AddInvestmentModal from '../../componentsFinance/Investments/AddInvestmentModal';
import { investments } from '../../data/financeData';

// -- COMPONENTE INTERNO: Efeito de Fundo --
const BackgroundGlow = ({ className, delay }) => (
    <motion.div
        className={`absolute rounded-full filter blur-3xl opacity-20 dark:opacity-30 ${className}`}
        animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, -180, 0],
        }}
        transition={{
            duration: 40,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
            delay: delay
        }}
    />
);

// -- PÁGINA PRINCIPAL --
export default function InvestmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddInvestment = () => setIsModalOpen(true);

  return (
    // Removido min-h-screen e overflow-hidden. O scroll nativo da página será usado no mobile.
    <div className="bg-light-bg dark:bg-dark-bg relative"> 
      <Head><title>Investimentos | Finance OS</title></Head>
      
      {/* Fundo dinâmico e abstrato - Mantido */}
      <div className="absolute inset-0 z-0">
          <BackgroundGlow className="w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 top-10 left-10" delay={0}/>
          <BackgroundGlow className="w-64 h-64 sm:w-96 sm:h-96 bg-finance-pink bottom-10 right-10" delay={5}/>
      </div>
      
      {/* Adicionado flex-col e h-screen para que o main possa ocupar a altura restante no desktop */}
      <div className="relative z-10 flex flex-col h-screen"> 
        <FinanceHeader />
        
        {/* Adicionado flex-1 para ocupar o espaço restante e lg:overflow-hidden para manter o scroll interno no desktop */}
        {/* Removido min-h-0. O padding horizontal e vertical está OK. */}
        <main className="flex-1 pt-28 pb-10 overflow-auto lg:overflow-hidden"> {/* overflow-auto para mobile, lg:overflow-hidden para desktop */}
          {/* Este container agora usa h-full e flex flex-col para passar a altura para o InvestmentTerminal no desktop */}
          <div className="container mx-auto px-4 sm:px-6 h-full flex flex-col"> 
            {/* InvestmentTerminal agora ocupa a altura restante devido ao flex-1 e h-full dos pais */}
            <InvestmentTerminal investments={investments} onAdd={handleAddInvestment} />
          </div>
        </main>
      </div>

      <AddInvestmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}