import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import Modal from '../Modal/Modal';
import styles from './ProjectDetailsModal.module.css';
import { getStatusInfo } from '../../utils/colaborativo-helpers';
import api from '../../services/colaborativo-api';
import { IoTrash, IoDocumentTextOutline, IoWalletOutline, IoInformationCircleOutline, IoShieldCheckmarkOutline, IoPencil } from 'react-icons/io5';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    try {
        const date = parseISO(dateString);
        return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) { return dateString; }
};

const DetailItem = ({ label, value }) => (
    <div className={styles.detailItem}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
    </div>
);

// Este componente é usado para exibir textos longos em Documentação.
// Foi renomeado para TextContentSection e agora é editável.
const TextContentSection = ({ title, content, name, onChange, rows = 4 }) => {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>{title}</label>
            <textarea name={name} value={content} onChange={onChange} rows={rows} className={styles.editInput}></textarea>
        </div>
    );
};

export default function ProjectDetailsModal({ project, isOpen, onClose, onDataChange, priorities, currentUserId }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [formData, setFormData] = useState({}); // Estado para campos editáveis (prioridade, doc)
    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({ amount: '', paymentDate: new Date().toISOString().split('T')[0] });
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                priorityId: project.priorityId || '',
                description: project.description || '',
                briefing: project.briefing || '',
                notes: project.notes || '',
            });
            fetchTransactions();
        }
        setActiveTab('overview');
    }, [project, isOpen]);

    if (!project) return null;

    const fetchTransactions = async () => {
        if (!project) return;
        setIsLoadingTransactions(true);
        try {
            const response = await api.get(`/projects/${project.id}/transactions`);
            setTransactions(response.data);
        } catch (error) { 
            console.error("Erro ao buscar transações", error);
            setTransactions([]);
        }
        finally { setIsLoadingTransactions(false); }
    };

    const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${project.id}/transactions`, newTransaction);
            setNewTransaction({ amount: '', paymentDate: new Date().toISOString().split('T')[0] });
            onDataChange(); // Notifica a página pai para recarregar
            fetchTransactions(); // Re-busca transações para o modal
        } catch (error) { 
            alert(error.response?.data?.message || "Erro ao adicionar transação."); 
        }
    };
    
    const handleDeleteTransaction = async (transactionId) => {
        if (window.confirm("Tem certeza que deseja remover este pagamento?")) {
            try {
                await api.delete(`/transactions/${transactionId}`);
                onDataChange();
                fetchTransactions();
            } catch (error) { 
                alert(error.response?.data?.message || "Erro ao remover transação."); 
            }
        }
    };
    
    const handleSaveChanges = async () => {
        try {
            // Envia apenas os campos relevantes para o PATCH
            const dataToPatch = {
                priorityId: formData.priorityId === '' ? null : parseInt(formData.priorityId, 10),
                description: formData.description,
                briefing: formData.briefing,
                notes: formData.notes
            };
            await api.patch(`/projects/${project.id}`, dataToPatch);
            onDataChange();
            onClose();
        } catch (error) { 
            alert(error.response?.data?.message || "Erro ao salvar alterações."); 
        }
    };

    // --- CORREÇÃO AQUI: handleFullPayment usa yourRemainingToReceive ---
    const handleFullPayment = async () => {
        const yourRemainingToReceive = parseFloat(project.yourRemainingToReceive || 0); // Usa o valor pré-calculado
        if (yourRemainingToReceive <= 0.001) return;

        if (window.confirm(`Você confirma o registro de um recebimento de ${formatCurrency(yourRemainingToReceive)} para quitar sua parte neste projeto?`)) {
            try {
                // Endpoint para registrar o recebimento da SUA PARTE
                await api.patch(`/projects/${project.id}/register-receipt`, { amount: yourRemainingToReceive, isFullPayment: true });
                onDataChange();
                fetchTransactions(); // Re-busca as transações para atualizar o modal
            } catch (error) {
                alert(error.response?.data?.message || "Erro ao registrar recebimento total da sua parte.");
            }
        }
    };
    // --- FIM LÓGICA DE PAGAMENTOS ---

    const statusInfo = getStatusInfo(project.status);
    const totalPaidByClient = parseFloat(project.paymentDetails?.client?.amountPaid || 0); // Já é o total pago pelo cliente
    const remainingAmountToClient = parseFloat(project.budget || 0) - totalPaidByClient; // O que falta o cliente pagar

    // Valores financeiros pré-calculados do projeto
    const yourTotalToReceive = parseFloat(project.yourTotalToReceive || 0);
    const yourAmountReceived = parseFloat(project.yourAmountReceived || 0);
    const yourRemainingToReceive = parseFloat(project.yourRemainingToReceive || 0);


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={project.name}>
            <div className={styles.tabs}>
                <button className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}><IoInformationCircleOutline /> Visão Geral</button>
                <button className={`${styles.tabButton} ${activeTab === 'docs' ? styles.active : ''}`} onClick={() => setActiveTab('docs')}><IoDocumentTextOutline /> Documentação</button>
                <button className={`${styles.tabButton} ${activeTab === 'payments' ? styles.active : ''}`} onClick={() => setActiveTab('payments')}><IoWalletOutline /> Pagamentos</button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'overview' && (
                    <div className={styles.detailsGrid}>
                        <DetailItem label="Cliente" value={project.Client ? (project.Client.tradeName || project.Client.legalName) : 'N/A'} />
                        <DetailItem label="Status" value={statusInfo.label} />
                        <DetailItem label="Prazo Final" value={formatDate(project.deadline)} />
                        <DetailItem label="Orçamento Total" value={formatCurrency(project.budget)} />
                        <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                            <label htmlFor="priority-select" className={styles.label}>Prioridade</label>
                            <select id="priority-select" name="priorityId" value={formData.priorityId} onChange={handleFormChange} className={styles.editInput}>
                                <option value="">Sem prioridade</option>
                                {priorities && priorities.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className={styles.docsSection}>
                        <TextContentSection title="Descrição" name="description" content={formData.description} onChange={handleFormChange} rows={4} />
                        <TextContentSection title="Briefing" name="briefing" content={formData.briefing} onChange={handleFormChange} rows={6} />
                        <TextContentSection title="Anotações Técnicas" name="notes" content={formData.notes} onChange={handleFormChange} rows={6} />
                    </div>
                )}
                
                {activeTab === 'payments' && (
                    <div className={styles.paymentControlSection}>
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
                        {isLoadingTransactions ? <p className={styles.noTransactions}>Carregando...</p> : (
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
            </div>
            
            <div className={styles.modalFooter}>
                <Link href={`/colaborativo/projetos/${project.id}`} className={styles.detailsButton}>Ver Página Completa</Link>
                <div className={styles.footerActions}>
                    <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                    <button onClick={handleSaveChanges} className={styles.saveButton}>Salvar Alterações</button>
                </div>
            </div>
        </Modal>
    );
}