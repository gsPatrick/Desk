// componentsFreelancer/Projects/ProjectDetailPanel.js (REFEITO PARA LAYOUT DASHBOARD)

import { motion } from 'framer-motion';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'; // Ícones
import { FolderOpenIcon } from '@heroicons/react/24/outline'; // Ícone da página
import { SiGithub, SiWhatsapp } from 'react-icons/si'; // Ícones para placeholders
import { ChartPieIcon, CreditCardIcon, CalendarDaysIcon, DocumentChartBarIcon, BeakerIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; // Ícones para placeholders
import { useMemo } from 'react'; // Para memoizar cliente

// Importar os componentes de seção (agora eles não têm estilo externo)
import ClientInfoSection from './ProjectSections/ClientInfoSection';
import GitHubInfoSection from './ProjectSections/GitHubInfoSection';
import GeneralInfoSection from './ProjectSections/GeneralInfoSection';


// Componente de placeholder para preencher a grade
const PlaceholderPanel = ({ title, icon: Icon }) => (
    <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-3 mb-4 flex-shrink-0">
            {Icon && <Icon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>} {title}
        </h3>
        <div className="flex-1 flex items-center justify-center text-light-subtle dark:text-dark-subtle italic">
            <p>Conteúdo futuro aqui.</p>
        </div>
    </div>
);


// Componente do PAINEL de Detalhes do Projeto (para ser exibido diretamente na página)
const ProjectDetailPanel = ({ project, clients, onEdit, onBackToList }) => {

     // Buscar o cliente completo e memoizar para evitar busca repetida
    const client = useMemo(() => clients?.find(c => c.id === project?.clientId), [project, clients]);

    if (!project) return null; // Não renderiza nada se nenhum project for passado

    return (
        <motion.div
             // Animação de entrada/saída do painel
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'circOut' } }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.3, ease: 'circIn' } }}
             // Estilo do container - AGORA SEM FUNDO/BORDA/SHADOW - É APENAS O CONTAINER DO GRID
            className="flex flex-col h-full w-full max-w-screen-xl mx-auto" // flex-col e h-full para gerenciar o header e o grid abaixo, max-w e mx-auto para centralizar
        >
             {/* Header do Painel de Detalhes - Fixo no topo da main */}
            <div className="flex items-center justify-between pb-4 mb-6 flex-shrink-0"> {/* Aumentado mb */}
                <div className="flex items-center gap-4">
                     {/* Botão Voltar para a Lista */}
                    <button onClick={onBackToList} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <ArrowLeftIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
                    </button>
                     {/* Título Principal do Projeto */}
                     {/* Font size alinhado com outros headers de página ou Dashboard hero */}
                     <h2 className="text-3xl sm:text-4xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">{project.name}</h2> {/* Font maior */}
                </div>
                 {/* Botão de Editar */}
                 <button onClick={() => onEdit(project)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex-shrink-0">
                     <PencilIcon className="h-4 w-4"/> Editar Projeto
                 </button>
            </div>

            {/* Corpo do Painel - ESTE É O GRID COM LAYOUT DASHBOARD */}
             {/* flex-1 para ocupar o espaço restante, overflow-y-auto (será na main) */}
             {/* GRID DASHBOARD-LIKE: 4 colunas base no desktop */}
             {/* gap-6 entre os painéis */}
             {/* h-full para que os painéis filhas possam ter h-full */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full"> {/* Use md:grid-cols-2 para tablets, lg:grid-cols-4 para desktop */}

                 {/* PAINEL 1: Cliente/WhatsApp/IA - Ocupa 2 colunas no desktop */}
                 <div className="md:col-span-2 lg:col-span-2">
                     <ClientInfoSection client={client} /> {/* Passa o cliente encontrado */}
                 </div>

                 {/* PAINEL 2: Informações Gerais - Ocupa 1 coluna */}
                 {/* md:col-span-1 para tablets */}
                 <div className="md:col-span-1 lg:col-span-1">
                     <GeneralInfoSection project={project} /> {/* Passa o projeto */}
                 </div>

                 {/* PAINEL 3: GitHub Info (Commits) - Ocupa 2 colunas e 2 linhas no desktop */}
                 {/* md:col-span-2 no tablet */}
                 {/* lg:col-span-2 lg:row-span-2 no desktop */}
                 {/* Para fazer row-span funcionar, os painéis devem estar em ordem na grid */}
                 {/* Alternativa mais simples: Colocar GitHub abaixo de Cliente, ocupando 2 colunas */}
                 {/* Vamos colocar GitHub abaixo de Cliente, ocupando 2 colunas */}
                  <div className="md:col-span-2 lg:col-span-2"> {/* Ocupa 2 colunas no md+ */}
                     <GitHubInfoSection project={project} /> {/* Passa o projeto */}
                 </div>


                 {/* Adicionar Painéis Placeholder para simular o layout do Dashboard */}

                 {/* Placeholder 1: Orçamento/Finanças do Projeto */}
                 <div className="md:col-span-1 lg:col-span-1">
                      <PlaceholderPanel title="Finanças do Projeto" icon={ChartPieIcon} />
                 </div>

                 {/* Placeholder 2: Horas Registradas / Timesheet */}
                 <div className="md:col-span-1 lg:col-span-1">
                      <PlaceholderPanel title="Horas Registradas" icon={CalendarDaysIcon} />
                 </div>

                  {/* Placeholder 3: Relatórios Gerados */}
                 <div className="md:col-span-2 lg:col-span-2"> {/* Pode ocupar 2 colunas */}
                      <PlaceholderPanel title="Relatórios Gerados" icon={DocumentChartBarIcon} />
                 </div>

                 {/* Placeholder 4: Próximos Marcos/Entregas */}
                  <div className="md:col-span-1 lg:col-span-1">
                      <PlaceholderPanel title="Próximos Marcos" icon={ClipboardDocumentListIcon} />
                 </div>


            </div>

        </motion.div>
    );
};
export default ProjectDetailPanel;