// componentsDesk/Header/Header.js (VERSÃO FINAL, CORRIGIDA E VENCEDORA)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, Squares2X2Icon } from '@heroicons/react/24/solid';

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: 'Sobre', href: '#about' },
    { name: 'Projetos', href: '#projects' },
    { name: 'Contato', href: '#contact' },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 15, delay: 0.5 } },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  };

  return (
    <motion.header
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="mx-auto flex items-center justify-between rounded-full bg-light-surface/70 dark:bg-dark-surface/50 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5 px-6 py-3">
        
        {/* CORREÇÃO 1: Adicionado legacyBehavior */}
        <Link href="/desk" passHref legacyBehavior>
          <motion.a className="text-lg font-bold text-light-text dark:text-dark-text" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Patrick.Developer
          </motion.a>
        </Link>
        
        <div className="hidden sm:flex items-center gap-x-6">
          {navItems.map((item) => (
            // CORREÇÃO 2: Adicionado legacyBehavior
            <Link key={item.name} href={item.href} passHref legacyBehavior>
              <motion.a className="text-sm font-medium text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text transition-colors duration-300" whileHover={{ y: -2 }}>
                {item.name}
              </motion.a>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-x-4">
          {/* CORREÇÃO 3: Adicionado legacyBehavior */}
          <Link href="/dashboard" passHref legacyBehavior>
            <motion.a className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Acessar Sistemas" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Squares2X2Icon className="h-5 w-5 text-light-subtle dark:text-dark-subtle" />
            </motion.a>
          </Link>

          <motion.button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Alterar Tema" whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
            <AnimatePresence mode="wait" initial={false}>
              {mounted && (
                <motion.div key={resolvedTheme} variants={iconVariants} initial="hidden" animate="visible" exit="hidden">
                  {resolvedTheme === 'dark' ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-dark-accent" />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;