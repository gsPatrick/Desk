// componentsFreelancer/Projects/ProjectFoldersSidebar.js (NOVO)

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { FolderIcon, FolderOpenIcon, ChevronRightIcon, DocumentCheckIcon } from '@heroicons/react/24/solid'; // Ícones para pastas e projetos
import { PlusIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

// Componente interno para um item de pasta
const FolderItem = ({ folder, isSelected, onSelect, projectCount }) => {
    return (
        <button
            onClick={() => onSelect(folder.id)}
            className="w-full text-left flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 relative"
        >
            {isSelected && (
                <motion.div
                    layoutId="active-project-folder-indicator" // ID para animação de layout
                    className="absolute inset-0 bg-blue-600/10 dark:bg-blue-500/10 rounded-lg"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
             {/* Ícone e Nome da Pasta */}
            <div className="flex items-center gap-3 z-10">
                {isSelected ? <FolderOpenIcon className="h-6 w-6 text-blue-500" /> : <FolderIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle" />}
                <span className={`font-semibold ${isSelected ? 'text-light-text dark:text-dark-text' : 'text-light-subtle dark:text-dark-subtle'}`}>
                    {folder.name}
                </span>
            </div>
            {/* Contagem de Projetos */}
            <span className="text-sm text-light-subtle dark:text-dark-subtle z-10">{projectCount}</span>
        </button>
    );
};

// Componente interno para um item de projeto na lista (diferente do card)
const ProjectListItem = ({ project, isSelected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 relative"
        >
            {isSelected && (
                <motion.div
                    layoutId="active-project-item-indicator" // ID para animação de layout
                    className="absolute inset-0 bg-finance-pink/10 dark:bg-finance-pink/10 rounded-lg" // Cor diferente para item ativo
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
             {/* Ícone de Projeto e Nome */}
             {/* Ícone menor para a lista */}
            <DocumentCheckIcon className={`h-5 w-5 flex-shrink-0 z-10 ${isSelected ? 'text-finance-pink' : 'text-light-subtle dark:text-dark-subtle'}`} />
            <span className={`z-10 text-sm font-medium truncate ${isSelected ? 'text-light-text dark:text-dark-text' : 'text-light-subtle dark:text-dark-subtle'}`}>
                {project.name}
            </span>
        </button>
    );
};


const ProjectFoldersSidebar = ({ folders, projects, clients, selectedFolderId, onSelectFolder, selectedProjectId, onSelectProject, onAddFolder }) => {

    // Agrupar projetos por pasta
    const projectsByFolder = useMemo(() => {
        const grouped = {};
        folders.forEach(folder => {
            // Para a pasta 'Todos', inclui todos os projetos
            if (folder.id === 'folder-all') {
                grouped[folder.id] = projects;
            } else {
                grouped[folder.id] = projects.filter(p => p.folderId === folder.id);
            }
        });
        return grouped;
    }, [folders, projects]);


    return (
        <LayoutGroup> {/* Agrupa animações de layout para FolderItem e ProjectListItem */}
            <div className="p-4 space-y-6 h-full flex flex-col">

                {/* Seção de Pastas */}
                <div>
                    <div className="flex justify-between items-center mb-2 px-2">
                        <h3 className="text-sm font-semibold uppercase text-light-subtle dark:text-dark-subtle">Pastas</h3>
                        <button onClick={onAddFolder} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-light-subtle dark:text-dark-subtle" title="Nova Pasta">
                             <PlusIcon className="h-5 w-5"/>
                        </button>
                    </div>
                    <div className="space-y-1">
                        {folders.map(folder => (
                            <FolderItem
                                key={folder.id}
                                folder={folder}
                                isSelected={selectedFolderId === folder.id}
                                onSelect={onSelectFolder}
                                projectCount={projectsByFolder[folder.id]?.length || 0} // Mostra contagem
                            />
                        ))}
                    </div>
                </div>

                {/* Seção de Projetos na Pasta Selecionada */}
                 {selectedFolderId && (
                    <motion.div
                        key={`projects-in-${selectedFolderId}`} // Anima a troca de lista ao mudar de pasta
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 overflow-hidden flex flex-col" // flex-1 para ocupar o espaço restante, overflow-hidden
                    >
                        <h3 className="text-sm font-semibold uppercase text-light-subtle dark:text-dark-subtle mb-2 px-2">
                            {folders.find(f => f.id === selectedFolderId)?.name || 'Projetos'}
                        </h3>
                         {/* Lista de Projetos com scroll interno */}
                        <div className="space-y-1 flex-1 overflow-y-auto -mr-2 pr-2"> {/* -mr-2 pr-2 para barra de scroll interna */}
                             {projectsByFolder[selectedFolderId]?.length > 0 ? (
                                projectsByFolder[selectedFolderId].map(project => (
                                    <ProjectListItem
                                        key={project.id}
                                        project={project}
                                        isSelected={selectedProjectId === project.id}
                                        onClick={() => onSelectProject(project.id)} // Passa o ID para seleção
                                    />
                                ))
                             ) : (
                                 <p className="text-sm text-light-subtle dark:text-dark-subtle text-center py-4">
                                     Nenhum projeto nesta pasta.
                                 </p>
                             )}
                        </div>
                    </motion.div>
                 )}

            </div>
        </LayoutGroup>
    );
};

export default ProjectFoldersSidebar;