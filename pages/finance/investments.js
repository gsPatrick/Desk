// pages/finance/investments.js

import { useState } from 'react';
import Head from 'next/head';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import InvestmentTerminal from '../../componentsFinance/Investments/InvestmentTerminal';
import AddInvestmentModal from '../../componentsFinance/Investments/AddInvestmentModal';
import { investments } from '../../data/financeData';
import { motion } from 'framer-motion';

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
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen relative overflow-hidden">
      <Head><title>Investimentos | Finance OS</title></Head>
      
      {/* Fundo dinâmico e abstrato */}
      <div className="absolute inset-0 z-0">
          <BackgroundGlow className="w-96 h-96 bg-blue-500 top-10 left-10" delay={0}/>
          <BackgroundGlow className="w-96 h-96 bg-finance-pink bottom-10 right-10" delay={5}/>
      </div>
      
      <div className="relative z-10 h-screen flex flex-col">
        <FinanceHeader />
        <main className="flex-1 container mx-auto px-6 pt-28 pb-10 min-h-0">
          <InvestmentTerminal investments={investments} onAdd={handleAddInvestment} />
        </main>
      </div>

      <AddInvestmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}