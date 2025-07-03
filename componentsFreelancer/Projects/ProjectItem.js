// componentsFreelancer/Projects/ProjectItem.js (AJUSTADO)

import { motion } from 'framer-motion';
import { CodeBracketIcon, FolderOpenIcon, LinkIcon } from '@heroicons/react/24/solid';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'; // Ícone para Cliente
import { SiGithub } from 'react-icons/si'; // Ícone do GitHub
import Link from 'next/link';

// Função auxiliar para obter o nome do cliente
const getClientName = (clientId, clients) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente Desconhecido';
};

// Componente para um item individual na lista de projetos
const ProjectItem = ({ project, clients }) => {
    const clientName = getClientName(project.clientId, clients);

    // Determina a cor e o ícone do status (exemplo simples)
    const statusClasses = {
        'Em Andamento': 'text-blue-500',
        'Concluído': 'text-green-500',
        'Pausado': 'text-yellow-500',
        'Arquivado': 'text-gray-500',
        'default': 'text-gray-500',
    };

    return (
        <motion.div
            layout // Habilita animações de layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            // Adicionado flexbox/grid e espaçamento para responsividade
            className="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center py-4 px-2 sm:px-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors gap-3 sm:gap-4 border-b border-black/5 dark:border-white/5 last:border-b-0 cursor-pointer" // Adicionado cursor-pointer
        >
            {/* Coluna 1: Ícone do Projeto (ocupando 1 coluna no sm+) */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center sm:col-span-1 mr-2 sm:mr-0">
                 <FolderOpenIcon className={`h-6 w-6 ${statusClasses[project.status] || statusClasses.default}`} />
            </div>

            {/* Coluna 2: Nome do Projeto (ocupando 4 colunas no sm+) */}
            {/* Ajustado sm:col-span para acomodar melhor o layout geral */}
            <div className="flex-1 sm:col-span-4 min-w-0">
                <p className="font-semibold text-light-text dark:text-dark-text truncate">{project.name}</p>
            </div>

             {/* Coluna 3: Cliente (ocupando 3 colunas no sm+) */}
            <div className="flex items-center gap-2 flex-1 sm:col-span-3 min-w-0">
                <BuildingOfficeIcon className="h-5 w-5 text-light-subtle dark:text-dark-subtle flex-shrink-0" />
                <p className="text-sm text-light-subtle dark:text-dark-subtle truncate">{clientName}</p>
            </div>

            {/* Coluna 4: Status (ocupando 2 colunas no sm+) */}
            <div className="flex-shrink-0 sm:col-span-2 min-w-0">
                 <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[project.status] || statusClasses.default} bg-black/5 dark:bg-white/5`}>
                    {project.status}
                 </span>
            </div>

             {/* Coluna 5: Link GitHub (ocupando 2 colunas no sm+), alinhado à direita no sm+ */}
            <div className="sm:col-span-2 flex justify-start sm:justify-end items-center gap-2 w-full sm:w-auto">
                 {project.githubUrl && (
                     <Link
                         href={project.githubUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center gap-1 text-blue-500 hover:underline"
                         title="Ver Repositório GitHub"
                         onClick={(e) => e.stopPropagation()} // Impede que o clique no link feche/edite o modal pai
                     >
                         <SiGithub className="h-5 w-5 flex-shrink-0" />
                     </Link>
                 )}
                 {/* Ícone de Chevron para indicar que a linha é clicável (detalhes/edição) */}
                  {/* <ChevronRightIcon className="h-5 w-5 text-light-subtle dark:text-dark-subtle flex-shrink-0" /> */}
            </div>
        </motion.div>
    );
};

export default ProjectItem;