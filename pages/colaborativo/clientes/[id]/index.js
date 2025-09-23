import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../../../services/colaborativo-api';

import Header from '../../../../components-colaborativo/Header/Header';
import ProjectList from '../../../../components-colaborativo/ProjectList/ProjectList';
import ProjectDetailsModal from '../../../../components-colaborativo/ProjectDetailsModal/ProjectDetailsModal';
import ProjectFormModal from '../../../../components-colaborativo/ProjectFormModal/ProjectFormModal';
import StatusFilter from '../../../../components-colaborativo/StatusFilter/StatusFilter';
import PriorityFilter from '../../../../components-colaborativo/PriorityFilter/PriorityFilter';
import DateFilter from '../../../../components-colaborativo/DateFilter/DateFilter';
import Pagination from '../../../../components-colaborativo/Pagination/Pagination';
import styles from '../../projetos.module.css'; // REUTILIZANDO OS ESTILOS DA PÁGINA DE PROJETOS
import { IoAdd, IoRefresh } from 'react-icons/io5';

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
  
  // Função centralizada para buscar dados
  const fetchData = async () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar os dados quando o ID do cliente, filtros ou página mudam
  useEffect(() => {
    fetchData();
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
      fetchData(); // Re-busca os dados para atualizar a lista
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao salvar projeto.");
    }
  };

  const handleUpdateProject = async (projectId, field, value) => {
    try {
        await api.patch(`/projects/${projectId}`, { [field]: value });
        const updatedProjects = projects.map(p => (p.id === projectId ? { ...p, [field]: value } : p));
        setProjects(updatedProjects);
        if (selectedProject?.id === projectId) {
            setSelectedProject(prev => ({ ...prev, [field]: value }));
        }
    } catch (err) {
        console.error("Erro ao atualizar campo do projeto:", err);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    await handleUpdateProject(projectId, 'status', newStatus);
    fetchData();
  };

  const handlePriorityChange = async (projectId, newPriority) => {
    await handleUpdateProject(projectId, 'priorityId', newPriority); // Enviar priorityId
    fetchData();
  };

  const handleOpenDetailsModal = (project) => { setSelectedProject(project); setIsDetailsModalOpen(true); };
  const handleCloseDetailsModal = () => setIsDetailsModalOpen(false);
  const handleOpenCreateModal = () => { setProjectToEdit(null); setIsFormModalOpen(true); };
  const handleCloseFormModal = () => setIsFormModalOpen(false);
  const handleClearFilters = () => { setStatusFilter('all'); setDateFilter('all'); setPriorityFilter('all'); };

  // Renderização de estado de carregamento inicial ou erro
  if (!client && (isLoading || error)) {
    return (
      <div className="colab-theme">
        <Header activePage="clientes" />
        <main className={styles.pageWrapper}>
          <div className={styles.messageState}>{error ? error : 'Carregando perfil do cliente...'}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="colab-theme">
      <Head>
          <title>{client?.name || 'Cliente'} | Projetos</title>
      </Head>
      
      <Header activePage="clientes" />
      <main className={styles.pageWrapper}>
        <div className={styles.toolbar}>
            <div>
                <h1 className={styles.pageTitle}>{client?.name}</h1>
                <p className={styles.pageSubtitle}>
                  {`Exibindo ${projects.length} de ${paginationInfo.totalProjects} projetos para este cliente.`}
                </p>
            </div>
            <div className={styles.actionsContainer}>
              <StatusFilter activeFilter={statusFilter} onFilterChange={setStatusFilter} />
              <PriorityFilter activeFilter={priorityFilter} onFilterChange={setPriorityFilter} />
              <DateFilter activeFilter={dateFilter} onFilterChange={setDateFilter} />
              {isAnyFilterActive && <button className={styles.clearButton} onClick={handleClearFilters} title="Limpar filtros"><IoRefresh size={18} /></button>}
              <button className={styles.addButton} onClick={handleOpenCreateModal}><IoAdd size={20} /> Novo Projeto</button>
            </div>
        </div>
        
        <div className={styles.financialSummary}>
            <div className={styles.summaryCard}><p className={styles.summaryLabel}>Valor Total (Filtrado)</p><h2 className={styles.summaryValue}>{formatCurrency(financialSummary.totalBudget)}</h2></div>
            <div className={styles.summaryCard}><p className={styles.summaryLabel}>Valor Recebido</p><h2 className={`${styles.summaryValue} ${styles.valueReceived}`}>{formatCurrency(financialSummary.totalReceived)}</h2></div>
            <div className={styles.summaryCard}><p className={styles.summaryLabel}>Valor a Receber</p><h2 className={`${styles.summaryValue} ${styles.valueToReceive}`}>{formatCurrency(financialSummary.totalToReceive)}</h2></div>
        </div>
        
        <div className={styles.projectListContainer}>
            {isLoading && !client ? ( // Condição ajustada para mostrar loading apenas na primeira carga
                <div className={styles.messageState}>Carregando projetos...</div>
            ) : projects.length > 0 ? (
                <ProjectList projects={projects} onOpenModal={handleOpenDetailsModal} onStatusChange={handleStatusChange} onPriorityChange={handlePriorityChange} />
            ) : (
                <div className={styles.messageState}>Nenhum projeto encontrado com os filtros selecionados.</div>
            )}
        </div>
        
        {!isLoading && projects.length > 0 && paginationInfo.totalPages > 1 && (
            <Pagination projectsPerPage={PROJECTS_PER_PAGE} totalProjects={paginationInfo.totalProjects} paginate={setCurrentPage} currentPage={paginationInfo.currentPage} />
        )}
      </main>
      
      <ProjectDetailsModal project={selectedProject} isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} onUpdateProject={handleUpdateProject} />
      
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        fixedClient={client}
      />
    </div>
  );
}