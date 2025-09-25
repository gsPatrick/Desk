import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LoadingModal.module.css';
import { IoCodeSlash, IoBusiness } from 'react-icons/io5'; // Ícones para Dev e Agência

export default function LoadingModal({ isOpen, userType }) {
  if (!isOpen) return null;

  // Propriedades específicas da animação
  const getAnimationProps = (type) => {
    switch (type) {
      case 'dev':
        return {
          icon: <IoCodeSlash size={60} className={styles.icon} />,
          title: "Preparando seu ambiente Dev...",
          description: "Configurando ferramentas e repositórios para você.",
          gradient: styles.blueGradient, // Gradiente azul para ambos agora
          animationDelay: 0.2 // Atraso para a animação do ícone/logo
        };
      case 'agency':
        return {
          icon: <IoBusiness size={60} className={styles.icon} />,
          title: "Organizando seus projetos de Agência...",
          description: "Sincronizando clientes e colaboradores para o seu negócio.",
          gradient: styles.blueGradient, // Gradiente azul para ambos agora
          animationDelay: 0.4
        };
      default:
        return {
          icon: null, // Pode ser o logo 'OS' ou um ícone padrão
          title: "Carregando...",
          description: "Aguarde enquanto preparamos sua experiência.",
          gradient: styles.blueGradient,
          animationDelay: 0
        };
    }
  };

  const { icon, title, description, gradient, animationDelay } = getAnimationProps(userType);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 15, delay: 0.1 } }, // Mais suave
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0, rotate: 0 },
    animate: {
      scale: [0.8, 1.1, 0.9, 1], // Pequeno pulso
      opacity: [0, 1, 1, 1],
      rotate: [0, 5, -5, 0], // Balanço sutil
      transition: {
        duration: 1.8, // Mais longo para suavidade
        delay: animationDelay,
        ease: "easeOut",
        repeat: Infinity, // Repete o pulso suave
        repeatType: "reverse"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: animationDelay + 1.2, duration: 0.6, ease: "easeOut" } } // Atraso após a logo e mais suave
  };

  const progressBarVariants = {
    initial: { width: '0%' },
    animate: {
      width: '100%',
      transition: {
        duration: 2, // Duração mais curta para o efeito de progresso
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.5 // Pequeno atraso antes de repetir
      }
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`${styles.backdrop}`} // Remove colab-theme daqui se já estiver no body/html
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className={`${styles.card} ${gradient}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className={styles.iconWrapper}
              variants={logoVariants}
              initial="initial"
              animate="animate"
            >
              {icon || <span className={styles.defaultLogo}>OS</span>}
            </motion.div>
            
            <motion.h2 variants={textVariants} initial="hidden" animate="visible">{title}</motion.h2>
            <motion.p variants={textVariants} initial="hidden" animate="visible">{description}</motion.p>

            <motion.div
              className={styles.progressBar}
              variants={progressBarVariants} // Usa as novas variantes da barra de progresso
              initial="initial"
              animate="animate"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}