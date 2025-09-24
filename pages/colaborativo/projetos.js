import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import api from '../../services/colaborativo-api';

import Header from '../../components-colaborativo/Header/Header';
import ProjectList from '../../components-colaborativo/ProjectList/ProjectList';
import ProjectDetailsModal from '../../components-colaborativo/ProjectDetailsModal/ProjectDetailsModal';
import ProjectFormModal from '../../components-colaborativo/ProjectFormModal/ProjectFormModal';
import StatusFilter from '../../components-colaborativo/StatusFilter/StatusFilter';
import PriorityFilter from '../../components-colaborativo/PriorityFilter/PriorityFilter';
import DateFilter from '../../components-colaborativo/DateFilter/DateFilter';
import Pagination from '../../components-colaborativo/Pagination/Pagination';
import ProjectFilterDrawer from '../../components-colaborativo/ProjectFilterDrawer/ProjectFilterDrawer'; // NOVO IMPORT
import styles from './projetos.module.css';
import { IoAdd, IoRefresh, IoFilter } from 'react-icons/io5';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const PROJECTS_PER_PAGE = 6;

// Estruturas de dados iniciais para evitar erros antes do carregamento
const initialFinancialSummary = { totalBudget: 0, totalReceived: 0, totalToReceive: 0, remainingToReceive: 0 };
const initialPaginationInfo = { totalProjects: 0, totalPages: 1, currentPage: 1 };

export default function ProjetosPage() {
  const [currentUserRole, setCurrentUserRole] = useState('dev'); // Será usado para calcular lucro no ProjectCard
  const [currentUserId, setCurrentUserId] = useState(null);

  // Estados para os dados da API
  const [projects, setProjects] = useState([]);
  const [financialSummary, setFinancialSummary] = useState(initialFinancialSummary);
  const [paginationInfo, setPaginationInfo] = useState(initialPaginationInfo);
  const [clientList, setClientList] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [platformList, setPlatformList] = useState([]); // Para filtro de plataforma

  // Estados de controle da UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados dos filtros e paginação
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [minBudget, setMinBudget] = useState(''); // NOVO
  const [maxBudget, setMaxBudget] = useState(''); // NOVO
  const [platformFilter, setPlatformFilter] = useState(''); // NOVO
  const [clientFilter, setClientFilter] = useState(''); // NOVO
  const [sortBy, setSortBy] = useState('createdAt'); // NOVO: Padrão por criação
  const [sortOrder, setSortOrder] = useState('desc'); // NOVO: Padrão descendente

  const [currentPage, setCurrentPage] = useState(1);
  const [isAnyFilterActive, setIsAnyFilterActive] = useState(false);

  // Estados dos modais
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // --- NOVO ESTADO PARA O DRAWER DE FILTROS MOBILE/DESKTOP ---
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);


  // Função centralizada para buscar projetos
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: PROJECTS_PER_PAGE,
        status: statusFilter,
        deadline: dateFilter,
        priorityId: priorityFilter,
        minBudget: minBudget,
        maxBudget: maxBudget,
        platformId: platformFilter,
        clientId: clientFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      const response = await api.get('/projects', { params });
      setProjects(response.data.projects || []);
      setFinancialSummary(response.data.summary || initialFinancialSummary);
      setPaginationInfo(response.data.pagination || initialPaginationInfo);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
      setError("Não foi possível carregar os projetos. Tente novamente mais tarde.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar dados auxiliares para os modais e filtros
  useEffect(() => {
    const fetchModalAndFilterData = async () => {
        try {
            const meResponse = await api.get('/users/me');
            setCurrentUserId(meResponse.data.id);
            // Assumimos que o role do usuário é o do banco de dados
            setCurrentUserRole(meResponse.data.label); 
            
            const [clientsResponse, collabsResponse, prioritiesResponse, platformsResponse] = await Promise.all([
                api.get('/clients'),
                api.get('/collaborations?status=accepted'),
                api.get('/priorities'),
                api.get('/platforms')
            ]);

            setClientList(clientsResponse.data || []);
            setCollaborators(collabsResponse.data || []);
            setPriorityList(prioritiesResponse.data || []);
            setPlatformList(platformsResponse.data || []);
            
        } catch (err) {
            console.error("Não foi possível carregar dados para os formulários/filtros.", err);
        }
    };
    fetchModalAndFilterData();
  }, []);

  // Efeito para re-buscar projetos quando filtros ou página mudam
  useEffect(() => {
    fetchProjects();
  }, [currentPage, statusFilter, dateFilter, priorityFilter, minBudget, maxBudget, platformFilter, clientFilter, sortBy, sortOrder]);

  // Efeito para resetar a página e checar filtros ativos
  useEffect(() => {
    setCurrentPage(1);
    setIsAnyFilterActive(
        statusFilter !== 'all' || dateFilter !== 'all' || priorityFilter !== 'all' ||
        minBudget !== '' || maxBudget !== '' || platformFilter !== '' || clientFilter !== '' ||
        sortBy !== 'createdAt' || sortOrder !== 'desc'
    );
  }, [statusFilter, dateFilter, priorityFilter, minBudget, maxBudget, platformFilter, clientFilter, sortBy, sortOrder]);

  // --- Handlers para Ações ---
  const handleSaveProject = async (projectData) => {
    try {
      if (projectData.id) {
        await api.patch(`/projects/${projectData.id}`, projectData);
      } else {
        await api.post('/projects', projectData);
      }
      handleCloseFormModal();
      fetchProjects();
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      alert(err.response?.data?.message || "Erro ao salvar projeto.");
    }
  };

  const handleUpdateProject = async (projectId, field, value) => {
    try {
        await api.patch(`/projects/${projectId}`, { [field]: value });
        fetchProjects(); 
        
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
            fetchProjects();
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

  // --- HANDLER PARA LIMPAR TODOS OS FILTROS ---
  const handleClearFilters = () => { 
    setStatusFilter('all'); 
    setDateFilter('all'); 
    setPriorityFilter('all');
    setMinBudget('');
    setMaxBudget('');
    setPlatformFilter('');
    setClientFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  return (
    <div className="colab-theme">
      <Head><title>Projetos | Sistema Colaborativo</title></Head>
      <Header activePage="projetos" />
      <main className={styles.pageWrapper}>
        <div className={styles.toolbar}>
            <div>
                <h1 className={styles.pageTitle}>Projetos</h1>
                <p className={styles.pageSubtitle}>
                  {`Exibindo ${projects.length} de ${paginationInfo.totalProjects} projetos no total.`}
                </p>
            </div>
            {/* --- FILTROS PARA DESKTOP --- */}
            <div className={styles.desktopActionsContainer}>
              {/* REMOVIDO os filtros Status, Prioridade, Data. Serão no Drawer */}
              {isAnyFilterActive && (
                <button className={styles.clearButton} onClick={handleClearFilters} title="Limpar todos os filtros">
                  <IoRefresh size={18} />
                </button>
              )}
              <button onClick={() => setIsFilterDrawerOpen(true)} className={styles.filterToggleButton}> {/* Botão para abrir o Drawer */}
                    <IoFilter size={20} /> Filtros
                </button>
              <button className={styles.addButton} onClick={handleOpenCreateModal}>
                  <IoAdd size={20} />
                  Novo Projeto
              </button>
            </div>
            {/* --- BOTÃO DE FILTROS PARA MOBILE (REUTILIZADO AGORA PARA AMBOS) --- */}
            <div className={styles.mobileActionsContainer}>
                <button onClick={() => setIsFilterDrawerOpen(true)} className={styles.filterToggleButton}>
                    <IoFilter size={20} /> Filtros
                </button>
                <button className={styles.addButton} onClick={handleOpenCreateModal}>
                    <IoAdd size={20} /> Novo Projeto
                </button>
            </div>
        </div>
        
        <div className={styles.financialSummary}>
            <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Valor Total (Bruto)</p>
                <h2 className={styles.summaryValue}>{formatCurrency(financialSummary.totalBudget)}</h2>
            </div>
            <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Valor Recebido (Cliente)</p>
                <h2 className={`${styles.summaryValue} ${styles.valueReceived}`}>{formatCurrency(financialSummary.totalReceived)}</h2>
            </div>
            <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Seu Líquido a Receber</p>
                <h2 className={`${styles.summaryValue} ${styles.valueToReceive}`}>{formatCurrency(financialSummary.totalToReceive)}</h2>
            </div>
             <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Seu Líquido Restante</p>
                <h2 className={`${styles.summaryValue} ${styles.valueToReceive}`}>{formatCurrency(financialSummary.remainingToReceive)}</h2>
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
                  currentUserRole={currentUserRole} // Passa o role
                  currentUserId={currentUserId} // Passa o ID para ProjectCard calcular lucro
                  priorities={priorityList}
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
        onDataChange={fetchProjects}
        priorities={priorityList}
        currentUserId={currentUserId} // Passa para o modal calcular lucro
      />
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        clients={clientList}
        collaborators={collaborators}
        currentUserId={currentUserId}
        platforms={platformList}
      />
      {/* --- DRAWER DE FILTROS PARA DESKTOP E MOBILE --- */}
      <ProjectFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
        dateFilter={dateFilter} setDateFilter={setDateFilter}
        minBudget={minBudget} setMinBudget={setMinBudget}
        maxBudget={maxBudget} setMaxBudget={setMaxBudget}
        platformFilter={platformFilter} setPlatformFilter={setPlatformFilter}
        clientFilter={clientFilter} setClientFilter={setClientFilter}
        sortBy={sortBy} setSortBy={setSortBy}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
        priorities={priorityList}
        clients={clientList}
        platforms={platformList}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}