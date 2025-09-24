import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../../services/colaborativo-api';
import Header from '../../../components-colaborativo/Header/Header';
import Modal from '../../../components-colaborativo/Modal/Modal'; // Para o formulário de plataforma
import styles from './Plataformas.module.css';
import formStyles from '../../../components-colaborativo/ProjectFormModal/ProjectFormModal.module.css'; // Reutiliza estilos de form
import { IoAdd, IoPencil, IoTrash, IoShareSocial } from 'react-icons/io5';

// Componente para o card de plataforma
const PlatformCard = ({ platform, onEdit, onDelete }) => (
    <div className={styles.platformCard}>
        <div className={styles.platformInfo}>
            {platform.logoUrl && <img src={platform.logoUrl} alt={`Logo ${platform.name}`} className={styles.platformLogo} />}
            <div>
                <p className={styles.platformName}>{platform.name}</p>
                <p className={styles.platformCommission}>Comissão Padrão: {platform.defaultCommissionPercent}%</p>
            </div>
        </div>
        <div className={styles.platformActions}>
            <button onClick={() => onEdit(platform)} className={styles.actionButton}><IoPencil /> Editar</button>
            <button onClick={() => onDelete(platform.id)} className={`${styles.actionButton} ${styles.deleteButton}`}><IoTrash /> Excluir</button>
        </div>
    </div>
);

// Componente para o Modal de Formulário de Plataforma
const PlatformFormModal = ({ isOpen, onClose, onSave, platformToEdit }) => {
    const [formData, setFormData] = useState({ name: '', defaultCommissionPercent: '', logoUrl: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (platformToEdit) {
            setFormData({ ...platformToEdit, defaultCommissionPercent: parseFloat(platformToEdit.defaultCommissionPercent) || '' });
        } else {
            setFormData({ name: '', defaultCommissionPercent: '', logoUrl: '' });
        }
        setError('');
    }, [platformToEdit, isOpen]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const dataToSend = { ...formData, defaultCommissionPercent: parseFloat(formData.defaultCommissionPercent) || 0 };
            if (platformToEdit) {
                await api.patch(`/platforms/${platformToEdit.id}`, dataToSend);
            } else {
                await api.post('/platforms', dataToSend);
            }
            onSave(); // Notifica a página pai para recarregar
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao salvar plataforma.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={platformToEdit ? "Editar Plataforma" : "Nova Plataforma"}>
            <form onSubmit={handleSubmit} className={formStyles.formGrid}>
                {error && <p className={formStyles.errorMessage}>{error}</p>}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Nome da Plataforma*</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={formStyles.input} required autoFocus />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.label}>Comissão Padrão (%)</label>
                    <input type="number" name="defaultCommissionPercent" value={formData.defaultCommissionPercent} onChange={handleChange} className={formStyles.input} step="0.01" />
                </div>
                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                    <label className={formStyles.label}>URL do Logo (Opcional)</label>
                    <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className={formStyles.input} />
                </div>
                <div className={formStyles.modalFooter}>
                    <button type="button" onClick={onClose} className={formStyles.cancelButton}>Cancelar</button>
                    <button type="submit" className={formStyles.saveButton} disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Plataforma'}</button>
                </div>
            </form>
        </Modal>
    );
};


export default function PlataformasPage() {
    const [platforms, setPlatforms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [platformToEdit, setPlatformToEdit] = useState(null);

    const fetchPlatforms = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/platforms');
            setPlatforms(response.data);
        } catch (err) {
            console.error("Erro ao buscar plataformas:", err);
            setError("Não foi possível carregar suas plataformas. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlatforms();
    }, []);

    const handleOpenCreateModal = () => {
        setPlatformToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (platform) => {
        setPlatformToEdit(platform);
        setIsFormModalOpen(true);
    };

    const handleDeletePlatform = async (platformId) => {
        if (window.confirm("Tem certeza que deseja excluir esta plataforma? Projetos associados terão sua comissão padrão removida.")) {
            try {
                await api.delete(`/platforms/${platformId}`);
                fetchPlatforms();
            } catch (err) {
                alert(err.response?.data?.message || "Erro ao excluir plataforma.");
            }
        }
    };

    return (
        <div className="colab-theme">
            <Head><title>Minhas Plataformas | Sistema Colaborativo</title></Head>
            <Header activePage="plataformas" />
            <main className={styles.pageWrapper}>
                <div className={styles.toolbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Minhas Plataformas</h1>
                        <p className={styles.pageSubtitle}>Gerencie as plataformas que você utiliza para seus projetos.</p>
                    </div>
                    <button onClick={handleOpenCreateModal} className={styles.addButton}><IoAdd size={20} /> Nova Plataforma</button>
                </div>

                {isLoading ? (
                    <div className={styles.messageState}>Carregando plataformas...</div>
                ) : error ? (
                    <div className={styles.messageState} style={{ color: '#f87171' }}>{error}</div>
                ) : platforms.length > 0 ? (
                    <div className={styles.platformList}>
                        {platforms.map(platform => (
                            <PlatformCard key={platform.id} platform={platform} onEdit={handleOpenEditModal} onDelete={handleDeletePlatform} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <IoShareSocial size={48} color="var(--colab-text-secondary)" />
                        <p>Nenhuma plataforma cadastrada. Adicione para organizar as comissões dos seus projetos.</p>
                        <button onClick={handleOpenCreateModal} className={styles.addButton}>Adicionar Primeira Plataforma</button>
                    </div>
                )}
            </main>

            <PlatformFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={fetchPlatforms} platformToEdit={platformToEdit} />
        </div>
    );
}