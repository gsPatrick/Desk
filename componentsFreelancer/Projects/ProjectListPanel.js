// componentsFreelancer/Projects/ProjectListPanel.js (MANTIDO - SEM ESTILO EXTERNO)

import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard'; // Importa o card
// Removido import de FolderOpenIcon pois não é mais usado aqui


const ProjectListPanel = ({ projects, clients, onSelectProject }) => {

     const containerVariants = { // Variações de animação para o container da lista
         hidden: { opacity: 0 },
         visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
     };

    return (
         <motion.div
             // Animação de entrada/saída (mantida)
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'circOut' } }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.3, ease: 'circIn' } }}
             // Removido ESTILO DE PAINEL EXTERNO, apenas layout
             // Adicionado padding que antes estava no painel externo
            className="flex flex-col h-full w-full max-w-screen-xl mx-auto p-4 sm:p-6" // flex-col e h-full para ocupar espaço, max-w e mx-auto para centralizar, ADICIONADO PADDING
         >
             {/* Removido o header interno, o header da página é usado */}

             {/* Corpo do Painel: GRID de Cards */}
             {/* flex-1 para ocupar o espaço restante, overflow-y-auto será na main */}
             <div className="flex-1">
                 {projects.length > 0 ? (
                     // AnimatePresence e motion.div para a lista/grid
                     <AnimatePresence>
                         <motion.div
                             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // Configuração do grid responsivo
                             variants={containerVariants} // Animação de container (stagger)
                             initial="hidden"
                             animate="visible"
                             layout // Adicionado layout para animação de reordenamento/remoção
                         >
                             {projects.map(project => (
                                 <ProjectCard
                                     key={project.id}
                                     project={project}
                                     clients={clients}
                                     onClick={() => onSelectProject(project)} // Chama o handler para selecionar o projeto
                                 />
                             ))}
                         </motion.div>
                     </AnimatePresence>
                 ) : (
                     <p className="text-center text-light-subtle dark:text-dark-subtle py-10">
                         Nenhum projeto encontrado. Comece adicionando um!
                     </p>
                 )}
             </div>
         </motion.div>
    );
};

export default ProjectListPanel;