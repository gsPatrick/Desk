import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoAlertCircleOutline } from 'react-icons/io5';
import styles from './SessionExpiredModal.module.css';
import { useRouter } from 'next/router';
import { sessionState } from '../../utils/session-state'; // IMPORTA O NOVO MÓDULO DE ESTADO

export default function SessionExpiredModal({ isOpen, onClose }) {
  const router = useRouter();

  const handleRedirectToLogin = () => {
    localStorage.removeItem('authToken'); // Limpa o token expirado
    sessionState.setExpired(false); // <<< Importante: reseta a flag global
    onClose(); // Fecha o modal localmente (que por sua vez chama sessionState.setExpired(false))
    router.push('/colaborativo/login'); // Redireciona
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 15, delay: 0.1 } },
    exit: { opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleRedirectToLogin}
        >
          <motion.div
            className={styles.modalCard}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.iconWrapper}>
              <IoAlertCircleOutline size={60} className={styles.icon} />
            </div>
            <h2 className={styles.title}>Sua sessão expirou!</h2>
            <p className={styles.description}>
              Para sua segurança, você foi desconectado(a). Por favor, faça login novamente.
            </p>
            <button onClick={handleRedirectToLogin} className={styles.loginButton}>
              Fazer Login
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}