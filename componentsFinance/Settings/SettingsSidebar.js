// componentsFinance/Settings/SettingsSidebar.js
import { motion } from 'framer-motion';
import { UserIcon, Cog6ToothIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: 'Meu Perfil', tab: 'profile', icon: UserIcon },
    { name: 'Preferências', tab: 'app', icon: Cog6ToothIcon },
    { name: 'Segurança', tab: 'security', icon: ShieldCheckIcon },
    { name: 'Plano e Faturamento', tab: 'billing', icon: CurrencyDollarIcon },
  ];
  return (
    <nav className="space-y-1">
      {navItems.map(item => (
        <button
          key={item.tab}
          onClick={() => setActiveTab(item.tab)}
          className="w-full relative flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        >
          {activeTab === item.tab && (
            <motion.div
              layoutId="active-settings-tab"
              className="absolute inset-0 bg-blue-600/10 dark:bg-blue-500/10 rounded-lg"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <item.icon className={`h-6 w-6 flex-shrink-0 z-10 transition-colors ${activeTab === item.tab ? 'text-blue-500' : 'text-light-subtle dark:text-dark-subtle'}`}/>
          <span className={`z-10 font-semibold transition-colors ${activeTab === item.tab ? 'text-light-text dark:text-dark-text' : 'text-light-subtle dark:text-dark-subtle'}`}>{item.name}</span>
        </button>
      ))}
    </nav>
  );
};
export default SettingsSidebar;