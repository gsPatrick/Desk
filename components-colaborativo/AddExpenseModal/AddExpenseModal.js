import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import api from '../../services/colaborativo-api';
import formStyles from '../ProjectFormModal/ProjectFormModal.module.css'; // Reutilizando estilos de formulário
import styles from './AddExpenseModal.module.css'; // Estilos específicos do modal

const initialNewExpense = {
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    category: '',
    receiptUrl: '',
    projectId: ''
};

export default function AddExpenseModal({ isOpen, onClose, onAddSuccess, clients, initialProjectId = '' }) {
    const [newExpense, setNewExpense] = useState(initialNewExpense);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        // Reseta o formulário e erros ao abrir/fechar o modal
        setNewExpense({ ...initialNewExpense, projectId: initialProjectId });
        setFormError('');
    }, [isOpen, initialProjectId]);

    const handleChange = (e) => {
        setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError('');
        try {
            const expenseDataToSend = {
                ...newExpense,
                amount: parseFloat(newExpense.amount),
                // Garante que o receiptUrl seja null se for uma string vazia
                receiptUrl: newExpense.receiptUrl.trim() !== '' ? newExpense.receiptUrl.trim() : null,
                // Garante que projectId seja null se for string vazia
                projectId: newExpense.projectId || null
            };
            
            await api.post('/expenses', expenseDataToSend);
            onAddSuccess(); // Notifica a página pai para recarregar
            onClose(); // Fecha o modal após sucesso
        } catch (err) {
            setFormError(err.response?.data?.message || "Erro ao adicionar despesa.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Despesa">
            <form onSubmit={handleSubmit} className={styles.addExpenseFormGrid}>
                {formError && <p className={formStyles.errorMessage}>{formError}</p>}
                
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="description">Descrição da Despesa*</label>
                    <input type="text" id="description" name="description" placeholder="Ex: Assinatura Vercel" value={newExpense.description} onChange={handleChange} required autoFocus />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="amount">Valor (R$)*</label>
                    <input type="number" id="amount" name="amount" placeholder="Ex: 50.00" value={newExpense.amount} onChange={handleChange} required step="0.01" />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="expenseDate">Data da Despesa*</label>
                    <input type="date" id="expenseDate" name="expenseDate" value={newExpense.expenseDate} onChange={handleChange} required />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="category">Categoria</label>
                    <input type="text" id="category" name="category" placeholder="Ex: Software, Hospedagem" value={newExpense.category} onChange={handleChange} />
                </div>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                    <label className={formStyles.label} htmlFor="receiptUrl">Link do Comprovante (Opcional)</label>
                    <input type="url" id="receiptUrl" name="receiptUrl" placeholder="URL da imagem ou PDF do comprovante" value={newExpense.receiptUrl} onChange={handleChange} />
                </div>
                
                {!initialProjectId && ( // Só mostra o seletor de projeto se não for um modal específico de projeto
                    <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                        <label className={formStyles.label} htmlFor="projectId">Projeto Associado (Opcional)</label>
                        <select id="projectId" name="projectId" value={newExpense.projectId} onChange={handleChange} className={formStyles.select}>
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
                    <button type="submit" className={formStyles.saveButton} disabled={isLoading}>
                        {isLoading ? 'Adicionando...' : 'Adicionar Despesa'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}