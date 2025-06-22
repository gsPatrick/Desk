// componentsDesk/DeskWelcome/DeskWelcomeScreen.js (INICIALIZAÇÃO RÁPIDA)

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootMessages = [
  "Iniciando Patrick.Developer Desk OS...",
  "Módulos de Soluções: [|||||||||||||]",
  "Interface Cinematográfica: ATIVADA",
  "Bem-vindo ao seu Centro de Controle.",
];

const DeskWelcomeScreen = ({ onBootComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentMessageIndex < bootMessages.length) {
      const messageToType = bootMessages[currentMessageIndex];
      if (typedMessage.length < messageToType.length) {
        const timeoutId = setTimeout(() => {
          setTypedMessage(messageToType.substring(0, typedMessage.length + 1));
        }, 40 + Math.random() * 30); // Mais rápido
        return () => clearTimeout(timeoutId);
      } else {
        // Pausa antes da próxima linha ou conclusão
        const delay = currentMessageIndex === bootMessages.length - 1 ? 1200 : 600;
        const timeoutId = setTimeout(() => {
          if (currentMessageIndex < bootMessages.length - 1) {
            setCurrentMessageIndex(currentMessageIndex + 1);
            setTypedMessage('');
          } else {
            // Boot completo
            setShowCursor(false);
            if (onBootComplete) onBootComplete();
          }
        }, delay);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [typedMessage, currentMessageIndex, onBootComplete]);

  return (
    <motion.section
      className="relative h-screen w-full flex flex-col items-center justify-center p-6 bg-dark-bg text-dark-text overflow-hidden"
      // Animação para a seção inteira desaparecer após o boot
      // Isso será controlado pela página principal
    >
      {/* Scanlines sutis de fundo */}
      <motion.div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 49px, ${'#3b82f6'}33 50px),
            repeating-linear-gradient(90deg, transparent, transparent 49px, ${'#3b82f6'}33 50px)
          `, // Usando a cor de acento do tema
          backgroundSize: '50px 50px',
        }}
        animate={{ backgroundPosition: ['0 0', '50px 50px']}}
        transition={{ duration: 5, ease: 'linear', repeat: Infinity}}
      />

      <div className="relative z-10 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-3 text-shadow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          Patrick.Developer
        </motion.h1>
        <motion.h2
          className="text-2xl sm:text-3xl font-light text-dark-accent tracking-wider mb-12"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          Desk OS
        </motion.h2>

        <div className="font-mono text-sm sm:text-base text-green-400 p-3 border border-green-500/20 rounded-md bg-black/40 backdrop-blur-sm min-h-[50px] sm:min-h-[70px] flex items-center justify-center w-full max-w-md sm:max-w-lg mx-auto">
          <p className="whitespace-nowrap overflow-hidden">
            <span className="text-green-300 mr-1"></span>
            {typedMessage}
            {showCursor && <span className="inline-block w-2 h-full bg-green-400 animate-pulse ml-1"></span>}
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default DeskWelcomeScreen;