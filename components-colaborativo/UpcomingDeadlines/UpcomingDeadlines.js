import styles from './UpcomingDeadlines.module.css';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Helper de formatação de data
const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'dd/MM', { locale: ptBR });
    } catch (e) {
        return dateString; // Retorna a string original se houver erro
    }
};

export default function UpcomingDeadlines({ projects, onOpenProjectDetails }) { // <<< Nova prop
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Próximos Prazos</h3>
            {projects && projects.length > 0 ? (
                <div className={styles.list}>
                    {projects.map(p => (
                        // <<< Cada item da lista é clicável
                        <div key={p.id} className={styles.item} onClick={() => onOpenProjectDetails(p)}>
                            <div className={styles.info}>
                                <p className={styles.name}>{p.name}</p>
                            </div>
                            <p className={styles.date}>{formatDisplayDate(p.deadline)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>Nenhum prazo nos próximos 7 dias.</div>
            )}
        </div>
    );
}