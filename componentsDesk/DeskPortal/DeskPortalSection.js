// componentsDesk/DeskPortal/DeskPortalSection.js (COM BOTÃO DA HERO)

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRightIcon, SquaresPlusIcon } from '@heroicons/react/24/solid';

const DeskPortalSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: 'easeInOut' },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2, delayChildren:0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: {duration: 0.6, ease: 'easeOut'} },
  };
  
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
    },
    hover: {
      scale: 1.1,
      filter: `drop-shadow(0 0 15px var(--color-accent-glow))`,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.section
      className="relative py-28 sm:py-36 bg-light-bg dark:bg-dark-bg overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      style={{
        '--color-accent-glow': 'rgba(59, 130, 246, 0.6)', 
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[500px] transform-gpu overflow-hidden blur-3xl -z-10" aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-dark-accent/30 to-pink-500/20 opacity-30 dark:opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-6 sm:px-8 text-center relative z-10"
        variants={contentVariants}
      >
        <motion.div variants={iconVariants} whileHover="hover" className="mb-8">
          <SquaresPlusIcon className="h-20 w-20 sm:h-24 sm:w-24 mx-auto text-light-accent dark:text-dark-accent transition-all duration-300" />
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-light-text dark:text-dark-text mb-5"
        >
          Conheça o <span className="text-light-accent dark:text-dark-accent">Desk</span>
        </motion.h2>
        
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-light-subtle dark:text-dark-subtle mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Mais que um portfólio, um <span className="font-medium text-dark-text">ecossistema de soluções</span> prontas para impulsionar sua visão.
        </motion.p>

        {/* --- BOTÃO ATUALIZADO AQUI --- */}
        <motion.div variants={itemVariants}>
          <Link href="/dashboard" passHref legacyBehavior>
            <motion.a
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full 
                         px-8 py-4 text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105
                         bg-light-surface dark:bg-dark-accent /* Cores base do botão */
                         text-light-text dark:text-dark-text /* Cor do texto */
                         shadow-xl shadow-light-accent/30 dark:shadow-lg dark:shadow-dark-accent/30"
              whileTap={{ scale: 0.95 }}
            >
              {/* Efeito de "Shine" */}
              <span className="absolute inset-0 -translate-x-full transform skew-x-[-20deg] 
                               bg-gradient-to-r from-transparent to-transparent 
                               transition-transform duration-700 group-hover:translate-x-full
                               via-black opacity-20 /* Tema Claro: Gradiente preto */
                               dark:via-white dark:opacity-15 /* Tema Escuro: Gradiente branco */">
              </span>
              
              <span className="relative z-10 inline-flex items-center gap-x-2.5">
                 Explorar o Desk
                 <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.a>
          </Link>
        </motion.div>
        {/* --- FIM DO BOTÃO ATUALIZADO --- */}
      </motion.div>
    </motion.section>
  );
};

export default DeskPortalSection;