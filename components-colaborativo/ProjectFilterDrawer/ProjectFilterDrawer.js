import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProjectFilterDrawer.module.css';
import { IoClose, IoFilter, IoRefresh, IoCheckmarkCircleOutline } from 'react-icons/io5';

// Componentes de filtro existentes
import StatusFilter from '../StatusFilter/StatusFilter';
import PriorityFilter from '../PriorityFilter/PriorityFilter';
import DateFilter from '../DateFilter/DateFilter';

export default function ProjectFilterDrawer({ 
    isOpen, 
    onClose, 
    // Filtros atuais (props)
    statusFilter, setStatusFilter, 
    priorityFilter, setPriorityFilter, 
    dateFilter, setDateFilter, 
    minBudget, setMinBudget,
    maxBudget, setMaxBudget,
    platformFilter, setPlatformFilter,
    clientFilter, setClientFilter,
    sortBy, setSortBy,
    sortOrder, setSortOrder,

    // Listas de dados para filtros
    priorities, 
    clients, 
    platforms,

    onClearFilters 
}) {
    // Estados locais para os filtros no drawer (para não aplicar na hora)
    const [localStatus, setLocalStatus] = useState(statusFilter);
    const [localPriority, setLocalPriority] = useState(priorityFilter);
    const [localDate, setLocalDate] = useState(dateFilter);
    const [localMinBudget, setLocalMinBudget] = useState(minBudget);
    const [localMaxBudget, setLocalMaxBudget] = useState(maxBudget);
    const [localPlatform, setLocalPlatform] = useState(platformFilter);
    const [localClient, setLocalClient] = useState(clientFilter);
    const [localSortBy, setLocalSortBy] = useState(sortBy);
    const [localSortOrder, setLocalSortOrder] = useState(sortOrder);

    // Sincroniza o estado local com as props quando o drawer abre
    useEffect(() => {
        if (isOpen) {
            setLocalStatus(statusFilter);
            setLocalPriority(priorityFilter);
            setLocalDate(dateFilter);
            setLocalMinBudget(minBudget);
            setLocalMaxBudget(maxBudget);
            setLocalPlatform(platformFilter);
            setLocalClient(clientFilter);
            setLocalSortBy(sortBy);
            setLocalSortOrder(sortOrder);
        }
    }, [isOpen, statusFilter, priorityFilter, dateFilter, minBudget, maxBudget, platformFilter, clientFilter, sortBy, sortOrder]);

    const handleApplyFilters = () => {
        setStatusFilter(localStatus);
        setPriorityFilter(localPriority);
        setDateFilter(localDate);
        setMinBudget(localMinBudget);
        setMaxBudget(localMaxBudget);
        setPlatformFilter(localPlatform);
        setClientFilter(localClient);
        setSortBy(localSortBy);
        setSortOrder(localSortOrder);
        onClose();
    };

    const handleClearAndApply = () => {
        onClearFilters();
        onClose();
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.header}>
                            <h3><IoFilter /> Filtrar Projetos</h3>
                            <button onClick={onClose} className={styles.closeButton}><IoClose size={24} /></button>
                        </div>

                        <div className={styles.filtersContent}> {/* Novo wrapper para o conteúdo rolável */}
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

                            <div className={styles.filterSection}>
                                <h4>Cliente</h4>
                                <select value={localClient} onChange={(e) => setLocalClient(e.target.value)} className={styles.selectInput}>
                                    <option value="">Todos os Clientes</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.tradeName || client.legalName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterSection}>
                                <h4>Plataforma</h4>
                                <select value={localPlatform} onChange={(e) => setLocalPlatform(e.target.value)} className={styles.selectInput}>
                                    <option value="">Todas as Plataformas</option>
                                    {platforms.map(platform => (
                                        <option key={platform.id} value={platform.id}>{platform.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterSection}>
                                <h4>Orçamento (R$)</h4>
                                <div className={styles.budgetInputs}>
                                    <input type="number" placeholder="Mínimo" value={localMinBudget} onChange={(e) => setLocalMinBudget(e.target.value)} className={styles.input} />
                                    <input type="number" placeholder="Máximo" value={localMaxBudget} onChange={(e) => setLocalMaxBudget(e.target.value)} className={styles.input} />
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <h4>Ordenar por</h4>
                                <select value={localSortBy} onChange={(e) => setLocalSortBy(e.target.value)} className={styles.selectInput}>
                                    <option value="createdAt">Mais Recente</option>
                                    <option value="name">Nome</option>
                                    <option value="budget">Orçamento</option>
                                    <option value="deadline">Prazo</option>
                                </select>
                                <select value={localSortOrder} onChange={(e) => setLocalSortOrder(e.target.value)} className={styles.selectInput} style={{marginTop: '8px'}}>
                                    <option value="desc">Descendente</option>
                                    <option value="asc">Ascendente</option>
                                </select>
                            </div>
                        </div> {/* Fim filtersContent */}

                        <div className={styles.footer}>
                            <button onClick={handleClearAndApply} className={styles.clearButton}><IoRefresh /> Limpar</button>
                            <button onClick={handleApplyFilters} className={styles.applyButton}><IoCheckmarkCircleOutline /> Aplicar Filtros</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}