import Modal from '../Modal/Modal';
import styles from './ProjectListModal.module.css';

export default function ProjectListModal({ isOpen, onClose, title, projects }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className={styles.listContainer}>
                {projects && projects.length > 0 ? (
                    <ul className={styles.projectList}>
                        {projects.map(project => (
                            <li key={project.id} className={styles.projectItem}>
                                {project.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyMessage}>Nenhum projeto para exibir.</p>
                )}
            </div>
        </Modal>
    );
}