import styles from './StatusFilter.module.css';

const options = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluídos' },
];

export default function StatusFilter({ activeFilter, onFilterChange }) {
    return (
        <div className={styles.filterContainer}>
            {options.map(option => (
                <button
                    key={option.value}
                    className={`${styles.filterButton} ${activeFilter === option.value ? styles.active : ''}`}
                    onClick={() => onFilterChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}