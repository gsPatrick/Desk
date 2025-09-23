import styles from './PriorityFilter.module.css';

// O componente agora recebe a lista de prioridades da API
export default function PriorityFilter({ activeFilter, onFilterChange, priorities }) {
    
    // As opções agora são construídas dinamicamente
    const options = [
        { value: 'all', label: 'Todas' },
        ...(priorities || []).map(p => ({
            value: p.id, // O valor enviado é o ID
            label: p.name // O texto exibido é o nome
        }))
    ];

    return (
        <div className={styles.filterContainer}>
            {options.map(option => (
                <button
                    key={option.value}
                    className={`${styles.filterButton} ${activeFilter == option.value ? styles.active : ''}`}
                    onClick={() => onFilterChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}