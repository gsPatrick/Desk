// componentsFinance/Dashboard/CreditCardBill.js (AJUSTADO: Design de Cartão de Crédito)

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SiVisa, SiMastercard, SiAmericanexpress, SiEllo } from 'react-icons/si';

// Mapeamento local de bandeiras para ícones
const localBrandIconMap = {
    'Visa': SiVisa,
    'Mastercard': SiMastercard,
    'American Express': SiAmericanexpress,
    'Elo': SiEllo,
};

const CreditCardBill = ({ card, invoice, mapBrandToIcon, formatDueDate }) => {
    if (!card) return null;

    const BrandIconComponent = mapBrandToIcon ? mapBrandToIcon(card.brand) : localBrandIconMap[card.brand];

    // Formata o dia de fechamento
    const formattedClosingDay = card.closingDay ? `${card.closingDay} de ${new Date().toLocaleDateString('pt-BR', { month: 'long' })}` : 'N/A';

    return (
        <motion.div
            className="w-full" // Garante que o container ocupe a largura disponível
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            {/* Div externa para criar a proporção de um cartão */}
            <div
                className="relative aspect-[85.6/53.98] w-full p-6 rounded-2xl overflow-hidden text-white flex flex-col justify-between shadow-lg"
                // Gradiente de fundo escuro para um visual premium
                style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                }}
            >
                {/* Efeito de brilho sutil */}
                <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-blue-500/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-finance-pink/10 rounded-full blur-3xl opacity-40 translate-x-1/4 translate-y-1/4"></div>

                {/* Conteúdo do cartão */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Header: Nome do Cartão e Bandeira */}
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{card.name}</h3>
                        {BrandIconComponent && <BrandIconComponent size={40} className="text-white/80" />}
                    </div>

                    {/* Footer: Valor, Final e Link */}
                    <div>
                        <p className="text-sm font-medium text-white/70">Fatura Atual</p>
                        {/* VALOR DA FATURA COM DESTAQUE */}
                        <p className="text-4xl font-bold tracking-tight mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice?.total || 0)}
                        </p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-white/70 leading-tight">Final {card.finalDigits}</p>
                                <p className="text-xs text-white/50 leading-tight">Fecha dia {formattedClosingDay}</p>
                            </div>
                            <Link
                                href={`/finance/invoices?accountId=${card.id}`}
                                className="text-xs font-semibold text-finance-pink hover:underline"
                            >
                                Detalhes →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreditCardBill;