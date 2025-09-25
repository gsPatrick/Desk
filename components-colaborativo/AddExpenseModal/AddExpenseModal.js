import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import api from '../../services/colaborativo-api';
import formStyles from '../ProjectFormModal/ProjectFormModal.module.css'; // Reutilizando estilos de formulário
import styles from './AddExpenseModal.module.css'; // Estilos específicos do modal
import { IoAdd, IoSync } from 'react-icons/io5'; // Ícone IoSync

const initialNewExpense = {
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    category: '',
    receiptUrl: '',
    projectId: ''
};

// Estado inicial para a recorrência
const initialRecurrenceData = {
    type: 'expense',
    description: '',
    amount: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    clientId: '',
    projectId: '',
    associatedHours: ''
};

export default function AddExpenseModal({ isOpen, onClose, onAddSuccess, clients, initialProjectId = '' }) {
    const [newExpense, setNewExpense] = useState(initialNewExpense);
    const [isCreatingRecurrence, setIsCreatingRecurrence] = useState(false); // NOVO: Estado para alternar
    const [recurrenceData, setRecurrenceData] = useState(initialRecurrenceData); // NOVO: Dados da recorrência

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setNewExpense({ ...initialNewExpense, projectId: initialProjectId });
        setRecurrenceData({ ...initialRecurrenceData, projectId: initialProjectId, startDate: new Date().toISOString().split('T')[0] });
        setFormError('');
        setIsCreatingRecurrence(false); // Reseta para despesa única
    }, [isOpen, initialProjectId]);

    const handleExpenseChange = (e) => setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    const handleRecurrenceChange = (e) => setRecurrenceData({ ...recurrenceData, [e.target.name]: e.target.value });

    const handleSubmitExpense = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError('');
        try {
            const expenseDataToSend = {
                ...newExpense,
                amount: parseFloat(newExpense.amount),
                receiptUrl: newExpense.receiptUrl.trim() !== '' ? newExpense.receiptUrl.trim() : null,
                projectId: newExpense.projectId || null
            };
            await api.post('/expenses', expenseDataToSend);
            onAddSuccess();
            onClose();
        } catch (err) {
            setFormError(err.response?.data?.message || "Erro ao adicionar despesa.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitRecurrence = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const dataToSend = {
                ...recurrenceData,
                amount: parseFloat(recurrenceData.amount),
                clientId: recurrenceData.clientId || null,
                projectId: recurrenceData.projectId || null,
                associatedHours: parseFloat(recurrenceData.associatedHours) || 0,
                endDate: recurrenceData.endDate || null,
                type: 'expense' // Garante que seja despesa
            };
            await api.post('/recurrences', dataToSend);
            onAddSuccess();
            onClose();
        } catch (err) {
            setFormError(err.response?.data?.message || "Erro ao criar recorrência de despesa.");
        } finally {
            setIsLoading(false);
        }
    };

    const projectsForSelectedClient = recurrenceData.clientId ? clients.find(c => c.id === parseInt(recurrenceData.clientId))?.Projects || [] : [];


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Despesa">
            <div className={styles.toggleRecurrenceContainer}>
                <button 
                    type="button" 
                    onClick={() => setIsCreatingRecurrence(false)} 
                    className={`${styles.toggleButton} ${!isCreatingRecurrence ? styles.active : ''}`}
                >
                    Despesa Única
                </button>
                <button 
                    type="button" 
                    onClick={() => setIsCreatingRecurrence(true)} 
                    className={`${styles.toggleButton} ${isCreatingRecurrence ? styles.active : ''}`}
                >
                    <IoSync /> Despesa Recorrente
                </button>
            </div>

            {formError && <p className={formStyles.errorMessage}>{formError}</p>}
            
            {!isCreatingRecurrence ? (
                // --- Formulário de Despesa Única ---
                <form onSubmit={handleSubmitExpense} className={styles.addExpenseFormGrid}>
                    <div className={formStyles.formGroup}><label className={formStyles.label}>Descrição da Despesa*</label><input type="text" name="description" placeholder="Ex: Assinatura Vercel" value={newExpense.description} onChange={handleExpenseChange} required autoFocus /></div>
                    <div className={formStyles.formGroup}><label className={formStyles.label}>Valor (R$)*</label><input type="number" name="amount" placeholder="Ex: 50.00" value={newExpense.amount} onChange={handleExpenseChange} required step="0.01" /></div>
                    <div className={formStyles.formGroup}><label className={formStyles.label}>Data da Despesa*</label><input type="date" name="expenseDate" value={newExpense.expenseDate} onChange={handleExpenseChange} required /></div>
                    <div className={formStyles.formGroup}><label className={formStyles.label}>Categoria</label><input type="text" name="category" placeholder="Ex: Software" value={newExpense.category} onChange={handleExpenseChange} /></div>
                    <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}><label className={formStyles.label}>Link do Comprovante (Opcional)</label><input type="url" name="receiptUrl" placeholder="URL da imagem ou PDF" value={newExpense.receiptUrl} onChange={handleExpenseChange} /></div>
                    
                    {!initialProjectId && (
                        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                            <label className={formStyles.label}>Projeto Associado (Opcional)</label>
                            <select name="projectId" value={newExpense.projectId} onChange={handleExpenseChange} className={formStyles.select}>
                                <option value="">Nenhuma (Despesa Geral)</option>
                                {clients.map(client => (
                                    <optgroup key={client.id} label={client.tradeName || client.legalName}>
                                        {(client.Projects || []).map(proj => (
                                            <option key={proj.id} value={proj.id}>{proj.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={formStyles.modalFooter}>
                        <button type="button" onClick={onClose} className={formStyles.cancelButton}>Cancelar</button>
                        <button type="submit" className={formStyles.saveButton} disabled={isLoading}>{isLoading ? 'Adicionando...' : 'Adicionar Despesa'}</button>
                    </div>
                </form>
            ) : (
                // --- Formulário de Despesa Recorrente ---
                <form onSubmit={handleSubmitRecurrence} className={styles.addExpenseFormGrid}>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Descrição*</label>
                        <input type="text" name="description" value={recurrenceData.description} onChange={handleRecurrenceChange} className={formStyles.input} required autoFocus />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Valor (R$)*</label>
                        <input type="number" name="amount" value={recurrenceData.amount} onChange={handleRecurrenceChange} className={formStyles.input} required step="0.01" />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Frequência*</label>
                        <select name="frequency" value={recurrenceData.frequency} onChange={handleRecurrenceChange} className={formStyles.select} required>
                            <option value="monthly">Mensal</option>
                            <option value="quarterly">Trimestral</option>
                            <option value="annually">Anual</option>
                        </select>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Data de Início*</label>
                        <input type="date" name="startDate" value={recurrenceData.startDate} onChange={handleRecurrenceChange} className={formStyles.input} required />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Data de Fim (Opcional)</label>
                        <input type="date" name="endDate" value={recurrenceData.endDate} onChange={handleRecurrenceChange} className={formStyles.input} />
                    </div>

                    <h3 className={`${formStyles.sectionTitle} ${formStyles.fullWidth}`}>Associação ao Projeto (Opcional)</h3>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Cliente</label>
                        <select name="clientId" value={recurrenceData.clientId} onChange={handleRecurrenceChange} className={formStyles.select}>
                            <option value="">Nenhum Cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.tradeName || client.legalName}</option>
                            ))}
                        </select>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Projeto</label>
                        <select name="projectId" value={recurrenceData.projectId} onChange={handleRecurrenceChange} className={formStyles.select} disabled={!recurrenceData.clientId}>
                            <option value="">Nenhum Projeto</option>
                            {projectsForSelectedClient.map(proj => (
                                <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.modalFooter}>
                        <button type="button" onClick={onClose} className={formStyles.cancelButton}>Cancelar</button>
                        <button type="submit" className={formStyles.saveButton} disabled={isLoading}>{isLoading ? 'Salvando...' : 'Criar Recorrência'}</button>
                    </div>
                </form>
            )}
        </Modal>
    );
}