// componentsFinance/Invoices/CreditCardVisual.js (NOVO)
import { motion } from 'framer-motion';

const CreditCardVisual = ({ card, isSelected, onSelect }) => {
  const cardVariants = {
    initial: { scale: 0.95, y: 10, opacity: 0.7 },
    animate: { 
      scale: isSelected ? 1.05 : 1, 
      y: isSelected ? -10 : 0, 
      opacity: 1,
      zIndex: isSelected ? 10 : 1,
      boxShadow: isSelected ? '0px 20px 30px rgba(0,0,0,0.3)' : '0px 5px 15px rgba(0,0,0,0.2)',
    },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={() => onSelect(card.id)}
      className={`relative w-full aspect-[1.586] rounded-xl cursor-pointer text-white p-5 flex flex-col justify-between overflow-hidden
        ${card.brand === 'Visa' ? 'bg-gradient-to-br from-blue-900 to-blue-700' : 'bg-gradient-to-br from-gray-800 to-gray-700'}`}
    >
      {/* Padrão de fundo sutil */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5"></div>
      
      <div className="flex justify-between items-start">
        <span className="font-semibold">{card.name}</span>
        <card.icon size={32} />
      </div>

      <div>
        <p className="font-mono tracking-widest text-lg">**** **** **** {card.final}</p>
      </div>
    </motion.div>
  );
};

export default CreditCardVisual;