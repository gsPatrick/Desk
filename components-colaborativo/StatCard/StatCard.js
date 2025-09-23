import styles from './StatCard.module.css';

export default function StatCard({ title, value, icon, subtitle, projectsList, onClick }) {
    return (
        <div className={`${styles.card} ${onClick ? styles.clickable : ''}`} onClick={onClick}>
            {projectsList ? (
                <>
                    <div className={styles.header}>
                        <h3 className={styles.title}>{title}</h3>
                        <div className={styles.icon}>{icon}</div>
                    </div>
                    {projectsList.length > 0 ? (
                        <ul className={styles.projectList}>
                            {projectsList.map(project => (
                                <li key={project.id} title={project.name}>{project.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles.emptyList}>
                            <p>Nenhum projeto ativo.</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div>
                        <div className={styles.header}>
                            <h3 className={styles.title}>{title}</h3>
                            <div className={styles.icon}>{icon}</div>
                        </div>
                        <p className={styles.value}>{value}</p>
                    </div>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </>
            )}
        </div>
    );
}