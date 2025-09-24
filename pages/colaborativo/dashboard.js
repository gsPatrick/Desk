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
import { IoArrowUp, IoReceipt, IoWallet, IoCashOutline, IoTrendingUpOutline } from 'react-icons/io5';

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

    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [projectsForModal, setProjectsForModal] = useState([]);

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
    }, []);

    const handleOpenListModal = (title, projects) => {
        if (projects && projects.length > 0) {
            setModalTitle(title);
            setProjectsForModal(projects);
            setIsListModalOpen(true);
        }
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
                    <h1 className={styles.headerValue}>{formatCurrency(dashboardData.netProfitMonth)}</h1>
                </div>

                <div className={styles.grid}>
                    <StatCard title="Valor Bruto (Projetos)" value={formatCurrency(dashboardData.totalGrossBudget)} icon={<IoCashOutline color="#4ade80" />} subtitle="Orçamento total de todos os projetos" />
                    <StatCard title="Total a Receber" value={formatCurrency(dashboardData.totalToReceive)} icon={<IoTrendingUpOutline color="#f59e0b" />} subtitle="Seu líquido a receber" />
                    <StatCard title="Falta Receber" value={formatCurrency(dashboardData.remainingToReceive)} icon={<IoReceipt color="#f87171" />} subtitle="Seu líquido que ainda não entrou" />
                    <StatCard title="Total Despesas (Mês)" value={formatCurrency(dashboardData.totalExpensesMonth)} icon={<IoReceipt color="#f87171" />} />
                    
                    <div className={styles.colSpan2}>
                        <StatCard 
                            title="Projetos Ativos" 
                            icon={<IoWallet color="#60a5fa" />} 
                            projectsList={dashboardData.activeProjects} 
                            onClick={() => handleOpenListModal('Projetos Ativos', dashboardData.activeProjects)}
                        />
                    </div>
                    
                    <div className={`${styles.colSpan2} ${styles.rowSpan2}`}>
                        <ProfitChart data={dashboardData.profitChartData.length > 0 ? dashboardData.profitChartData : []} />
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