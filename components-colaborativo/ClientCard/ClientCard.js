import Link from 'next/link';
import styles from './ClientCard.module.css';
import { IoArrowForward } from 'react-icons/io5';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function ClientCard({ client, onEdit, onOpenDetails }) { // <<-- NOVA PROP
    if (!client || !client.legalName) {
        return null;
    }

    const avatarLetter = (client.tradeName || client.legalName || 'C').substring(0, 1).toUpperCase();

    return (
        // O clique no corpo do card (sem ser no botão "Ver Projetos") abre o modal de detalhes
        <div className={styles.card} onClick={() => onOpenDetails(client)}> {/* <<-- NOVO ONCLICK */}
            <div className={styles.mainInfo}>
                <div className={styles.avatar}>{avatarLetter}</div>
                <div className={styles.textInfo}>
                    <p className={styles.name}>{client.tradeName || client.legalName}</p>
                    <p className={styles.company}>{client.tradeName ? client.legalName : (client.cnpj || '')}</p>
                </div>
            </div>

            <div className={styles.metrics}>
                <div className={styles.metricItem}>
                    <span className={styles.metricValue}>{formatCurrency(client.totalBilled)}</span>
                    <span className={styles.metricLabel}>Total Faturado</span>
                </div>
                <div className={styles.metricItem}>
                    <span className={`${styles.metricValue} ${styles.metricValueReceived}`}>{formatCurrency(client.totalReceived)}</span>
                    <span className={styles.metricLabel}>Total Recebido</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(client); }} className={styles.editButton}> {/* <<-- STOPPROPAGATION */}
                    Editar
                </button>
                <Link href={`/colaborativo/clientes/${client.id}`} className={styles.actionButton} onClick={e => e.stopPropagation()}> {/* <<-- STOPPROPAGATION */}
                    Ver Projetos <IoArrowForward />
                </Link>
            </div>
        </div>
    );
}