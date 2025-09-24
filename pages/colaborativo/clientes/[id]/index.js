import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../../../services/colaborativo-api';

// Componentes da UI
import Header from '../../../../components-colaborativo/Header/Header';
import ProjectList from '../../../../components-colaborativo/ProjectList/ProjectList';
import ProjectDetailsModal from '../../../../components-colaborativo/ProjectDetailsModal/ProjectDetailsModal';
import ProjectFormModal from '../../../../components-colaborativo/ProjectFormModal/ProjectFormModal';
import StatusFilter from '../../../../components-colaborativo/StatusFilter/StatusFilter';
import PriorityFilter from '../../../../components-colaborativo/PriorityFilter/PriorityFilter';
import DateFilter from '../../../../components-colaborativo/DateFilter/DateFilter';
import Pagination from '../../../../components-colaborativo/Pagination/Pagination';
import MobileFilterDrawer from '../../../../components-colaborativo/MobileFilterDrawer/MobileFilterDrawer'; // NOVO IMPORT

// Estilos e Ícones
import styles from '../../projetos.module.css'; // Reutilizando os estilos da página de projetos
import { IoAdd, IoRefresh, IoFilter } from 'react-icons/io5'; // IoFilter adicionado

// Formatação de valores
const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const PROJECTS_PER_PAGE = 6;

// Estruturas de dados iniciais
const initialFinancialSummary = { totalBudget: 0, totalReceived: 0, totalToReceive: 0 };
const initialPaginationInfo = { totalProjects: 0, totalPages: 1, currentPage: 1 };

export default function ClientProfilePage() {
  const router = useRouter();
  const { id: clientId } = router.query; // Pega o ID do cliente da URL

  // Estados dos dados da API
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [financialSummary, setFinancialSummary] = useState(initialFinancialSummary);
  const [paginationInfo, setPaginationInfo] = useState(initialPaginationInfo);
  const [priorities, setPriorities] = useState([]); // Para a lista de prioridades

  // Estados de controle da UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados dos filtros e paginação
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnyFilterActive, setIsAnyFilterActive] = useState(false);

  // Estados dos modais
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // --- NOVO ESTADO PARA O DRAWER DE FILTROS MOBILE ---
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState(false);


  // Função principal para buscar os dados completos do projeto e prioridades
  const fetchClientProjectsAndPriorities = async () => {
    if (!clientId) return; // Não faz nada se o ID do cliente ainda não estiver disponível

    setIsLoading(true);
    setError(null);
    try {
      // Busca os dados do cliente para exibir o nome
      // Se o cliente ainda não foi carregado, busca as informações dele
      if (!client) {
        const clientResponse = await api.get(`/clients/${clientId}`);
        setClient(clientResponse.data);
      }

      // Busca as prioridades (necessário para os filtros e cards)
      const prioritiesResponse = await api.get('/priorities');
      setPriorities(prioritiesResponse.data);


      // Monta os parâmetros de query para a API de projetos
      const params = {
        page: currentPage,
        limit: PROJECTS_PER_PAGE,
        clientId: clientId, // Filtra projetos apenas para este cliente
      };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priorityId = priorityFilter;
      if (dateFilter !== 'all') params.deadline = dateFilter;

      const response = await api.get('/projects', { params });
      setProjects(response.data.projects || []);
      setFinancialSummary(response.data.summary || initialFinancialSummary);
      setPaginationInfo(response.data.pagination || initialPaginationInfo);

    } catch (err) {
      console.error("Erro ao buscar dados do cliente ou projetos:", err);
      setError("Não foi possível carregar os dados. Verifique a URL ou tente novamente.");
      setClient(null); // Reseta o cliente em caso de erro
      setProjects([]); // Limpa os projetos em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar os dados quando o ID do cliente, filtros ou página mudam
  useEffect(() => {
    fetchClientProjectsAndPriorities();
  }, [clientId, currentPage, statusFilter, dateFilter, priorityFilter]);

  // Efeito para resetar a página e checar filtros ativos
  useEffect(() => {
    setCurrentPage(1);
    setIsAnyFilterActive(statusFilter !== 'all' || dateFilter !== 'all' || priorityFilter !== 'all');
  }, [statusFilter, dateFilter, priorityFilter]);

  // --- Handlers para Ações e Modais ---
  const handleSaveProject = async (projectData) => {
    try {
      // Garante que o clientId da página seja usado ao salvar
      const dataToSend = { ...projectData, clientId }; 
      if (projectData.id) {
        await api.patch(`/projects/${projectData.id}`, dataToSend);
      } else {
        await api.post('/projects', dataToSend);
      }
      handleCloseFormModal();
      fetchClientProjectsAndPriorities(); // Recarrega os dados da página
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao salvar projeto.");
    }
  };

  const handleUpdateProject = async (projectId, field, value) => {
    try {
        await api.patch(`/projects/${projectId}`, { [field]: value });
        fetchClientProjectsAndPriorities(); // Recarrega para garantir consistência
        
        // Atualiza o projeto selecionado no modal de detalhes, se estiver aberto
        if (selectedProject?.id === projectId) {
            const response = await api.get(`/projects/${projectId}`);
            setSelectedProject(response.data);
        }
    } catch (err) {
        console.error("Erro ao atualizar campo do projeto:", err);
    }
  };

  const handleStatusChange = (projectId, newStatus) => {
    handleUpdateProject(projectId, 'status', newStatus);
  };

  const handlePriorityChange = (projectId, newPriorityId) => {
    handleUpdateProject(projectId, 'priorityId', newPriorityId);
  };

  const handleEdit = (project) => {
    setProjectToEdit(project);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.")) {
        try {
            await api.delete(`/projects/${projectId}`);
            fetchClientProjectsAndPriorities();
        } catch (err) {
            console.error("Erro ao excluir projeto:", err);
            alert(err.response?.data?.message || "Não foi possível excluir o projeto.");
        }
    }
  };

  const handleOpenDetailsModal = (project) => { setSelectedProject(project); setIsDetailsModalOpen(true); };
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
  };
  const handleOpenCreateModal = () => { setProjectToEdit(null); setIsFormModalOpen(true); };
  const handleCloseFormModal = () => setIsFormModalOpen(false);
  const handleClearFilters = () => { setStatusFilter('all'); setDateFilter('all'); setPriorityFilter('all'); };

  // Renderização enquanto o cliente não foi carregado
  if (!client && (isLoading || error)) {
    return (
      <div className="colab-theme">
        <Header activePage="clientes" />
        <main className={styles.pageWrapper}>
          <div className={styles.loading}>{error ? error : 'Carregando perfil do cliente...'}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="colab-theme">
      <Head>
          <title>{client ? (client.tradeName || client.legalName) : 'Cliente'} | Projetos</title>
      </Head>
      
      <Header activePage="clientes" />
      <main className={styles.pageWrapper}>
        <div className={styles.toolbar}>
            <div>
                <h1 className={styles.pageTitle}>{client ? (client.tradeName || client.legalName) : 'Cliente'}</h1>
                <p className={styles.pageSubtitle}>
                  {`Exibindo ${projects.length} de ${paginationInfo.totalProjects} projetos para este cliente.`}
                </p>
            </div>
            {/* --- FILTROS PARA DESKTOP --- */}
            <div className={styles.desktopActionsContainer}>
              <StatusFilter activeFilter={statusFilter} onFilterChange={setStatusFilter} />
              <PriorityFilter 
                  activeFilter={priorityFilter} 
                  onFilterChange={setPriorityFilter} 
                  priorities={priorities} 
              />
              <DateFilter activeFilter={dateFilter} onFilterChange={setDateFilter} />
              {isAnyFilterActive && (
                <button className={styles.clearButton} onClick={handleClearFilters} title="Limpar todos os filtros">
                  <IoRefresh size={18} />
                </button>
              )}
              <button className={styles.addButton} onClick={handleOpenCreateModal}>
                  <IoAdd size={20} />
                  Novo Projeto
              </button>
            </div>
            {/* --- BOTÃO DE FILTROS PARA MOBILE --- */}
            <div className={styles.mobileActionsContainer}>
                <button onClick={() => setIsMobileFilterDrawerOpen(true)} className={styles.filterToggleButton}>
                    <IoFilter size={20} /> Filtros
                </button>
                <button className={styles.addButton} onClick={handleOpenCreateModal}>
                    <IoAdd size={20} /> Novo Projeto
                </button>
            </div>
        </div>
        
        <div className={styles.financialSummary}>
            <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Valor Total (Filtrado)</p>
                <h2 className={styles.summaryValue}>{formatCurrency(financialSummary.totalBudget)}</h2>
            </div>
            <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Valor Recebido</p>
                <h2 className={`${styles.summaryValue} ${styles.valueReceived}`}>{formatCurrency(financialSummary.totalReceived)}</h2>
            </div>
            <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Valor a Receber</p>
                <h2 className={`${styles.summaryValue} ${styles.valueToReceive}`}>{formatCurrency(financialSummary.totalToReceive)}</h2>
            </div>
        </div>
        
        <div className={styles.projectListContainer}>
            {isLoading ? (
                <div className={styles.messageState}>Carregando projetos...</div>
            ) : error ? (
                <div className={styles.messageState} style={{ color: '#f87171' }}>{error}</div>
            ) : projects.length > 0 ? (
                <ProjectList 
                  projects={projects} 
                  onOpenModal={handleOpenDetailsModal} 
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  currentUserRole={"dev"} // Ou pegue do contexto do usuário
                  priorities={priorities}
                />
            ) : (
                <div className={styles.emptyState}>Nenhum projeto encontrado com os filtros selecionados.</div>
            )}
        </div>

        {!isLoading && projects.length > 0 && paginationInfo.totalPages > 1 && (
          <Pagination
              projectsPerPage={PROJECTS_PER_PAGE}
              totalProjects={paginationInfo.totalProjects}
              paginate={setCurrentPage}
              currentPage={paginationInfo.currentPage}
          />
        )}
      </main>

      <ProjectDetailsModal 
        project={selectedProject}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onDataChange={fetchClientProjectsAndPriorities}
        priorities={priorities}
      />
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        clients={client ? [client] : []} // Passa apenas o cliente atual para o modal de criação
        fixedClient={client} // Garante que o cliente esteja pré-selecionado
        // collaborators={collaborators} // Remover, pois não precisamos da lista de colaboradores aqui
        // currentUserId={currentUserId} // Não é usado neste modal
      />
      {/* --- DRAWER DE FILTROS PARA MOBILE --- */}
      <MobileFilterDrawer
        isOpen={isMobileFilterDrawerOpen}
        onClose={() => setIsMobileFilterDrawerOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        priorities={priorities}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}