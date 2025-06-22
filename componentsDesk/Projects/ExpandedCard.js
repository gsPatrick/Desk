// componentsDesk/Projects/ExpandedCard.js (VERSÃO FINAL ATUALIZADA)

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

const ExpandedCard = ({ project, setSelectedId }) => {
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-lg flex items-center justify-center p-4"
      onClick={() => setSelectedId(null)} // Fecha ao clicar no fundo
    >
      <motion.div
        layoutId={project.id}
        onClick={(e) => e.stopPropagation()} // Impede que o clique no card feche o modal
        // Fundo do modal adaptado para tema claro e escuro
        className="relative w-full max-w-4xl h-auto max-h-[90vh] bg-light-surface dark:bg-dark-surface rounded-2xl overflow-y-auto shadow-2xl"
      >
        <div className="relative h-64 w-full">
          <Image src={project.image} layout="fill" objectFit="cover" alt={project.title} className="rounded-t-2xl"/>
          {/* Botão de fechar adaptado para tema claro e escuro */}
          <motion.button
            onClick={() => setSelectedId(null)}
            className="absolute top-4 right-4 bg-black/5 dark:bg-white/10 p-2 rounded-full"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-white" />
          </motion.button>
        </div>
        
        <motion.div className="p-8" variants={contentVariants} initial="hidden" animate="visible">
          {/* Textos adaptados para tema claro e escuro */}
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">{project.title}</motion.h2>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 text-xs font-medium text-light-accent dark:text-dark-text bg-light-accent/10 dark:bg-dark-accent/20 rounded-full"
              >
                {tag}
              </span>
            ))}
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-light-subtle dark:text-dark-subtle mb-6">{project.longDescription}</motion.p>
          
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">Principais Features</h3>
            <ul className="list-disc list-inside text-light-subtle dark:text-dark-subtle space-y-1">
              {project.features.map(feature => <li key={feature}>{feature}</li>)}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link href={project.link} passHref legacyBehavior>
              {/* --- BOTÃO "VISITAR SITE" ATUALIZADO --- */}
              <a 
                target="_blank"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full 
                           px-8 py-4 text-base font-semibold transition-all duration-300 ease-in-out hover:scale-105
                           bg-light-surface dark:bg-dark-accent
                           text-light-text dark:text-dark-text
                           shadow-xl shadow-light-accent/30 dark:shadow-lg dark:shadow-dark-accent/30"
              >
                <span className="absolute inset-0 -translate-x-full transform skew-x-[-20deg] 
                                 bg-gradient-to-r from-transparent to-transparent 
                                 transition-transform duration-700 group-hover:translate-x-full
                                 via-black opacity-20
                                 dark:via-white dark:opacity-15">
                </span>
                
                <span className="relative z-10 inline-flex items-center gap-x-3">
                  Visitar Site <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </span>
              </a>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ExpandedCard;