// componentsDesk/DeskHub/DeskHubScreen.js

import { motion } from 'framer-motion';
import { ComputerDesktopIcon, AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

const DeskHubScreen = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }, // Curva suave
    },
  };

  const interactiveElementVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 30px rgba(59, 130, 246, 0.3)", // Usando a cor de acento do tema
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  }

  return (
    <motion.section
      className="relative h-screen w-full flex flex-col items-center justify-center p-8 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible" // Esta seção entra logo após o boot
    >
      {/* Elementos de fundo sutis (opcional) */}
      <div className="absolute inset-0 z-0 opacity-5">
        {/* Pode adicionar um padrão geométrico sutil ou gradiente aqui se desejar */}
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        <motion.div variants={itemVariants} className="mb-8">
          <ComputerDesktopIcon className="h-20 w-20 sm:h-24 sm:w-24 mx-auto text-dark-accent" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4"
        >
          Bem-vindo ao seu <span className="text-dark-accent">Desk Digital</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-light-subtle dark:text-dark-subtle mb-12 max-w-xl mx-auto"
        >
          Este é o seu centro de comando pessoal para acessar soluções inovadoras e ferramentas projetadas para elevar sua produtividade. Explore os módulos abaixo.
        </motion.p>

        {/* Elemento interativo ou call to action para rolar */}
        <motion.div
            variants={itemVariants}
            className="flex flex-col items-center"
        >
            <motion.p 
                className="text-sm text-light-subtle dark:text-dark-subtle mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }} // Aparece um pouco depois
            >
                Role para explorar os sistemas
            </motion.p>
            <motion.div
                className="text-dark-accent animate-bounce"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DeskHubScreen;