import styles from './UpcomingDeadlines.module.css';

export default function UpcomingDeadlines({ projects }) {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Próximos Prazos</h3>
            {projects && projects.length > 0 ? (
                <div className={styles.list}>
                    {projects.map(p => (
                        <div key={p.id} className={styles.item}>
                            <div className={styles.info}>
                                <p className={styles.name}>{p.name}</p>
                            </div>
                            <p className={styles.date}>{p.deadline}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>Nenhum prazo nos próximos 7 dias.</div>
            )}
        </div>
    );
}