// componentsFreelancer/Projects/ProjectsLayout.js (NOVO - LAYOUT COM SIDEBAR)

import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion'; // Para animação de saída/entrada do conteúdo principal

const ProjectsLayout = ({ sidebar, mainContent }) => {
  return (
    <motion.div
        className="bg-light-bg dark:bg-dark-bg min-h-screen flex flex-col lg:h-screen lg:overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        {/* Header (assumimos que virá do componente pai ou será fixo fora deste layout) */}
        {/* <FinanceHeader /> */}

        {/* Main Content Area */}
        {/* Adicionado pt-28 para acomodar o header fixo do Finance OS */}
         {/* lg:flex lg:flex-row para sidebar e main content lado a lado no desktop */}
        <main className="flex-1 pt-28 pb-10 lg:overflow-hidden lg:flex lg:flex-row">
            {/* Sidebar - fixo, largura definida, scroll interno */}
            {/* flex-shrink-0 para não encolher, w-full no mobile, lg:w-64 no desktop */}
            {/* overflow-y-auto para scroll da sidebar */}
            <div className="flex-shrink-0 w-full lg:w-64 border-r border-black/5 dark:border-white/10 lg:h-full overflow-y-auto">
                 {sidebar}
            </div>

            {/* Main Content Area - ocupa o restante do espaço, scroll interno */}
            {/* lg:flex-1 para ocupar espaço, lg:overflow-y-auto para scroll, p-6 para padding */}
             {/* AnimatePresence para animar a troca do conteúdo (bem-vindo vs dashboard) */}
            <div className="lg:flex-1 lg:overflow-y-auto p-4 sm:p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={mainContent ? mainContent.key : 'welcome'} // Usa uma chave para animar a troca
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                         className="h-full" // Garante que o container interno ocupe a altura
                    >
                        {mainContent ? mainContent.element : (
                             // Conteúdo de boas-vindas se nenhum projeto estiver selecionado
                             <div className="flex items-center justify-center h-full text-center text-light-subtle dark:text-dark-subtle">
                                 <p className="text-lg">Selecione um projeto na lateral para visualizar o dashboard.</p>
                             </div>
                        )}
                     </motion.div>
                </AnimatePresence>
            </div>
        </main>
    </motion.div>
  );
};

export default ProjectsLayout;