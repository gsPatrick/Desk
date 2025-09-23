import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../../services/colaborativo-api';
import Header from '../../../components-colaborativo/Header/Header';
import AddExpenseModal from '../../../components-colaborativo/AddExpenseModal/AddExpenseModal'; // Importa o novo modal
import styles from './Despesas.module.css';
import { IoAdd, IoTrash } from 'react-icons/io5';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

// --- Componente Card de Despesa ---
const ExpenseCard = ({ expense, onDelete }) => (
    <div className={styles.expenseCard}>
        <div className={styles.expenseHeader}>
            <p className={styles.expenseDescription}>{expense.description}</p>
            <span className={styles.expenseAmount}>{formatCurrency(expense.amount)}</span>
        </div>
        <div className={styles.expenseDetails}>
            {expense.category && <span className={styles.expenseCategory}>{expense.category}</span>}
            <span className={styles.expenseDate}>{formatDate(expense.expenseDate)}</span>
            {expense.receiptUrl && <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>Ver Comprovante</a>}
            <button onClick={() => onDelete(expense.id)} className={styles.deleteButton} title="Excluir despesa"><IoTrash /></button>
        </div>
    </div>
);

export default function DespesasPage() {
    const [expenses, setExpenses] = useState([]);
    const [clientsWithProjects, setClientsWithProjects] = useState([]); // Para o filtro e modal
    const [activeProjectFilter, setActiveProjectFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const params = activeProjectFilter ? { projectId: activeProjectFilter } : {};
            const response = await api.get('/expenses', { params });
            setExpenses(response.data);
        } catch (error) {
            console.error("Erro ao buscar despesas", error);
            setExpenses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClientsAndProjectsForFilter = async () => {
        try {
            const projectsResponse = await api.get('/projects');
            // Agrupa projetos por cliente para exibição hierárquica no filtro
            const grouped = projectsResponse.data.projects.reduce((acc, proj) => {
                const clientId = proj.Client ? proj.Client.id : 'general';
                if (!acc[clientId]) {
                    acc[clientId] = { 
                        id: clientId, 
                        legalName: proj.Client ? proj.Client.legalName : 'Despesas Gerais', 
                        tradeName: proj.Client ? proj.Client.tradeName : 'Despesas Gerais',
                        Projects: [] 
                    };
                }
                acc[clientId].Projects.push(proj);
                return acc;
            }, {});
            setClientsWithProjects(Object.values(grouped));
        } catch (error) {
            console.error("Erro ao buscar clientes com projetos para o filtro", error);
        }
    };

    useEffect(() => {
        fetchClientsAndProjectsForFilter();
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [activeProjectFilter, isAddModalOpen]);

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
            try {
                await api.delete(`/expenses/${expenseId}`);
                fetchExpenses();
            } catch (error) {
                alert(error.response?.data?.message || "Erro ao excluir despesa.");
            }
        }
    };

    const totalPeriodExpenses = expenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);

    return (
        <div className="colab-theme">
            <Head><title>Despesas | Sistema Colaborativo</title></Head>
            <Header activePage="despesas" />
            <main className={styles.pageWrapper}>
                 <div className={styles.toolbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Despesas</h1>
                        <p className={styles.pageSubtitle}>Gerencie suas despesas de projetos e do negócio.</p>
                    </div>
                    <div className={styles.actionsContainer}>
                        <select value={activeProjectFilter} onChange={(e) => setActiveProjectFilter(e.target.value)} className={styles.filterSelect}>
                            <option value="">Todas as Despesas</option>
                            {clientsWithProjects.map(client => (
                                <optgroup key={client.id} label={client.tradeName || client.legalName}>
                                    {(client.Projects || []).map(proj => (
                                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <button onClick={() => setIsAddModalOpen(true)} className={styles.addButton}><IoAdd size={20} /> Nova Despesa</button>
                    </div>
                </div>

                <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Total de Despesas (Filtrado)</p>
                    <h2 className={styles.summaryValue}>{formatCurrency(totalPeriodExpenses)}</h2>
                </div>

                {isLoading ? (
                    <div className={styles.messageState}>Carregando despesas...</div>
                ) : expenses.length > 0 ? (
                    <div className={styles.expenseList}>
                        {expenses.map(exp => <ExpenseCard key={exp.id} expense={exp} onDelete={handleDeleteExpense} />)}
                    </div>
                ) : (
                    <div className={styles.emptyState}>Nenhuma despesa encontrada para os filtros selecionados.</div>
                )}
            </main>

            <AddExpenseModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddSuccess={() => { setIsAddModalOpen(false); fetchExpenses(); }} 
                clients={clientsWithProjects}
                initialProjectId={activeProjectFilter} // Preenche o projectId se já estiver filtrado
            />
        </div>
    );
}