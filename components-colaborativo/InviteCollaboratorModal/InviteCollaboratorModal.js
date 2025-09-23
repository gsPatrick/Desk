import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import api from '../../services/colaborativo-api'; // O MODAL AGORA USA A API DIRETAMENTE

// Reutilizando os estilos do formulário de projeto para consistência
import formStyles from '../ProjectFormModal/ProjectFormModal.module.css';
// Adicionando um arquivo de estilo próprio para a mensagem de erro
import styles from './InviteCollaboratorModal.module.css';

// A prop onSendInvite foi renomeada para onInviteSuccess para mais clareza
export default function InviteCollaboratorModal({ isOpen, onClose, onInviteSuccess }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reseta o formulário sempre que o modal for fechado ou aberto
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setEmail('');
                setError('');
                setIsLoading(false);
            }, 200); // Pequeno delay para a animação de fechar
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!email) {
            setError('Por favor, insira um e-mail.');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            await api.post('/collaborations', { addresseeEmail: email });
            // Se a API retornou sucesso, chama a função da página pai
            onInviteSuccess(); 
        } catch (err) {
            // Se a API retornou um erro, pega a mensagem e a exibe no modal
            const errorMessage = err.response?.data?.error || "Ocorreu um erro ao enviar o convite.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Convidar Colaborador">
            <div className={formStyles.formGroup}>
                <label className={formStyles.label} htmlFor="email">E-mail do Colaborador</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={formStyles.input}
                    placeholder="exemplo@agencia.com"
                    autoFocus
                />
            </div>

            {/* --- EXIBIÇÃO DA MENSAGEM DE ERRO DENTRO DO MODAL --- */}
            {error && (
                <div className={styles.errorMessageContainer}>
                    <p>{error}</p>
                </div>
            )}
            
            <div className={formStyles.modalFooter}>
                <button onClick={onClose} className={formStyles.cancelButton}>Cancelar</button>
                <button onClick={handleSend} className={formStyles.saveButton} disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar Convite'}
                </button>
            </div>
        </Modal>
    );
}