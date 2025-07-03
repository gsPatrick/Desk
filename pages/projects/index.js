// pages/projects/index.js (COMPLETO COM LAYOUT SIDEBAR/DASHBOARD E MODAIS)

import { useState, useMemo, useEffect } from 'react'; // Importado useEffect
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence para o conteúdo principal

// Componentes Reutilizados do Finance OS
import FinanceHeader from '../../componentsFinance/Header/FinanceHeader'; // Reutilizando o header

// Componentes da área de Projetos
import ProjectsLayout from '../../componentsFreelancer/Projects/ProjectsLayout'; // NOVO Layout
import ProjectFoldersSidebar from '../../componentsFreelancer/Projects/ProjectFoldersSidebar'; // NOVO Sidebar
import ProjectDashboard from '../../componentsFreelancer/Projects/ProjectDashboard'; // NOVO Dashboard

// Modais
import AddProjectModal from '../../componentsFreelancer/Shared/AddProjectModal'; // Modal Add/Edit Projeto
import EditClientModal from '../../componentsFreelancer/Shared/EditClientModal'; // NOVO Modal Editar Cliente
import AddTaskModal from '../../componentsFreelancer/Shared/AddTaskModal'; // NOVO Modal Adicionar/Editar Tarefa
 import AddFolderModal from '../../componentsFreelancer/Shared/AddFolderModal'; // NOVO Modal Adicionar Pasta


// Dados Placeholder Iniciais
import { clients as initialClients, projects as initialProjects, folders as initialFolders } from '../../data/freelancerData';
import { PlusIcon } from '@heroicons/react/24/solid'; // Ícone de adição
import { FolderOpenIcon as FolderOpenOutlineIcon } from '@heroicons/react/24/outline'; // Ícone da página de Projetos


export default function ProjectsPage() {
    // --- Estados Globais ---
    const [currentClients, setCurrentClients] = useState(initialClients); // Lista de Clientes
    const [currentFolders, setCurrentFolders] = useState(initialFolders); // Lista de Pastas
    const [currentProjects, setCurrentProjects] = useState(initialProjects); // Lista de Projetos

    const [selectedFolderId, setSelectedFolderId] = useState('folder-all'); // Pasta selecionada (padrão: Todos)
    const [selectedProjectId, setSelectedProjectId] = useState(null); // Projeto selecionado para mostrar o dashboard

    // --- Estados dos Modais ---
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false); // Modal Adicionar/Editar Projeto
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false); // Modal Editar Cliente
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false); // Modal Adicionar/Editar Tarefa
     const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false); // Modal Adicionar Pasta

    // --- Estados Temporários para Modais de Edição ---
    const [projectToEdit, setProjectToEdit] = useState(null); // Projeto sendo editado no modal de Add/Edit
    const [clientToEdit, setClientToEdit] = useState(null); // Cliente sendo editado no modal de Edit Cliente
     const [taskToEdit, setTaskToEdit] = useState(null); // Tarefa sendo editada no modal de Add/Edit Tarefa
     const [taskParentProjectId, setTaskParentProjectId] = useState(null); // ID do projeto ao adicionar uma TAREFA (para associar)

    // --- Dados Derivados (Memoizados para performance) ---
    const projectsInSelectedFolder = useMemo(() => {
        if (selectedFolderId === 'folder-all') {
            return currentProjects;
        }
        return currentProjects.filter(project => project.folderId === selectedFolderId);
    }, [currentProjects, selectedFolderId]);

     const selectedProject = useMemo(() => {
         return currentProjects.find(project => project.id === selectedProjectId) || null;
     }, [currentProjects, selectedProjectId]);

     // Lista de pastas SEM a pasta "Todos" para o dropdown no modal Add Project
     const foldersForDropdown = useMemo(() => {
         return currentFolders.filter(f => f.id !== 'folder-all');
     }, [currentFolders]);


    // --- Handlers de Ações (Abrir Modais, Salvar, Excluir) ---

    // --- Projetos ---
    const handleAddProject = () => {
        setProjectToEdit(null); // Modo adição
        setIsAddProjectModalOpen(true);
    };

    const handleEditProject = (project) => { // Chamado a partir do Dashboard
        setProjectToEdit(project); // Modo edição
        setIsAddProjectModalOpen(true);
        // Fechar dashboard se necessário, ou deixar aberto por baixo
        // setSelectedProjectId(null); // Opcional: limpar seleção para fechar dashboard
    };

     // Recebe projectData e opcionalmente newClientData
    const handleSaveProject = (projectData, newClientData) => {
        // 1. Salvar Novo Cliente (se existir)
        if (newClientData) {
            setCurrentClients(prev => [...prev, newClientData]);
             console.log("Novo cliente salvo na lista:", newClientData);
        }

        // 2. Salvar Projeto
        setCurrentProjects(prev => {
            const existingIndex = prev.findIndex(p => p.id === projectData.id);
            if (existingIndex > -1) {
                // Atualizar projeto existente
                const newState = [...prev];
                newState[existingIndex] = projectData;
                console.log("Projeto atualizado:", projectData);
                return newState;
            } else {
                // Adicionar novo projeto
                console.log("Novo projeto adicionado:", projectData);
                return [...prev, projectData];
            }
        });
        // Fechar o modal Add/Edit Projeto já é tratado no componente modal (onClose)
        // Opcional: Selecionar o projeto recém-salvo/editado para abrir o dashboard
        // setSelectedProjectId(projectData.id);
    };

    // TODO: Implementar Exclusão de Projeto real (passar para o modal Add/Edit)
    const handleDeleteProject = (projectId) => {
         if (confirm("Tem certeza que deseja excluir este projeto?")) {
             setCurrentProjects(prev => prev.filter(p => p.id !== projectId));
             alert("Projeto excluído! (Simulado)");
             // Após excluir, limpar a seleção para fechar o dashboard
             setSelectedProjectId(null);
             // Fechar modal Add/Edit se estiver aberto para este projeto
             setIsAddProjectModalOpen(false);
             setProjectToEdit(null); // Limpar projectToEdit
         }
    };


    // --- Clientes ---
    // Recebe o cliente do ClientCard
    const handleEditClient = (client) => {
        setClientToEdit(client); // Define cliente para edição
        setIsEditClientModalOpen(true); // Abre modal de edição de cliente
    };

     // Recebe os dados atualizados do modal EditClientModal
    const handleSaveClient = (clientData) => {
         setCurrentClients(prev => {
             const existingIndex = prev.findIndex(c => c.id === clientData.id);
             if (existingIndex > -1) {
                 // Atualiza cliente existente
                 const newState = [...prev];
                 newState[existingIndex] = clientData;
                 console.log("Cliente atualizado:", clientData);
                 return newState;
             }
              // Este modal é principalmente para edição, mas se fosse usado para adição também:
              // else { console.warn("Tentativa de salvar novo cliente via modal de edição?", clientData); return prev; }
              return prev; // Não faz nada se não encontrar o cliente (deve vir do modal de edição)
         });
          // Fechar o modal Edit Cliente já é tratado no componente modal (onClose)
    };

    // TODO: Implementar Exclusão de Cliente real
     const handleDeleteClient = (clientId) => {
         if (confirm("Tem certeza que deseja excluir este cliente? Isso pode afetar projetos associados.")) {
             setCurrentClients(prev => prev.filter(c => p.id !== clientId)); // Correção aqui: p.id !== clientId
             // O que fazer com projetos associados? (Ex: set clientId para null)
             setCurrentProjects(prev => prev.map(p => p.clientId === clientId ? { ...p, clientId: null } : p));
             alert("Cliente excluído! Projetos associados foram desvinculados. (Simulado)");
             // Fechar modal Edit Cliente se estiver aberto
             setIsEditClientModalOpen(false);
             setClientToEdit(null); // Limpar clientToEdit
         }
     };


    // --- Tarefas (associadas a Projetos) ---
    // Abre modal Add Task, recebe o projectId do TasksCard
     const handleAddTask = (projectId) => {
         setTaskToEdit(null); // Modo adição
         setTaskParentProjectId(projectId); // Define a qual projeto a tarefa será adicionada
         setIsAddTaskModalOpen(true);
     };

     // Abre modal Edit Task, recebe a task do TaskItem
     const handleEditTask = (task) => {
         setTaskToEdit(task); // Modo edição
         // Não precisamos do taskParentProjectId aqui, pois a tarefa já tem projectId
         setIsAddTaskModalOpen(true);
     };

     // Recebe os dados da tarefa do modal AddTaskModal
    const handleSaveTask = (taskData) => {
         setCurrentProjects(prevProjects => {
             // Encontra o projeto pai
             const projectIndex = prevProjects.findIndex(p => p.id === taskData.projectId);
             if (projectIndex === -1) {
                 console.error("Erro ao salvar tarefa: Projeto pai não encontrado.", taskData.projectId);
                 return prevProjects; // Retorna estado anterior se projeto não encontrado
             }

             const projectToUpdate = { ...prevProjects[projectIndex] };
             const tasks = [...(projectToUpdate.tasks || [])]; // Garante que tasks é um array

             const existingTaskIndex = tasks.findIndex(t => t.id === taskData.id);

             if (existingTaskIndex > -1) {
                 // Atualiza tarefa existente
                 tasks[existingTaskIndex] = taskData;
                 console.log("Tarefa atualizada:", taskData);
             } else {
                 // Adiciona nova tarefa
                 tasks.push(taskData);
                 console.log("Nova tarefa adicionada:", taskData);
             }

             // Atualiza o projeto com a nova lista de tarefas
             projectToUpdate.tasks = tasks;

             // Atualiza a lista de projetos
             const newProjects = [...prevProjects];
             newProjects[projectIndex] = projectToUpdate;
             return newProjects;
         });
          // Fechar o modal Add/Edit Tarefa já é tratado no componente modal (onClose)
    };

    // Recebe o taskId do TaskItem
    const handleDeleteTask = (taskId) => {
         // Precisamos encontrar o projeto pai primeiro para remover a tarefa de lá
         const projectContainingTask = currentProjects.find(p => p.tasks?.some(t => t.id === taskId));

         if (!projectContainingTask) {
             console.error("Erro ao excluir tarefa: Projeto pai não encontrado.", taskId);
             alert("Erro interno: Tarefa não encontrada ou projeto associado desconhecido.");
             return;
         }

         if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
             setCurrentProjects(prevProjects => {
                  // Encontra o índice do projeto pai
                 const projectIndex = prevProjects.findIndex(p => p.id === projectContainingTask.id);
                 if (projectIndex === -1) return prevProjects; // Fallback defensivo

                 const projectToUpdate = { ...prevProjects[projectIndex] };
                 projectToUpdate.tasks = (projectToUpdate.tasks || []).filter(t => t.id !== taskId); // Remove a tarefa

                 const newProjects = [...prevProjects];
                 newProjects[projectIndex] = projectToUpdate;
                 console.log("Tarefa excluída:", taskId);
                 return newProjects;
             });
              // Fechar modal Add/Edit Tarefa se estiver aberto para esta tarefa
             setIsAddTaskModalOpen(false);
             setTaskToEdit(null); // Limpar taskToEdit
         }
    };

    // Handler para alternar status de tarefa (chamado pelo TaskItem)
    const handleToggleTaskStatus = (task) => {
         setCurrentProjects(prevProjects => {
             // Encontra o projeto pai e a tarefa
             const projectIndex = prevProjects.findIndex(p => p.id === task.projectId);
             if (projectIndex === -1) {
                 console.error("Erro ao alternar status da tarefa: Projeto pai não encontrado.", task.projectId);
                 return prevProjects;
             }
             const taskIndex = prevProjects[projectIndex].tasks?.findIndex(t => t.id === task.id);
             if (taskIndex === -1 || taskIndex === undefined) {
                  console.error("Erro ao alternar status da tarefa: Tarefa não encontrada.", task.id);
                  return prevProjects;
             }

             const newProjects = [...prevProjects];
             const projectToUpdate = { ...newProjects[projectIndex] };
             projectToUpdate.tasks = [...(projectToUpdate.tasks || [])]; // Copia o array de tarefas

             // Atualiza o status da tarefa
             projectToUpdate.tasks[taskIndex] = {
                 ...projectToUpdate.tasks[taskIndex],
                 status: task.status === 'completed' ? 'pending' : 'completed'
             };

             // Atualiza o projeto no array de projetos
             newProjects[projectIndex] = projectToUpdate;

              console.log(`Status da tarefa ${task.id} alternado para ${projectToUpdate.tasks[taskIndex].status} (Simulado).`);

             return newProjects;
         });
    };


    // --- Pastas ---
    const handleAddFolder = () => {
        setIsAddFolderModalOpen(true);
    };

    const handleSaveFolder = (folderData) => {
         // Simplesmente adiciona a nova pasta (este modal é só para adição)
         setCurrentFolders(prev => [...prev, folderData]);
         alert(`Pasta "${folderData.name}" criada! (Simulado)`);
          // Fechar o modal Add Folder já é tratado no componente modal (onClose)
    };

    // TODO: Implementar Exclusão de Pasta e renomear pasta


     // --- Renderização do Conteúdo Principal (Dashboard ou Boas-Vindas) ---
     const mainContent = useMemo(() => {
        if (!selectedProject) {
            // Retorna null para mostrar a mensagem de boas-vindas no ProjectsLayout
            return null;
        }

        // Retorna o componente ProjectDashboard envolvido para permitir animação de saída/entrada
        return {
             key: selectedProject.id, // Chave única para animar a transição entre dashboards
             element: (
                 <ProjectDashboard
                    project={selectedProject}
                    clients={currentClients} // Passa a lista completa de clientes
                    onEditClient={handleEditClient} // Passa handler para editar cliente
                    onAddTask={handleAddTask} // Passa handler para adicionar tarefa
                     onEditTask={handleEditTask} // Passa handler para editar tarefa
                    onDeleteTask={handleDeleteTask} // Passa handler para excluir tarefa
                 />
             )
        };
     }, [selectedProject, currentClients, handleEditClient, handleAddTask, handleEditTask, handleDeleteTask]); // Depende do projeto selecionado e dos handlers


    return (
        <>
            <Head>
                <title>Projetos | Freelancer OS</title>
            </Head>

            <FinanceHeader /> {/* Header fixo no topo */}

             {/* Usa o layout com sidebar e área principal */}
            <ProjectsLayout
                 // Passa o sidebar: componente e props
                sidebar={
                    <ProjectFoldersSidebar
                        folders={currentFolders}
                        projects={projectsInSelectedFolder} // Passa APENAS projetos da pasta selecionada para a lista na sidebar
                        clients={currentClients} // Pode ser útil para a sidebar (ex: nome do cliente na lista de projetos)
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={setSelectedFolderId}
                        selectedProjectId={selectedProjectId}
                        onSelectProject={setSelectedProjectId} // Atualiza o projeto selecionado para o dashboard
                        onAddFolder={handleAddFolder} // Passa handler para adicionar pasta
                    />
                }
                 // Passa o conteúdo principal: dashboard ou mensagem de boas-vindas
                mainContent={mainContent}
            />

            {/* --- Modais Renderizados Globalmente --- */}

             {/* Modal Adicionar/Editar Projeto */}
            <AddProjectModal
                isOpen={isAddProjectModalOpen}
                onClose={() => { setIsAddProjectModalOpen(false); setProjectToEdit(null); }} // Limpa projectToEdit ao fechar
                onSave={handleSaveProject}
                projectToEdit={projectToEdit} // Passa o projeto (objeto para edição, null para adição)
                clients={currentClients} // Passa a lista de clientes para seleção no modal
                folders={foldersForDropdown} // Passa a lista de pastas para seleção
                // onDelete={handleDeleteProject} // Passar para o modal se o botão Excluir for lá
            />

             {/* Modal Editar Cliente */}
             {/* Passa o cliente para edição. Só é renderizado se clientToEdit não for null */}
            <EditClientModal
                isOpen={isEditClientModalOpen}
                onClose={() => { setIsEditClientModalOpen(false); setClientToEdit(null); }} // Limpa clientToEdit ao fechar
                onSave={handleSaveClient}
                onDelete={handleDeleteClient}
                clientToEdit={clientToEdit} // Passa o cliente para edição
            />

            {/* Modal Adicionar/Editar Tarefa */}
            <AddTaskModal
                 isOpen={isAddTaskModalOpen}
                 onClose={() => { setIsAddTaskModalOpen(false); setTaskToEdit(null); setTaskParentProjectId(null); }} // Limpa estados relacionados à tarefa ao fechar
                 onSave={handleSaveTask}
                 onDelete={handleDeleteTask}
                 projectId={taskParentProjectId} // Passa o ID do projeto pai (usado na adição)
                 taskToEdit={taskToEdit} // Passa a tarefa (objeto para edição, null para adição)
            />

             {/* Modal Adicionar Pasta */}
             <AddFolderModal
                 isOpen={isAddFolderModalOpen}
                 onClose={() => setIsAddFolderModalOpen(false)}
                 onSave={handleSaveFolder}
             />

        </>
    );
}