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
  BeakerIcon,
  ClipboardDocumentListIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/solid';

const navLinks = [
  { name: 'Dashboard', href: '/finance/dashboard', icon: ChartPieIcon },
  { name: 'Lançamentos', href: '/finance/transactions', icon: ClipboardDocumentListIcon },
  { name: 'Faturas', href: '/finance/invoices', icon: CreditCardIcon },
  { name: 'Calendário', href: '/finance/calendar', icon: CalendarDaysIcon },
  { name: 'Investimentos', href: '/finance/investments', icon: BeakerIcon },
  { name: 'Relatórios', href: '/finance/reports', icon: DocumentChartBarIcon },
  { name: 'Configurações', href: '/finance/settings', icon: Cog8ToothIcon },
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
      <div className="flex items-center justify-between p-2 bg-finance-cream/80 dark:bg-finance-black/50 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/10 shadow-lg 
                      h-16 sm:h-auto max-h-16 sm:max-h-none"> {/* Define altura fixa e max-height para evitar scroll vertical no container principal */}

        <div className="flex items-center gap-x-3 pl-3 flex-shrink-0">
          <Link href="/finance/dashboard" className="text-lg font-bold text-finance-pink">
            OS
          </Link>
          <Image
            src="https://placehold.co/200x200/png"
            alt="Patrick Siqueira"
            width={36}
            height={36}
            className="rounded-full"
            unoptimized
          />
        </div>

        <nav className="
          flex-1 min-w-0 
          overflow-x-auto /* APENAS scroll horizontal */
          overflow-y-hidden /* EXPLICITAMENTE proibir scroll vertical aqui */
          scrollbar-hide /* Para esconder a barra de scroll visualmente */
          mx-2
          py-1 /* Adiciona um pequeno padding vertical para garantir que os itens não causem overflow no pai */
        ">
          <div className="flex items-center gap-x-1 sm:gap-x-2 whitespace-nowrap px-1">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    relative group flex items-center justify-center gap-x-2 px-3 sm:px-4 py-2 rounded-full
                    transition-colors duration-300 flex-shrink-0
                    ${isActive
                      ? 'bg-finance-pink text-finance-cream shadow-md'
                      : 'text-light-text dark:text-dark-subtle hover:text-finance-pink dark:hover:text-finance-pink'
                    }
                  `}
                  title={link.name}
                >
                  <link.icon className={`h-5 sm:h-6 w-5 sm:w-6 ${
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

        <div className="flex items-center gap-x-2 pr-3 flex-shrink-0">
          <motion.button
            className="flex items-center justify-center p-2 sm:p-3 bg-finance-pink text-white rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Adicionar Transação"
          >
            <PlusIcon className="h-5 sm:h-6 w-5 sm:w-6" />
          </motion.button>

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