import styles from './Pagination.module.css';

export default function Pagination({ projectsPerPage, totalProjects, paginate, currentPage }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalProjects / projectsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null; // Não mostra a paginação se só houver uma página

    return (
        <nav>
            <ul className={styles.pagination}>
                {pageNumbers.map(number => (
                    <li key={number} className={styles.pageItem}>
                        <a 
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(number);
                            }} 
                            href="!#" 
                            className={`${styles.pageLink} ${currentPage === number ? styles.active : ''}`}
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}