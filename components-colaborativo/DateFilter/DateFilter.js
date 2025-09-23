import styles from './DateFilter.module.css';

const options = [
    { value: 'day', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'all', label: 'Todos' },
];

export default function DateFilter({ activeFilter, onFilterChange }) {
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