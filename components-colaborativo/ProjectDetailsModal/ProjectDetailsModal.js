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

export default function ProjectDetailsModal({ project, isOpen, onClose, onDataChange, priorities }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [formData, setFormData] = useState({}); // Estado para campos editáveis (prioridade, doc)
    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({ amount: '', paymentDate: new Date().toISOString().split('T')[0] });
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false); // Renomeado para maior clareza

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
            onDataChange();
            fetchTransactions();
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
                priorityId: formData.priorityId,
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

    const statusInfo = getStatusInfo(project.status);
    const totalPaid = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const remainingAmount = parseFloat(project.budget) - totalPaid;

    const handleFullPayment = async () => {
        if (remainingAmount <= 0.001) return;

        if (window.confirm(`Você confirma o registro de um pagamento de ${formatCurrency(remainingAmount)} para quitar este projeto?`)) {
            const fullPaymentTransaction = {
                amount: remainingAmount,
                paymentDate: new Date().toISOString().split('T')[0],
                description: 'Pagamento total do projeto'
            };
            try {
                await api.post(`/projects/${project.id}/transactions`, fullPaymentTransaction);
                onDataChange();
                fetchTransactions();
            } catch (error) {
                alert(error.response?.data?.message || "Erro ao registrar pagamento total.");
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={project.name}>
            <div className={styles.tabs}>
                <button className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}><IoInformationCircleOutline /> Visão Geral</button>
                <button className={`${styles.tabButton} ${activeTab === 'docs' ? styles.active : ''}`} onClick={() => setActiveTab('docs')}><IoDocumentTextOutline /> Documentação</button>
                <button className={`${styles.tabButton} ${activeTab === 'payments' ? styles.active : ''}`} onClick={() => setActiveTab('payments')}><IoWalletOutline /> Pagamentos</button>
            </div>

            <div className={styles.tabContent}>
                {/* Aba de Visão Geral */}
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

                {/* Aba de Documentação */}
                {activeTab === 'docs' && (
                    <div className={styles.docsSection}>
                        <TextContentSection title="Descrição" name="description" content={formData.description} onChange={handleFormChange} rows={4} />
                        <TextContentSection title="Briefing" name="briefing" content={formData.briefing} onChange={handleFormChange} rows={6} />
                        <TextContentSection title="Anotações Técnicas" name="notes" content={formData.notes} onChange={handleFormChange} rows={6} />
                    </div>
                )}
                
                {/* Aba de Pagamentos */}
                {activeTab === 'payments' && (
                    <div className={styles.paymentControlSection}>
                        <div className={styles.paymentSummary}>
                            <DetailItem label="Total Recebido" value={formatCurrency(totalPaid)} />
                            <DetailItem label="Valor Restante" value={formatCurrency(remainingAmount)} />
                        </div>
                        
                        {remainingAmount > 0.001 && (
                            <div className={styles.fullPaymentContainer}>
                                <button className={styles.fullPaymentButton} onClick={handleFullPayment}>
                                    <IoShieldCheckmarkOutline /> Registrar Pagamento Total
                                </button>
                            </div>
                        )}

                        <h3 className={styles.subTitle}>Histórico de Pagamentos</h3>
                        {isLoadingTransactions ? <p className={styles.noTransactions}>Carregando...</p> : (
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