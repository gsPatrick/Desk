import styles from './CollaboratorCard.module.css';

const StatusBadge = ({ status }) => {
    const statusMap = {
        accepted: { text: 'Aceito', className: styles.statusAccepted },
        pending: { text: 'Pendente', className: styles.statusPending },
        declined: { text: 'Recusado', className: styles.statusDeclined },
        revoked: { text: 'Removido', className: styles.statusDeclined }, // Adicionado para caso a API retorne 'revoked'
        canceled: { text: 'Cancelado', className: styles.statusDeclined }, // Adicionado para caso a API retorne 'canceled'
    };
    const { text, className } = statusMap[status] || { text: status, className: '' };
    return <span className={`${styles.statusBadge} ${className}`}>{text}</span>;
};

export default function CollaboratorCard({ collaboration, currentUserId, onAccept, onDecline, onCancel, onRemove }) {
    // A API retorna `requesterId` e `addresseeId`. Usamos isso para determinar quem é o "parceiro" a ser exibido.
    const isReceivedInvite = collaboration.addresseeId === currentUserId;
    
    // Os objetos aninhados vêm com letra maiúscula da API (Requester, Addressee)
    const partner = isReceivedInvite ? collaboration.Requester : collaboration.Addressee;

    const renderActions = () => {
        if (isReceivedInvite && collaboration.status === 'pending') {
            return (
                <>
                    <button onClick={() => onDecline(collaboration.id)} className={`${styles.actionButton} ${styles.decline}`}>Recusar</button>
                    <button onClick={() => onAccept(collaboration.id)} className={`${styles.actionButton} ${styles.accept}`}>Aceitar</button>
                </>
            );
        }
        if (!isReceivedInvite && collaboration.status === 'pending') {
            return <button onClick={() => onCancel(collaboration.id)} className={`${styles.actionButton} ${styles.cancel}`}>Cancelar Convite</button>;
        }
        if (collaboration.status === 'accepted') {
            return <button onClick={() => onRemove(collaboration.id)} className={`${styles.actionButton} ${styles.remove}`}>Remover</button>;
        }
        // Não renderiza ações para convites recusados, cancelados ou revogados
        return null; 
    };

    // Se por algum motivo o parceiro não for encontrado, não renderiza o card para evitar erros
    if (!partner) {
        return null;
    }

    return (
        <div className={styles.card}>
            <div className={styles.avatar}>{partner.name.substring(0, 1)}</div>
            <div className={styles.info}>
                <p className={styles.name}>{partner.name}</p>
                <p className={styles.email}>{partner.email}</p>
            </div>
            <div className={styles.statusAndActions}>
                <StatusBadge status={collaboration.status} />
                <div className={styles.actions}>{renderActions()}</div>
            </div>
        </div>
    );
}