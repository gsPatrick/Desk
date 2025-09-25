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
import ClientDetailsModal from '../../../../components-colaborativo/ClientDetailsModal/ClientDetailsModal';

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

    const [currentUserId, setCurrentUserId] = useState(null); // ID do usuário logado
    const [currentUserRole, setCurrentUserRole] = useState(null); // Role do usuário logado

    // --- ESTADOS PARA O MODAL DE DETALHES DO CLIENTE (para abrir da sidebar) ---
    const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
    const [selectedClientForModal, setSelectedClientForModal] = useState(null);


    // Função principal para buscar os dados completos do projeto e prioridades
    // Esta função será passada para os componentes filhos para recarregar a página
    const fetchProjectAndPriorities = async () => {
        if (!projectId) return;
        try {
            setIsLoading(true);
            const [projectResponse, prioritiesResponse, meResponse] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get('/priorities'),
                api.get('/users/me')
            ]);
            setProject(projectResponse.data);
            setPriorities(prioritiesResponse.data);
            setCurrentUserId(meResponse.data.id); 
            setCurrentUserRole(meResponse.data.label); 
            setFormData({ // Inicializa formData com os dados do projectResponse.data
                description: projectResponse.data.description || '',
                briefing: projectResponse.data.briefing || '',
                notes: projectResponse.data.notes || '',
                priorityId: projectResponse.data.priorityId || '',
                platformCommissionPercent: projectResponse.data.platformCommissionPercent || '',
                ownerCommissionType: projectResponse.data.ownerCommissionType || '',
                ownerCommissionValue: projectResponse.data.ownerCommissionValue || ''
            });
        } catch (error) { 
            console.error("Erro ao buscar detalhes do projeto ou prioridades", error);
            setProject(null); 
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

    // Salva alterações da aba "Documentação" ou "Visão Geral" (ex: prioridade, comissões)
    const handleSaveGeneralChanges = async () => {
        try {
            // Converte valores numéricos para float antes de enviar
            const dataToSave = {
                ...formData,
                platformCommissionPercent: parseFloat(formData.platformCommissionPercent) || 0,
                ownerCommissionValue: parseFloat(formData.ownerCommissionValue) || 0,
                priorityId: formData.priorityId === '' ? null : parseInt(formData.priorityId, 10)
            };
            await api.patch(`/projects/${projectId}`, dataToSave);
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

    // --- CORREÇÃO AQUI: handleFullPayment usa yourRemainingToReceive ---
    const handleFullPayment = async () => {
        const yourRemainingToReceive = parseFloat(project.yourRemainingToReceive || 0); // Pega o valor já calculado do project
        if (yourRemainingToReceive <= 0.001) return;

        if (window.confirm(`Você confirma o registro de um recebimento de ${formatCurrency(yourRemainingToReceive)} para quitar sua parte neste projeto?`)) {
            try {
                // A API precisa de um endpoint para registrar o recebimento da SUA PARTE
                // Vamos usar um endpoint específico para isso no backend
                await api.patch(`/projects/${projectId}/register-receipt`, { amount: yourRemainingToReceive, isFullPayment: true });
                fetchProjectAndPriorities();
            } catch (error) {
                alert(error.response?.data?.message || "Erro ao registrar recebimento total da sua parte.");
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
    const totalPaidByClient = parseFloat(project.paymentDetails?.client?.amountPaid || 0); // Já é o total pago pelo cliente
    const remainingAmountToClient = parseFloat(project.budget || 0) - totalPaidByClient; // O que falta o cliente pagar

    // --- CÁLCULO DE COMISSÕES E LUCRO LÍQUIDO DO DONO / PARCEIRO (APENAS PARA EXIBIÇÃO) ---
    // Estes valores já vêm pré-calculados do backend no objeto `project`
    const budget = parseFloat(project.budget || 0);
    const platformCommissionPercent = parseFloat(project.platformCommissionPercent || 0);
    const platformFee = budget * (platformCommissionPercent / 100);

    const yourTotalToReceive = parseFloat(project.yourTotalToReceive || 0);
    const yourAmountReceived = parseFloat(project.yourAmountReceived || 0);
    const yourRemainingToReceive = parseFloat(project.yourRemainingToReceive || 0);

    const netAmountAfterPlatform = budget - platformFee;


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
                                    <div><span className={styles.label}>Orçamento Total Bruto</span><p className={styles.value}>{formatCurrency(budget)}</p></div>
                                    
                                    <div className={styles.fullWidth}><span className={styles.label}>Prioridade</span>
                                        <select name="priorityId" value={formData.priorityId} onChange={handleFormChange} className={styles.editInput}>
                                            <option value="">Sem prioridade</option>
                                            {priorities.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                                        </select>
                                    </div>
                                    <div className={styles.fullWidth}><span className={styles.label}>Plataforma</span><p className={styles.value}>{project.AssociatedPlatform?.name || 'Venda Direta'}</p></div>
                                    <div className={styles.fullWidth}><span className={styles.label}>Comissão Plataforma</span><p className={styles.value}>{platformCommissionPercent || 0}% ({formatCurrency(platformFee)})</p></div>
                                    
                                    <h3 className={styles.subTitle + ' ' + styles.fullWidth}>Sua Participação</h3>
                                    <div className={styles.fullWidth}><span className={styles.label}>Seu Líquido Total Esperado</span><p className={styles.value}>{formatCurrency(yourTotalToReceive)}</p></div>

                                    {/* --- DADOS DOS PARCEIROS (apenas se houver) --- */}
                                    {project.Partners?.length > 0 && (
                                        <>
                                            <h3 className={styles.subTitle + ' ' + styles.fullWidth}>Comissões dos Parceiros</h3>
                                            {project.Partners.map(partner => {
                                                const share = partner.ProjectShare;
                                                const partnerExpectedAmount = share.commissionType === 'percentage'
                                                    ? netAmountAfterPlatform * (parseFloat(share.commissionValue) / 100)
                                                    : parseFloat(share.commissionValue);
                                                return (
                                                    <div key={partner.id} className={styles.fullWidth}>
                                                        <span className={styles.label}>{partner.name}</span>
                                                        <p className={styles.value}>
                                                            {share.commissionValue}{share.commissionType === 'percentage' ? '%' : ' (fixo)'} ({formatCurrency(partnerExpectedAmount)})
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
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
                                    <div className={styles.summaryItem}><span>Total Recebido do Cliente</span><p className={styles.receivedAmount}>{formatCurrency(totalPaidByClient)}</p></div>
                                    <div className={styles.summaryItem}><span>Valor Restante do Cliente</span><p className={styles.remainingAmount}>{formatCurrency(remainingAmountToClient)}</p></div>
                                    <div className={styles.summaryItem}><span>Seu Líquido Total</span><p className={styles.receivedAmount}>{formatCurrency(yourTotalToReceive)}</p></div>
                                    <div className={styles.summaryItem}><span>Seu Líquido Já Recebido</span><p className={styles.receivedAmount}>{formatCurrency(yourAmountReceived)}</p></div>
                                    <div className={styles.summaryItem}><span>Seu Líquido Restante</span><p className={styles.remainingAmount}>{formatCurrency(yourRemainingToReceive)}</p></div>
                                </div>
                                {yourRemainingToReceive > 0.001 && ( // Alterado para seuRemainingToReceive
                                    <div className={styles.fullPaymentContainer}>
                                        <button className={styles.fullPaymentButton} onClick={handleFullPayment}>
                                            <IoShieldCheckmarkOutline /> Registrar Recebimento Total (Sua Parte)
                                        </button>
                                    </div>
                                )}
                                <h3 className={styles.subTitle}>Histórico de Pagamentos do Cliente</h3>
                                {isLoading ? <p className={styles.noTransactions}>Carregando...</p> : (
                                    <div className={styles.transactionList}>
                                        {project.Transactions && project.Transactions.length > 0 ? project.Transactions.map(t => (
                                            <div key={t.id} className={styles.transactionItem}>
                                                <div><p className={styles.transactionAmount}>{formatCurrency(t.amount)}</p><p className={styles.transactionDate}>{formatDate(t.paymentDate)}</p></div>
                                                <button onClick={() => handleDeleteTransaction(t.id)} className={styles.deleteButton} title="Excluir"><IoTrash /></button>
                                            </div>
                                        )) : <p className={styles.noTransactions}>Nenhum pagamento registrado do cliente.</p>}
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