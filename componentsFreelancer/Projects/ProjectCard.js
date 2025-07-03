// componentsFreelancer/Projects/ProjectCard.js (AJUSTADO SLIGHTLY)

import { motion } from 'framer-motion';
import { CodeBracketIcon, FolderOpenIcon, LinkIcon } from '@heroicons/react/24/solid';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';

// Função auxiliar para obter o nome do cliente
const getClientName = (clientId, clients) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente Desconhecido';
};

// Componente para um CARD individual na lista de projetos
const ProjectCard = ({ project, clients, onClick }) => {
    const clientName = getClientName(project.clientId, clients);

    // Determina a cor e o ícone do status
    const statusClasses = {
        'Em Andamento': 'text-blue-500',
        'Concluído': 'text-green-500',
        'Pausado': 'text-yellow-500',
        'Arquivado': 'text-gray-500',
        'default': 'text-gray-500',
    };

     // Formata a data
    const formattedStartDate = project.startDate ? new Date(project.startDate + 'T00:00:00Z').toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : 'Data Não Definida';


    return (
        <motion.div
            layout // Habilita animações de layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            // Estilo do card: fundo, borda, sombra, padding
            className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 cursor-pointer flex flex-col h-full"
            onClick={onClick} // Torna o card clicável
            whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }} // Animação sutil no hover
        >
            {/* Top section: Icon, Name, Status */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <FolderOpenIcon className={`h-7 w-7 flex-shrink-0 ${statusClasses[project.status] || statusClasses.default}`} />
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text leading-tight">{project.name}</h3>
                </div>
                 {/* Status Badge */}
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[project.status] || statusClasses.default} bg-black/5 dark:bg-white/5 flex-shrink-0`}>
                    {project.status}
                </span>
            </div>

            {/* Client Info */}
            <div className="flex items-center gap-2 text-sm text-light-subtle dark:text-dark-subtle mb-4">
                <BuildingOfficeIcon className="h-4 w-4 flex-shrink-0" />
                <span>{clientName}</span>
            </div>

             {/* Description Snippet (optional) */}
             {project.description && (
                 <p className="text-sm text-light-subtle dark:text-dark-subtle mb-4 line-clamp-2"> {/* line-clamp-2 limita a 2 linhas */}
                    {project.description}
                 </p>
             )}


            {/* Start Date and GitHub Link */}
            <div className="flex items-center justify-between text-xs text-light-subtle dark:text-dark-subtle mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                 <span>Início: {formattedStartDate}</span>
                 {project.githubUrl && (
                     <Link
                         href={project.githubUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center gap-1 text-blue-500 hover:underline"
                         title={`Ver Repositório GitHub (${project.githubBranch || 'branch não definida'})`}
                         onClick={(e) => e.stopPropagation()} // Impede que o clique no link ative o onClick do card
                     >
                         GitHub <SiGithub className="h-4 w-4 flex-shrink-0" />
                     </Link>
                 )}
            </div>

        </motion.div>
    );
};

export default ProjectCard;