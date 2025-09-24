import { useState, useEffect } from 'react';
import api from '../../services/colaborativo-api';
import styles from './ExpenseTracker.module.css';
import { IoAdd, IoTrash, IoReceipt } from 'react-icons/io5';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

export default function ExpenseTracker({ projectId }) { // onUpdateProjectData foi removido das props
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        category: '',
        receiptUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState('');

    const fetchExpenses = async () => {
        try {
            const response = await api.get(`/expenses?projectId=${projectId}`);
            setExpenses(response.data);
            // onUpdateProjectData() foi REMOVIDO daqui para evitar o loop
        } catch (error) {
            console.error("Erro ao buscar despesas", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [projectId]);

    const handleChange = (e) => {
        setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const expenseDataToSend = {
                ...newExpense,
                amount: parseFloat(newExpense.amount),
                receiptUrl: newExpense.receiptUrl.trim() !== '' ? newExpense.receiptUrl.trim() : null
            };
            await api.post('/expenses', { ...expenseDataToSend, projectId });
            setNewExpense({ description: '', amount: '', expenseDate: new Date().toISOString().split('T')[0], category: '', receiptUrl: '' });
            fetchExpenses();
        } catch (error) {
            setFormError(error.response?.data?.message || "Não foi possível adicionar a despesa.");
        }
    };

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

    const totalExpenses = expenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);

    return (
        <div className={styles.section}>
            <h2><IoReceipt /> Despesas do Projeto</h2>
            <div className={styles.summary}>
                <span>Total em Despesas</span>
                <span className={styles.totalAmount}>{formatCurrency(totalExpenses)}</span>
            </div>
            
            <form onSubmit={handleAddExpense} className={styles.addExpenseForm}>
                {formError && <p className={styles.errorMessage}>{formError}</p>}
                <input type="text" name="description" placeholder="Descrição da Despesa" value={newExpense.description} onChange={handleChange} required />
                <input type="number" name="amount" placeholder="Valor (R$)" value={newExpense.amount} onChange={handleChange} required step="0.01" />
                <input type="date" name="expenseDate" value={newExpense.expenseDate} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Categoria (Ex: Software)" value={newExpense.category} onChange={handleChange} />
                <input type="url" name="receiptUrl" placeholder="Link do comprovante (Opcional)" value={newExpense.receiptUrl} onChange={handleChange} />
                <button type="submit"><IoAdd /> Adicionar Despesa</button>
            </form>

            {isLoading ? (
                <p className={styles.loadingMessage}>Carregando despesas...</p>
            ) : expenses.length > 0 ? (
                <div className={styles.expenseList}>
                    {expenses.map(exp => (
                        <div key={exp.id} className={styles.expenseItem}>
                            <div className={styles.expenseInfo}>
                                <p className={styles.expenseDesc}>{exp.description}</p>
                                <p className={styles.expenseMeta}>{exp.category} - {formatDate(exp.expenseDate)}</p>
                            </div>
                            <span className={styles.expenseAmount}>{formatCurrency(exp.amount)}</span>
                            {exp.receiptUrl && <a href={exp.receiptUrl} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>Ver Comprovante</a>}
                            <button onClick={() => handleDeleteExpense(exp.id)} className={styles.deleteButton} title="Excluir despesa"><IoTrash /></button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.emptyMessage}>Nenhuma despesa registrada para este projeto.</p>
            )}
        </div>
    );
}