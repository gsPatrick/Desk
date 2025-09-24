import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MobileFilterDrawer.module.css';
import { IoClose, IoFilter, IoRefresh } from 'react-icons/io5';

// Componentes de filtro existentes (serão passados como props)
import StatusFilter from '../StatusFilter/StatusFilter';
import PriorityFilter from '../PriorityFilter/PriorityFilter';
import DateFilter from '../DateFilter/DateFilter';

export default function MobileFilterDrawer({ 
    isOpen, 
    onClose, 
    statusFilter, 
    setStatusFilter, 
    priorityFilter, 
    setPriorityFilter, 
    dateFilter, 
    setDateFilter, 
    priorities, 
    onClearFilters 
}) {
    // Controla o estado local dos filtros no drawer
    const [localStatus, setLocalStatus] = useState(statusFilter);
    const [localPriority, setLocalPriority] = useState(priorityFilter);
    const [localDate, setLocalDate] = useState(dateFilter);

    // Sincroniza o estado local com as props quando o drawer abre
    useEffect(() => {
        if (isOpen) {
            setLocalStatus(statusFilter);
            setLocalPriority(priorityFilter);
            setLocalDate(dateFilter);
        }
    }, [isOpen, statusFilter, priorityFilter, dateFilter]);

    const handleApplyFilters = () => {
        setStatusFilter(localStatus);
        setPriorityFilter(localPriority);
        setDateFilter(localDate);
        onClose(); // Fecha o drawer
    };

    const handleClearAndApply = () => {
        onClearFilters(); // Chama a função da página principal
        onClose(); // Fecha o drawer
    };

    const drawerVariants = {
        hidden: { y: '100%' },
        visible: { y: '0%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { y: '100%', transition: { duration: 0.2 } },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.backdrop}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.drawer}
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()} // Impede que o clique no drawer feche
                    >
                        <div className={styles.header}>
                            <h3><IoFilter /> Filtrar Projetos</h3>
                            <button onClick={onClose} className={styles.closeButton}>
                                <IoClose size={24} />
                            </button>
                        </div>

                        <div className={styles.filterSection}>
                            <h4>Status</h4>
                            <StatusFilter activeFilter={localStatus} onFilterChange={setLocalStatus} />
                        </div>

                        <div className={styles.filterSection}>
                            <h4>Prioridade</h4>
                            <PriorityFilter activeFilter={localPriority} onFilterChange={setLocalPriority} priorities={priorities} />
                        </div>

                        <div className={styles.filterSection}>
                            <h4>Prazo</h4>
                            <DateFilter activeFilter={localDate} onFilterChange={setLocalDate} />
                        </div>

                        <div className={styles.footer}>
                            <button onClick={handleClearAndApply} className={styles.clearButton}>
                                <IoRefresh /> Limpar Filtros
                            </button>
                            <button onClick={handleApplyFilters} className={styles.applyButton}>
                                Aplicar Filtros
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}