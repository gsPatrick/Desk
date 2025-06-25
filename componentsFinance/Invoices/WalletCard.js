// componentsFinance/Invoices/WalletCard.js (CORREÇÃO DE COR)
import { motion } from 'framer-motion';

const WalletCard = ({ card, invoice, isSelected, onSelect }) => {
  return (
    <motion.div
      layoutId={`card-container-${card.id}`}
      onClick={onSelect}
      // A cor de fundo do gradiente é fixa, independente do tema. O texto é sempre branco.
      className={`relative w-full max-w-sm mx-auto aspect-[1.586] rounded-2xl p-6 flex flex-col justify-between cursor-pointer text-white shadow-lg transition-transform duration-300 overflow-hidden bg-gradient-to-br ${card.color}`}
      whileHover={{ y: -5 }}
    >
      {isSelected && (
        <motion.div 
          layoutId="selected-card-indicator"
          className="absolute inset-0 border-2 border-finance-lime rounded-2xl"
        />
      )}
      
      <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-white/10 rounded-full blur-3xl opacity-50" />

      <div className="flex justify-between items-start z-10">
        <span className="font-semibold text-lg">{card.name}</span>
        <card.icon size={36} className="opacity-80" />
      </div>
      
      <div className="z-10">
        <p className="text-sm opacity-70">Fatura Atual</p>
        <p className="text-3xl font-bold">
          {invoice ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.total) : 'R$ 0,00'}
        </p>
      </div>
    </motion.div>
  );
};

export default WalletCard;