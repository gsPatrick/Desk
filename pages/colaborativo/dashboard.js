// DashboardPage.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../services/colaborativo-api';

import Header from '../../components-colaborativo/Header/Header';
import StatCard from '../../components-colaborativo/StatCard/StatCard';
import ProfitChart from '../../components-colaborativo/ProfitChart/ProfitChart';
import RecentProjects from '../../components-colaborativo/RecentProjects/RecentProjects';
import UpcomingDeadlines from '../../components-colaborativo/UpcomingDeadlines/UpcomingDeadlines';
import ProjectListModal from '../../components-colaborativo/ProjectListModal/ProjectListModal';
import styles from './dashboard.module.css';
import { IoArrowUp, IoReceipt, IoWallet, IoCashOutline, IoTrendingUpOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

// Estrutura de dados inicial para evitar erros de 'undefined' antes do carregamento
const initialDashboardData = {
    netProfitMonth: 0,
    totalGrossBudget: 0,
    totalToReceive: 0,
    remainingToReceive: 0,
    activeProjects: [],
    profitChartData: [],
    recentCompletedProjects: [],
    upcomingDeadlines: [],
    totalExpensesMonth: 0
};

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState(initialDashboardData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isValuesHidden, setIsValuesHidden] = useState(false); // Estado inicial pode ser false, mas será sobrescrito pelo localStorage

    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [projectsForModal, setProjectsForModal] = useState([]);

    // Efeito para carregar os dados do dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setDashboardData(response.data || initialDashboardData);
            } catch (err) {
                console.error("Erro ao buscar dados do dashboard:", err);
                setError("Não foi possível carregar as informações do dashboard. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Dependência vazia, executa apenas na montagem

    // Efeito para carregar e salvar a preferência de visibilidade
    useEffect(() => {
        // Carregar a preferência de visibilidade do localStorage na montagem
        // Certifique-se de que estamos no ambiente do navegador antes de acessar localStorage
        if (typeof window !== 'undefined') {
            const storedVisibility = localStorage.getItem('hideDashboardValues');
            if (storedVisibility !== null) {
                setIsValuesHidden(JSON.parse(storedVisibility));
            }
        }
    }, []); // Dependência vazia, executa apenas na montagem inicial para carregar

    // Efeito para salvar a preferência de visibilidade no localStorage sempre que 'isValuesHidden' mudar
    useEffect(() => {
        // Certifique-se de que estamos no ambiente do navegador antes de acessar localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('hideDashboardValues', JSON.stringify(isValuesHidden));
        }
    }, [isValuesHidden]); // Este useEffect reage apenas às mudanças de isValuesHidden


    const handleOpenListModal = (title, projects) => {
        if (projects && projects.length > 0) {
            setModalTitle(title);
            setProjectsForModal(projects);
            setIsListModalOpen(true);
        }
    };

    const toggleValuesVisibility = () => {
        setIsValuesHidden(prev => !prev); // Usar a função de atualização para garantir o estado mais recente
    };

    const displayValue = (value) => {
        return isValuesHidden ? '********' : value;
    };

    if (isLoading) {
        return (
            <div className="colab-theme">
                <Header activePage="dashboard" />
                <main className={styles.pageWrapper}>
                    <div className={styles.messageState}>Carregando informações...</div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="colab-theme">
                <Header activePage="dashboard" />
                <main className={styles.pageWrapper}>
                    <div className={styles.messageState} style={{ color: '#f87171' }}>{error}</div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="colab-theme">
            <Head>
                <title>Dashboard | Sistema Colaborativo</title>
            </Head>
            <Header activePage="dashboard" />
            <main className={styles.pageWrapper}>
                <div className={styles.header}>
                    <p className={styles.headerLabel}>Lucro Líquido (Mês)</p>
                    <div className={styles.headerValueContainer}>
                        <h1 className={styles.headerValue}>{displayValue(formatCurrency(dashboardData.netProfitMonth))}</h1>
                        <button onClick={toggleValuesVisibility} className={styles.visibilityToggle}>
                            {isValuesHidden ? <IoEyeOffOutline size={24} /> : <IoEyeOutline size={24} />}
                        </button>
                    </div>
                </div>

                <div className={styles.grid}>
                    <StatCard 
                        title="Valor Bruto (Projetos)" 
                        value={displayValue(formatCurrency(dashboardData.totalGrossBudget))} 
                        icon={<IoCashOutline color="#4ade80" />} 
                        subtitle="Orçamento total de todos os projetos" 
                        isValuesHidden={isValuesHidden} // Passa a prop para o StatCard
                    />
                    <StatCard 
                        title="Total a Receber" 
                        value={displayValue(formatCurrency(dashboardData.totalToReceive))} 
                        icon={<IoTrendingUpOutline color="#f59e0b" />} 
                        subtitle="Seu líquido a receber" 
                        isValuesHidden={isValuesHidden} // Passa a prop para o StatCard
                    />
                    <StatCard 
                        title="Falta Receber" 
                        value={displayValue(formatCurrency(dashboardData.remainingToReceive))} 
                        icon={<IoReceipt color="#f87171" />} 
                        subtitle="Seu líquido que ainda não entrou" 
                        isValuesHidden={isValuesHidden} // Passa a prop para o StatCard
                    />
                    <StatCard 
                        title="Total Despesas (Mês)" 
                        value={displayValue(formatCurrency(dashboardData.totalExpensesMonth))} 
                        icon={<IoReceipt color="#f87171" />} 
                        isValuesHidden={isValuesHidden} // Passa a prop para o StatCard
                    />
                    
                    <div className={styles.colSpan2}>
                        <StatCard 
                            title="Projetos Ativos" 
                            icon={<IoWallet color="#60a5fa" />} 
                            projectsList={dashboardData.activeProjects} 
                            onClick={() => handleOpenListModal('Projetos Ativos', dashboardData.activeProjects)}
                        />
                    </div>
                    
                    <div className={`${styles.colSpan2} ${styles.rowSpan2}`}>
                        <ProfitChart data={dashboardData.profitChartData.length > 0 ? dashboardData.profitChartData : []} isValuesHidden={isValuesHidden} /> {/* Passa a prop para o ProfitChart */}
                    </div>
                    <div className={styles.rowSpan2}>
                        <RecentProjects 
                            projects={dashboardData.recentCompletedProjects} 
                            onClick={() => handleOpenListModal('Projetos Concluídos Recentemente', dashboardData.recentCompletedProjects)}
                        />
                    </div>
                     <div className={styles.rowSpan2}>
                        <UpcomingDeadlines projects={dashboardData.upcomingDeadlines} />
                    </div>
                </div>
            </main>
            
            <ProjectListModal 
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                title={modalTitle}
                projects={projectsForModal}
            />
        </div>
    );
}