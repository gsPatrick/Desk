// componentsFreelancer/Projects/ProjectDashboard.js (NOVO)

import { motion } from 'framer-motion';
import ClientCard from './ClientCard';
import WhatsappCard from './WhatsappCard';
import GithubCard from './GithubCard';
import TasksCard from './TasksCard';

const ProjectDashboard = ({ project, clients, onEditClient, onAddTask, onEditTask, onDeleteTask }) => {
    // Encontra o cliente associado
    const projectClient = clients.find(c => c.id === project.clientId);

    const dashboardVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
    };


    return (
        <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full" // Grid responsivo
            variants={dashboardVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Coluna 1 / Span 1-2 */}
            <motion.div className="lg:col-span-2 h-full" variants={cardVariants}>
                 {/* Passa o cliente encontrado e o handler de edição */}
                <ClientCard client={projectClient} onEdit={onEditClient} />
            </motion.div>

            {/* Coluna 3 */}
             <motion.div className="lg:col-span-1 h-full" variants={cardVariants}>
                 {/* Placeholder para outro card pequeno, talvez Resumo Financeiro do Projeto? */}
                  <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full">
                     <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">Resumo do Projeto</h3>
                     <p className="text-sm text-light-subtle dark:text-dark-subtle">{project.description}</p>
                     {/* Adicionar mais detalhes aqui */}
                 </div>
            </motion.div>

             {/* Card WhatsApp - Ocupa 1 ou 2 colunas */}
             <motion.div className="lg:col-span-1 h-full" variants={cardVariants}>
                <WhatsappCard
                     history={project.whatsappHistory || []}
                     aiSuggestion={project.whatsappAISuggestion}
                     // onSendMessage={handleSendMessage} // TODO: Implementar handler real
                />
             </motion.div>

             {/* Card GitHub - Ocupa 2 ou 3 colunas */}
            <motion.div className="lg:col-span-2 h-full" variants={cardVariants}>
                 <GithubCard project={project} />
            </motion.div>


             {/* Card Demandas/Tarefas - Ocupa 1 ou 3 colunas (dependendo do layout) */}
             <motion.div className="lg:col-span-3 h-full" variants={cardVariants}> {/* Ocupa 3 colunas para uma lista mais longa */}
                <TasksCard
                     projectId={project.id} // Passa o ID do projeto
                     tasks={project.tasks || []} // Passa as tarefas do projeto
                     onAddTask={onAddTask} // Passa handlers para gerenciamento de tarefas
                     onEditTask={onEditTask}
                     onDeleteTask={onDeleteTask}
                />
            </motion.div>

            {/* TODO: Adicionar outros cards conforme necessário */}

        </motion.div>
    );
};

export default ProjectDashboard;