// componentsFinance/Invoices/WalletCard.js (AJUSTADO: Menu de Opções do Cartão como Overlay)

import { motion, AnimatePresence } from 'framer-motion';
// Importe o ícone EllipsisVerticalIcon
import { PlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react'; // Importe useEffect
// Ícones de bandeira (Mantidos)
import { SiVisa, SiMastercard, SiAmericanexpress, SiEllo } from 'react-icons/si';


const localBrandIconMap = {
    'Visa': SiVisa,
    'Mastercard': SiMastercard,
    'American Express': SiAmericanexpress,
    'Elo': SiEllo,
};

const WalletCard = ({ card, invoice, isSelected, onSelect, onEditClick, onDeleteClick }) => {
  if (!card) return null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // O ícone da bandeira deve vir da prop icon do card (que é uma string ex: 'SiVisa')
  const BrandIconComponent = card && card.icon ? localBrandIconMap[card.icon] : null;

  // Handler para toggle do menu (agora apenas abre o overlay)
  const handleMenuToggle = (e) => {
      e.stopPropagation(); // Impede propagação
      setIsMenuOpen(true); // Abre o menu (overlay)
  };

  // Handlers para as ações do menu (fecham o menu e chamam a prop)
  const handleEditClick = (e) => {
      e.stopPropagation();
      setIsMenuOpen(false); // Fecha o menu overlay
      if (onEditClick) onEditClick(card.id);
  };

  const handleDeleteClick = (e) => {
      e.stopPropagation();
      setIsMenuOpen(false); // Fecha o menu overlay
      if (onDeleteClick) onDeleteClick(card.id);
  };

  // Handler para o botão Cancelar/Sair do menu
  const handleCancelClick = (e) => {
      e.stopPropagation();
      setIsMenuOpen(false); // Fecha o menu overlay
  };

  // Não precisamos mais do useEffect para fechar ao clicar fora, o overlay click faz isso.
  // useEffect(() => { ... }, [isMenuOpen]);


  return (
    <motion.div
      layoutId={`card-container-${card.id}`}
      onClick={onSelect} // Clicar no card principal seleciona ele
      style={{
          background: card.color ? card.color : 'linear-gradient(to bottom right, #1a202c 0%, #2d3748 100%)'
      }}
      className="relative w-full max-w-sm mx-auto aspect-[1.586] rounded-2xl p-6 flex flex-col justify-between cursor-pointer text-white shadow-lg transition-transform duration-300 overflow-hidden"
      whileHover={{ y: isSelected ? -10 : -5 }}
    >
      {isSelected && (
        <motion.div
          layoutId="selected-card-indicator"
          className="absolute inset-0 border-2 border-finance-lime rounded-2xl"
        />
      )}

      <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-white/10 rounded-full blur-3xl opacity-50" />

      {/* Conteúdo do Cartão */}
      <div className="flex justify-between items-start z-10">
        <span className="font-semibold text-lg">{card.name}</span>
        {BrandIconComponent && <BrandIconComponent size={36} className="opacity-80" />}

         {/* Botão que abre o Overlay de Opções */}
         {/* Posicionado de forma flexível no final, não absoluto */}
         <div className="flex-shrink-0 ml-2 z-10"> {/* z-index para garantir que o botão esteja clicável */}
             <motion.button
                 onClick={handleMenuToggle} // Agora apenas abre o overlay
                 className="p-1 rounded-full hover:bg-black/30 transition-colors text-white opacity-80 hover:opacity-100"
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 title="Opções do Cartão"
             >
                 <EllipsisVerticalIcon className="h-6 w-6"/>
             </motion.button>
         </div>
      </div>

      <div className="z-10">
        <p className="text-sm opacity-70">Fatura Atual</p>
        <p className="text-3xl font-bold">
          {invoice ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total || 0) : 'R$ 0,00'}
        </p>
         {card.closingDay && <p className="text-xs opacity-60 mt-1">Fecha dia {card.closingDay}</p>}
      </div>

      {/* CORRIGIDO: Overlay Centralizado para o Menu de Opções do Cartão */}
      {/* AnimatePresence para animar a entrada/saída */}
      <AnimatePresence>
          {isMenuOpen && (
              // Container principal do overlay (fundo semi-transparente e centralização)
              <motion.div
                  key="card-menu-overlay" // Chave para AnimatePresence
                  initial={{ opacity: 0 }} // Animação de entrada do fundo
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} // Animação de saída do fundo
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" // Fixado, cobre a tela, fundo transparente, centraliza conteúdo
                  onClick={handleCancelClick} // Clicar no fundo semi-transparente fecha o menu
              >
                  {/* Container das Opções do Menu (centralizado) */}
                  <motion.div
                      initial={{ y: 50, opacity: 0 }} // Animação de entrada do menu (vindo de baixo)
                      animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
                      exit={{ y: 50, opacity: 0 }} // Animação de saída do menu (voltando para baixo)
                      className="w-full max-w-xs bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden z-50 border border-black/10 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark" // Largura máxima, background, sombra, z-index alto, borda, cor do texto
                      onClick={(e) => e.stopPropagation()} // Impede que o clique DENTRO do menu feche o overlay
                  >
                      {/* Opções do Menu (Botões) */}
                      <button onClick={handleEditClick} className="block w-full text-left px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                          Editar
                      </button>
                      <button onClick={handleDeleteClick} className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10">
                          Remover
                      </button>
                      {/* Separador visual */}
                      <div className="h-px bg-black/10 dark:bg-white/10 my-1"></div>
                      {/* Botão Cancelar */}
                      <button onClick={handleCancelClick} className="block w-full text-center px-4 py-3 text-sm font-semibold text-blue-500 hover:bg-blue-500/10">
                          Cancelar
                      </button>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>


    </motion.div>
  );
};

export default WalletCard;