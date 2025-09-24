import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '../../../../services/colaborativo-api';

// Componentes da UI
import Header from '../../../../components-colaborativo/Header/Header';
import EditableSection from '../../../../components-colaborativo/EditableSection/EditableSection';
import ClientInfoCard from '../../../../components-colaborativo/ClientInfoCard/ClientInfoCard';
import TimeTracking from '../../../../components-colaborativo/TimeTracking/TimeTracking';
import ExpenseTracker from '../../../../components-colaborativo/ExpenseTracker/ExpenseTracker';
import ClientDetailsModal from '../../../../components-colaborativo/ClientDetailsModal/ClientDetailsModal'; // Importar o modal de detalhes do cliente

// Estilos e Ícones
import styles from './FullProjectView.module.css';
import { 
    IoArrowBack, IoDocumentTextOutline, IoHourglassOutline, IoReceiptOutline, 
    IoWalletOutline, IoInformationCircleOutline, IoShieldCheckmarkOutline, IoPencil, 
    IoTrash 
} from 'react-icons/io5';

// Helpers
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getStatusInfo } from '../../../../utils/colaborativo-helpers';


// Formatação de valores
const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    try { return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR }); } catch (e) { return dateString; }
};


// Definições de campos para EditableSection (inalteradas)
const STACK_FIELDS = [
    { name: 'type', label: 'Tipo', placeholder: 'Ex: Frontend, Backend' },
    { name: 'name', label: 'Tecnologia', placeholder: 'Ex: React, Node.js' },
    { name: 'repoUrl', label: 'Repositório', placeholder: 'URL do GitHub' },
];
const LINKS_FIELDS = [
    { name: 'name', label: 'Nome', placeholder: 'Ex: Figma, Staging' },
    { name: 'url', label: 'Link', placeholder: 'URL completa' },
];
const CREDENTIALS_FIELDS = [
    { name: 'service', label: 'Serviço', placeholder: 'Ex: AWS S3, Hospedagem' },
    { name: 'user', label: 'Usuário/Chave', placeholder: 'Seu usuário ou chave de acesso' },
    { name: 'pass', label: 'Senha/Segredo', placeholder: 'Sua senha ou segredo' },
];


export default function FullProjectViewPage() {
    const router = useRouter();
    const { id: projectId } = router.query;
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // Começa na aba de Visão Geral
    const [priorities, setPriorities] = useState([]); // Para a lista de prioridades
    const [formData, setFormData] = useState({}); // Estado para campos editáveis via input/textarea
    const [newTransaction, setNewTransaction] = useState({ amount: '', paymentDate: new Date().toISOString().split('T')[0] });

    // --- ESTADOS PARA O MODAL DE DETALHES DO CLIENTE (para abrir da sidebar) ---
    const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
    const [selectedClientForModal, setSelectedClientForModal] = useState(null);


    // Função principal para buscar os dados completos do projeto e prioridades
    // Esta função será passada para os componentes filhos para recarregar a página
    const fetchProjectAndPriorities = async () => {
        if (!projectId) return;
        try {
            setIsLoading(true);
            const [projectResponse, prioritiesResponse] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get('/priorities')
            ]);
            setProject(projectResponse.data);
            setPriorities(prioritiesResponse.data);
            setFormData({ // Inicializa formData com os dados do projeto para os campos de texto/select editáveis
                description: projectResponse.data.description || '',
                briefing: projectResponse.data.briefing || '',
                notes: projectResponse.data.notes || '',
                priorityId: projectResponse.data.priorityId || ''
            });
        } catch (error) { 
            console.error("Erro ao buscar detalhes do projeto ou prioridades", error);
            setProject(null); // Limpa o projeto em caso de erro
        } finally { 
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        fetchProjectAndPriorities();
    }, [projectId]);

    // Função genérica para atualizar qualquer campo do projeto (para EditableSection e campos de texto)
    const handleUpdate = async (fieldName, newData) => {
        try {
            setProject(prev => ({ ...prev, [fieldName]: newData })); 
            await api.patch(`/projects/${projectId}`, { [fieldName]: newData });
        } catch (error) {
            console.error(`Erro ao atualizar ${fieldName}`, error);
            alert(`Não foi possível salvar as alterações em "${fieldName}". A página será atualizada.`);
            fetchProjectAndPriorities(); 
        }
    };

    // Handler para campos de formulário que não são EditableSection
    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Salva alterações da aba "Documentação" ou "Visão Geral" (ex: prioridade)
    const handleSaveGeneralChanges = async () => {
        try {
            await api.patch(`/projects/${projectId}`, formData);
            fetchProjectAndPriorities(); // Recarrega para garantir que a UI reflita o novo estado
            alert('Alterações salvas com sucesso!');
        } catch (error) {
            alert(error.response?.data?.message || "Erro ao salvar alterações.");
        }
    };


    // --- LÓGICA DE PAGAMENTOS ---
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${projectId}/transactions`, newTransaction);
            setNewTransaction({ amount: '', paymentDate: new Date().toISOString().split('T')[0] });
            fetchProjectAndPriorities(); // Recarrega tudo para atualizar o resumo e a lista
        } catch (error) { alert(error.response?.data?.message || "Erro ao adicionar transação."); }
    };
    
    const handleDeleteTransaction = async (transactionId) => {
        if (window.confirm("Tem certeza que deseja remover este pagamento?")) {
            try {
                await api.delete(`/transactions/${transactionId}`);
                fetchProjectAndPriorities();
            } catch (error) { alert(error.response?.data?.message || "Erro ao remover transação."); }
        }
    };

    const handleFullPayment = async () => {
        const totalPaid = project.Transactions ? project.Transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0) : 0;
        const remainingAmount = parseFloat(project.budget) - totalPaid;
        if (remainingAmount <= 0.001) return; // Pequena tolerância para float

        if (window.confirm(`Você confirma o registro de um pagamento de ${formatCurrency(remainingAmount)} para quitar este projeto?`)) {
            const fullPaymentTransaction = {
                amount: remainingAmount,
                paymentDate: new Date().toISOString().split('T')[0],
                description: 'Pagamento total do projeto'
            };
            try {
                await api.post(`/projects/${projectId}/transactions`, fullPaymentTransaction);
                fetchProjectAndPriorities();
            } catch (error) {
                alert(error.response?.data?.message || "Erro ao registrar pagamento total.");
            }
        }
    };
    // --- FIM LÓGICA DE PAGAMENTOS ---

    // --- HANDLERS PARA O MODAL DE DETALHES DO CLIENTE ---
    const handleOpenClientDetailsModal = (client) => {
        setSelectedClientForModal(client);
        setIsClientDetailsModalOpen(true);
    };
    const handleCloseClientDetailsModal = () => {
        setSelectedClientForModal(null);
        setIsClientDetailsModalOpen(false);
    };


    if (isLoading || !project) { 
        return (
            <div className="colab-theme">
                <Header activePage="projetos" />
                <main className={styles.pageWrapper}>
                    <div className={styles.loading}>{isLoading ? 'Carregando projeto...' : 'Projeto não encontrado ou acesso negado.'}</div>
                </main>
            </div>
        );
    }

    // Dados derivados para exibição
    const statusInfo = getStatusInfo(project.status);
    const totalPaid = project.Transactions ? project.Transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0) : 0;
    const remainingAmount = parseFloat(project.budget) - totalPaid;

    return (
        <div className="colab-theme">
            <Head><title>{project.name} | Detalhes do Projeto</title></Head>
            <Header activePage="projetos" />

            <main className={styles.pageWrapper}>
                <div className={styles.header}>
                    <button onClick={() => router.push('/colaborativo/projetos')} className={styles.backButton}>
                        <IoArrowBack /> Voltar para Projetos
                    </button>
                    <h1>{project.name}</h1>
                </div>
                
                {/* --- MENU DE ABAS --- */}
                <div className={styles.tabs}>
                    <button onClick={() => setActiveTab('overview')} className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}><IoInformationCircleOutline /> Visão Geral</button>
                    <button onClick={() => setActiveTab('docs')} className={`${styles.tabButton} ${activeTab === 'docs' ? styles.active : ''}`}><IoDocumentTextOutline /> Documentação</button>
                    <button onClick={() => setActiveTab('payments')} className={`${styles.tabButton} ${activeTab === 'payments' ? styles.active : ''}`}><IoWalletOutline /> Pagamentos</button>
                    <button onClick={() => setActiveTab('hours')} className={`${styles.tabButton} ${activeTab === 'hours' ? styles.active : ''}`}><IoHourglassOutline /> Horas</button>
                    <button onClick={() => setActiveTab('expenses')} className={`${styles.tabButton} ${activeTab === 'expenses' ? styles.active : ''}`}><IoReceiptOutline /> Despesas</button>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.mainContent}>
                        {/* Aba: Visão Geral */}
                        {activeTab === 'overview' && (
                            <div className={styles.section}>
                                <h2>Visão Geral do Projeto <button onClick={handleSaveGeneralChanges} className={styles.saveSectionButton}><IoPencil /> Salvar</button></h2>
                                <div className={styles.overviewGrid}>
                                    <div><span className={styles.label}>Status</span><p className={`${styles.value} ${styles[statusInfo.className]}`}>{statusInfo.label}</p></div>
                                    <div><span className={styles.label}>Prazo Final</span><p className={styles.value}>{formatDate(project.deadline)}</p></div>
                                    <div><span className={styles.label}>Orçamento Total</span><p className={styles.value}>{formatCurrency(project.budget)}</p></div>
                                    
                                    <div className={styles.fullWidth}><span className={styles.label}>Prioridade</span>
                                        <select name="priorityId" value={formData.priorityId} onChange={handleFormChange} className={styles.editInput}>
                                            <option value="">Sem prioridade</option>
                                            {priorities.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                                        </select>
                                    </div>
                                    <div className={styles.fullWidth}><span className={styles.label}>Plataforma</span><p className={styles.value}>{project.platform || 'Venda Direta'}</p></div>
                                </div>
                            </div>
                        )}

                        {/* Aba: Documentação */}
                        {activeTab === 'docs' && (
                            <div className={styles.section}>
                                <h2>Documentação <button onClick={handleSaveGeneralChanges} className={styles.saveSectionButton}><IoPencil /> Salvar</button></h2>
                                <div className={styles.docsSection}>
                                    <div className={styles.formGroup}><label className={styles.label}>Descrição</label><textarea name="description" value={formData.description} onChange={handleFormChange} rows="4" className={styles.editInput}></textarea></div>
                                    <div className={styles.formGroup}><label className={styles.label}>Briefing</label><textarea name="briefing" value={formData.briefing} onChange={handleFormChange} rows="6" className={styles.editInput}></textarea></div>
                                    <div className={styles.formGroup}><label className={styles.label}>Anotações Técnicas</label><textarea name="notes" value={formData.notes} onChange={handleFormChange} rows="6" className={styles.editInput}></textarea></div>
                                </div>
                                <EditableSection title="Stack Técnica" data={project.technicalStack} fields={STACK_FIELDS} fieldName="technicalStack" onSave={handleUpdate} />
                                <EditableSection title="Links Úteis" data={project.projectLinks} fields={LINKS_FIELDS} fieldName="projectLinks" onSave={handleUpdate} />
                                <EditableSection title="Credenciais" data={project.credentials} fields={CREDENTIALS_FIELDS} fieldName="credentials" onSave={handleUpdate} />
                            </div>
                        )}
                        
                        {/* Aba: Pagamentos */}
                        {activeTab === 'payments' && (
                            <div className={styles.section}>
                                <h2>Pagamentos</h2>
                                <div className={styles.paymentSummary}>
                                    <div className={styles.summaryItem}><span>Total Recebido</span><p className={styles.receivedAmount}>{formatCurrency(totalPaid)}</p></div>
                                    <div className={styles.summaryItem}><span>Valor Restante</span><p className={styles.remainingAmount}>{formatCurrency(remainingAmount)}</p></div>
                                </div>
                                {remainingAmount > 0.001 && (
                                    <div className={styles.fullPaymentContainer}>
                                        <button className={styles.fullPaymentButton} onClick={handleFullPayment}>
                                            <IoShieldCheckmarkOutline /> Registrar Pagamento Total
                                        </button>
                                    </div>
                                )}
                                <h3 className={styles.subTitle}>Histórico de Pagamentos</h3>
                                {isLoading ? <p className={styles.noTransactions}>Carregando...</p> : (
                                    <div className={styles.transactionList}>
                                        {project.Transactions && project.Transactions.length > 0 ? project.Transactions.map(t => (
                                            <div key={t.id} className={styles.transactionItem}>
                                                <div><p className={styles.transactionAmount}>{formatCurrency(t.amount)}</p><p className={styles.transactionDate}>{formatDate(t.paymentDate)}</p></div>
                                                <button onClick={() => handleDeleteTransaction(t.id)} className={styles.deleteButton} title="Excluir"><IoTrash /></button>
                                            </div>
                                        )) : <p className={styles.noTransactions}>Nenhum pagamento registrado.</p>}
                                    </div>
                                )}
                                <form className={styles.addTransactionForm} onSubmit={handleAddTransaction}>
                                    <input type="number" step="0.01" placeholder="Adicionar pagamento parcial" value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} required />
                                    <input type="date" value={newTransaction.paymentDate} onChange={e => setNewTransaction({ ...newTransaction, paymentDate: e.target.value })} required />
                                    <button type="submit" className={styles.saveButton}>Adicionar</button>
                                </form>
                            </div>
                        )}

                        {/* Aba: Horas */}
                        {activeTab === 'hours' && <TimeTracking projectId={projectId} onUpdateProjectData={fetchProjectAndPriorities} />}

                        {/* Aba: Despesas */}
                        {activeTab === 'expenses' && <ExpenseTracker projectId={projectId} onUpdateProjectData={fetchProjectAndPriorities} />}
                    </div>
                    <aside className={styles.sidebar}>
                        <ClientInfoCard client={project.Client} onOpenClientDetails={handleOpenClientDetailsModal} />
                        {/* Você pode adicionar mais cards de informação aqui no futuro */}
                    </aside>
                </div>
            </main>
             {/* Modal de Detalhes do Cliente (para abrir da sidebar) */}
            <ClientDetailsModal
                isOpen={isClientDetailsModalOpen}
                onClose={handleCloseClientDetailsModal}
                client={selectedClientForModal}
            />
        </div>
    );
}