import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../../services/colaborativo-api';
import Header from '../../../components-colaborativo/Header/Header';
import Modal from '../../../components-colaborativo/Modal/Modal';
import styles from './Recorrencias.module.css';
import formStyles from '../../../components-colaborativo/ProjectFormModal/ProjectFormModal.module.css';
import { IoAdd, IoPencil, IoTrash, IoSyncCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
        return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (e) {
        return dateStr;
    }
};

// --- Componente Card de Recorrência ---
const RecurrenceCard = ({ recurrence, onEdit, onDelete }) => {
    const isRevenue = recurrence.type === 'revenue';
    const amountColorClass = isRevenue ? styles.revenueAmount : styles.expenseAmount;

    return (
        <div className={styles.recurrenceCard}>
            <div className={styles.recurrenceHeader}>
                <p className={styles.recurrenceDescription}>{recurrence.description}</p>
                <span className={amountColorClass}>{formatCurrency(recurrence.amount)}</span>
            </div>
            <div className={styles.recurrenceDetails}>
                <span className={styles.recurrenceType}>{isRevenue ? 'Receita' : 'Despesa'} Recorrente</span>
                <span className={styles.recurrenceFrequency}>A cada {recurrence.frequency}</span>
                {recurrence.Client && <span className={styles.recurrenceClient}>Cliente: {recurrence.Client?.tradeName || recurrence.Client?.legalName}</span>}
                {recurrence.Project && <span className={styles.recurrenceProject}>Projeto: {recurrence.Project?.name}</span>}
                <div className={styles.cardActions}>
                    <button onClick={() => onEdit(recurrence)} className={styles.actionButton}><IoPencil /> Editar</button>
                    <button onClick={() => onDelete(recurrence.id)} className={`${styles.actionButton} ${styles.deleteButton}`}><IoTrash /> Excluir</button>
                </div>
            </div>
        </div>
    );
};

// --- Componente Modal de Formulário de Recorrência ---
// ESTADO INICIAL PARA O FORMULÁRIO DE RECORRÊNCIA
const initialRecurrenceData = {
    type: 'revenue', // Define o padrão do formulário como receita
    description: '',
    amount: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    clientId: '',
    projectId: '',
    associatedHours: ''
};

const RecurrenceFormModal = ({ isOpen, onClose, onSave, recurrenceToEdit, clients, projects }) => {
    const [formData, setFormData] = useState(initialRecurrenceData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (recurrenceToEdit) {
            setFormData({ 
                ...recurrenceToEdit, 
                amount: parseFloat(recurrenceToEdit.amount) || '',
                startDate: recurrenceToEdit.startDate.split('T')[0],
                endDate: recurrenceToEdit.endDate ? recurrenceToEdit.endDate.split('T')[0] : '',
                clientId: recurrenceToEdit.clientId || '',
                projectId: recurrenceToEdit.projectId || '',
                associatedHours: parseFloat(recurrenceToEdit.associatedHours) || ''
            });
        } else {
            setFormData({ ...initialRecurrenceData, startDate: new Date().toISOString().split('T')[0] }); // CORRIGIDO
        }
        setError('');
    }, [recurrenceToEdit, isOpen]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const dataToSend = {
                ...formData,
                amount: parseFloat(formData.amount),
                clientId: formData.clientId || null,
                projectId: formData.projectId || null,
                associatedHours: parseFloat(formData.associatedHours) || 0,
                endDate: formData.endDate || null
            };
            if (recurrenceToEdit) {
                await api.patch(`/recurrences/${recurrenceToEdit.id}`, dataToSend);
            } else {
                await api.post('/recurrences', dataToSend);
            }
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao salvar recorrência.");
        } finally {
            setIsLoading(false);
        }
    };

    const projectsForSelectedClient = formData.clientId ? clients.find(c => c.id === parseInt(formData.clientId))?.Projects || [] : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={recurrenceToEdit ? "Editar Recorrência" : "Nova Recorrência"}>
            <form onSubmit={handleSubmit} className={formStyles.formGrid}>
                {error && <p className={formStyles.errorMessage}>{error}</p>}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Tipo de Lançamento*</label>
                    <select name="type" value={formData.type} onChange={handleChange} className={formStyles.select} required>
                        <option value="revenue">Receita</option>
                        <option value="expense">Despesa</option>
                    </select>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Descrição*</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className={formStyles.input} required />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Valor (R$)*</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={formStyles.input} required step="0.01" />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Frequência*</label>
                    <select name="frequency" value={formData.frequency} onChange={handleChange} className={formStyles.select} required>
                        <option value="monthly">Mensal</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="annually">Anual</option>
                    </select>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Data de Início*</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={formStyles.input} required />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Data de Fim (Opcional)</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={formStyles.input} />
                </div>

                <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Associações (Opcional)</h3>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Cliente</label>
                    <select name="clientId" value={formData.clientId} onChange={handleChange} className={formStyles.select}>
                        <option value="">Nenhum Cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.tradeName || client.legalName}</option>
                        ))}
                    </select>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Projeto</label>
                    <select name="projectId" value={formData.projectId} onChange={handleChange} className={formStyles.select} disabled={!formData.clientId}>
                        <option value="">Nenhum Projeto</option>
                        {projectsForSelectedClient.map(proj => (
                            <option key={proj.id} value={proj.id}>{proj.name}</option>
                        ))}
                    </select>
                </div>

                {formData.type === 'revenue' && (
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Horas Associadas (Opcional)</label>
                        <input type="number" name="associatedHours" value={formData.associatedHours} onChange={handleChange} className={formStyles.input} />
                    </div>
                )}

                <div className={formStyles.modalFooter}>
                    <button type="button" onClick={onClose} className={formStyles.cancelButton}>Cancelar</button>
                    <button type="submit" className={formStyles.saveButton} disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Recorrência'}</button>
                </div>
            </form>
        </Modal>
    );
};


export default function RecorrenciasPage() {
    const [recurrences, setRecurrences] = useState([]);
    const [forecastEntries, setForecastEntries] = useState([]); // Lançamentos previstos
    const [clients, setClients] = useState([]); // Para o modal de form de recorrência
    const [projects, setProjects] = useState([]); // Para o modal de form de recorrência
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [recurrenceToEdit, setRecurrenceToEdit] = useState(null);

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [recurrencesResponse, forecastResponse, clientsResponse, projectsResponse] = await Promise.all([
                api.get('/recurrences'),
                api.get('/forecast-entries'),
                api.get('/clients'), // Para o dropdown de clientes
                api.get('/projects') // Para o dropdown de projetos
            ]);
            setRecurrences(recurrencesResponse.data);
            setForecastEntries(forecastResponse.data);
            setClients(clientsResponse.data);
            setProjects(projectsResponse.data.projects); // A API de projetos retorna um objeto com 'projects'
        } catch (err) {
            console.error("Erro ao buscar dados de recorrências:", err);
            setError("Não foi possível carregar as recorrências. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleOpenCreateModal = () => {
        setRecurrenceToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (recurrence) => {
        setRecurrenceToEdit(recurrence);
        setIsFormModalOpen(true);
    };

    const handleDeleteRecurrence = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta recorrência e todos os seus lançamentos previstos?")) {
            try {
                await api.delete(`/recurrences/${id}`);
                fetchAllData();
            } catch (err) {
                alert(err.response?.data?.message || "Erro ao excluir recorrência.");
            }
        }
    };

    const handleConfirmForecast = async (id) => {
        if (window.confirm("Deseja confirmar este lançamento e convertê-lo em uma transação/despesa real?")) {
            try {
                await api.patch(`/forecast-entries/${id}/confirm`);
                fetchAllData();
            } catch (err) {
                alert(err.response?.data?.message || "Erro ao confirmar lançamento.");
            }
        }
    };

    return (
        <div className="colab-theme">
            <Head><title>Recorrências | Sistema Colaborativo</title></Head>
            <Header activePage="recorrencias" />
            <main className={styles.pageWrapper}>
                <div className={styles.toolbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Recorrências</h1>
                        <p className={styles.pageSubtitle}>Gerencie suas receitas e despesas recorrentes.</p>
                    </div>
                    <button onClick={handleOpenCreateModal} className={styles.addButton}><IoAdd size={20} /> Nova Recorrência</button>
                </div>

                {isLoading ? (
                    <div className={styles.messageState}>Carregando recorrências...</div>
                ) : error ? (
                    <div className={styles.messageState} style={{ color: '#f87171' }}>{error}</div>
                ) : (
                    <>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Regras de Recorrência</h2>
                            {recurrences.length > 0 ? (
                                <div className={styles.recurrenceList}>
                                    {recurrences.map(rec => (
                                        <RecurrenceCard key={rec.id} recurrence={rec} onEdit={handleOpenEditModal} onDelete={handleDeleteRecurrence} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <IoSyncCircleOutline size={48} color="var(--colab-text-secondary)" />
                                    <p>Nenhuma recorrência cadastrada ainda. Crie sua primeira receita ou despesa recorrente!</p>
                                    <button onClick={handleOpenCreateModal} className={styles.addButton}>Criar Recorrência</button>
                                </div>
                            )}
                        </section>

                        <section className={styles.section} style={{marginTop: '48px'}}>
                            <h2 className={styles.sectionTitle}>Lançamentos Previstos</h2>
                            {forecastEntries.length > 0 ? (
                                <div className={styles.forecastList}>
                                    {forecastEntries.map(entry => (
                                        <div key={entry.id} className={styles.forecastCard}>
                                            <div className={styles.forecastHeader}>
                                                <p className={styles.forecastDescription}>{entry.description}</p>
                                                <span className={entry.type === 'revenue' ? styles.revenueAmount : styles.expenseAmount}>{formatCurrency(entry.amount)}</span>
                                            </div>
                                            <div className={styles.forecastDetails}>
                                                <span className={styles.forecastDate}>Vencimento: {formatDate(entry.dueDate)}</span>
                                                {entry.Client && <span className={styles.forecastClient}>Cliente: {entry.Client.tradeName || entry.Client.legalName}</span>}
                                                {entry.Project && <span className={styles.forecastProject}>Projeto: {entry.Project.name}</span>}
                                                <span className={`${styles.forecastStatus} ${styles[`status${entry.status}`]}`}>{entry.status}</span>
                                                {entry.status === 'pending' && (
                                                    <button onClick={() => handleConfirmForecast(entry.id)} className={styles.confirmButton}><IoCheckmarkCircleOutline /> Confirmar</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <IoCheckmarkCircleOutline size={48} color="var(--colab-text-secondary)" />
                                    <p>Nenhum lançamento previsto para os próximos meses.</p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            <RecurrenceFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={fetchAllData} recurrenceToEdit={recurrenceToEdit} clients={clients} projects={projects} />
        </div>
    );
}