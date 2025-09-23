import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../services/colaborativo-api';

import Header from '../../components-colaborativo/Header/Header';
import CollaboratorCard from '../../components-colaborativo/CollaboratorCard/CollaboratorCard';
import InviteCollaboratorModal from '../../components-colaborativo/InviteCollaboratorModal/InviteCollaboratorModal';
import styles from './colaboradores.module.css';
import { IoAdd } from 'react-icons/io5';

export default function ColaboradoresPage() {
    // Estados para os dados da API
    const [collaborations, setCollaborations] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Estados de controle da UI
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // Função para buscar os dados da API
    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Primeiro, precisamos saber quem é o usuário logado
            let userId = currentUserId;
            if (!userId) {
                const meResponse = await api.get('/users/me');
                userId = meResponse.data.id;
                setCurrentUserId(userId);
            }

            // Agora, buscamos as colaborações
            const collabResponse = await api.get('/collaborations');
            setCollaborations(collabResponse.data || []);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Não foi possível carregar as informações. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    // Efeito para buscar os dados iniciais quando a página carrega
    useEffect(() => {
        fetchAllData();
    }, []);

    // --- Handlers de Ações (Integrados com a API) ---
    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/collaborations/${id}`, { status });
            fetchAllData(); // Re-busca os dados para atualizar a lista
        } catch (err) {
            alert(err.response?.data?.message || `Erro ao ${status === 'accepted' ? 'aceitar' : 'recusar'} o convite.`);
        }
    };

    const handleRemoveOrCancel = async (id) => {
        try {
            await api.delete(`/collaborations/${id}`);
            fetchAllData(); // Re-busca os dados
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao remover a colaboração.");
        }
    };
    
    // Esta função é chamada pelo modal APENAS em caso de SUCESSO.
    const handleInviteSuccess = () => {
        setIsInviteModalOpen(false); // Fecha o modal
        fetchAllData(); // Atualiza a lista de colaboradores
    };

    // Filtra os dados com base no ID do usuário logado
    const receivedInvites = collaborations.filter(c => c.addresseeId === currentUserId && c.status === 'pending');
    const myCollaborators = collaborations.filter(c => !(c.addresseeId === currentUserId && c.status === 'pending'));

    return (
        <div className="colab-theme">
            <Head>
                <title>Colaboradores | Sistema Colaborativo</title>
            </Head>
            <Header activePage="colaboradores" />
            <main className={styles.pageWrapper}>
                <div className={styles.toolbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Colaboradores</h1>
                        <p className={styles.pageSubtitle}>Gerencie seus parceiros e convites.</p>
                    </div>
                    <button onClick={() => setIsInviteModalOpen(true)} className={styles.addButton}>
                        <IoAdd size={20} />
                        Adicionar Colaborador
                    </button>
                </div>

                {isLoading ? (
                    <div className={styles.messageState}>Carregando...</div>
                ) : error ? (
                    <div className={styles.messageState} style={{ color: '#f87171' }}>{error}</div>
                ) : (
                    <>
                        {/* Seção de Convites Recebidos */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Convites Recebidos</h2>
                            <div className={styles.collaboratorList}>
                                {receivedInvites.length > 0 ? (
                                    receivedInvites.map(collab => (
                                        <CollaboratorCard 
                                            key={collab.id} 
                                            collaboration={collab} 
                                            currentUserId={currentUserId} 
                                            onAccept={(id) => handleUpdateStatus(id, 'accepted')} 
                                            onDecline={(id) => handleUpdateStatus(id, 'declined')} 
                                        />
                                    ))
                                ) : (
                                    <div className={styles.emptyState}>Você não tem nenhum convite pendente.</div>
                                )}
                            </div>
                        </section>

                        {/* Seção de Meus Colaboradores */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Meus Colaboradores</h2>
                            <div className={styles.collaboratorList}>
                                {myCollaborators.length > 0 ? (
                                    myCollaborators.map(collab => (
                                        <CollaboratorCard 
                                            key={collab.id} 
                                            collaboration={collab} 
                                            currentUserId={currentUserId} 
                                            onCancel={handleRemoveOrCancel} 
                                            onRemove={handleRemoveOrCancel} 
                                        />
                                    ))
                                ) : (
                                    <div className={styles.emptyState}>Você ainda não adicionou nenhum colaborador.</div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <InviteCollaboratorModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInviteSuccess={handleInviteSuccess}
            />
        </div>
    );
}