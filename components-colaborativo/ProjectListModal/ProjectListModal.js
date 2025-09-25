import Modal from '../Modal/Modal';
import styles from './ProjectListModal.module.css';
import Link from 'next/link'; // Importar Link do Next.js
import { IoArrowForward } from 'react-icons/io5'; // Ícone para o link

export default function ProjectListModal({ isOpen, onClose, title, projects }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className={styles.listContainer}>
                {projects && projects.length > 0 ? (
                    <ul className={styles.projectList}>
                        {projects.map(project => (
                            <li key={project.id} className={styles.projectItem}>
                                <Link href={`/colaborativo/projetos/${project.id}`} className={styles.projectLink} onClick={onClose}>
                                    {/* --- CORREÇÃO AQUI --- */}
                                    {project.name}
                                    <IoArrowForward size={16} />
                                </Link>
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