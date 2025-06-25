// componentsFinance/Settings/BillingSettings.js
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import BillingHistoryRow from './BillingHistoryRow';
import { SiVisa } from 'react-icons/si';

const BillingSettings = () => {
    const billingHistory = [
        { id: 1, date: "1 de Junho, 2024", description: "Cobrança mensal - Plano Pro", amount: "R$ 49,90" },
        { id: 2, date: "1 de Maio, 2024", description: "Cobrança mensal - Plano Pro", amount: "R$ 49,90" },
    ];
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionWrapper title="Plano Atual" description="Você está no plano Pro. Gerencie seu plano e forma de pagamento.">
                <div className="p-6 bg-blue-600/10 dark:bg-blue-500/10 rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-blue-500">Plano Pro</h3>
                    <p className="mt-2 text-4xl font-extrabold">R$ 49,90<span className="text-lg font-medium text-light-subtle dark:text-dark-subtle">/mês</span></p>
                    <button className="mt-4 w-full py-2 font-semibold bg-blue-600 text-white rounded-lg">Gerenciar Plano</button>
                </div>
            </SectionWrapper>

            <div className="my-8 border-t border-black/5 dark:border-white/10"></div>

            <SectionWrapper title="Forma de Pagamento" description="O cartão que será usado para as cobranças futuras.">
                <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                        <SiVisa size={32} />
                        <p className="font-semibold">Cartão de crédito terminando em 4242</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-500 hover:underline">Alterar</button>
                </div>
            </SectionWrapper>

            <div className="my-8 border-t border-black/5 dark:border-white/10"></div>

            <SectionWrapper title="Histórico de Faturamento" description="Baixe o recibo de suas cobranças anteriores.">
                <div className="divide-y divide-black/5 dark:divide-white/5">
                    {billingHistory.map(invoice => <BillingHistoryRow key={invoice.id} invoice={invoice} />)}
                </div>
            </SectionWrapper>
        </motion.div>
    );
};
export default BillingSettings;