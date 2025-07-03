// componentsFreelancer/Projects/TasksCard.js (NOVO - TAREFAS/DEMANDAS)

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon as CheckCircleSolid, PlusIcon as PlusSolid, DocumentCheckIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleOutline, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Ícones para outline, add, edit, delete

// Componente interno para um item de tarefa
const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
     // Formata a data (opcional)
     const formattedDueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Sem Data';

    return (
        <motion.div
            layout // Animação de layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group" // group para mostrar botões no hover
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Ícone de status da tarefa */}
                <button onClick={() => onToggleStatus(task)} className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    {task.status === 'completed' ? (
                         <CheckCircleSolid className="h-6 w-6 text-green-500" />
                     ) : (
                         <CheckCircleOutline className="h-6 w-6 text-light-subtle dark:text-dark-subtle" />
                     )}
                </button>
                {/* Descrição da tarefa e data */}
                <div className="flex-1 min-w-0">
                     <p className={`font-medium text-light-text dark:text-dark-text truncate ${task.status === 'completed' ? 'line-through text-light-subtle dark:text-dark-subtle' : ''}`}>
                        {task.description}
                    </p>
                     <p className="text-xs text-light-subtle dark:text-dark-subtle mt-0.5">
                        {formattedDueDate}
                    </p>
                </div>
            </div>

            {/* Botões de ação (Editar, Excluir) - aparecem no hover */}
            <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(task)} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-blue-500" title="Editar Tarefa">
                     <PencilIcon className="h-5 w-5"/>
                </button>
                 <button onClick={() => onDelete(task.id)} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-red-500" title="Excluir Tarefa">
                    <TrashIcon className="h-5 w-5"/>
                </button>
            </div>
        </motion.div>
    );
};


const TasksCard = ({ projectId, tasks = [], onAddTask, onEditTask, onDeleteTask }) => {

    // Separa tarefas por status
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    // Handler para alternar status (simulado)
     const handleToggleStatus = (task) => {
         console.log(`Simulando toggle status da tarefa ${task.id}. Novo status: ${task.status === 'completed' ? 'pending' : 'completed'}`);
         // Em um app real, você chamaria uma função no componente pai (pages/projects/index.js)
         // que atualizaria o estado tasks do projeto e persistiria os dados.
         // Ex: onUpdateTaskStatus(projectId, task.id, task.status === 'completed' ? 'pending' : 'completed');
         alert(`Toggle status da tarefa "${task.description}" (Simulado).`);
     };


    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <DocumentCheckIcon className="h-7 w-7 text-purple-500" />
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Tarefas do Projeto ({tasks.length})</h3>
                </div>
                {/* Botão para Adicionar Tarefa */}
                <button onClick={() => onAddTask(projectId)} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors" title="Nova Tarefa">
                    <PlusIcon className="h-5 w-5"/>
                </button>
            </div>

            {/* Lista de Tarefas Pendentes (com scroll) */}
            {pendingTasks.length > 0 && (
                 <div className="mb-6 flex-shrink-0"> {/* Não permite encolher */}
                    <h4 className="text-sm font-semibold text-light-text dark:text-dark-text mb-2 border-b border-black/5 dark:border-white/5 pb-1">Pendentes ({pendingTasks.length})</h4>
                     <div className="space-y-2">
                        <AnimatePresence initial={false}>
                            {pendingTasks.map(task => (
                                 <TaskItem
                                     key={task.id}
                                     task={task}
                                     onEdit={onEditTask} // Passa handlers
                                     onDelete={onDeleteTask}
                                     onToggleStatus={handleToggleStatus} // Passa o handler de toggle
                                 />
                             ))}
                        </AnimatePresence>
                     </div>
                 </div>
             )}


            {/* Lista de Tarefas Concluídas (com scroll) */}
            {completedTasks.length > 0 && (
                 <div className="flex-1 overflow-y-auto pr-2 -mr-2"> {/* Flex-1 e scroll interno para a lista de concluídas */}
                    <h4 className="text-sm font-semibold text-light-text dark:text-dark-text mb-2 border-b border-black/5 dark:border-white/5 pb-1">Concluídas ({completedTasks.length})</h4>
                     <div className="space-y-2">
                         <AnimatePresence initial={false}>
                            {completedTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onEdit={onEditTask} // Passa handlers
                                    onDelete={onDeleteTask}
                                    onToggleStatus={handleToggleStatus} // Passa o handler de toggle
                                />
                            ))}
                         </AnimatePresence>
                     </div>
                 </div>
             )}

             {/* Mensagem se não houver tarefas */}
             {tasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-center text-light-subtle dark:text-dark-subtle">
                     <p>Nenhuma tarefa para este projeto.</p>
                 </div>
             )}

        </div>
    );
};
export default TasksCard;