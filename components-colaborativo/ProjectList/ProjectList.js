import ProjectCard from '../ProjectCard/ProjectCard';
import styles from './ProjectList.module.css';

export default function ProjectList({ projects, onOpenModal, onStatusChange, onPriorityChange, onEdit, onDelete, currentUserRole, priorities }) {
    return (
        <div className={styles.projectGrid}>
            {projects.map((project) => (
                <ProjectCard 
                    key={project.id} 
                    project={project}
                    onOpenModal={onOpenModal} 
                    onStatusChange={onStatusChange}
                    onPriorityChange={onPriorityChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    currentUserRole={currentUserRole}
                    priorities={priorities}
                />
            ))}
        </div>
    );
}