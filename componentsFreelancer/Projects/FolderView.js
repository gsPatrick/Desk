// componentsFreelancer/Projects/FolderView.js (NOVO - Exibe Pastas e Projetos)

import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, PlusIcon } from '@heroicons/react/24/outline'; // Ícones para pasta e adicionar
import ProjectCard from './ProjectCard'; // Importa o ProjectCard

// Componente para exibir o conteúdo de uma pasta
const FolderView = ({ 
    currentFolder, // A pasta que está sendo exibida (null para raiz)
    folders, // Todas as pastas disponíveis
    projects, // Todos os projetos disponíveis
    clients, // Todos os clientes disponíveis
    onFolderClick, // Handler para clicar em uma subpasta
    onProjectClick, // Handler para clicar em um projeto (abrir dashboard)
    onAddFolder, // Handler para abrir modal de adicionar pasta
    onAddProject, // Handler para abrir modal de adicionar projeto
}) => {
    // Encontra as subpastas e projetos dentro da pasta atual
    const itemsInFolder = useMemo(() => {
         const folderId = currentFolder ? currentFolder.id : null; // null para pastas raiz

        const subfolders = folders.filter(folder => folder.parentFolderId === folderId);
        const projectsInFolder = projects.filter(project => project.folderId === folderId);

        // Combina subpastas e projetos
        // Poderia ordenar aqui (ex: pastas primeiro, depois projetos, por nome)
        return [
            ...subfolders.map(folder => ({ type: 'folder', item: folder })),
            ...projectsInFolder.map(project => ({ type: 'project', item: project })),
        ];
    }, [currentFolder, folders, projects]); // Dependências para recalcular

    // Animação para itens da lista/grid
     const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    };

    return (
        <motion.div
             key={currentFolder ? currentFolder.id : 'root'} // Chave para animação de troca de pasta
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.3, ease: 'easeInOut' }}
             className="h-full flex flex-col" // Adicionado flex-col para layout interno
        >
            {/* Botões de Ação (Adicionar Pasta/Projeto) */}
            <div className="flex justify-end gap-4 mb-6 flex-shrink-0"> {/* flex-shrink-0 para não sumir no scroll */}
                 {/* Botão Adicionar Pasta */}
                 <motion.button
                     onClick={onAddFolder}
                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg text-sm"
                     whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                 >
                     <PlusIcon className="h-5 w-5"/> Adicionar Pasta
                 </motion.button>
                  {/* Botão Adicionar Projeto */}
                 <motion.button
                    onClick={onAddProject}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg text-sm"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                    <PlusIcon className="h-5 w-5"/> Adicionar Projeto
                </motion.button>
            </div>


            {/* Lista de Pastas e Projetos (usando Grid para os Cards) */}
            <div className="flex-1 overflow-y-auto -mr-4 pr-4"> {/* Scroll interno para o conteúdo */}
                 {itemsInFolder.length > 0 ? (
                    <motion.div
                         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // Grid para exibir cards e pastas
                         variants={{
                             visible: { transition: { staggerChildren: 0.08 } }, // Animação de stagger para entrada dos itens
                         }}
                         initial="hidden"
                         animate="visible"
                         exit="exit"
                    >
                         <AnimatePresence>
                             {itemsInFolder.map(({ type, item }) => (
                                 // Cada item (pasta ou projeto) no grid
                                 <motion.div key={item.id} variants={itemVariants} layout>
                                     {type === 'folder' ? (
                                         // --- Card/Item de Pasta ---
                                         <motion.div
                                             className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 cursor-pointer flex flex-col items-center justify-center h-48 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                              onClick={() => onFolderClick(item)} // Clica na pasta para navegar
                                              whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}
                                         >
                                             <FolderIcon className="h-12 w-12 text-yellow-500 mb-3" />
                                             <p className="font-bold text-light-text dark:text-dark-text text-center truncate w-full px-2">{item.name}</p>
                                             {/* Opcional: Contagem de itens na pasta */}
                                              {/* <p className="text-sm text-light-subtle dark:text-dark-subtle">({folders.filter(f => f.parentFolderId === item.id).length + projects.filter(p => p.folderId === item.id).length} itens)</p> */}
                                         </motion.div>
                                     ) : (
                                         // --- Project Card ---
                                         // Renderiza o ProjectCard, passando os dados e o handler de clique
                                         <ProjectCard
                                             project={item}
                                             clients={clients}
                                             onClick={() => onProjectClick(item)} // Clica no projeto para abrir o dashboard
                                         />
                                     )}
                                 </motion.div>
                             ))}
                         </AnimatePresence>
                     </motion.div>
                 ) : (
                    // Mensagem quando a pasta está vazia
                     <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-light-subtle dark:text-dark-subtle py-10"
                     >
                        Esta pasta está vazia. Adicione uma subpasta ou um projeto!
                     </motion.p>
                 )}
            </div>
        </motion.div>
    );
};

export default FolderView;