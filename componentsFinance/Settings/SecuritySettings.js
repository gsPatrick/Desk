// componentsFinance/Settings/SecuritySettings.js
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import SettingsInput from './SettingsInput';
import { ComputerDesktopIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

const SecuritySettings = () => (
     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <SectionWrapper title="Senha" description="Para sua segurança, recomendamos o uso de uma senha forte e única.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingsInput label="Senha Atual" type="password" />
                <SettingsInput label="Nova Senha" type="password" />
            </div>
            <div className="flex justify-end mt-4">
                <button className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">Alterar Senha</button>
            </div>
        </SectionWrapper>
        
        <div className="my-8 border-t border-black/5 dark:border-white/10"></div>

        <SectionWrapper title="Autenticação de Dois Fatores (2FA)" description="Adicione uma camada extra de segurança usando um aplicativo autenticador.">
             <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                <p className="font-medium">Status: Desativado</p>
                <button className="px-5 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg">Ativar 2FA</button>
            </div>
        </SectionWrapper>

        <div className="my-8 border-t border-black/5 dark:border-white/10"></div>

        <SectionWrapper title="Sessões Ativas" description="Estas são as sessões atualmente logadas na sua conta.">
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <ComputerDesktopIcon className="h-8 w-8 text-green-500" />
                    <div>
                        <p className="font-semibold">Chrome em Desktop (Sessão Atual)</p>
                        <p className="text-sm text-light-subtle dark:text-dark-subtle">São Paulo, SP - IP: 189.23.45.67</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <GlobeAltIcon className="h-8 w-8 text-light-subtle dark:text-dark-subtle" />
                    <div>
                        <p className="font-semibold">Safari em iPhone</p>
                        <p className="text-sm text-light-subtle dark:text-dark-subtle">Rio de Janeiro, RJ - IP: 201.56.78.90</p>
                    </div>
                </div>
                 <div className="flex justify-end mt-4">
                    <button className="px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg">Desconectar todas as outras sessões</button>
                </div>
             </div>
        </SectionWrapper>
    </motion.div>
);
export default SecuritySettings;