// componentsFinance/Settings/ProfileSettings.js
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CameraIcon } from '@heroicons/react/24/outline';
import SectionWrapper from './SectionWrapper';
import SettingsInput from './SettingsInput';

const ProfileSettings = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <SectionWrapper title="Informações Pessoais" description="Atualize sua foto e detalhes pessoais.">
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                    <Image src="/images/profile-placeholder.png" layout="fill" className="rounded-full" alt="Patrick Siqueira"/>
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white"><CameraIcon className="h-4 w-4"/></button>
                </div>
                <div className="flex-1">
                    <SettingsInput label="Nome Completo" type="text" value="Patrick Siqueira" />
                    <SettingsInput label="Email" type="email" value="patrick.developer@email.com" disabled />
                </div>
            </div>
        </SectionWrapper>
        
        <SectionWrapper title="Informações Profissionais" description="Dados da sua empresa ou atuação como freelancer.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingsInput label="Empresa/Nome Profissional" type="text" value="Patrick.Developer" />
                <SettingsInput label="CNPJ" type="text" value="58.315.507/0001-14" disabled />
            </div>
        </SectionWrapper>

        <div className="flex justify-end mt-8">
            <button className="px-6 py-2 font-semibold bg-finance-pink text-white rounded-lg">Salvar Alterações</button>
        </div>
    </motion.div>
);
export default ProfileSettings;