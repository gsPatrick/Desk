import styles from './RecentProjects.module.css';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function RecentProjects({ projects, onClick }) {
    return (
        <div className={`${styles.card} ${onClick ? styles.clickable : ''}`} onClick={onClick}>
            <h3 className={styles.title}>Projetos Concluídos Recentemente</h3>
            {projects && projects.length > 0 ? (
                <div className={styles.list}>
                    {projects.map(p => (
                        <div key={p.id} className={styles.item}>
                            <div className={styles.info}>
                                <p className={styles.name}>{p.name}</p>
                                <p className={styles.client}>{p.client}</p>
                            </div>
                            <p className={styles.profit}>+ {formatCurrency(p.profit)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>Nenhuma atividade recente.</div>
            )}
        </div>
    );
}