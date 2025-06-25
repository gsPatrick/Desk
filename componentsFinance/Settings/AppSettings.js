// componentsFinance/Settings/AppSettings.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import SettingsToggle from './SettingsToggle';

const AppSettings = () => {
    const [notifications, setNotifications] = useState(true);
    const [newsletter, setNewsletter] = useState(false);
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SectionWrapper title="Preferências Gerais" description="Personalize a aparência e o comportamento da aplicação.">
                <div>
                    <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Moeda Padrão</label>
                    <select className="w-full mt-1 p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10">
                        <option>Real Brasileiro (BRL)</option>
                        <option>Dólar Americano (USD)</option>
                        <option>Euro (EUR)</option>
                    </select>
                </div>
            </SectionWrapper>
            
            <div className="my-8 border-t border-black/5 dark:border-white/10"></div>

            <SectionWrapper title="Notificações" description="Escolha como você recebe as comunicações.">
                <div className="divide-y divide-black/5 dark:divide-white/5">
                    <SettingsToggle label="Alertas de Vencimento" description="Avisar sobre contas a pagar próximas do vencimento." enabled={notifications} setEnabled={setNotifications} />
                    <SettingsToggle label="Resumos Mensais" description="Enviar um resumo do seu fluxo de caixa todo mês." enabled={true} setEnabled={() => {}} />
                    <SettingsToggle label="Newsletter" description="Notícias e atualizações do Finance OS." enabled={newsletter} setEnabled={setNewsletter} />
                </div>
            </SectionWrapper>
        </motion.div>
    );
};
export default AppSettings;