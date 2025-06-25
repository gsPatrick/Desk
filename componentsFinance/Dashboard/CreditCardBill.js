// componentsFinance/Dashboard/CreditCardBill.js (NOME CORRETO)
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SiVisa } from 'react-icons/si';

const CreditCardBill = () => {
  return (
    <motion.div
      className="relative col-span-1 md:col-span-2 p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="absolute top-0 right-0 h-full w-1/2 bg-finance-pink/20 blur-3xl"></div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">Cartão de Crédito</h3>
            <SiVisa size={36} className="text-white/80" />
          </div>
          <p className="text-sm text-white/60">Final 4242</p>
        </div>
        <div>
          <p className="text-sm text-white/60 mb-1">Fatura Atual</p>
          <p className="text-3xl font-bold">R$ 1.874,50</p>
          <Link
            href="#" // Futuramente levaria para /finance/cards/details
            className="mt-4 inline-block text-sm font-semibold text-finance-pink hover:underline"
          >
            Ver detalhes da fatura →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditCardBill;