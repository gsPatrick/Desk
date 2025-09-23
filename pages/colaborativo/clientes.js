import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '../../services/colaborativo-api';

import Header from '../../components-colaborativo/Header/Header';
import ClientCard from '../../components-colaborativo/ClientCard/ClientCard';
import ClientFormModal from '../../components-colaborativo/ClientFormModal/ClientFormModal';
import ClientDetailsModal from '../../components-colaborativo/ClientDetailsModal/ClientDetailsModal';
import styles from './clientes.module.css';
import { IoAdd } from 'react-icons/io5';

export default function ClientesPage() {
    const [clients, setClients] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);

    // Estados para o modal de detalhes do cliente
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    // Função centralizada para buscar os clientes
    const fetchClients = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/clients');
            setClients(response.data || []);
        } catch (err) {
            console.error("Erro ao buscar clientes:", err);
            setError("Não foi possível carregar os clientes. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Função para buscar colaboradores aceitos (para o modal de compartilhamento)
    const fetchCollaborators = async () => {
        try {
            const response = await api.get('/collaborations?status=accepted');
            setCollaborators(response.data || []);
        } catch (err) {
            console.error("Erro ao buscar colaboradores:", err);
        }
    };

    // Efeito para buscar os dados iniciais quando a página carrega
    useEffect(() => {
        fetchClients();
        fetchCollaborators();
    }, []);

    // --- Handlers para Ações (integrados com a API) ---
    const handleSaveClient = async (clientData) => {
        try {
            // Remove a máscara do CNPJ antes de enviar
            const dataToSend = {
                ...clientData,
                cnpj: clientData.cnpj ? clientData.cnpj.replace(/\D/g, '') : '',
            };

            if (dataToSend.id) {
                await api.patch(`/clients/${dataToSend.id}`, dataToSend);
            } else {
                await api.post('/clients', dataToSend);
            }
            handleCloseFormModal();
            fetchClients(); // Re-busca a lista de clientes para mostrar as atualizações
        } catch (err) {
            console.error("Erro ao salvar cliente:", err);
            alert(err.response?.data?.message || "Ocorreu um erro ao salvar o cliente.");
        }
    };

    const handleOpenCreateModal = () => {
        setClientToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (client) => {
        setClientToEdit(client);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setClientToEdit(null); // Limpa o cliente a ser editado
    };

    // --- NOVO HANDLER PARA ABRIR O MODAL DE DETALHES ---
    const handleOpenDetailsModal = (client) => {
        setSelectedClient(client);
        setIsDetailsModalOpen(true);
    };
    const handleCloseDetailsModal = () => {
        setSelectedClient(null); // Limpa o cliente selecionado
        setIsDetailsModalOpen(false);
    };

    return (
        <div className="colab-theme">
            <Head>
                <title>Clientes | Sistema Colaborativo</title>
            </Head>
            <Header activePage="clientes" />
            <main className={styles.pageWrapper}>
                <div className={styles.toolbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Clientes</h1>
                        <p className={styles.pageSubtitle}>
                            {isLoading ? 'Carregando...' : `Você tem ${clients.length} clientes cadastrados.`}
                        </p>
                    </div>
                    <button onClick={handleOpenCreateModal} className={styles.addButton}>
                        <IoAdd size={20} />
                        Novo Cliente
                    </button>
                </div>

                {isLoading ? (
                    <div className={styles.messageState}>Carregando clientes...</div>
                ) : error ? (
                    <div className={styles.messageState} style={{ color: '#f87171' }}>{error}</div>
                ) : (
                    <div className={styles.clientList}>
                        {clients.length > 0 ? (
                            clients.filter(Boolean).map(client => (
                                <ClientCard
                                    key={client.id}
                                    client={client}
                                    onEdit={handleOpenEditModal}
                                    onOpenDetails={handleOpenDetailsModal}
                                />
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.
                            </div>
                        )}
                    </div>
                )}
            </main>

            <ClientFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSave={handleSaveClient}
                clientToEdit={clientToEdit}
                collaborators={collaborators}
            />

            {/* --- NOVO MODAL DE DETALHES DO CLIENTE --- */}
            <ClientDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                client={selectedClient}
            />
        </div>
    );
}