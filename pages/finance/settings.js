// pages/finance/settings.js (VERSÃO "POLISHED CONTROL PANEL")
import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader';
import SettingsSidebar from '../../componentsFinance/Settings/SettingsSidebar'; // Importar
import ProfileSettings from '../../componentsFinance/Settings/ProfileSettings';
import AppSettings from '../../componentsFinance/Settings/AppSettings';
import SecuritySettings from '../../componentsFinance/Settings/SecuritySettings';
import BillingSettings from '../../componentsFinance/Settings/BillingSettings';
import { UserIcon, Cog6ToothIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const pageMetas = {
    profile: { title: "Meu Perfil", icon: UserIcon },
    app: { title: "Preferências", icon: Cog6ToothIcon },
    security: { title: "Segurança", icon: ShieldCheckIcon },
    billing: { title: "Plano e Faturamento", icon: CurrencyDollarIcon },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const ActiveIcon = pageMetas[activeTab].icon;

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen">
      <Head><title>Configurações | Finance OS</title></Head>
      <FinanceHeader />

      <main className="container mx-auto px-6 pt-32 pb-10">
        
        {/* Header Contextual da Página */}
        <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="p-3 bg-light-surface dark:bg-dark-surface rounded-xl border border-black/5 dark:border-white/10">
                <ActiveIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">{pageMetas[activeTab].title}</h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-1">
            <LayoutGroup> {/* Permite a animação do indicador da aba */}
                <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </LayoutGroup>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab} // A chave garante a animação de troca
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'app' && <AppSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'billing' && <BillingSettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}