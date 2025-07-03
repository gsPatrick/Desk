// componentsFreelancer/Shared/AddProjectModal.js (AJUSTADO - CAMPO BRANCH TEXTO E SELEÇÃO DE PASTA)

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CodeBracketIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid'; // Ícones úteis
import { PlusIcon, MinusIcon, FolderIcon as FolderOutlineIcon } from '@heroicons/react/24/outline'; // Ícones para adicionar/remover
import { SiGithub } from 'react-icons/si'; // Ícone do GitHub
import { useState, useEffect } from 'react';
// import { clients } from '../../data/freelancerData'; // Não importaremos mais clients aqui, eles virão via prop

// Removido placeholderBranches e import de clients

const AddProjectModal = ({ isOpen, onClose, onSave, projectToEdit, clients: availableClients, folders: availableFolders }) => { // Recebe folders
    const [isEditing, setIsEditing] = useState(false); // true se estiver editando um projeto existente
    const [showNewClientForm, setShowNewClientForm] = useState(false); // Controla a visibilidade do form de novo cliente
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        githubUrl: '',
        githubBranch: '', // Agora é um input de texto
        clientId: '', // ID do cliente selecionado
        status: 'Em Andamento', // Status inicial padrão
        startDate: new Date().toISOString().split('T')[0], // Data atual
        folderId: '', // NOVO: ID da pasta selecionada
        // Campos do novo cliente (se showNewClientForm for true)
        newClientName: '',
        newClientContactName: '',
        newClientEmail: '',
        newClientPhone: '',
    });

    // Efeito para carregar dados se estiver editando um projeto existente
    useEffect(() => {
        if (projectToEdit) {
            setFormData({
                name: projectToEdit.name || '',
                description: projectToEdit.description || '',
                githubUrl: projectToEdit.githubUrl || '',
                githubBranch: projectToEdit.githubBranch || '', // Carrega a branch existente
                clientId: projectToEdit.clientId || '',
                status: projectToEdit.status || 'Em Andamento',
                startDate: projectToEdit.startDate ? new Date(projectToEdit.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // Corrigido project para projectToEdit
                folderId: projectToEdit.folderId || '', // Carrega a pasta existente
                // Limpar campos de novo cliente no modo edição
                newClientName: '', newClientContactName: '', newClientEmail: '', newClientPhone: '',
            });
            setIsEditing(true); // Estamos no modo edição
            setShowNewClientForm(false); // Esconde o form de novo cliente na edição
        } else {
            // Resetar para o formulário de adição vazio
            setFormData({
                name: '', description: '', githubUrl: '', githubBranch: '', clientId: '', status: 'Em Andamento', startDate: new Date().toISOString().split('T')[0],
                folderId: '', // Sem pasta padrão
                newClientName: '', newClientContactName: '', newClientEmail: '', newClientPhone: '',
            });
            setIsEditing(false); // Estamos no modo adição
            setShowNewClientForm(false); // Começa escondido o form de novo cliente
        }
    }, [projectToEdit]); // Roda este efeito sempre que projectToEdit mudar

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev.formData, [name]: value }));
    };

     const handleNewClientInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
     };

    const handleSave = () => {
        // Validação básica do projeto
        if (!formData.name || !formData.startDate || !formData.folderId) { // Adicionada validação da pasta
            alert("Por favor, preencha Nome do Projeto, Data de Início e Pasta.");
            return;
        }

         // Validação de Cliente: Ou um cliente existente está selecionado, OU um novo cliente está sendo criado e seus campos básicos preenchidos
         const isExistingClientSelected = !!formData.clientId && !showNewClientForm;
         const isNewClientFormValid = showNewClientForm && formData.newClientName; // Pode adicionar mais validações para novo cliente

         // O cliente agora é opcional para projetos internos (clientId: null)
         // if (!isExistingClientSelected && !isNewClientFormValid) {
         //     alert("Por favor, selecione um cliente existente ou preencha o nome do novo cliente.");
         //     return;
         // }

         // Validação de URL e Branch se foram preenchidos
        if (formData.githubUrl) { // Apenas valide se a URL foi preenchida
            if (!formData.githubUrl.startsWith('http')) {
                 alert("Por favor, insira uma URL de GitHub válida.");
                 return;
            }
             if (!formData.githubBranch) { // Agora verifica se a branch *digitada* não está vazia
                  alert("Por favor, digite a branch do GitHub.");
                  return;
             }
        }

        let newClientData = null;
        let finalClientId = formData.clientId || null; // Cliente é opcional, pode ser null

        // Se o formulário de novo cliente estiver visível e válido, prepare os dados do novo cliente
        if (showNewClientForm && isNewClientFormValid) {
            newClientData = {
                // Gerar um ID temporário para o novo cliente. O ID final pode ser gerado no backend.
                id: `client-${Date.now()}`,
                name: formData.newClientName,
                contactName: formData.newClientContactName,
                email: formData.newClientEmail,
                phone: formData.newClientPhone,
            };
            finalClientId = newClientData.id; // O projeto será associado a este novo cliente
        }


        const projectDataToSave = {
            ...formData,
            // Se estiver editando, mantém o ID original; se for novo, gera um ID
            id: isEditing ? projectToEdit.id : `project-${Date.now()}`, // ID simulado
            clientId: finalClientId, // Usa o ID do cliente selecionado, do novo cliente, ou null
             // Remover campos de novo cliente do objeto do projeto
            newClientName: undefined, newClientContactName: undefined, newClientEmail: undefined, newClientPhone: undefined,
             // Adicionar outros campos se necessário (budget, technologies, etc.)
             tasks: isEditing ? projectToEdit.tasks : [], // Mantém tarefas existentes ou inicia vazio
             whatsappHistory: isEditing ? projectToEdit.whatsappHistory : [], // Mantém histórico ou inicia vazio
             whatsappAISuggestion: isEditing ? projectToEdit.whatsappAISuggestion : null, // Mantém sugestão ou inicia vazio
        };

        console.log("Dados do projeto a salvar:", projectDataToSave);
         if (newClientData) {
             console.log("Dados do novo cliente a salvar:", newClientData);
         }


        if (onSave) {
            // Passa o projeto e o novo cliente (se existir) para a função onSave no componente pai
            onSave(projectDataToSave, newClientData);
        }

        onClose(); // Fecha o modal após salvar
    };

    // Título do modal baseado se é edição ou adição
    const modalTitle = isEditing ? 'Editar Projeto' : 'Novo Projeto';

    // Opções de status (exemplo)
    const statusOptions = ['Em Andamento', 'Concluído', 'Pausado', 'Arquivado'];


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose} // Fecha modal clicando no overlay
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 35 } }}
                        exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                        className="w-full max-w-lg bg-light-surface dark:bg-dark-surface rounded-2xl shadow-xl text-light-text dark:text-dark-text flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()} // Previne fechar clicando dentro do modal
                    >
                        {/* Header do Modal */}
                        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
                            <h2 className="text-xl font-bold">{modalTitle}</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <XMarkIcon className="h-6 w-6 text-light-subtle dark:text-dark-subtle"/>
                            </button>
                        </div>

                        {/* Corpo do Formulário com Scroll Interno */}
                         <div className="p-6 space-y-5 flex-1 overflow-y-auto"> {/* Aumentado o espaço entre campos */}

                            {/* Campo Nome do Projeto */}
                            <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome do Projeto</label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleInputChange}
                                    placeholder="Ex: Website Empresa Alpha"
                                    className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Campo Pasta */}
                             <div>
                                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Pasta</label>
                                 <div className="relative">
                                      <select
                                          name="folderId" value={formData.folderId} onChange={handleInputChange}
                                          className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none pr-10" // Adicionado pr-10 para ícone
                                      >
                                          <option value="" disabled>Selecione uma pasta</option>
                                          {/* Filtra a pasta 'Todos' que é apenas virtual */}
                                          {availableFolders.filter(f => f.id !== 'folder-all').map(folder => (
                                              <option key={folder.id} value={folder.id}>{folder.name}</option>
                                          ))}
                                      </select>
                                       <FolderOutlineIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-subtle dark:text-dark-subtle pointer-events-none"/>
                                  </div>
                              </div>


                            {/* Campo Cliente OU Novo Cliente Form */}
                             {/* Permite associar ou não um cliente, exceto se já estiver editando e tiver cliente (simplificado) */}
                             {!isEditing || (isEditing && projectToEdit?.clientId === null) ? ( // Mostra a seção de cliente na adição ou se editando um projeto sem cliente
                                  <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-4">
                                     <h3 className="text-md font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                                        <BuildingOfficeIcon className="h-5 w-5"/> Cliente (Opcional)
                                     </h3>

                                     <AnimatePresence mode="wait">
                                         {showNewClientForm ? (
                                             // --- Formulário de Novo Cliente (Condicional) ---
                                             <motion.div
                                                key="new-client-form"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="space-y-3 overflow-hidden"
                                             >
                                                 <h4 className="text-sm font-medium text-light-subtle dark:text-dark-subtle">Novo Cliente</h4>
                                                  <div>
                                                     <label className="block text-xs font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome da Empresa/Cliente</label>
                                                      <input type="text" name="newClientName" value={formData.newClientName} onChange={handleNewClientInputChange} placeholder="Nome Completo ou Empresa" className="w-full p-2 bg-black/10 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                                 </div>
                                                 <div className="grid grid-cols-2 gap-4">
                                                     <div>
                                                         <label className="block text-xs font-medium text-light-subtle dark:text-dark-subtle mb-1">Nome de Contato (Opcional)</label>
                                                          <input type="text" name="newClientContactName" value={formData.newClientContactName} onChange={handleNewClientInputChange} placeholder="Pessoa de contato" className="w-full p-2 bg-black/10 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                                 </div>
                                                      <div>
                                                         <label className="block text-xs font-medium text-light-subtle dark:text-dark-subtle mb-1">Email (Opcional)</label>
                                                          <input type="email" name="newClientEmail" value={formData.newClientEmail} onChange={handleNewClientInputChange} placeholder="email@cliente.com" className="w-full p-2 bg-black/10 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                                 </div>
                                                 </div>
                                                  <div>
                                                     <label className="block text-xs font-medium text-light-subtle dark:text-dark-subtle mb-1">Telefone (Opcional)</label>
                                                      <input type="text" name="newClientPhone" value={formData.newClientPhone} onChange={handleNewClientInputChange} placeholder="(XX) 9XXXX-XXXX" className="w-full p-2 bg-black/10 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                                 </div>
                                                 <button onClick={() => setShowNewClientForm(false)} className="mt-3 text-sm font-semibold text-red-500 hover:underline flex items-center gap-1">
                                                     <MinusIcon className="h-4 w-4"/> Cancelar Novo Cliente
                                                 </button>
                                             </motion.div>

                                         ) : (
                                            // --- Seleção de Cliente Existente ou Adicionar Novo ---
                                            <motion.div
                                                key="select-client"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="space-y-3 overflow-hidden"
                                            >
                                                 <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Selecione um Cliente Existente (Opcional)</label>
                                                <select
                                                    name="clientId" value={formData.clientId} onChange={handleInputChange}
                                                    className={`w-full p-2 bg-black/10 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none`}
                                                >
                                                    <option value="">-- Nenhum Cliente --</option> {/* Opção para não associar cliente */}
                                                    {availableClients.map(client => (
                                                        <option key={client.id} value={client.id}>{client.name}</option>
                                                    ))}
                                                </select>
                                                {/* Botão para Adicionar Novo Cliente (Visível apenas se a seleção não estiver desabilitada) */}
                                                 {(formData.clientId === "" || formData.clientId === null) && ( // Mostra botão Add Client apenas se "Nenhum Cliente" está selecionado
                                                    <button onClick={() => setShowNewClientForm(true)} className="mt-3 text-sm font-semibold text-blue-500 hover:underline flex items-center gap-1">
                                                         <PlusIcon className="h-4 w-4"/> Adicionar Novo Cliente
                                                    </button>
                                                )}
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>
                             ) : (
                                  // Se estiver editando um projeto QUE JÁ TINHA cliente, apenas mostra o nome
                                   <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                                      <h3 className="text-md font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                                         <BuildingOfficeIcon className="h-5 w-5"/> Cliente
                                      </h3>
                                      {/* TODO: Mostrar o nome do cliente aqui e talvez botão para editar */}
                                       <p className="text-sm text-light-subtle dark:text-dark-subtle mt-2">Cliente associado: {availableClients.find(c => c.id === projectToEdit?.clientId)?.name || 'Desconhecido'}</p>
                                  </div>
                              )}


                             {/* Campo Descrição */}
                             <div>
                                <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Descrição (Opcional)</label>
                                <textarea
                                     name="description" value={formData.description} onChange={handleInputChange}
                                     placeholder="Detalhes sobre o escopo e objetivos do projeto."
                                     rows={3}
                                    className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md resize-y border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                ></textarea>
                            </div>

                             {/* Seção de Integração GitHub */}
                             <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-4">
                                <h3 className="text-md font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                                     <SiGithub className="h-5 w-5"/> Integração GitHub (Opcional)
                                </h3>
                                 {/* Campo URL Repositório */}
                                <div>
                                    <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">URL Repositório GitHub</label>
                                    <input
                                        type="url" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange}
                                        placeholder="https://github.com/seuusuario/seu-repo"
                                        className="w-full p-2 bg-black/10 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                 {/* Campo Branch (Visível apenas se URL for preenchida) */}
                                <AnimatePresence>
                                 {formData.githubUrl && (
                                     <motion.div
                                         key="branch-input" // Chave para a animação
                                         initial={{ opacity: 0, height: 0 }}
                                         animate={{ opacity: 1, height: 'auto' }}
                                         exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                                          className="overflow-hidden"
                                     >
                                        <div>
                                             <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Branch</label>
                                             {/* AGORA É UM INPUT DE TEXTO */}
                                             <input
                                                 type="text" // Alterado para text
                                                 name="githubBranch"
                                                 value={formData.githubBranch}
                                                 onChange={handleInputChange}
                                                 placeholder="main ou develop" // Placeholder ajustado
                                                 className="w-full p-2 bg-black/10 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                             />
                                         </div>
                                     </motion.div>
                                  )}
                                </AnimatePresence>
                             </div>

                             {/* Campo Status e Data de Início na mesma linha no desktop */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {/* Campo Status */}
                                  <div>
                                      <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Status</label>
                                      <select
                                          name="status" value={formData.status} onChange={handleInputChange}
                                          className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                                      >
                                          {statusOptions.map(status => (
                                              <option key={status} value={status}>{status}</option>
                                          ))}
                                      </select>
                                  </div>
                                  {/* Campo Data de Início */}
                                   <div>
                                      <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">Data de Início</label>
                                      <input
                                          type="date" name="startDate" value={formData.startDate} onChange={handleInputChange}
                                          className="w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                                      />
                                  </div>
                              </div>


                            {/* TODO: Adicionar campo para Data de Término Estimada, Tecnologias, Orçamento, etc. */}

                         </div>

                         {/* Ações do Modal (Footer) */}
                        <div className="flex items-center justify-between p-6 border-t border-black/5 dark:border-white/10 space-x-4 flex-shrink-0">
                             {/* Botão de Excluir (visível apenas no modo edição) */}
                            {isEditing && (
                                 <button onClick={() => { /* TODO: Implementar exclusão real */ alert("Excluir Projeto (Simulado)"); onClose(); }} className="px-4 py-2 text-sm font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">Excluir</button>
                             )}

                            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-light-text dark:text-dark-text transition-colors">Cancelar</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg transition-colors">
                                {isEditing ? 'Salvar Alterações' : 'Salvar Projeto'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default AddProjectModal;