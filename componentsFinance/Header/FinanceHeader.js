// componentsFinance/Header/FinanceHeader.js

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import {
  ChartPieIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  UserIcon, // Ícone de perfil
  CurrencyDollarIcon,
  ClipboardDocumentListIcon // Ícone de moeda
} from '@heroicons/react/24/solid';

const navLinks = [
  { name: 'Dashboard', href: '/finance/dashboard', icon: ChartPieIcon },
  { name: 'Lançamentos', href: '/finance/transactions', icon: ClipboardDocumentListIcon },
  { name: 'Faturas', href: '/finance/invoices', icon: CreditCardIcon },
  { name: 'Calendário', href: '/finance/calendar', icon: CalendarDaysIcon },
  { name: 'Investimentos', href: '/finance/investments', icon: CurrencyDollarIcon }, // Ícone de moeda para Investimentos
  { name: 'Relatórios', href: '/finance/reports', icon: DocumentChartBarIcon },
  { name: 'Perfil', href: '/finance/settings', icon: UserIcon }, // Ícone de perfil para Configurações
];

const FinanceHeader = () => {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.header
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Container principal sem scroll vertical visível */}
      <div className="flex flex-wrap items-center justify-between p-2 bg-finance-cream/80 dark:bg-finance-black/50 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/10 shadow-lg 
                      h-16 sm:h-auto max-h-16 sm:max-h-none overflow-hidden">

        <div className="flex items-center gap-x-3 pl-3 flex-shrink-0 min-w-[80px]"> {/* min-w para garantir espaço para 'OS' */}
          <Link href="/finance/dashboard" className="text-lg font-bold text-finance-pink">
            OS
          </Link>
          <div className="h-6 w-px bg-white/10 dark:bg-white/10 mx-2"></div> {/* Divisor à direita do OS */}
        </div>

        {/* Navegação principal com scroll horizontal oculto */}
        <nav className="
          flex-1 
          min-w-0 
          overflow-x-auto /* Permite scroll horizontal apenas */
          overflow-y-hidden /* Bloqueia scroll vertical explícito */
          no-scrollbar /* Usando a classe customizada para esconder a scrollbar visualmente */
          py-2 
          px-1 
        ">
          <div className="flex items-center justify-center gap-x-1 sm:gap-x-2 whitespace-nowrap"> {/* justify-center centraliza os itens de navegação */}
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    relative group flex items-center justify-center gap-x-1 sm:gap-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full
                    transition-colors duration-300 flex-shrink-0 text-sm sm:text-base 
                    ${isActive
                      ? 'bg-finance-pink text-finance-cream shadow-md'
                      : 'text-light-text dark:text-dark-subtle hover:text-finance-pink dark:hover:text-finance-pink'
                    }
                  `}
                  title={link.name}
                >
                  <link.icon className={`h-4 sm:h-5 w-4 sm:w-5 
                    ${
                    isActive
                      ? 'text-finance-cream'
                      : 'text-light-text dark:text-dark-subtle group-hover:text-finance-pink dark:group-hover:text-finance-pink'
                  }`} />
                  <span
                    className={`
                      absolute -bottom-8 whitespace-nowrap text-xs text-white bg-black/70
                      px-2 py-1 rounded-md opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                      ${isActive ? 'hidden' : ''}
                    `}
                  >
                    {link.name}
                  </span>
                  {isActive && (
                    <span className="hidden sm:block text-sm font-semibold">
                      {link.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-x-2 pr-3 flex-shrink-0 min-w-[80px]"> {/* min-w para garantir espaço para os botões */}
          <div className="h-6 w-px bg-white/10 dark:bg-white/10 mx-2"></div> {/* Divisor à esquerda da lua/sol */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 sm:p-3 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            title="Alterar Tema"
          >
            {mounted && (
              resolvedTheme === 'dark'
                ? <SunIcon className="h-5 sm:h-6 w-5 sm:w-6 text-yellow-400" />
                : <MoonIcon className="h-5 sm:h-6 w-5 sm:w-6 text-gray-800" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default FinanceHeader;